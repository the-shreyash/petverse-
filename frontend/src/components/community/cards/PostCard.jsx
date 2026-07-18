import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, MoreHorizontal } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard/GlassCard";
import UserAvatar from "../shared/UserAvatar";
import LocationBadge from "../shared/LocationBadge";
import PetBadge from "../shared/PetBadge";
import MediaGallery from "../shared/MediaGallery";
import ReactionBar from "../shared/ReactionBar";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000";

function resolveMedia(url) {
  if (!url) return url;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${BACKEND_URL}${url}`;
}

export default function PostCard({
  post,
  onLike,
  onBookmark,
  onShare,
  onDelete,
  currentUserId = null
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // `post` comes from useCommunity.mapPost — counts are numbers, flags are booleans.
  const likesCount = typeof post.likes === "number" ? post.likes : (post.likes?.length || 0);
  const commentsCount = typeof post.comments === "number" ? post.comments : (post.comments?.length || 0);
  const isLiked = !!post.likedByMe;
  const isBookmarked = !!post.bookmarkedByMe;
  const images = (post.images || []).map(resolveMedia);
  const isOwner = currentUserId && post.author?.id && post.author.id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      <GlassCard className="p-6 md:p-8" hover={true}>
        {/* Author Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <UserAvatar
            name={post.author?.name}
            avatar={post.author?.avatar}
            role={post.author?.role}
          />
          <div className="flex flex-wrap items-center gap-2">
            <PetBadge pet={post.pet} />
            <LocationBadge text={post.location} />
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  aria-label="Post options"
                >
                  <MoreHorizontal size={18} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-9 z-10 w-36 rounded-xl border border-slate-100 bg-white shadow-lg py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (onDelete && window.confirm("Delete this post?")) onDelete(post.id);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 size={14} /> Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Text Content */}
        <p className="mt-5 text-sm md:text-base text-slate-700 leading-relaxed font-medium text-left whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Media Gallery */}
        <MediaGallery images={images} videos={post.videos} />

        {/* Footer info (Timestamp) */}
        <div className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
              : ""}
          </span>
        </div>

        {/* Reaction Bar */}
        <ReactionBar
          likesCount={likesCount}
          commentsCount={commentsCount}
          sharesCount={post.shares || 0}
          isLiked={isLiked}
          isBookmarked={isBookmarked}
          onLike={() => onLike && onLike(post.id)}
          onBookmark={() => onBookmark && onBookmark(post.id)}
          onShare={() => onShare && onShare(post.id)}
          onCommentClick={() => {}}
        />

        {/* Comment view shortcut */}
        <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between items-center">
          <Link
            to={`/community/post/${post.id}`}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
          >
            View discussions ({commentsCount} comments) →
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}
