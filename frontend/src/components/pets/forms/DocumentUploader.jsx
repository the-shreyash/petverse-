import React, { useState } from "react";
import { FileText, Upload, Trash2, Plus, Paperclip } from "lucide-react";

export default function DocumentUploader({ formData, updateFields }) {
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("Medical Record");

  const addDocument = () => {
    if (!docName.trim()) return;
    const updated = [
      ...(formData.documents || []),
      {
        id: `doc-${Date.now()}`,
        name: docName.endsWith(".pdf") ? docName : `${docName}.pdf`,
        uploadDate: new Date().toISOString().split("T")[0],
        type: docType,
        fileUrl: "#"
      }
    ];
    updateFields({ documents: updated });
    setDocName("");
  };

  const removeDocument = (id) => {
    const updated = (formData.documents || []).filter((d) => d.id !== id);
    updateFields({ documents: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Pet Documents</h3>
        <p className="text-sm text-slate-500 mt-1">Upload records, certifications, vaccine receipts or PDFs.</p>
      </div>

      {/* Existing documents */}
      {formData.documents && formData.documents.length > 0 && (
        <div className="space-y-2">
          {formData.documents.map((doc) => (
            <div
              key={doc.id}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                bg-slate-50/60
                border
                border-slate-200/50
                p-3.5
                shadow-sm
                transition-all
                hover:bg-slate-50
              "
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2.5 border border-slate-100 text-indigo-500 shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">{doc.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    {doc.type} • Uploaded {doc.uploadDate}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeDocument(doc.id)}
                className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Document Interface */}
      <div className="rounded-3xl border border-slate-200/60 p-5 bg-white/75 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Document Title</label>
            <input
              type="text"
              placeholder="e.g. Vaccination Report 2026"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Document Category</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 bg-white"
            >
              <option value="Medical Record">Medical Record</option>
              <option value="Registration">Registration / Identity</option>
              <option value="Vaccination">Vaccination Sheet</option>
              <option value="Prescription">Prescription</option>
              <option value="Other">Other Document</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={addDocument}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
        >
          <Plus size={14} /> Add Document
        </button>
      </div>
    </div>
  );
}
