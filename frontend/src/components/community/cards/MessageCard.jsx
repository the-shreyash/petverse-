import React from "react";
import { Check, CheckCheck } from "lucide-react";

export default function MessageCard({ conversation, isActive, onClick }) {
  const messages = conversation.messages || [];
  const lastMessage = messages[messages.length - 1];
  const participant = conversation.participant;

  // The server computes unread from each participant's read cursor; the list
  // payload only carries the last message, so it cannot be derived client-side.
  const unreadCount = conversation.unreadCount ?? 0;

  return (
    <button
      onClick={onClick}
      className={`
        w-full
        flex
        items-start
        gap-4
        p-4
        rounded-[20px]
        transition
        outline-none
        text-left
        ${
          isActive
            ? "bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100 shadow-sm"
            : "hover:bg-slate-50 border border-transparent"
        }
      `}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={participant.avatar}
          alt={participant.name}
          className="h-12 w-12 rounded-xl object-cover border border-slate-200"
        />
        {participant.status === "online" && (
          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>

      {/* Message Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 text-sm truncate">{participant.name}</span>
          <span className="text-[10px] text-slate-400 font-semibold shrink-0">
            {lastMessage
              ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : ""}
          </span>
        </div>

        <p className="text-xs text-slate-400 font-semibold mt-0.5">{participant.role}</p>

        {/* Message preview */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs font-semibold text-slate-500 truncate pr-2 flex-1">
            {lastMessage ? lastMessage.text : "No messages yet"}
          </p>

          {/* Delivery ticks or unread counts */}
          {unreadCount > 0 ? (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          ) : lastMessage && lastMessage.sender === "me" ? (
            <span className="text-slate-400">
              {lastMessage.status === "read" ? (
                <CheckCheck size={14} className="text-emerald-500" />
              ) : (
                <Check size={14} />
              )}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
