import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, CalendarRange, CheckCircle, Smartphone, Mail, ShieldAlert, HeartPulse, ShoppingBag, Users, CalendarClock, Save, Bot } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout";
import GlassCard from "@/components/ui/GlassCard/GlassCard";
import PreferenceCard from "@/components/notifications/cards/PreferenceCard";
import { publishEvent } from "@/utils/events";

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    push: true,
    email: true,
    sms: false,
    categories: {
      health: true,
      shop: true,
      community: true,
      ai: true
    }
  });
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handlePreferenceChange = (channel, updatedPrefs) => {
    const nextPrefs = {
      ...preferences,
      [channel]: updatedPrefs
    };
    setPreferences(nextPrefs);

    // Dynamic save toast feedback
    setSavedFeedback(true);
    const timer = setTimeout(() => setSavedFeedback(false), 1500);
    return () => clearTimeout(timer);
  };

  return (
    <DashboardLayout pageTitle="Notification Preferences" pageDescription="Customize how and when you receive health alerts, shop updates, and AI tips.">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Navigation shortcuts */}
        <div className="space-y-6 text-left">
          <GlassCard className="p-6" hover={false}>
            <h4 className="font-bold text-slate-800 mb-4">Notification Engine</h4>
            <nav className="space-y-1">
              <Link to="/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-bold text-sm transition">
                <Bell size={16} />
                Notification Logs
              </Link>
              <Link to="/notifications/history" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 font-bold text-sm transition">
                <CalendarRange size={16} />
                Reminders Tracker
              </Link>
              <Link to="/notifications/preferences" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm">
                <Settings size={16} />
                Preferences
              </Link>
            </nav>
          </GlassCard>
        </div>

        {/* Middle Preferences checklists (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header & saved alert indicator */}
          <div className="flex justify-between items-center h-10">
            <h3 className="text-lg font-black text-slate-800 text-left">Notification Channels</h3>
            {savedFeedback && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5 shadow-sm animate-pulse">
                <CheckCircle size={12} />
                Changes saved automatically
              </span>
            )}
          </div>

          <div className="space-y-6">
            {Object.keys(preferences).map((channel) => (
              <PreferenceCard
                key={channel}
                channel={channel}
                preferences={preferences[channel]}
                onChange={handlePreferenceChange}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
