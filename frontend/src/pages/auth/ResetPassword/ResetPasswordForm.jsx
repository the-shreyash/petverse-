import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import { authTheme } from "@/styles/authTheme";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center py-2">
        <div className="flex justify-center">
          <div className={`${authTheme.successIcon} animate-bounce`}>
            <CheckCircle2 size={36} />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800">Password reset complete</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your password has been successfully updated. <br />
            You can now log in with your new credentials.
          </p>
        </div>
        <div className="pt-2">
          <AuthButton onClick={() => navigate("/auth/login")}>
            Proceed to Sign In
          </AuthButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-500 border border-red-100/60 font-medium">
          {error}
        </div>
      )}

      {/* New Password */}
      <PasswordInput
        label="New Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      {/* Confirm Password */}
      <PasswordInput
        label="Confirm Password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      {/* Submit Button */}
      <AuthButton type="submit" isLoading={isLoading}>
        Reset Password
      </AuthButton>

      {/* Back to Login */}
      <div className="text-center pt-2">
        <Link
          to="/auth/login"
          className={`inline-flex cursor-pointer items-center gap-2 text-sm ${authTheme.link}`}
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
