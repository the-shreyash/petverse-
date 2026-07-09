import { PawPrint } from "lucide-react";

export default function PetAvatar({ src, name, species, size = "md", status }) {
  const sizeClasses = {
    sm: "h-10 w-10 text-xs",
    md: "h-16 w-16 text-sm",
    lg: "h-24 w-24 text-lg",
    xl: "h-32 w-32 text-2xl",
  };

  const ringColorClasses = {
    Healthy: "ring-emerald-400",
    "Vaccination Due": "ring-amber-400",
    "Needs Checkup": "ring-rose-400",
  };

  const getInitials = (n) => {
    if (!n) return "?";
    return n.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={`
        relative
        inline-flex
        items-center
        justify-center
        rounded-3xl
        bg-gradient-to-br
        from-slate-100
        to-slate-200
        font-bold
        text-slate-600
        shadow-inner
        ${sizeClasses[size] || sizeClasses.md}
        ${status ? `ring-4 ring-offset-2 ${ringColorClasses[status] || "ring-slate-300"}` : ""}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full rounded-[inherit] object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = ""; // Force fallback rendering
          }}
        />
      ) : (
        <span className="flex flex-col items-center justify-center gap-0.5">
          {name ? (
            getInitials(name)
          ) : (
            <PawPrint className="opacity-60" size={size === "sm" ? 14 : size === "md" ? 22 : 36} />
          )}
        </span>
      )}
    </div>
  );
}
