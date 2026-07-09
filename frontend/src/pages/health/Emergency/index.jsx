import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useHealth } from "@/hooks/useHealth";
import { AlertOctagon, Phone, Info, ShieldAlert, Award, FileText, Heart, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button/Button";

export default function EmergencyView() {
  const {
    pets,
    selectedPet,
    changeSelectedPet,
    emergencyContacts,
    addEmergencyContact,
    deleteEmergencyContact
  } = useHealth();

  const [newContact, setNewContact] = useState({ name: "", phone: "", availability: "Open 24/7", role: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  if (!selectedPet) {
    return (
      <DashboardLayout pageTitle="Emergency Hub" pageDescription="Helplines & First Aid.">
        <div className="flex h-64 items-center justify-center">
          <p className="font-bold text-slate-400">Loading emergency network...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Emergency Guidelines checklist
  const guidelines = [
    { title: "Choking & Breathing Problems", steps: ["Check airway for obstruction gently.", "Perform Heimlich maneuver for pets if trained.", "Administer CPR if pulse stops and drive immediately to emergency."] },
    { title: "Heavy Bleeding or Cuts", steps: ["Apply direct pressure using clean gauze/cloth.", "Elevate the injured limb if possible.", "Apply bandage firmly but not too tight (restricting bloodflow)."] },
    { title: "Ingestion of Toxic Substance", steps: ["Do NOT induce vomiting unless instructed.", "Identify what was consumed and when.", "Contact ASPCA Poison Control Helpline immediately."] },
    { title: "Heatstroke & Dehydration", steps: ["Move pet to a cool shade/room immediately.", "Apply damp, cool towels to back of head, armpits, and feet.", "Offer cool water in small amounts. Avoid ice-cold water."] }
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    addEmergencyContact(newContact);
    setNewContact({ name: "", phone: "", availability: "Open 24/7", role: "" });
    setShowAddForm(false);
  };

  const handleExportPassport = () => {
    alert(`Exporting Emergency Medical Passport for ${selectedPet.name}.\nIncludes: Microchip #${selectedPet.microchip || "N/A"}, weight: ${selectedPet.weight}, current health score: ${selectedPet.healthScore}%.`);
  };

  return (
    <DashboardLayout
      pageTitle="Emergency & First Aid"
      pageDescription="Urgent hotlines, nearby 24/7 veterinary clinics, first aid instructions, and immediate medical passport access."
    >
      <div className="space-y-8">
        {/* Urgent Alert Banner */}
        <div className="relative overflow-hidden rounded-[30px] border border-rose-100 bg-gradient-to-r from-rose-500 to-red-600 p-6 text-white shadow-lg flex items-start gap-4">
          <div className="rounded-2xl bg-white/20 p-3 text-white shrink-0">
            <AlertOctagon size={24} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight">EMERGENCY PROTOCOL ACTIVE</h4>
            <p className="mt-1 text-sm text-white/95 font-medium leading-relaxed max-w-2xl">
              If your companion is unresponsive, bleeding heavily, or exhibiting extreme distress, contact a responder immediately. Locate your nearest 24/7 clinic from the listings below.
            </p>
          </div>
        </div>

        {/* Toggle Pet */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {pets.map((p) => (
            <button
              key={p.id}
              onClick={() => changeSelectedPet(p.id)}
              className={`
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-black
                transition-all
                ${
                  p.id === selectedPet.id
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }
              `}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Emergency Contacts List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <ShieldAlert size={18} className="text-rose-500" />
                  <span>Responders & Helpline Directory</span>
                </h4>
                
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>{showAddForm ? "Hide" : "Add Contact"}</span>
                </button>
              </div>

              {/* Form to add contact */}
              {showAddForm && (
                <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl gap-3 grid sm:grid-cols-2 items-end">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contact Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Westside Veterinary Center"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. +1 (555) 019-9999"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Role / Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Nearest 24hr Clinic"
                      value={newContact.role}
                      onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <Button type="submit" className="py-2 px-4 text-xs rounded-xl flex items-center justify-center bg-rose-600 hover:bg-rose-700">
                    Save Responder
                  </Button>
                </form>
              )}

              {/* Contacts rendering */}
              <div className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 hover:bg-slate-50 transition"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800 text-base">{contact.name}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                          {contact.role || "Emergency"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Info size={12} className="text-slate-400" />
                        <span>Availability: {contact.availability}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${contact.phone}`}
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-rose-600
                          px-4
                          py-2.5
                          text-xs
                          font-bold
                          text-white
                          transition
                          hover:bg-rose-700
                          shadow-md
                          shadow-rose-600/10
                        "
                      >
                        <Phone size={14} />
                        <span>Dial Responder</span>
                      </a>
                      
                      <button
                        onClick={() => deleteEmergencyContact(contact.id)}
                        className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Passport download */}
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                  <FileText size={18} className="text-emerald-500" />
                  <span>PetCare Medical Passport</span>
                </h4>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-sm">
                  Download a PDF summary card containing age, weight, microchip code, and active medical records.
                </p>
              </div>
              <Button onClick={handleExportPassport} className="py-3 px-5 text-xs rounded-xl flex items-center gap-2">
                <Award size={14} />
                <span>Export Passport</span>
              </Button>
            </div>
          </div>

          {/* First Aid Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h4 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-4">
                <Heart size={18} className="text-rose-500" />
                <span>Immediate First-Aid Guidelines</span>
              </h4>

              <div className="space-y-4">
                {guidelines.map((guide, idx) => (
                  <div key={idx} className="space-y-2">
                    <h5 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
                        {idx + 1}
                      </span>
                      <span>{guide.title}</span>
                    </h5>
                    <ul className="pl-7 space-y-1 text-xs text-slate-500 font-semibold list-disc">
                      {guide.steps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
