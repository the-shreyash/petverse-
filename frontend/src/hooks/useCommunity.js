import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { publishEvent } from "@/utils/events";

export function useCommunity() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [lostPets, setLostPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const mapPost = (p) => ({
    id: p.id,
    author: {
      id: p.author_id || p.author?.id,
      name: p.author
        ? `${p.author.first_name || ""} ${p.author.last_name || ""}`.trim() || p.author.username || "User"
        : "User",
      avatar:
        p.author?.avatar_url ||
        p.author?.profile_image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          p.author?.first_name || "User"
        )}&background=10b981&color=fff`
    },
    content: p.content,
    images: p.media_urls || p.images || [],
    likes: p.likes_count !== undefined ? p.likes_count : (p.likes?.length || 0),
    likedByMe: p.liked_by_me || false,
    bookmarkedByMe: p.bookmarked_by_me || false,
    comments: p.comments_count !== undefined ? p.comments_count : (p.comments?.length || 0),
    shares: p.shares_count || p.shares || 0,
    createdAt: p.created_at,
    location: p.location || null,
    hashtags: p.hashtags || [],
    petTag: p.pet_id || null
  });

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const offset = reset ? 0 : page * PAGE_SIZE;
      const response = await api.get(`/community/feed?skip=${offset}&limit=${PAGE_SIZE}`);
      const data = response.data || [];
      const mapped = data.map(mapPost);

      if (reset) {
        setPosts(mapped);
        setPage(1);
      } else {
        setPosts(prev => [...prev, ...mapped]);
        setPage(prev => prev + 1);
      }
      setHasMore(mapped.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to load posts", err);
      setPosts(prev => reset ? [] : prev);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshFeed = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(false);
    }
  }, [loading, hasMore, fetchPosts]);

  const addPost = useCallback(async (postContent, images = [], location = "", petTag = null, hashtags = []) => {
    try {
      const payload = {
        content: postContent,
        media_urls: Array.isArray(images) ? images : [],
        location: location || null,
        pet_id: petTag || null,
        hashtags: hashtags || []
      };

      const response = await api.post("/community/posts", payload);

      if (response.status === 201 || response.status === 200) {
        // Optimistically prepend the new post
        const newPost = mapPost(response.data?.data || response.data);
        setPosts(prev => [newPost, ...prev]);

        publishEvent({
          type: "SOCIAL_POST",
          category: "community",
          title: "New Post Created",
          description: `You shared: "${postContent.substring(0, 50)}${postContent.length > 50 ? '...' : ''}"`,
          priority: "low",
          action: "/community"
        });
        return newPost;
      }
    } catch (err) {
      console.error("Failed to add post", err);
      throw err;
    }
  }, []);

  const likePost = useCallback(async (postId) => {
    // Determine the intended action from the CURRENT state before toggling.
    let wasLiked = false;
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        wasLiked = !!p.likedByMe;
        return { ...p, likes: wasLiked ? Math.max(0, p.likes - 1) : p.likes + 1, likedByMe: !wasLiked };
      })
    );
    try {
      // POST to add a like, DELETE to remove it (backend rejects duplicate POSTs).
      if (wasLiked) {
        await api.delete(`/community/posts/${postId}/like`);
      } else {
        await api.post(`/community/posts/${postId}/like`);
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
      // Revert optimistic update on error
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, likes: wasLiked ? p.likes + 1 : Math.max(0, p.likes - 1), likedByMe: wasLiked }
            : p
        )
      );
    }
  }, []);

  const bookmarkPost = useCallback(async (postId) => {
    let wasBookmarked = false;
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        wasBookmarked = !!p.bookmarkedByMe;
        return { ...p, bookmarkedByMe: !wasBookmarked };
      })
    );
    try {
      if (wasBookmarked) {
        await api.delete(`/community/posts/${postId}/bookmark`);
      } else {
        await api.post(`/community/posts/${postId}/bookmark`);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, bookmarkedByMe: wasBookmarked } : p
        )
      );
    }
  }, []);

  const addComment = useCallback(async (postId, content) => {
    try {
      const response = await api.post(`/community/posts/${postId}/comments`, { content });
      // Increment comment count optimistically
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, comments: p.comments + 1 } : p
        )
      );
      return response.data;
    } catch (err) {
      console.error("Failed to add comment", err);
      throw err;
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    try {
      await api.delete(`/community/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Failed to delete post", err);
      throw err;
    }
  }, []);

  const reportLostPet = useCallback(async (lostPetData) => {
    try {
      const response = await api.post("/lost-found", lostPetData);
      return response.data;
    } catch (err) {
      console.error("Failed to report lost pet", err);
      throw err;
    }
  }, []);

  const addStory = useCallback(() => {}, []);
  const toggleLostPetStatus = useCallback(() => {}, []);

  return {
    posts,
    stories,
    lostPets,
    shelters: [],
    loading,
    hasMore,
    addPost,
    likePost,
    bookmarkPost,
    addComment,
    deletePost,
    addStory,
    reportLostPet,
    toggleLostPetStatus,
    loadMore,
    refreshFeed
  };
}
