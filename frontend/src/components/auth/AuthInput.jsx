import { forwardRef } from "react";
import { authTheme } from "@/styles/authTheme";

const AuthInput = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      icon: Icon,
      suffix,
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <div className="group relative">
          {Icon && (
            <Icon
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500"
            />
          )}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`
              w-full
              rounded-xl
              border
              ${
                error
                  ? "border-red-400 focus:ring-red-100 focus:border-red-500"
                  : authTheme.input
              }
              py-3
              ${Icon ? "pl-12" : "pl-4"}
              ${suffix ? "pr-12" : "pr-4"}
              text-slate-800
              placeholder:text-slate-400
              outline-none
              transition-all
              duration-200
              focus:ring-4
              ${className}
            `}
            {...props}
          />

          {suffix && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
              {suffix}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
