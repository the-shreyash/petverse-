import React, { useState, useRef } from "react";
import { Image, Upload, X, Check, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoUploader({ formData, errors, updateFields }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);


  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFile = (file) => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    
    // Simulate progress while reading
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 30, 90));
    }, 100);

    const reader = new FileReader();
    reader.onloadend = () => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        updateFields({
          profileImage: reader.result,
          profileImageFile: file,
          gallery: [...(formData.gallery || []), reader.result],
          galleryFiles: [...(formData.galleryFiles || []), file]
        });
      }, 300);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };


  const removePhoto = () => {
    updateFields({ profileImage: "", profileImageFile: null });
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
    </div>
  );
}
