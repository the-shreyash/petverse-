import { authTheme } from "@/styles/authTheme";

const RememberMe = ({ checked, onChange, label = "Remember me", ...props }) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div className={`
          h-5 w-5
          rounded-lg
          border
          border-slate-200
          bg-white
          flex items-center justify-center
          transition-all duration-200
          ${authTheme.checkbox.focus}
          ${authTheme.checkbox.checked}
          ${authTheme.checkbox.hover}
        `}>
          <svg
            className={`h-3.5 w-3.5 text-white transition-transform duration-200 ${
              checked ? "scale-100" : "scale-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
        {label}
      </span>
    </label>
  );
};

export default RememberMe;
