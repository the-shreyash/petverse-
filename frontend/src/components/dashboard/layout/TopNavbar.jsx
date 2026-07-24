import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  Search,
  CheckCircle,
  Eye,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationBell from "@/components/notifications/shared/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000";
const resolveAvatar = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${BACKEND_URL}${url}`;
};

const ROLE_LABELS = {
  USER: "Pet Parent",
  ADMIN: "Administrator",
  VETERINARIAN: "Veterinarian",
  SHELTER: "Shelter"
};

const TopNavbar = ({
  onMenuClick,
  pageTitle = "Dashboard",
  pageDescription = "Welcome back! Here's what's happening today.",
}) => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const displayName =
    user ? (`${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "User") : "…";
  const roleLabel = ROLE_LABELS[user?.role] || "Pet Parent";
  const avatarSrc =
    resolveAvatar(user?.profile_image) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name || "User")}&background=10b981&color=fff`;

  // Close notification dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close user menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    try { await logout?.(); } catch (_) {}
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-6 lg:px-10">

        {/* Left Side */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-slate-900">
              {pageTitle}
            </h1>

            <p className="text-sm text-slate-500">
              {pageDescription}
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="hidden w-full max-w-md lg:flex">
          <div className="relative w-full">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search pets, appointments..."
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-emerald-400
                focus:bg-white
                focus:ring-4
                focus:ring-emerald-100
              "
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">


          {/* Notifications Bell and Quick Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <NotificationBell
              unreadCount={unreadCount}
              onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
              <div className="
                absolute
                right-0
                mt-3
                w-80
                rounded-3xl
                border
                border-slate-100
                bg-white
                p-4
                shadow-2xl
                z-50
                text-left
              ">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
                  <span className="font-bold text-slate-800 text-sm">Recent Alerts</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 uppercase tracking-wider"
                    >
                      <CheckCircle size={10} />
                      Read All
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markAsRead(item.id);
                        setIsOpen(false);
                      }}
                      className={`
                        p-2.5
                        rounded-xl
                        hover:bg-slate-50
                        transition
                        cursor-pointer
                        border
                        border-transparent
                        ${!item.isRead ? "bg-slate-50/50 border-emerald-100/30" : ""}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800 truncate pr-2 flex-1">
                          {item.title}
                        </span>
                        {!item.isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold truncate mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-xs text-slate-400 font-semibold text-center py-4">
                      No notifications yet.
                    </p>
                  )}
                </div>

                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="
                    mt-3
                    w-full
                    rounded-xl
                    bg-slate-50
                    hover:bg-slate-100
                    py-2
                    text-center
                    text-[10px]
                    font-black
                    text-slate-500
                    uppercase
                    tracking-widest
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    border
                    border-slate-100
                    transition
                    block
                  "
                >
                  <Eye size={12} />
                  View Notification Center
                </Link>
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-3
                py-2
                transition
                hover:border-emerald-300
              "
            >
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-11 w-11 rounded-xl object-cover"
              />

              <div className="hidden text-left lg:block">
                <p className="font-semibold text-slate-900">
                  {displayName}
                </p>
                <p className="text-sm text-slate-500">
                  {roleLabel}
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`hidden text-slate-400 lg:block transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-slate-100 bg-white shadow-2xl z-50 overflow-hidden py-1">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-bold text-slate-900 text-sm truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || roleLabel}</p>
                </div>


                <Link
                  to="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <UserIcon size={15} className="text-slate-400" />
                  My Profile
                </Link>

                <div className="border-t border-slate-100 mt-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default TopNavbar;