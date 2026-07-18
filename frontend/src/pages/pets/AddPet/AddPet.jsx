import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, PawPrint } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "@/pages/dashboard/DashboardHome/DashboardHeader";
import { usePetForm } from "@/hooks/usePetForm";
import { publishEvent } from "@/utils/events";
import api from "@/services/api";

// Form steps imports
import BasicInformationForm from "@/components/pets/forms/BasicInformationForm";
import PhotoUploader from "@/components/pets/forms/PhotoUploader";
import HealthInformationForm from "@/components/pets/forms/HealthInformationForm";
import FeedingInformationForm from "@/components/pets/forms/FeedingInformationForm";
import ReviewCard from "@/components/pets/review/ReviewCard";

const steps = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Upload Photo" },
  { id: 3, name: "Health Profile" },
  { id: 4, name: "Feeding Preferences" },
  { id: 5, name: "Review" },
  { id: 6, name: "Success" }
];

export default function AddPet() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, errors, updateFields, validateStep } = usePetForm();
  const [createdPetId, setCreatedPetId] = useState(null);

  const handleNext = () => {
    // Validate fields before proceeding to the next step
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep === 5) {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/pets");
    }
  };


  const handleSubmit = async () => {
    try {
      const response = await api.post("/pets", {
        name: formData.name,
        species: formData.species ? formData.species.toUpperCase() : "OTHER",
        breed: formData.breed || null,
        gender: formData.gender ? formData.gender.toUpperCase() : "UNKNOWN",
        birth_date: formData.birthDate || null,
        weight: parseFloat(formData.weight) || null,
        color: formData.color || null,
        // photo handling will be updated in Section 3, for now pass null or ignore
      });

      if (response.status === 201 || response.status === 200) {
        const newPetId = response.data.data?.id || "new";
        
        // Upload profile image if present
        if (formData.profileImageFile && newPetId !== "new") {
          const formDataObj = new FormData();
          formDataObj.append("file", formData.profileImageFile);
          try {
            await api.post(`/pets/${newPetId}/profile-image`, formDataObj, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          } catch (imgErr) {
            console.error("Failed to upload profile image:", imgErr);
          }
        }

        publishEvent({
          type: "PET_ADDED",
          category: "system",
          title: "New Pet Profile Added",
          description: `${formData.name} has been added to your PetVerse family!`,
          priority: "medium",
          action: `/pets`
        });
        setCreatedPetId(newPetId);
        setCurrentStep(6); // Go to Success step
      }
    } catch (err) {
      console.error("Error adding pet:", err);
      // Could display error notification here
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationForm formData={formData} errors={errors} updateFields={updateFields} />;
      case 2:
        return <PhotoUploader formData={formData} errors={errors} updateFields={updateFields} />;
      case 3:
        return <HealthInformationForm formData={formData} updateFields={updateFields} />;
      case 4:
        return <FeedingInformationForm formData={formData} errors={errors} updateFields={updateFields} />;
      case 5:
        return <ReviewCard formData={formData} />;
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-8 space-y-6"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-inner">
              <CheckCircle2 size={44} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">Pet Profile Created!</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md">
                We've successfully added <span className="font-extrabold text-emerald-600">{formData.name}</span> to your PetVerse portfolio. You can now track vaccines, feeding charts, and medical history.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full justify-center">
              <Link
                to={`/pets/${createdPetId}`}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-emerald-500
                  to-cyan-500
                  px-6
                  py-3.5
                  font-bold
                  text-white
                  shadow-lg
                  shadow-emerald-500/20
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-xl
                "
              >
                <span>View Profile</span>
              </Link>
              <Link
                to="/pets"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-6
                  py-3.5
                  font-bold
                  text-slate-600
                  transition-all
                  hover:bg-slate-50
                  hover:text-slate-900
                "
              >
                <span>Go to dashboard</span>
              </Link>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      pageTitle="Add Pet Wizard"
      pageDescription="Create a new profile step by step."
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <DashboardHeader
          title="Add New Pet"
          subtitle="Follow our step-by-step setup helper to enroll your companion."
        />

        {/* Step Indicator Header (Hide on Success page) */}
        {currentStep < 6 && (
          <div className="rounded-3xl border border-slate-200/60 bg-white/95 p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase mb-4">
              <span>Setup Checklist</span>
              <span className="text-emerald-600">Step {currentStep} of 5</span>
            </div>
            
            {/* Unified Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6 flex">
              {steps.slice(0, 5).map((step) => (
                <div
                  key={step.id}
                  className={`
                    h-full
                    flex-1
                    transition-all
                    duration-300
                    border-r
                    border-white
                    last:border-r-0
                    ${step.id <= currentStep ? "bg-gradient-to-r from-emerald-500 to-cyan-500" : "bg-slate-100"}
                  `}
                />
              ))}
            </div>

            {/* Step names list */}
            <div className="hidden sm:flex justify-between text-[11px] font-bold text-slate-400 uppercase">
              {steps.slice(0, 5).map((step) => (
                <span
                  key={step.id}
                  className={step.id === currentStep ? "text-emerald-600 font-extrabold" : ""}
                >
                  {step.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Main Card */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/95 p-6 sm:p-8 shadow-md relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Action buttons (Hide on success page) */}
          {currentStep < 6 && (
            <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={handleBack}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                  font-bold
                  text-slate-600
                  transition-all
                  hover:bg-slate-50
                  hover:text-slate-900
                "
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-2xl
                  bg-slate-900
                  px-6
                  py-3
                  font-bold
                  text-white
                  transition-all
                  hover:bg-slate-800
                "
              >
                <span>{currentStep === 5 ? "Submit" : "Continue"}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
