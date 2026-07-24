import React, { useRef, useEffect, useState } from "react";
import { X, Image as ImageIcon, MapPin, PawPrint, Sparkles, Trash2 } from "lucide-react";
import { usePets } from "@/hooks/usePets";
import api from "@/services/api";
import { resolveMediaUrl } from "@/utils/media";

/** Pull #hashtags out of the body so they are stored structurally, not just inline. */
function extractHashtags(text) {
  return [...(text.matchAll(/#([\w-]+)/g) || [])].map((m) => m[1]);
}

export default function CreatePostModal({ isOpen, onClose, onSave }) {
  const dialogRef = useRef(null);
  const fileRef = useRef(null);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [petTag, setPetTag] = useState("");
  const [media, setMedia] = useState([]); // [{ url, type }]
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { pets: hooksPets } = usePets();
  const pets = hooksPets || [];

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    setError("");
    setUploading(true);
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        const { data } = await api.post("/community/posts/media", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMedia((prev) => [
          ...prev,
          { url: data.media_url, type: file.type.startsWith("video/") ? "video" : "image" },
        ]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Check the file type and size.");
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (url) => setMedia((prev) => prev.filter((m) => m.url !== url));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Fallback for click outside dialog backdrop (Safari / older engines)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isDialogContent) {
        onClose();
      }
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || uploading || submitting) return;

    const selectedPetObj = pets.find((p) => p.id === petTag) || null;
    const urls = media.map((m) => m.url);

    setSubmitting(true);
    setError("");
    try {
      // addPost expects a pet_id string (or null), not the pet object.
      await onSave(content, urls, location, selectedPetObj?.id || null, extractHashtags(content));
      setContent("");
      setLocation("");
      setPetTag("");
      setMedia([]);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not publish your post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      closedby="any"
      className="
        w-full
        max-w-lg
        rounded-[30px]
        border
        border-slate-100
        bg-white/95
        p-8
        shadow-2xl
        backdrop-blur-2xl
        outline-none
        backdrop:bg-slate-900/60
        backdrop:backdrop-blur-sm
        mx-auto
        my-auto
        max-h-[90vh]
        overflow-y-auto
      "
    >
      <div className="relative flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Create Post</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Share something about your pet... What's on their mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="
              w-full
              resize-none
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
              text-sm
              outline-none
              transition
              focus:border-emerald-400
              focus:bg-white
              focus:ring-4
              focus:ring-emerald-100
            "
            required
          />

          {/* Media upload */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Photos & Videos
            </label>

            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFiles}
              data-testid="post-media-input"
            />

            <div className="flex flex-wrap gap-3 mt-2">
              {media.map((m) => (
                <div
                  key={m.url}
                  className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-emerald-500 group"
                >
                  {m.type === "video" ? (
                    <video src={resolveMediaUrl(m.url)} className="h-full w-full object-cover" />
                  ) : (
                    <img
                      src={resolveMediaUrl(m.url)}
                      alt="upload"
                      className="h-full w-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(m.url)}
                    aria-label="Remove media"
                    className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="h-16 w-16 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition disabled:opacity-60"
              >
                {uploading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                ) : (
                  <ImageIcon size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Tag Pet */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                <PawPrint size={13} className="text-emerald-500" />
                Tag Pet
              </label>
              <select
                value={petTag}
                onChange={(e) => setPetTag(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-emerald-400
                  focus:bg-white
                "
              >
                <option value="">None</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                <MapPin size={13} className="text-emerald-500" />
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Park, Vet..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-emerald-400
                  focus:bg-white
                "
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || submitting || !content.trim()}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-100 hover:opacity-95 transition disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
