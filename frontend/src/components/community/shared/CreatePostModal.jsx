import React, { useRef, useEffect, useState } from "react";
import { X, Image as ImageIcon, MapPin, PawPrint, Sparkles } from "lucide-react";
import { usePets } from "@/hooks/usePets";

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80"
];

export default function CreatePostModal({ isOpen, onClose, onSave }) {
  const dialogRef = useRef(null);
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [petTag, setPetTag] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  
  const { pets: hooksPets } = usePets();
  const pets = hooksPets || [];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const selectedPetObj = pets.find((p) => p.id === petTag) || null;
    const images = selectedImage ? [selectedImage] : [];

    // addPost expects a pet_id string (or null), not the pet object.
    onSave(content, images, location, selectedPetObj?.id || null);
    
    // Clear inputs
    setContent("");
    setLocation("");
    setPetTag("");
    setSelectedImage("");
    onClose();
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

          {/* Quick Preset Image Select */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Add Photo
            </label>
            <div className="flex gap-3 mt-2">
              {PRESET_IMAGES.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedImage(selectedImage === img ? "" : img)}
                  className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                    selectedImage === img ? "border-emerald-500 scale-95 shadow-md" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="preset" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

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
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-100 hover:opacity-95 transition"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
