import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * OAuthCallback — Landing page after Google OAuth redirect.
 * 
 * The backend redirects to:
 *   /auth/oauth-callback?access_token=...&refresh_token=...&token_type=bearer
 *
 * This page extracts the tokens from the URL, stores them, and redirects
 * to the dashboard.
 */
const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const error = params.get("error");

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=oauth_failed");
      return;
    }

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }
      // Clean URL and redirect to dashboard
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login?error=no_token");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
          <svg
            className="w-8 h-8 text-emerald-600 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-700">
          Completing sign-in…
        </h2>
        <p className="text-sm text-slate-500">Please wait while we set up your session.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
