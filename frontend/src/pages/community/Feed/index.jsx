import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Search, TrendingUp, Users, Heart, MessageSquare, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout";
import GlassCard from "@/components/ui/GlassCard/GlassCard";
import StoryCard from "@/components/community/cards/StoryCard";
import PetStoryCard from "@/components/community/cards/PetStoryCard";
import PostCard from "@/components/community/cards/PostCard";
import CreatePostModal from "@/components/community/shared/CreatePostModal";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/contexts/AuthContext";

export default function FeedPage() {
  const { posts, stories, addPost, likePost, bookmarkPost, deletePost, addStory } = useCommunity();
  const { user } = useAuth();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenStory = (story, index) => {
    setSelectedStory(story);
    setStoryIndex(index);
  };

  const handleNextStory = () => {
    if (storyIndex < stories.length - 1) {
      const nextIndex = storyIndex + 1;
      setSelectedStory(stories[nextIndex]);
      setStoryIndex(nextIndex);
    } else {
      setSelectedStory(null);
    }
  };

  const handlePrevStory = () => {
    if (storyIndex > 0) {
      const prevIndex = storyIndex - 1;
      setSelectedStory(stories[prevIndex]);
      setStoryIndex(prevIndex);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.content || "").toLowerCase().includes(q) ||
      (p.author?.name || "").toLowerCase().includes(q)
    );
  });

  const handleShare = async (postId) => {
    const url = `${window.location.origin}/community/post/${postId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "PetVerse post", url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* user dismissed share sheet — non-fatal */
    }
  };

  return (
    <DashboardLayout pageTitle="Community" pageDescription="Connect with fellow pet lovers, view stories, and share tips.">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Section Shortcuts */}
        <div className="hidden lg:block space-y-6">
          <GlassCard className="p-6 text-left" hover={false}>
            <h4 className="font-bold text-slate-800 mb-4">Navigations</h4>
            <nav className="space-y-1">
              <Link to="/community" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm">
                <Users size={16} />
                Social Feed
              </Link>
              <Link to="/adoption" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-bold text-sm transition">
                <Heart size={16} />
                Find Adoption
              </Link>
              <Link to="/community/lost-found" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-bold text-sm transition">
                <AlertCircle size={16} />
                Lost & Found
              </Link>
              <Link to="/community/messages" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-bold text-sm transition">
                <MessageSquare size={16} />
                Direct Chats
              </Link>
            </nav>
          </GlassCard>
        </div>

        {/* Middle Main Feed (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stories list */}
          <div className="flex items-center gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
            {/* Create Story Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => addStory("https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80", "Luna")}
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <div className="h-[74px] w-[74px] rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-white shadow-sm hover:border-emerald-500 transition">
                <PlusCircle size={24} className="text-slate-400 hover:text-emerald-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-500">Post Story</span>
            </motion.button>

            {/* Stories */}
            {stories.map((story, i) => (
              <StoryCard
                key={story.id}
                story={story}
                onClick={() => handleOpenStory(story, i)}
              />
            ))}
          </div>

          {/* Social Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations, tags, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                py-3.5
                pl-11
                pr-4
                text-sm
                outline-none
                transition
                focus:border-emerald-400
                focus:ring-4
                focus:ring-emerald-100
              "
            />
          </div>

          {/* Add Post Widget Card */}
          <GlassCard className="p-5 flex items-center gap-4 text-left cursor-pointer" hover={true} onClick={() => setIsPostModalOpen(true)}>
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              alt="avatar"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 py-2.5 px-4 text-sm text-slate-400 font-medium">
              Share something about your pet today...
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md">
              <PlusCircle size={18} />
            </button>
          </GlassCard>

          {/* Feed Posts */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                  onLike={likePost}
                  onBookmark={bookmarkPost}
                  onShare={handleShare}
                  onDelete={deletePost}
                />
              ))
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-white p-12 text-center text-slate-400">
                No discussions matching your query were found.
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Trending Topics & Shelters */}
        <div className="space-y-6 text-left">
          {/* Trending hashtags */}
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
              <TrendingUp size={16} className="text-emerald-500" />
              <span>Trending Discussions</span>
            </div>
            <div className="space-y-3 font-semibold text-sm text-slate-600">
              <Link to="/community/trending" className="block hover:text-emerald-500 transition">
                #GoldenRetrievers <span className="text-xs text-slate-400 font-medium block">2.4k posts this week</span>
              </Link>
              <Link to="/community/trending" className="block hover:text-emerald-500 transition">
                #PuppyTrainingTips <span className="text-xs text-slate-400 font-medium block">1.8k posts this week</span>
              </Link>
              <Link to="/community/trending" className="block hover:text-emerald-500 transition">
                #PersianCatCare <span className="text-xs text-slate-400 font-medium block">982 posts this week</span>
              </Link>
              <Link to="/community/trending" className="block hover:text-emerald-500 transition">
                #VeterinaryAdvising <span className="text-xs text-slate-400 font-medium block">840 posts this week</span>
              </Link>
            </div>
          </GlassCard>

          {/* Quick Shelter profiles */}
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
              <Heart size={16} className="text-rose-500" />
              <span>Rescue Shelters Nearby</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&auto=format&fit=crop&q=80"
                  alt="shelter"
                  className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-xs truncate">Hopeful Paws Sanctuary</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Brooklyn, NY • 4.9 ★</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&auto=format&fit=crop&q=80"
                  alt="shelter"
                  className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-xs truncate">Metro Cat Haven</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manhattan, NY • 4.8 ★</p>
                </div>
              </div>
            </div>
            <Link
              to="/adoption"
              className="mt-4 w-full rounded-xl bg-slate-100 hover:bg-slate-200/80 py-2 text-center text-xs font-bold text-slate-600 transition block"
            >
              Browse Shelters & Pets
            </Link>
          </GlassCard>
        </div>
      </div>

      {/* Post Modal */}
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSave={addPost}
      />

      {/* Expanded Story overlay */}
      <PetStoryCard
        story={selectedStory}
        isOpen={selectedStory !== null}
        onClose={() => setSelectedStory(null)}
        onNext={handleNextStory}
        onPrev={handlePrevStory}
      />
    </DashboardLayout>
  );
}
