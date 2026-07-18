import React, { useEffect, useState } from "react";
import {
  Bot,
  CalendarDays,
  Syringe,
  UtensilsCrossed,
  Activity,
  Bell,
  PawPrint,
  ShoppingBag,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";

const ICON_MAP = {
  "appointment": CalendarDays,
  "vaccination": Syringe,
  "feeding": UtensilsCrossed,
  "ai": Bot,
  "order": ShoppingBag,
  "health": Heart,
  "pet": PawPrint,
  "system": Bell
};

const COLOR_MAP = {
  "appointment": "bg-blue-50 text-blue-600",
  "vaccination": "bg-purple-50 text-purple-600",
  "feeding": "bg-amber-50 text-amber-600",
  "ai": "bg-violet-50 text-violet-600",
  "order": "bg-green-50 text-green-600",
  "health": "bg-rose-50 text-rose-600",
  "pet": "bg-emerald-50 text-emerald-600",
  "system": "bg-slate-50 text-slate-600"
};

// Derives an icon category from a raw notification's type + entity_type.
function categoryOf(n) {
  const et = (n.entity_type || "").toLowerCase();
  if (et.includes("appointment")) return "appointment";
  if (et.includes("vaccination")) return "vaccination";
  if (et.includes("order") || et.includes("cart") || et.includes("product")) return "order";
  if (et.includes("adopt") || et.includes("pet")) return "pet";
  if (et.includes("ai")) return "ai";
  if (et.includes("health") || et.includes("medication")) return "health";
  const t = (n.type || "").toUpperCase();
  if (t === "SOCIAL") return "pet";
  if (t === "COMMERCE") return "order";
  if (t === "REMINDER") return "health";
  return "system";
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

const ActivityTimeline = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await api.get("/notifications?limit=10");
        const data = response.data || [];
        setActivities(data);
      } catch (err) {
        console.error("Failed to load activity", err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">Recent Activity</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Activity Timeline</h2>
        <p className="mt-2 text-slate-500">Everything happening across your pets in one place.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
                <div className="h-2 bg-slate-100 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="relative ml-5 border-l-2 border-slate-100">
          {activities.map((activity, idx) => {
            const category = categoryOf(activity);
            const IconComponent = ICON_MAP[category] || Bell;
            const colorClass = COLOR_MAP[category] || COLOR_MAP["system"];

            return (
              <motion.div
                key={activity.id || idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 4 }}
                className="relative mb-6 pl-8"
              >
                <div className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full ${colorClass} border-2 border-white shadow-sm`}>
                  <IconComponent size={14} />
                </div>
                <div className={`rounded-xl border px-4 py-3 ${activity.status !== "READ" && !activity.read_at ? "border-emerald-100 bg-emerald-50/40" : "border-slate-100 bg-white"}`}>
                  <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                  {(activity.body || activity.message) && (
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{activity.body || activity.message}</p>
                  )}
                  <p className="mt-1 text-[10px] font-medium text-slate-400">{timeAgo(activity.created_at)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-12 px-4 text-center">
          <Activity className="text-slate-300 mb-4" size={40} />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No recent activity</h3>
          <p className="text-slate-500 max-w-sm">
            When you interact with PetVerse — adding pets, booking appointments, or sharing posts — your activity will appear here.
          </p>
        </div>
      )}
    </section>
  );
};

export default ActivityTimeline;