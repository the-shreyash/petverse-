import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import { authTheme } from "@/styles/authTheme";

const VerifyOTPForm = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputsRef.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (!/^\d{6}$/.test(pastedData)) {
      setError("Please paste a valid 6-digit code.");
      return;
    }
    setError("");
    const newOtp = pastedData.split("");
    setOtp(newOtp);
    inputsRef.current[5].focus();
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setOtp(new Array(6).fill(""));
    setCountdown(60);
    setError("");
    alert("Verification code resent successfully.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Verification successful!");
      navigate("/");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-500 border border-red-100/60 font-medium">
          {error}
        </div>
      )}

      {/* 6-Digit Input Container */}
      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="
              w-12
              h-14
              text-center
              text-xl
              font-bold
              text-slate-800
              border
              border-slate-200
              rounded-xl
              bg-white
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-100
              outline-none
              transition-all
              duration-200
            "
          />
        ))}
      </div>

      {/* Countdown Timer */}
      <div className="text-center text-sm">
        <span className="text-slate-500">Didn't receive the code? </span>
        {countdown > 0 ? (
          <span className="font-semibold text-slate-700">
            Resend in {countdown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className={`cursor-pointer ${authTheme.link}`}
          >
            Resend Code
          </button>
        )}
      </div>

      {/* Submit Button */}
      <AuthButton type="submit" isLoading={isLoading}>
        Verify Code
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

export default VerifyOTPForm;
