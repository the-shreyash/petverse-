import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { authTheme } from "@/styles/authTheme";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center py-2">
        <div className="flex justify-center">
          <div className={`${authTheme.successIcon} animate-bounce`}>
            <CheckCircle2 size={36} />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800">Check your email</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            We have sent password recovery instructions to <br />
            <strong className="text-slate-700">{email}</strong>
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/login"
            className={`inline-flex cursor-pointer items-center gap-2 text-sm ${authTheme.link}`}
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
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

      {/* Email Input */}
      <AuthInput
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        icon={Mail}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      {/* Continue Button */}
      <AuthButton type="submit" isLoading={isLoading}>
        Send Instructions
      </AuthButton>

      {/* Back to Login */}
      <div className="text-center pt-2">
        <Link
          to="/login"
          className={`inline-flex cursor-pointer items-center gap-2 text-sm ${authTheme.link}`}
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
