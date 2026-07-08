import { useState, forwardRef } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import AuthInput from "./AuthInput";

const PasswordInput = forwardRef(({ label = "Password", placeholder = "••••••••", ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleButton = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="flex cursor-pointer items-center justify-center text-slate-400 transition-colors hover:text-emerald-600 focus:outline-none"
      tabIndex={-1}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <AuthInput
      ref={ref}
      type={showPassword ? "text" : "password"}
      label={label}
      placeholder={placeholder}
      icon={Lock}
      suffix={toggleButton}
      {...props}
    />
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
