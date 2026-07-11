import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import RememberMe from "@/components/auth/RememberMe";
import { authTheme } from "@/styles/authTheme";

const LoginForm = () => {
  const navigate = useNavigate();
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
      const response = await axios.post(
        "http://127.0.0.1:5001/login",
        {
          email,
          password,
        }
      );
  
      localStorage.setItem("token", response.data.token);
  
      navigate("/dashboard");
  
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Server Error");
      }
    } finally {
      setIsLoading(false);
    }
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
        Continue
      </AuthButton>

      {/* Divider */}
      <AuthDivider />

      {/* Google Login */}
      <SocialLoginButton provider="google" onClick={() => alert("Google Login simulated")} />

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
