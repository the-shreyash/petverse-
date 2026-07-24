import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, User, AtSign } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import RememberMe from "@/components/auth/RememberMe";
import { authTheme } from "@/styles/authTheme";
import { useAuth } from "@/contexts/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // Return the user to the page they originally requested (if any) once
  // their account is created; otherwise land them on the dashboard.
  const redirectTo = location.state?.from?.pathname || "/dashboard";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept Terms and Privacy Policy");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setIsLoading(true);
      await register({
        first_name: firstName,
        last_name: lastName,
        username: username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '_'),
        email,
        password,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const detail = err?.response?.data?.detail
        || err?.response?.data?.message
        || err?.response?.data?.error;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg || d.message || JSON.stringify(d)).join(' | '));
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    window.location.href = `${backendUrl}/auth/google/login`;
  };

  const termsLabel = (
    <span className="text-xs text-slate-500 font-normal">
      I agree to the{" "}
      <Link to="/terms" className="font-semibold text-emerald-600 hover:text-teal-600">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link to="/privacy" className="font-semibold text-emerald-600 hover:text-teal-600">
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

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <AuthInput
          label="First Name"
          type="text"
          placeholder="John"
          icon={User}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <AuthInput
          label="Last Name"
          type="text"
          placeholder="Doe"
          icon={User}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      {/* Username */}
      <AuthInput
        label="Username"
        type="text"
        placeholder="johndoe"
        icon={AtSign}
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
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
      <SocialLoginButton provider="google" onClick={handleGoogleLogin}>
        Sign up with Google
      </SocialLoginButton>

      {/* Navigation Option */}
      <p className="text-center text-sm text-slate-500 pt-1">
        Already have an account?{" "}
        <Link to="/login" className={authTheme.link}>
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
