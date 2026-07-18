import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/layout";
import { motion } from "framer-motion";
import {
  User, Bell, Shield, Palette, Check, Camera, Lock, LogOut,
  Trash2, Loader2, AlertTriangle, Mail, Link2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8000";
const resolveAvatar = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${BACKEND_URL}${url}`;
};

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-slate-300"} ${disabled ? "opacity-50" : ""}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function Banner({ msg, tone = "success" }) {
  if (!msg) return null;
  const tones = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    error: "bg-rose-50 text-rose-700 border-rose-200"
  };
  return (
    <div className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${tones[tone]}`}>{msg}</div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, fetchCurrentUser } = useAuth();
  const {
    preferences, privacy, loading,
    updateProfile, changePassword, updatePreferences, updatePrivacy, uploadAvatar, deleteAccount
  } = useSettings();

  const fileRef = useRef(null);

  const [form, setForm] = useState({ first_name: "", last_name: "", username: "", phone_number: "", city: "", bio: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [pwd, setPwd] = useState({ current_password: "", new_password: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  const [prefMsg, setPrefMsg] = useState(null);
  const [avatarBusy, setAvatarBusy] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deletePwd, setDeletePwd] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteErr, setDeleteErr] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        phone_number: user.phone_number || "",
        city: user.city || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const flash = (setter, value) => {
    setter(value);
    setTimeout(() => setter(null), 3000);
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await updateProfile(form);
      await fetchCurrentUser();
      flash(setProfileMsg, { msg: "Profile updated successfully.", tone: "success" });
    } catch (err) {
      flash(setProfileMsg, { msg: err.response?.data?.message || "Failed to update profile.", tone: "error" });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (pwd.new_password !== pwd.confirm) {
      flash(setPwdMsg, { msg: "New passwords do not match.", tone: "error" });
      return;
    }
    setPwdSaving(true);
    try {
      await changePassword(pwd.current_password, pwd.new_password);
      setPwd({ current_password: "", new_password: "", confirm: "" });
      flash(setPwdMsg, { msg: "Password changed successfully.", tone: "success" });
    } catch (err) {
      flash(setPwdMsg, { msg: err.response?.data?.message || "Failed to change password.", tone: "error" });
    } finally {
      setPwdSaving(false);
    }
  };

  const handlePref = async (patch) => {
    try {
      await updatePreferences(patch);
      flash(setPrefMsg, { msg: "Preferences saved.", tone: "success" });
    } catch {
      flash(setPrefMsg, { msg: "Failed to save preferences.", tone: "error" });
    }
  };

  const handlePrivacy = async (patch) => {
    try {
      await updatePrivacy(patch);
      flash(setPrefMsg, { msg: "Privacy settings saved.", tone: "success" });
    } catch {
      flash(setPrefMsg, { msg: "Failed to save privacy settings.", tone: "error" });
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarBusy(true);
    try {
      await uploadAvatar(file);
      await fetchCurrentUser();
      flash(setProfileMsg, { msg: "Avatar updated.", tone: "success" });
    } catch (err) {
      flash(setProfileMsg, { msg: err.response?.data?.message || "Failed to upload avatar.", tone: "error" });
    } finally {
      setAvatarBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    setDeleteErr(null);
    try {
      await deleteAccount(deletePwd);
      await logout();
      navigate("/login");
    } catch (err) {
      setDeleteErr(err.response?.data?.message || "Failed to delete account. Check your password.");
      setDeleteBusy(false);
    }
  };

  const avatarSrc = resolveAvatar(user?.profile_image) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.first_name || "PV")}&background=10b981&color=fff&size=120`;
  const isGoogle = user?.provider === "GOOGLE";

  return (
    <DashboardLayout pageTitle="Settings" pageDescription="Manage your PetVerse account and preferences.">
      <div className="max-w-3xl space-y-6">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={avatarSrc} alt="Profile" className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-200" />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={avatarBusy}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white border-2 border-white hover:bg-slate-700 transition"
              >
                {avatarBusy ? <Loader2 size={11} className="animate-spin" /> : <Camera size={11} />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={handleAvatar} className="hidden" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-black text-slate-800 truncate">
                {user ? `${user.first_name} ${user.last_name}` : "…"}
              </p>
              <p className="text-sm font-semibold text-slate-500 truncate">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {user?.is_verified ? "Verified" : "Unverified"} · {user?.role || "USER"}
              </span>
            </div>
            <button
              onClick={handleProfileSave}
              disabled={profileSaving}
              className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all disabled:opacity-60"
            >
              {profileSaving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              {profileSaving ? "Saving…" : "Save Changes"}
            </button>
          </div>

          {profileMsg && <div className="mt-4"><Banner msg={profileMsg.msg} tone={profileMsg.tone} /></div>}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="First Name" value={form.first_name} onChange={(v) => setForm({ ...form, first_name: v })} />
            <Field label="Last Name" value={form.last_name} onChange={(v) => setForm({ ...form, last_name: v })} />
            <Field label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
            <Field label="Phone" value={form.phone_number} onChange={(v) => setForm({ ...form, phone_number: v })} />
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="Email (read-only)" value={user?.email || ""} onChange={() => {}} disabled />
          </div>
          <div className="mt-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Bio</label>
            <textarea
              rows={2}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:bg-white transition resize-none"
            />
          </div>
        </motion.div>

        {(prefMsg) && <Banner msg={prefMsg.msg} tone={prefMsg.tone} />}

        {/* Notifications */}
        <Section icon={Bell} title="Notifications" desc="Control which alerts you receive.">
          {loading || !preferences ? (
            <SkeletonRows />
          ) : (
            <div className="space-y-1">
              {[
                ["email_notifications", "Email notifications"],
                ["push_notifications", "Push notifications"],
                ["health_notifications", "Health alerts"],
                ["community_notifications", "Community activity"],
                ["order_notifications", "Order updates"],
                ["ai_notifications", "AI insights"],
                ["marketing_emails", "Marketing emails"]
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                  <span className="text-sm font-semibold text-slate-700">{label}</span>
                  <Toggle checked={!!preferences[key]} onChange={(v) => handlePref({ [key]: v })} />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Appearance */}
        <Section icon={Palette} title="Appearance" desc="Theme preference.">
          {loading || !preferences ? <SkeletonRows /> : (
            <div className="flex gap-3">
              {["LIGHT", "DARK", "SYSTEM"].map((t) => (
                <button
                  key={t}
                  onClick={() => handlePref({ theme: t })}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-bold capitalize transition ${
                    preferences.theme === t
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t.toLowerCase()}
                </button>
              ))}
            </div>
          )}
        </Section>

        {/* Privacy */}
        <Section icon={Shield} title="Privacy & Security" desc="Control visibility and password.">
          {loading || !privacy ? <SkeletonRows /> : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Public profile</p>
                  <p className="text-xs text-slate-400">Allow others to view your profile.</p>
                </div>
                <Toggle
                  checked={privacy.profile_visibility === "PUBLIC"}
                  onChange={(v) => handlePrivacy({ profile_visibility: v ? "PUBLIC" : "PRIVATE" })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Searchable</p>
                  <p className="text-xs text-slate-400">Appear in member search results.</p>
                </div>
                <Toggle checked={!!privacy.search_visibility} onChange={(v) => handlePrivacy({ search_visibility: v })} />
              </div>
            </div>
          )}

          {/* Change password */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3"><Lock size={15} /> Change Password</p>
            {isGoogle ? (
              <p className="text-xs text-slate-400">You signed in with Google — password managed by your Google account.</p>
            ) : (
              <div className="space-y-3">
                {pwdMsg && <Banner msg={pwdMsg.msg} tone={pwdMsg.tone} />}
                <input type="password" placeholder="Current password" value={pwd.current_password}
                  onChange={(e) => setPwd({ ...pwd, current_password: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input type="password" placeholder="New password" value={pwd.new_password}
                    onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white" />
                  <input type="password" placeholder="Confirm new password" value={pwd.confirm}
                    onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white" />
                </div>
                <button onClick={handlePasswordSave} disabled={pwdSaving || !pwd.current_password || !pwd.new_password}
                  className="rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-bold hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2">
                  {pwdSaving && <Loader2 size={14} className="animate-spin" />} Update Password
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* Connected account */}
        <Section icon={Link2} title="Google Account" desc="Connected sign-in providers.">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Google</p>
                <p className="text-xs text-slate-400">{isGoogle ? "Connected" : "Not connected"}</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${isGoogle ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              {isGoogle ? "Active" : "Local login"}
            </span>
          </div>
        </Section>

        {/* Session + danger zone */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-800">Session</h4>
            <p className="text-xs font-semibold text-slate-400">Sign out of this device.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
            <LogOut size={15} /> Logout
          </button>
        </div>

        <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5">
          <h4 className="text-sm font-black text-rose-800 mb-1 flex items-center gap-2"><AlertTriangle size={15} /> Danger Zone</h4>
          <p className="text-xs font-semibold text-rose-600 mb-3">Deleting your account is permanent and cannot be undone.</p>
          <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100">
            <Trash2 size={14} /> Delete Account
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] p-7 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><AlertTriangle size={18} className="text-rose-500" /> Delete Account</h3>
            <p className="text-sm text-slate-500 mt-2">This permanently deletes your account and data. Enter your password to confirm.</p>
            {deleteErr && <div className="mt-3"><Banner msg={deleteErr} tone="error" /></div>}
            <input type="password" placeholder="Password" value={deletePwd} onChange={(e) => setDeletePwd(e.target.value)}
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:bg-white" />
            <div className="mt-5 flex gap-3">
              <button onClick={() => { setShowDelete(false); setDeletePwd(""); setDeleteErr(null); }}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleteBusy || !deletePwd}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {deleteBusy && <Loader2 size={14} className="animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Field({ label, value, onChange, disabled }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:bg-white transition ${disabled ? "opacity-60" : ""}`}
      />
    </div>
  );
}

function Section({ icon: Icon, title, desc, children }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon size={18} /></div>
        <div>
          <p className="font-black text-slate-800 text-sm">{title}</p>
          <p className="text-xs font-semibold text-slate-400">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => <div key={i} className="h-8 rounded-lg bg-slate-100 animate-pulse" />)}
    </div>
  );
}
