import React from "react";
import { motion } from "framer-motion";

export default function StoryCard({ story, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 shrink-0 outline-none"
    >
      <div
        className={`relative p-[3px] rounded-full shadow-md ${
          story.seen
            ? "bg-slate-300"
            : "bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500"
        }`}
      >
        <div className="h-16 w-16 rounded-full border-2 border-white overflow-hidden bg-slate-100">
          <img
            src={story.mediaUrl}
            alt={story.petName || story.authorName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm flex items-center justify-center">
          <img
            src={story.authorAvatar}
            alt="author"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-600 truncate max-w-[70px]">
        {story.petName || story.authorName.split(" ")[0]}
      </span>
    </motion.button>
  );
}
