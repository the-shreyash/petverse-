import { forwardRef } from "react";

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

        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          )}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`
              w-full
              rounded-2xl
              border
              ${
                error
                  ? "border-red-400 focus:ring-red-100 focus:border-red-500"
                  : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
              }
              bg-white
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