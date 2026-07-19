/**
 * Media URL helpers.
 *
 * The backend persists uploads as root-relative paths ("/uploads/posts/x.jpg")
 * so the stored value stays host-agnostic. The browser needs them resolved
 * against the API origin, which is not the same origin as the Vite dev server.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// Strip the "/api/v1" suffix to get the bare server origin that serves /uploads.
export const API_ORIGIN = API_BASE.replace(/\/api\/v\d+\/?$/, "");

export function resolveMediaUrl(url) {
  if (!url) return null;
  // Already absolute (external image, data URI, blob preview) — leave it alone.
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function avatarFor(user, fallbackName = "User") {
  const direct = user?.avatar_url || user?.profile_image;
  if (direct) return resolveMediaUrl(direct);
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || fallbackName;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`;
}

export function displayName(user, fallback = "User") {
  if (!user) return fallback;
  return (
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username ||
    fallback
  );
}
