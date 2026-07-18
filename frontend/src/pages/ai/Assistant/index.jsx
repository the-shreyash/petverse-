import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useAIContext } from "@/hooks/useAIContext";
import { useConversation } from "@/hooks/useConversation";
import { useChat } from "@/hooks/useChat";
import { Bot, RefreshCw, MessageSquare, Plus, ArrowRight, Lock, Star, Sparkles } from "lucide-react";
import ConversationSidebar from "@/components/ai/chat/ConversationSidebar";
import MessageBubble from "@/components/ai/chat/MessageBubble";
import ChatInput from "@/components/ai/chat/ChatInput";
import SuggestedPrompt from "@/components/ai/chat/SuggestedPrompt";

export default function AssistantView() {
  const suggestedPrompts = {
    general: [
      "Is chocolate safe for dogs?",
      "How to train my cat?",
      "Best diet for an old pet",
      "Common signs of illness"
    ]
  };
  const breedKnowledge = [];
  const nutritionData = [];
  const context = useAIContext();
  const { activePet, health, weightHistory, medicalHistory, vaccinations } = context;

  // Conversations hook
  const {
    petConversations,
    createConversation,
    deleteConversation,
    updateConversationMessages,
    renameConversation
  } = useConversation(activePet?.id || "general");

  const [activeConv, setActiveConv] = useState(null);

  // Set initial active conversation
  useEffect(() => {
    if (petConversations.length > 0 && !activeConv) {
      setActiveConv(petConversations[0]);
    }
  }, [petConversations, activeConv]);

  // Messages hook
  const { messages, isTyping, sendMessage } = useChat(
    activeConv,
    updateConversationMessages
  );

  const handleSend = (text) => {
    // Health contexts payload
    const breedInfo = breedKnowledge[activePet?.breed];
    const nutritionInfo = nutritionData[activePet?.breed];
    const healthContext = {
      latestRecord: medicalHistory[0],
      vaccinations,
      weightHistory,
      nutritionInfo,
      breedInfo
    };
    sendMessage(text, activePet, healthContext);
  };

  const handleCreateChat = () => {
    const newConv = createConversation(
      `Chat about ${activePet?.name || "Pet"}`,
      activePet?.id || "general",
      activePet?.name || "System"
    );
    setActiveConv(newConv);
  };

  const handleSelectChat = (conv) => {
    setActiveConv(conv);
  };

  const handleDeleteChat = (id) => {
    deleteConversation(id);
    if (activeConv?.id === id) {
      setActiveConv(null);
    }
  };

  const handleRenameChat = (id, title) => {
    renameConversation(id, title);
  };

  return (
    <DashboardLayout
      pageTitle="AI Chat Assistant"
      pageDescription="Ask anything about medical checks, vaccines, or dietary targets."
    >
      <div className="grid gap-6 lg:grid-cols-12 h-[calc(100vh-140px)] min-h-[580px]">
        {/* Left: Sidebar */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-full bg-white">
          <ConversationSidebar
            conversations={petConversations}
            activeId={activeConv?.id || ""}
            onSelect={handleSelectChat}
            onCreate={handleCreateChat}
            onDelete={handleDeleteChat}
            onRename={handleRenameChat}
          />
        </div>

        {/* Center/Right: Chat Screen */}
        <div className="lg:col-span-9 flex flex-col rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                <Bot size={17} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800">
                  {activeConv ? activeConv.title : "No active discussion"}
                </h4>
                <p className="text-[10px] font-extrabold uppercase text-emerald-600">
                  Online {activePet ? `· Analyzing ${activePet.name}` : ""}
                </p>
              </div>
            </div>
            
            {activePet && (
              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                <Sparkles size={11} className="text-emerald-500 animate-pulse" />
                <span>{activePet.name}'s History Loaded</span>
              </div>
            )}
          </div>

          {/* Messages Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-slate-50/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4 animate-bounce">
                  <Bot size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-700">
                  VetCare AI is ready for {activePet?.name || "your pet"}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-400 leading-relaxed">
                  I have analyzed {activePet?.name || "your pet"}'s complete record history. Choose a suggested prompt below or start typing.
                </p>

                {/* Suggested prompts list */}
                <div className="mt-8 grid gap-2.5 w-full sm:grid-cols-2">
                  {suggestedPrompts.general.slice(0, 4).map((p, i) => (
                    <SuggestedPrompt key={i} label={p} onClick={handleSend} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onRegenerate={handleSend}
                  />
                ))}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white flex items-center justify-center animate-pulse">
                      <Bot size={15} />
                    </div>
                    <div className="bg-white border border-slate-200 px-5 py-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce delay-150" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-bounce delay-300" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </DashboardLayout>
  );
}
