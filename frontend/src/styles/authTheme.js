export const authTheme = {
  card: `
    rounded-[30px]
    border
    border-white/40
    bg-white/70
    p-8
    shadow-[0_20px_60px_rgba(16,185,129,.10)]
    backdrop-blur-2xl
  `,

  floatingCard: `
    rounded-[30px]
    border
    border-white/40
    bg-white/70
    backdrop-blur-2xl
    shadow-[0_20px_60px_rgba(16,185,129,.10)]
  `,

  input: `
    border-slate-200
    bg-white
    focus:border-emerald-500
    focus:ring-emerald-100
  `,

  link: `
    font-bold
    text-emerald-600
    transition-colors
    hover:text-teal-600
  `,

  successIcon: `
    rounded-full
    border
    border-emerald-100/60
    bg-emerald-50
    p-3
    text-emerald-500
  `,

  checkbox: {
    focus: "peer-focus:ring-2 peer-focus:ring-emerald-100",
    checked: "peer-checked:bg-emerald-500 peer-checked:border-emerald-500",
    hover: "group-hover:border-emerald-400",
  },

  iconTile: "rounded-xl bg-emerald-100 p-2 text-emerald-600",
};
