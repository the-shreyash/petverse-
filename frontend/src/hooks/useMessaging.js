import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/services/api";
import { resolveMediaUrl, avatarFor, displayName } from "@/utils/media";
import { subscribeToRealtime } from "@/utils/realtime";

/**
 * useMessaging
 *
 * Backed by /messaging. Shapes API payloads into the structure the Messages UI
 * already renders: conversation.participant + conversation.messages[] where
 * each message has sender: "me" | "them".
 */
export function useMessaging() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  // Reserved for the realtime layer; the UI already renders this indicator.
  const [isTyping] = useState(false);
  const activeIdRef = useRef(null);

  const mapMessage = useCallback((m) => ({
    id: m.id,
    sender: m.is_mine ? "me" : "them",
    text: m.content || "",
    mediaUrl: resolveMediaUrl(m.media_url),
    timestamp: m.created_at,
    status: m.is_mine ? (m.read_by_other ? "read" : "sent") : "read",
  }), []);

  const mapConversation = useCallback((c) => ({
    id: c.id,
    participant: {
      id: c.other_user?.id,
      name: displayName(c.other_user),
      avatar: avatarFor(c.other_user),
      role: "Pet Parent",
      status: "offline",
    },
    listingId: c.listing_id,
    petId: c.pet_id,
    unreadCount: c.unread_count || 0,
    lastMessageAt: c.last_message_at,
    // List view only carries the last message; the thread fetch fills the rest.
    messages: c.last_message ? [mapMessage(c.last_message)] : [],
  }), [mapMessage]);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/messaging/conversations");
      setConversations((data || []).map(mapConversation));
    } catch (err) {
      console.error("Failed to load conversations", err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [mapConversation]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const loadThread = useCallback(async (conversationId) => {
    if (!conversationId) {
      setActiveConversation(null);
      return null;
    }
    try {
      const { data } = await api.get(`/messaging/conversations/${conversationId}`);
      const conv = { ...mapConversation(data), messages: (data.messages || []).map(mapMessage) };
      setActiveConversation(conv);
      return conv;
    } catch (err) {
      console.error("Failed to load conversation", err);
      setActiveConversation(null);
      return null;
    }
  }, [mapConversation, mapMessage]);

  const markAsRead = useCallback(async (conversationId) => {
    try {
      await api.post(`/messaging/conversations/${conversationId}/read`);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error("Failed to mark conversation read", err);
    }
  }, []);

  const selectConversation = useCallback(async (conversationId) => {
    setActiveConvId(conversationId);
    activeIdRef.current = conversationId;
    await loadThread(conversationId);
    await markAsRead(conversationId);
  }, [loadThread, markAsRead]);

  const uploadImage = useCallback(async (file) => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("/messaging/media", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.media_url;
  }, []);

  const sendMessage = useCallback(async (text, mediaUrl = null) => {
    const conversationId = activeIdRef.current;
    if (!conversationId) return;
    if (!text?.trim() && !mediaUrl) return;

    setSending(true);
    try {
      await api.post(`/messaging/conversations/${conversationId}/messages`, {
        content: text?.trim() || null,
        media_url: mediaUrl,
      });
      await loadThread(conversationId);
      await fetchConversations();
    } catch (err) {
      console.error("Failed to send message", err);
      throw err;
    } finally {
      setSending(false);
    }
  }, [loadThread, fetchConversations]);

  /**
   * Open (or create) a direct conversation with a user and select it.
   * Used by "Message Owner" from Adoption, Community and Pet Profile.
   */
  const startConversation = useCallback(async (userId, { listingId = null, petId = null, message = null } = {}) => {
    const { data } = await api.post("/messaging/conversations", {
      participant_id: userId,
      listing_id: listingId,
      pet_id: petId,
      message,
    });
    await fetchConversations();
    await selectConversation(data.id);
    return data.id;
  }, [fetchConversations, selectConversation]);

  // Realtime: refresh the open thread when a message arrives for it.
  useEffect(() => {
    return subscribeToRealtime("message:new", (payload) => {
      if (payload?.conversation_id === activeIdRef.current) {
        loadThread(activeIdRef.current);
      }
      fetchConversations();
    });
  }, [loadThread, fetchConversations]);

  return {
    conversations,
    activeConvId,
    activeConversation,
    loading,
    sending,
    isTyping,
    selectConversation,
    sendMessage,
    startConversation,
    uploadImage,
    markAsRead,
    refreshConversations: fetchConversations,
  };
}
