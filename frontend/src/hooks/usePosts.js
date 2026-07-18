import { useState, useCallback, useEffect } from "react";
import api from "@/services/api";

export function usePosts(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshPost = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const response = await api.get(`/community/posts/${postId}`);
      const p = response.data?.data || response.data;
      if (p) {
        setPost({
          id: p.id,
          author: {
            id: p.author_id || p.author?.id,
            name: p.author
              ? `${p.author.first_name || ""} ${p.author.last_name || ""}`.trim() || p.author.username || "User"
              : "User",
            avatar: p.author?.avatar_url || p.author?.profile_image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(p.author?.first_name || "User")}&background=10b981&color=fff`
          },
          content: p.content,
          images: p.media_urls || [],
          likes: p.likes_count || 0,
          likedByMe: p.liked_by_me || false,
          bookmarkedByMe: p.bookmarked_by_me || false,
          comments: (p.comments || []).map((c) => ({
            id: c.id,
            content: c.content,
            createdAt: c.created_at,
            author: {
              id: c.author_id || c.author?.id,
              name: c.author
                ? `${c.author.first_name || ""} ${c.author.last_name || ""}`.trim() || "User"
                : "User",
              avatar:
                c.author?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  c.author?.first_name || "User"
                )}&background=10b981&color=fff`
            }
          })),
          shares: p.shares_count || 0,
          createdAt: p.created_at,
          hashtags: p.hashtags || []
        });
      }
    } catch (err) {
      console.error("Failed to fetch post", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    refreshPost();
  }, [refreshPost]);

  const addComment = useCallback(async (commentText) => {
    if (!postId || !commentText?.trim()) return;
    try {
      await api.post(`/community/posts/${postId}/comments`, { content: commentText });
      await refreshPost();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  }, [postId, refreshPost]);

  const sharePost = useCallback(async () => {
    if (!postId) return;
    const url = `${window.location.origin}/community/posts/${postId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "PetVerse post", url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch (err) {
      // User dismissed the share sheet, or clipboard is unavailable — non-fatal.
    }
  }, [postId]);

  return {
    post,
    loading,
    addComment,
    sharePost,
    refreshPost
  };
}

export default usePosts;
