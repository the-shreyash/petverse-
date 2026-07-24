import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCw, CheckCircle, ShieldAlert, Sparkles } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";
import dogImage from "../../assets/illustrations/hero-dog.png";

const BREED_RESULTS = [
  { name: "Golden Retriever", confidence: 92, color: "bg-emerald-500" },
  { name: "Labrador Retriever", confidence: 6, color: "bg-teal-500" },
  { name: "Flat-Coated Retriever", confidence: 2, color: "bg-cyan-500" }
];

const BREED_STATS = [
  { label: "Energy Level", value: "High (4/5)" },
  { label: "Trainability", value: "Eager to Please" },
  { label: "Life Expectancy", value: "10-12 Years" }
];

const BreedScanner = () => {
  const [scanState, setScanState] = useState("idle"); // idle, scanning, completed
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setScanState("scanning");
    setProgress(0);
  };

  useEffect(() => {
    if (scanState !== "scanning") return;

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setScanState("completed");
          return 100;
        }
        return oldProgress + 2.5; // Controls scan speed
      });
    }, 50);

    return () => clearInterval(timer);
  }, [scanState]);

  return (
    <div className="grid gap-8 lg:grid-cols-5 items-center">
      {/* Left Column: Image Scanner View */}
      <div className="lg:col-span-2">
        <GlassCard hover={false} className="border border-slate-200/60 bg-white/90 p-5 shadow-xl relative overflow-hidden">
          {/* Top header decoration */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Camera size={14} className="text-slate-400" /> AI Lens View
            </span>
            <div className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          </div>

          {/* Scanner Area */}
          <div className="relative rounded-[20px] overflow-hidden bg-slate-50 border border-slate-100 aspect-square flex items-center justify-center">
            <img
              src={dogImage}
              alt="Scan Subject"
              className={`h-full w-full object-contain p-4 transition-all duration-700 ${scanState === "scanning" ? "brightness-75 blur-[1px]" : ""
                }`}
            />

            {/* Glowing Scanning Line */}
            {scanState === "scanning" && (
              <motion.div
                className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
                animate={{
                  top: ["0%", "100%", "0%"]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Overlay Status */}
            <AnimatePresence>
              {scanState === "scanning" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center text-white"
                >
                  <p className="text-sm font-bold tracking-wider mb-2">SCANNING SUBJECT...</p>
                  <p className="text-xs opacity-75">{Math.floor(progress)}% Complete</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controller Button */}
          <div className="mt-5">
            {scanState === "idle" && (
              <Button onClick={startScan} className="w-full flex items-center justify-center gap-2" variant="primary">
                <Sparkles size={16} /> Analyze Pet Photo
              </Button>
            )}
            {scanState === "scanning" && (
              <Button disabled className="w-full flex items-center justify-center gap-2 cursor-not-allowed opacity-75">
                <RefreshCw size={16} className="animate-spin" /> Processing Features...
              </Button>
            )}
            {scanState === "completed" && (
              <Button onClick={startScan} className="w-full flex items-center justify-center gap-2" variant="secondary">
                <RefreshCw size={16} /> Scan Another Photo
              </Button>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Right Column: AI Analysis Results */}
      <div className="lg:col-span-3">
        <GlassCard hover={false} className="border border-slate-200/60 bg-white/95 p-6 md:p-8 shadow-xl">
          <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            AI Classification Report
          </h4>

          <AnimatePresence mode="wait">
            {scanState === "idle" && (
              <motion.div
                key="idle-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12 text-center text-slate-400"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4">
                  <Camera size={28} />
                </div>
                <p className="text-sm font-semibold">Ready to Scan</p>
                <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                  Click the scan button to run breed classification and characteristics analysis.
                </p>
              </motion.div>
            )}

            {scanState === "scanning" && (
              <motion.div
                key="scanning-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center text-slate-400"
              >
                <RefreshCw size={36} className="animate-spin text-emerald-500 mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-600">Running Neural Network...</p>
                <p className="text-xs text-slate-400 mt-2">
                  Matching key facial and biological parameters against 250+ distinct breeds.
                </p>
              </motion.div>
            )}

            {scanState === "completed" && (
              <motion.div
                key="results-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Confidence scores */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classification Confidence</p>
                  {BREED_RESULTS.map((r, index) => (
                    <div key={r.name} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          {index === 0 && <CheckCircle size={14} className="text-emerald-500" />} {r.name}
                        </span>
                        <span className="text-slate-800">{r.confidence}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          className={`h-full ${r.color}`}
                          initial={{ width: "0%" }}
                          animate={{ width: `${r.confidence}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Characteristics breakdown */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Breed Characteristics</p>
                  <div className="grid gap-4 grid-cols-3">
                    {BREED_STATS.map((s, idx) => (
                      <div key={idx} className="rounded-xl bg-slate-50 p-4 text-center border border-slate-100/50">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className="text-xs md:text-sm font-extrabold text-slate-700">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50/30 border border-emerald-100/50 p-4 flex gap-3 text-xs leading-5 text-emerald-800">
                  <ShieldAlert className="shrink-0 mt-0.5" size={16} />
                  <p>
                    <strong>Golden Retriever Care Tip:</strong> Golden Retrievers are active and highly social dogs. They need regular exercise and love to carry objects in their mouths, so provide plenty of safe chew toys!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
};

export default BreedScanner;
