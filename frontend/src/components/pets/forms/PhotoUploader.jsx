import React, { useState, useRef } from "react";
import { Image, Upload, X, Check, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoUploader({ formData, errors, updateFields }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Preset Unsplash options for testing as virtual "uploads" or lets allow custom urls/inputs
  const mockPresetImages = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=500",
    "https://images.unsplash.com/photo-1537151608828-ea2b117b62e4?w=500"
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const simulateUpload = (imageUrl) => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          updateFields({
            profileImage: imageUrl,
            gallery: [...(formData.gallery || []), imageUrl]
          });
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    // Simulate uploading a random high quality animal photo
    const randomImg = mockPresetImages[Math.floor(Math.random() * mockPresetImages.length)];
    simulateUpload(randomImg);
  };

  const handleSelectFile = () => {
    const randomImg = mockPresetImages[Math.floor(Math.random() * mockPresetImages.length)];
    simulateUpload(randomImg);
  };

  const handlePresetSelect = (url) => {
    simulateUpload(url);
  };

  const removePhoto = () => {
    updateFields({ profileImage: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Pet Photo</h3>
        <p className="text-sm text-slate-500 mt-1">Upload a profile photo or select from curated presets.</p>
      </div>

      {errors.profileImage && (
        <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-xs font-bold text-rose-600">
          {errors.profileImage}
        </div>
      )}

      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="
          relative
          flex
          flex-col
          items-center
          justify-center
          rounded-3xl
          border-2
          border-dashed
          border-slate-200
          bg-slate-50/50
          p-8
          text-center
          transition-all
          hover:border-emerald-400
          hover:bg-slate-50
        "
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleSelectFile}
          className="hidden"
          accept="image/*"
        />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100">
                <ArrowUp size={24} className="animate-bounce" />
              </div>
              <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs font-bold text-slate-500">Uploading photo... {progress}%</p>
            </motion.div>
          ) : formData.profileImage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group inline-block"
            >
              <img
                src={formData.profileImage}
                alt="Upload Preview"
                className="h-44 w-44 rounded-3xl object-cover border-4 border-white shadow-xl"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="
                  absolute
                  -top-2
                  -right-2
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-rose-500
                  text-white
                  shadow-lg
                  transition-transform
                  hover:scale-110
                "
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                <Check size={12} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3 py-6 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="rounded-2xl bg-white p-4 border border-slate-100 text-slate-400 shadow-sm">
                <Upload size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Drag & drop your photo here</p>
                <p className="text-xs text-slate-400 mt-1">Or click to browse your folders</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preset Curated Images */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Or choose a preset profile image</p>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {mockPresetImages.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePresetSelect(url)}
              className={`
                relative
                h-16
                w-16
                shrink-0
                rounded-2xl
                overflow-hidden
                border-2
                transition-all
                hover:scale-105
                ${formData.profileImage === url ? "border-emerald-500 shadow-md" : "border-transparent opacity-75 hover:opacity-100"}
              `}
            >
              <img src={url} alt={`Preset ${i}`} className="h-full w-full object-cover" />
              {formData.profileImage === url && (
                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center text-white">
                  <Check size={16} strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
