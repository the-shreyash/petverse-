import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import RememberMe from "@/components/auth/RememberMe";
import { authTheme } from "@/styles/authTheme";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Where to send the user after a successful sign-in: the page they
  // originally tried to reach (captured by ProtectedRoute), or the dashboard.
  const redirectTo = location.state?.from?.pathname || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const detail = err?.response?.data?.detail
        || err?.response?.data?.message
        || err?.response?.data?.error
        || "Invalid email or password";
      setError(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    window.location.href = `${backendUrl}/auth/google/login`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-500 border border-red-100/60 font-medium">
          {error}
        </div>
      )}

      {/* Email */}
      <AuthInput
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        icon={Mail}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
        required
      />

      {/* Password & Forgot Link */}
      <div className="space-y-2">
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className={`text-xs ${authTheme.link}`}
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Remember Me */}
      <RememberMe
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      />

      {/* Submit Button */}
      <AuthButton type="submit" isLoading={isLoading}>
        Sign In
      </AuthButton>

      {/* Divider */}
      <AuthDivider />

      {/* Google Login */}
      <SocialLoginButton provider="google" onClick={handleGoogleLogin} />

      {/* Navigation Option */}
      <p className="text-center text-sm text-slate-500 pt-2">
        Don't have an account?{" "}
        <Link
          to="/register"
          className={authTheme.link}
        >
          Create Account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
