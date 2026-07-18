export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);
  return decoded ? decoded.user_id || decoded.id : null;
};
