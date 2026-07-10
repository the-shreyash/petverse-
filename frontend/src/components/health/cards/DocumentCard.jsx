import React from "react";
import { FileText, Download, Eye, Calendar, Tag, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentCard({
  document,
  onPreview,
  onDelete
}) {
  const {
    id,
    name,
    category,
    type,
    uploadDate
  } = document;

  const docCategory = type || category || "General File";

  const getCategoryColor = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes("presc")) return "text-indigo-600 bg-indigo-50 border-indigo-100";
    if (c.includes("cert")) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (c.includes("lab") || c.includes("result")) return "text-cyan-600 bg-cyan-50 border-cyan-100";
    if (c.includes("invo") || c.includes("bill")) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-slate-600 bg-slate-50 border-slate-100";
  };

  const catStyles = getCategoryColor(docCategory);

  const handleDownload = (e) => {
    e.stopPropagation();
    alert(`Downloading: ${name}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onPreview && onPreview(document)}
      className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header Icon & Category */}
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${catStyles}`}>
            {docCategory}
          </span>
          
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                title="Delete File"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* File Name */}
        <div className="mt-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-emerald-500 shadow-inner group-hover:bg-emerald-50/50 transition">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800 break-words leading-tight group-hover:text-emerald-600 transition">
              {name}
            </h4>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
              <Calendar size={11} />
              <span>Uploaded: {uploadDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 border-t border-slate-100/70 pt-3.5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 flex items-center gap-1">
          <Eye size={12} />
          <span>Click to preview</span>
        </span>

        <button
          onClick={handleDownload}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-slate-50
            border
            border-slate-200
            text-slate-500
            transition
            hover:bg-slate-900
            hover:text-white
            hover:border-slate-900
          "
          title="Download File"
        >
          <Download size={14} />
        </button>
      </div>
    </motion.div>
  );
}
