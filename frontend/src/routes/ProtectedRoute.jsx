import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Route guard for authenticated-only areas.
 *
 * - While the session is being restored (`loading`), render a lightweight
 *   splash so we never flash the login page for an already-signed-in user.
 * - When there is no authenticated user, redirect to /login and remember the
 *   originally requested location in router state (`from`) so the login flow
 *   can send the user straight back after a successful sign-in.
 * - Otherwise render the nested protected routes via <Outlet />.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
