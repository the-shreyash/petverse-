import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export default function PetStatusBadge({ status }) {
  const styles = {
    Healthy: {
      container: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
    },
    "Vaccination Due": {
      container: "bg-amber-50 text-amber-700 border-amber-200/60",
      dot: "bg-amber-500",
      icon: AlertTriangle,
    },
    "Needs Checkup": {
      container: "bg-rose-50 text-rose-700 border-rose-200/60",
      dot: "bg-rose-500",
      icon: AlertCircle,
    },
  };

  const current = styles[status] || {
    container: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
    icon: CheckCircle2,
  };

  const Icon = current.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-semibold
        shadow-sm
        backdrop-blur-md
        ${current.container}
      `}
    >
      <Icon size={14} className="shrink-0" />
      <span>{status || "Unknown"}</span>
    </span>
  );
}
