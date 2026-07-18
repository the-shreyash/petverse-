import { useState, useCallback, useEffect } from "react";
import api from "@/services/api";

export function useChat(activeConversation, onUpdateMessages) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Sync messages with active conversation
  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages || []);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  const triggerBotResponse = useCallback(async (userText, pet, healthContext) => {
    setIsTyping(true);
    
    try {
      const response = await api.post("/ai/chat", {
        message: userText,
        pet_id: pet?.id,
        conversation_id: activeConversation?.id,
        provider: "gemini"
      });
      
      const botMessage = {
        id: `msg-bot-${Date.now()}`,
        role: "assistant",
        text: response.data.message,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => {
        const next = [...prev, botMessage];
        if (activeConversation && onUpdateMessages) {
          onUpdateMessages(activeConversation.id, next, botMessage.text.substring(0, 60) + "...");
        }
        return next;
      });
    } catch (err) {
      console.error("AI chat failed", err);
      
      const errorMessage = {
        id: `msg-bot-err-${Date.now()}`,
        role: "assistant",
        text: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [activeConversation, onUpdateMessages]);

  const sendMessage = useCallback((text, pet, healthContext) => {
    if (!text.trim()) return;

    const userMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      text: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      const next = [...prev, userMessage];
      if (activeConversation && onUpdateMessages) {
        onUpdateMessages(activeConversation.id, next, userMessage.text);
      }
      return next;
    });

    triggerBotResponse(text, pet, healthContext);
  }, [activeConversation, onUpdateMessages, triggerBotResponse]);

  return {
    messages,
    isTyping,
    sendMessage,
    setMessages
  };
}
