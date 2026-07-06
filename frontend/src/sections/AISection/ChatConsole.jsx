import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Brain, Check, RefreshCw } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const CONVERSATIONS = [
  {
    id: "symptoms",
    title: "Symptom Checker",
    prompt: "Why is my cat sneezing so frequently?",
    answer: "Frequent sneezing in cats is often caused by airborne irritants (like dust or perfumes), viral respiratory infections (like Feline Herpesvirus), or allergies. Keep an eye out for eye discharge, wheezing, or low energy. If symptoms persist for more than 48 hours, a vet visit is recommended.",
    icon: "🐈"
  },
  {
    id: "diet",
    title: "Nutrition & Diet",
    prompt: "Can I feed fresh blueberries to my puppy?",
    answer: "Yes, blueberries are an excellent low-calorie snack for puppies! They are packed with antioxidants, fiber, and vitamin C. Just make sure to wash them thoroughly and limit treats to 10% of their daily calorie intake to prevent stomach upset.",
    icon: "🫐"
  },
  {
    id: "behavior",
    title: "Behavioral Guide",
    prompt: "How do I stop my puppy from biting furniture?",
    answer: "Chewing is normal teething behavior. To stop it: redirect them to appropriate chew toys whenever they start biting furniture, apply pet-safe deterrent sprays to popular spots, and ensure they get plenty of physical exercise and mental stimulation to prevent boredom.",
    icon: "🐕"
  }
];

const ChatConsole = () => {
  const [selectedId, setSelectedId] = useState("symptoms");
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const activeConv = CONVERSATIONS.find(c => c.id === selectedId);

  useEffect(() => {
    setIsTyping(true);
    setTypedText("");
    
    let index = 0;
    const text = activeConv.answer;
    
    // Simulate typing speed
    const interval = setInterval(() => {
      setTypedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [selectedId]);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Left side: Prompts list */}
      <div className="space-y-4 lg:col-span-2">
        <h4 className="text-lg font-bold text-slate-800 mb-2">Select a Care Scenario</h4>
        <div className="flex flex-col gap-3">
          {CONVERSATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left font-semibold transition-all duration-300 ${
                selectedId === c.id
                  ? "border-emerald-500 bg-emerald-50/50 text-emerald-800 shadow-md scale-[1.01]"
                  : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-xl shadow-inner">
                {c.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-extrabold">{c.title}</p>
                <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{c.prompt}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Informational micro-card */}
        <div className="rounded-2xl bg-slate-100/50 p-5 border border-slate-100 text-xs text-slate-500 flex items-start gap-3 mt-4">
          <Brain className="text-emerald-500 shrink-0 mt-0.5" size={16} />
          <p className="leading-5">
            <strong>PetVerse AI</strong> processes your pet's age, breed history, and daily tracking logs to customize clinical insights.
          </p>
        </div>
      </div>

      {/* Right side: Mock Chat Window */}
      <div className="lg:col-span-3">
        <GlassCard hover={false} className="flex h-[420px] flex-col border border-slate-200/60 bg-white/90 p-0 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/50 bg-slate-50/40 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                <Sparkles size={18} />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-800">PetVerse Care AI</h5>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  Active Assistant <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </p>
              </div>
            </div>
            <Badge variant="primary" className="text-[10px] py-1 px-2 flex items-center gap-1 font-bold">
              <Check size={10} strokeWidth={3} /> Certified Knowledge Base
            </Badge>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User message */}
            <div className="flex items-start justify-end gap-3">
              <div className="rounded-2xl rounded-tr-none bg-slate-100 px-4 py-3 text-sm text-slate-700 max-w-[80%] leading-6">
                <p className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider mb-1">Owner Ask</p>
                <p>{activeConv.prompt}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">👤</div>
            </div>

            {/* AI Response */}
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-xs shadow-md">
                🤖
              </div>
              <div className="rounded-2xl rounded-tl-none bg-emerald-50/40 border border-emerald-100/60 px-5 py-3.5 text-sm text-slate-700 max-w-[85%] leading-7 relative overflow-hidden">
                <div className="flex items-center justify-between font-bold text-emerald-800 text-[10px] uppercase tracking-wider mb-2">
                  <span>AI Advisor</span>
                  {isTyping && <span className="flex gap-1"><RefreshCw size={10} className="animate-spin" /> Thinking...</span>}
                </div>
                <p className="whitespace-pre-line">{typedText}</p>
              </div>
            </div>
          </div>

          {/* Footer Input Area */}
          <div className="border-t border-slate-200/50 bg-slate-50/30 px-6 py-4 flex gap-3 items-center">
            <div className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-400 flex items-center justify-between">
              <span>Ask custom follow-up (e.g. dosing, vet references)...</span>
              <Send size={14} className="text-slate-300" />
            </div>
            <Button className="h-10 py-0 px-4 rounded-xl text-xs font-bold" variant="primary">
              Ask AI
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ChatConsole;
