import { useState, useCallback, useEffect } from "react";
import api from "@/services/api";

/**
 * useConversation
 *
 * Manages AI chat conversation sessions. Sessions are stored in localStorage
 * for instant access, and AI history is synced from backend.
 */
export function useConversation(activePetId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Persistence key per user
  const storageKey = "petverse_ai_conversations";

  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return [];
  }, []);

  const saveToStorage = useCallback((convs) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(convs));
    } catch (e) {}
  }, []);

  // On mount: load from localStorage, then sync history from backend
  useEffect(() => {
    const local = loadFromStorage();
    if (local.length > 0) {
      setConversations(local);
      setLoading(false);
    }

    // Fetch server history and merge
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      try {
        const response = await api.get("/ai/history?limit=50");
        const history = response.data || [];
        // Merge server history with local conversations
        // Server history has: id, title, pet_id, messages (array), created_at, updated_at
        const serverConvs = history.map(h => ({
          id: h.id,
          title: h.title || "AI Chat",
          petId: h.pet_id || "general",
          petName: h.pet_name || "General",
          lastMessage: h.last_message || "No messages yet.",
          timestamp: h.updated_at || h.created_at,
          messages: h.messages || []
        }));

        // Merge: prefer server versions, keep local-only ones
        const serverIds = new Set(serverConvs.map(c => c.id));
        const localOnly = local.filter(c => !serverIds.has(c.id));
        const merged = [...serverConvs, ...localOnly].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setConversations(merged);
        saveToStorage(merged);
      } catch (err) {
        // Non-critical — local storage is the source of truth
        console.error("Failed to sync AI history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [loadFromStorage, saveToStorage]);

  const petConversations = conversations.filter(
    c => !activePetId || c.petId === activePetId || c.petId === "general"
  );

  const createConversation = useCallback((title, petId, petName) => {
    const newConv = {
      id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: title || "New Conversation",
      petId: petId || "general",
      petName: petName || "General",
      lastMessage: "No messages yet.",
      timestamp: new Date().toISOString(),
      messages: []
    };

    setConversations(prev => {
      const updated = [newConv, ...prev];
      saveToStorage(updated);
      return updated;
    });

    return newConv;
  }, [saveToStorage]);

  const deleteConversation = useCallback((id) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateConversationMessages = useCallback((id, messages, lastMessage) => {
    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            messages,
            lastMessage: lastMessage || c.lastMessage,
            timestamp: new Date().toISOString()
          };
        }
        return c;
      });
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const renameConversation = useCallback((id, newTitle) => {
    setConversations(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, title: newTitle } : c));
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  return {
    conversations,
    petConversations,
    createConversation,
    deleteConversation,
    updateConversationMessages,
    renameConversation,
    loading
  };
}
