import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, Shield, Calendar, Tag } from "lucide-react";
import Button from "@/components/ui/Button/Button";

export default function DocumentPreview({
  isOpen,
  onClose,
  document
}) {
  if (!isOpen || !document) return null;

  const handleDownload = () => {
    alert(`Downloading file: ${document.name}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/10">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 truncate max-w-md">
                  {document.name}
                </h3>
                <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    {document.type || document.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {document.uploadDate}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Document Content Mock */}
          <div className="bg-slate-100 p-8 flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-slate-200/50 relative overflow-hidden"
            >
              {/* Certificate design lines */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-cyan-500" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">PETVERSE CLINICAL REPORT</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Medical Document</p>
                </div>
                <Shield size={26} className="text-emerald-500" />
              </div>

              <div className="space-y-4 text-slate-600 text-sm leading-relaxed border-t border-b border-dashed border-slate-200 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Document ID</span>
                    <span className="font-semibold text-slate-800">{document.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Category</span>
                    <span className="font-semibold text-slate-800">{document.type || document.category}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Statement of Checkup</span>
                  <p className="mt-1 font-medium text-slate-600">
                    This document serves as verification of clinic visitation and diagnostic record for the subject pet. Standard vitals and weight parameters have been logged into the secure PetVerse central health module.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Signature of Assessor</span>
                    <span className="font-semibold text-slate-800">Licensed DVM Practitioner</span>
                  </div>
                  <div className="h-10 w-20 border border-slate-200 rounded flex items-center justify-center text-[10px] text-slate-400 font-semibold italic uppercase bg-white/70">
                    VERIFIED
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center text-xs text-slate-400 font-semibold">
                <span>Secure Document Server v1.0</span>
                <span>Date: {document.uploadDate}</span>
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-6 bg-white">
            <Button
              variant="secondary"
              onClick={onClose}
              className="py-2.5 px-5 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              className="py-2.5 px-5 text-sm flex items-center gap-2"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
