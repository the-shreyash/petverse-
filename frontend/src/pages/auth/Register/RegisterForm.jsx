import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import RememberMe from "@/components/auth/RememberMe";
import { authTheme } from "@/styles/authTheme";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
  
    try {
      setIsLoading(true);
  
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User";
      const username = email.split("@")[0].replace(/[^a-zA-Z0-9._-]/g, "") + Math.floor(Math.random() * 1000);

      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Signup Successful!");
        navigate("/login");
      } else {
        if (data.details && data.details.length > 0) {
          setError(data.details.map(d => `${d.field.split(' → ').pop()}: ${d.message}`).join(" | "));
        } else {
          setError(data.message || "Signup failed");
        }
      }
  
    } catch (error) {
      setError("Backend server not connected");
    } finally {
      setIsLoading(false);
    }
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
          to="/login"
          className={authTheme.link}
        >
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
