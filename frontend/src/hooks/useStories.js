import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { resolveMediaUrl, avatarFor, displayName } from "@/utils/media";

/**
 * useStories
 *
 * Backed entirely by /community/stories. The API returns stories grouped by
 * author (unseen authors first); we keep the groups for the rail and also
 * expose a flat, play-order list for the full-screen viewer.
 */
export function useStories() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapStory = useCallback((s, author) => ({
    id: s.id,
    authorId: s.author_id,
    authorName: displayName(author),
    authorAvatar: avatarFor(author),
    mediaUrl: resolveMediaUrl(s.media_url),
    mediaType: s.media_type,
    caption: s.caption,
    petName: s.caption || null,
    petTag: s.pet_id || null,
    createdAt: s.created_at,
    expiresAt: s.expires_at,
    seen: s.seen_by_me,
    views: s.views_count,
  }), []);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/community/stories");
      setGroups(
        (data || []).map((g) => ({
          authorId: g.author_id,
          authorName: displayName(g.author),
          authorAvatar: avatarFor(g.author),
          allSeen: g.all_seen,
          stories: (g.stories || []).map((s) => mapStory(s, g.author)),
        }))
      );
    } catch (err) {
      console.error("Failed to load stories", err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [mapStory]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  /** Flat list in play order — group order, then oldest-first within a group. */
  const stories = groups.flatMap((g) => g.stories);

  const uploadStoryMedia = useCallback(async (file) => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("/community/stories/media", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data; // { media_url, media_type }
  }, []);

  const addStory = useCallback(
    async (file, caption = null, petId = null) => {
      // Accepts either a File (upload first) or an already-hosted URL string.
      let mediaUrl = file;
      let mediaType = "IMAGE";

      if (file instanceof File || file instanceof Blob) {
        const uploaded = await uploadStoryMedia(file);
        mediaUrl = uploaded.media_url;
        mediaType = uploaded.media_type;
      }

      await api.post("/community/stories", {
        media_url: mediaUrl,
        media_type: mediaType,
        caption,
        pet_id: petId,
      });
      await fetchStories();
    },
    [uploadStoryMedia, fetchStories]
  );

  const markSeen = useCallback(async (storyId) => {
    // Optimistic: flip locally so the ring dims immediately, then persist.
    setGroups((prev) =>
      prev.map((g) => {
        const stories = g.stories.map((s) =>
          s.id === storyId ? { ...s, seen: true } : s
        );
        return { ...g, stories, allSeen: stories.every((s) => s.seen) };
      })
    );
    try {
      await api.post(`/community/stories/${storyId}/view`);
    } catch (err) {
      console.error("Failed to mark story seen", err);
    }
  }, []);

  const deleteStory = useCallback(async (storyId) => {
    await api.delete(`/community/stories/${storyId}`);
    await fetchStories();
  }, [fetchStories]);

  return {
    groups,
    stories,
    loading,
    addStory,
    markSeen,
    deleteStory,
    refreshStories: fetchStories,
  };
}
