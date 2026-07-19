import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function PetStoryCard({
  story,
  isOpen,
  onClose,
  onNext,
  onPrev,
  duration = 5000
}) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onNext();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, story, onNext, duration]);

  if (!isOpen || !story) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-55 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 transition outline-none"
        >
          <X size={20} />
        </button>

        {/* Prev Arrow */}
        <button
          onClick={onPrev}
          className="absolute left-4 md:left-12 z-55 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 transition hidden sm:block outline-none"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Story Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md h-[80vh] rounded-[30px] overflow-hidden shadow-2xl bg-black border border-white/10"
        >
          {/* Progress Bar Indicators */}
          <div className="absolute top-4 left-4 right-4 z-54 flex gap-1.5">
            <div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
              <motion.div
                key={story.id}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="h-full bg-emerald-400"
              />
            </div>
          </div>

          {/* Author info overlay */}
          <div className="absolute top-8 left-4 z-54 flex items-center gap-3 text-white">
            <img
              src={story.authorAvatar}
              alt="author"
              className="h-9 w-9 rounded-full object-cover border-2 border-emerald-400"
            />
            <div className="text-left">
              <p className="font-semibold text-sm drop-shadow-md">{story.authorName}</p>
              {story.caption && (
                <p className="text-[10px] text-emerald-300 font-bold drop-shadow-md">
                  {story.caption}
                </p>
              )}
            </div>
          </div>

          {/* Main Media */}
          {story.mediaType === "VIDEO" ? (
            <video
              src={story.mediaUrl}
              className="h-full w-full object-cover select-none"
              autoPlay
              muted
              playsInline
              loop
            />
          ) : (
            <img
              src={story.mediaUrl}
              alt="story media"
              className="h-full w-full object-cover select-none pointer-events-none"
            />
          )}
        </motion.div>

        {/* Next Arrow */}
        <button
          onClick={onNext}
          className="absolute right-4 md:right-12 z-55 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 transition hidden sm:block outline-none"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </AnimatePresence>
  );
}
