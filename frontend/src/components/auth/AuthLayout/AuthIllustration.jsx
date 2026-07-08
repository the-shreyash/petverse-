import { motion } from "framer-motion";
import {
  Bot,
  CalendarDays,
  Check,
  HeartPulse,
  Home,
  LogOut,
  MoreHorizontal,
  PawPrint,
  Send,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import dogImage from "@/assets/illustrations/dog.png";
import { authTheme } from "@/styles/authTheme";

const navItems = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "My Pets", icon: PawPrint },
  { label: "Health", icon: HeartPulse },
  { label: "Appointments", icon: CalendarDays },
  { label: "Community", icon: Users },
  { label: "Settings", icon: Settings },
];

const timelineItems = [
  { label: "Rabies", date: "June 15", complete: true },
  { label: "Parvovirus", date: "March 2", complete: true },
  { label: "Distemper", date: "Feb 10", complete: false },
];

const AuthIllustration = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-4 xl:px-8">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
        className="relative z-20 w-full max-w-[760px]"
      >
        <div className={`${authTheme.floatingCard} overflow-hidden p-4`}>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <PawPrint size={20} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-gray-900">
                PetVerse
              </h3>
              <p className="-mt-1 text-xs text-gray-500">
                Pet Care Platform
              </p>
            </div>
          </div>

          <div className="grid min-h-[460px] grid-cols-[76px_minmax(0,1fr)_178px] overflow-hidden rounded-[24px] border border-white/50 bg-white/75 shadow-[0_20px_60px_rgba(16,185,129,.10)] backdrop-blur-2xl">
            <aside className="flex min-w-0 flex-col items-center border-r border-slate-200/60 bg-slate-50/70 py-4">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                <PawPrint size={22} />
              </div>

              <nav className="flex flex-1 flex-col gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className={`group flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-semibold transition ${
                        item.active
                          ? "bg-emerald-50 text-emerald-600 shadow-sm"
                          : "text-slate-500 hover:bg-white hover:text-emerald-600"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="max-w-full truncate">{item.label}</span>
                    </div>
                  );
                })}
              </nav>

              <LogOut size={20} className="text-slate-400" />
            </aside>

            <main className="min-w-0 bg-white/55 p-4">
              <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    PetVerse | Pet Care Platform
                  </p>
                  <h4 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900">
                    Dashboard
                  </h4>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm">
                  <CalendarDays size={14} className="text-emerald-500" />
                  Summy pet
                </div>
              </div>

              <section className="mb-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h5 className="text-xs font-extrabold text-gray-900">
                    Overall Pet Health Metrics
                  </h5>
                  <MoreHorizontal size={16} className="shrink-0 text-slate-400" />
                </div>

                <div className="grid min-w-0 grid-cols-3 gap-2.5">
                  <div className="min-w-0 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                    <p className="mb-3 text-[11px] font-semibold leading-4 text-slate-600">
                      Average Activity Level
                    </p>
                    <div className="relative mx-auto mb-1 flex h-16 w-16 items-end justify-center overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-16 rounded-t-full border-[8px] border-slate-100 border-b-0" />
                      <div className="absolute inset-x-0 bottom-0 h-16 rounded-t-full border-[8px] border-emerald-400 border-b-0 [clip-path:polygon(0_0,82%_0,82%_100%,0_100%)]" />
                      <span className="relative pb-1 text-xl font-extrabold text-gray-900">
                        82%
                      </span>
                    </div>
                    <p className="text-center text-[11px] text-slate-500">Active</p>
                  </div>

                  <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                    <p className="mb-2 text-[11px] font-semibold leading-4 text-slate-600">
                      Weight Trend
                    </p>
                    <svg viewBox="0 0 150 75" className="h-[66px] w-full">
                      <defs>
                        <linearGradient id="authTrend" x1="0" x2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M8 56 C28 22, 42 50, 60 35 S86 22, 100 35 122 50, 142 16"
                        fill="none"
                        stroke="url(#authTrend)"
                        strokeLinecap="round"
                        strokeWidth="5"
                      />
                      <circle cx="82" cy="29" r="14" fill="#d1fae5" />
                      <PawPrint x="73" y="20" size={18} className="text-emerald-500" />
                    </svg>
                  </div>

                  <div className="min-w-0 rounded-xl border border-cyan-100 bg-cyan-50/40 p-3">
                    <p className="mb-4 text-[11px] font-semibold leading-4 text-slate-600">
                      Recent Behavior Score
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900">8.5/10</p>
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h5 className="text-xs font-extrabold text-gray-900">
                    Vaccination Scheduling Timeline
                  </h5>
                  <MoreHorizontal size={16} className="shrink-0 text-slate-400" />
                </div>

                <div className="mb-4 grid grid-cols-[94px_1fr] gap-3 text-xs font-semibold text-slate-600">
                  <span />
                  <div className="flex justify-around">
                    <span>Upcoming</span>
                    <span>Past</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {["Luna - Labrador", "Max - Tabby"].map((pet, row) => (
                    <div key={pet} className="grid min-w-0 grid-cols-[94px_minmax(0,1fr)] items-center gap-3">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 text-[11px] font-bold leading-4 text-slate-700">
                        {pet}
                      </div>

                      <div className="relative flex min-w-0 items-center justify-between">
                        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-100" />
                        <div className="absolute left-0 top-1/2 h-1 w-[68%] -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />

                        {timelineItems.map((item) => (
                          <div key={item.label} className="relative z-10 flex flex-col items-center gap-2">
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                                item.complete || row === 0
                                  ? "bg-emerald-500 text-white"
                                  : "bg-white text-teal-500 ring-2 ring-teal-400"
                              }`}
                            >
                              {item.complete || row === 0 ? <Check size={14} /> : null}
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-white px-2 py-1.5 text-center shadow-sm">
                              <p className="text-[10px] font-bold text-slate-700">
                                {item.label}
                              </p>
                              <p className="text-[9px] text-slate-400">
                                {item.date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            <aside className="min-w-0 space-y-3 border-l border-slate-200/60 bg-slate-50/50 p-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                <div className="relative mx-auto mb-2 h-20 w-20">
                  <img
                    src={dogImage}
                    alt="Luna"
                    className="h-full w-full rounded-full border-4 border-white object-cover shadow-md"
                  />
                  <span className="absolute bottom-2 right-1.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <p className="text-lg font-extrabold text-gray-900">Luna</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 p-3">
                  <div className="min-w-0">
                    <h5 className="text-xs font-extrabold leading-4 text-gray-900">
                      AI Veterinary Chatbot
                    </h5>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold leading-4 text-emerald-600">
                      <Bot size={14} />
                      <span>Dr. Pawfect - AI Assistant</span>
                    </div>
                  </div>
                  <MoreHorizontal size={16} className="shrink-0 text-slate-400" />
                </div>

                <div className="space-y-3 p-3">
                  <div className="max-w-[130px] rounded-2xl rounded-tl-md bg-slate-50 px-3 py-2 text-[11px] leading-4 text-slate-600 shadow-sm">
                    Hello! How can I help with Luna today?
                  </div>
                  <div className="ml-auto max-w-[130px] rounded-2xl rounded-tr-md bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-[11px] leading-4 text-white shadow-sm">
                    Help Luna feel better
                  </div>
                </div>

                <div className="m-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-400">
                  Type your message...
                  <Send size={14} className="ml-auto text-emerald-500" />
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <ShieldCheck size={15} />
                  Care Status
                </div>
                <p className="text-[11px] leading-4 text-slate-600">
                  Vaccines and health reminders are synced for today.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthIllustration;
