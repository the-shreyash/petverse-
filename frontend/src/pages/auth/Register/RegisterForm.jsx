import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import RememberMe from "@/components/auth/RememberMe";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms & Privacy Policy.");
      return;
    }

    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Registration simulated for: " + email);
      navigate("/auth/verify");
    }, 1200);
  };

  const termsLabel = (
    <span className="text-xs text-slate-500 font-normal">
      I agree to the{" "}
      <Link to="/terms" className="font-semibold text-cyan-600 hover:text-cyan-700">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link to="/privacy" className="font-semibold text-cyan-600 hover:text-cyan-700">
        Privacy Policy
      </Link>
    </span>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-500 border border-red-100/60 font-medium">
          {error}
        </div>
      )}

      {/* Name */}
      <AuthInput
        label="Full Name"
        type="text"
        placeholder="John Doe"
        icon={User}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Email */}
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

      {/* Password */}
      <PasswordInput
        label="Password"
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

      {/* Terms Checkbox */}
      <RememberMe
        checked={agreeTerms}
        onChange={(e) => setAgreeTerms(e.target.checked)}
        label={termsLabel}
      />

      {/* Submit Button */}
      <AuthButton type="submit" isLoading={isLoading} className="mt-2">
        Create Account
      </AuthButton>

      {/* Divider */}
      <AuthDivider />

      {/* Google Signup */}
      <SocialLoginButton provider="google" onClick={() => alert("Google Signup simulated")}>
        Sign up with Google
      </SocialLoginButton>

      {/* Navigation Option */}
      <p className="text-center text-sm text-slate-500 pt-1">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
