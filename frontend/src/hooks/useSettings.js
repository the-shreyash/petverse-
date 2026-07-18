import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

const unwrap = (res) => res.data?.data ?? res.data;

export function useSettings() {
  const [preferences, setPreferences] = useState(null);
  const [privacy, setPrivacy] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [prefRes, privRes] = await Promise.all([
        api.get("/users/preferences"),
        api.get("/users/privacy")
      ]);
      setPreferences(unwrap(prefRes));
      setPrivacy(unwrap(privRes));
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateProfile = useCallback(async (payload) => {
    const res = await api.patch("/users/me", payload);
    return unwrap(res);
  }, []);

  const changePassword = useCallback(async (current_password, new_password) => {
    const res = await api.put("/users/change-password", { current_password, new_password });
    return unwrap(res);
  }, []);

  const updatePreferences = useCallback(async (next) => {
    // Backend PUT replaces the whole object — always send the full merged set.
    const merged = { ...preferences, ...next };
    const res = await api.put("/users/preferences", merged);
    const data = unwrap(res);
    setPreferences(data);
    return data;
  }, [preferences]);

  const updatePrivacy = useCallback(async (next) => {
    const merged = { ...privacy, ...next };
    const res = await api.put("/users/privacy", merged);
    const data = unwrap(res);
    setPrivacy(data);
    return data;
  }, [privacy]);

  const uploadAvatar = useCallback(async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post("/users/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return unwrap(res);
  }, []);

  const deleteAccount = useCallback(async (password) => {
    await api.delete("/users/delete-account", { data: { password } });
  }, []);

  return {
    preferences,
    privacy,
    loading,
    reload: load,
    updateProfile,
    changePassword,
    updatePreferences,
    updatePrivacy,
    uploadAvatar,
    deleteAccount
  };
}

export default useSettings;
