import React from "react";

export default function BasicInformationForm({ formData, errors, updateFields }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFields({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Basic Information</h3>
        <p className="text-sm text-slate-500 mt-1">Tell us the core details about your pet.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-bold text-slate-700">
            Pet Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="e.g. Luna"
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              outline-none
              transition-all
              ${
                errors.name
                  ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                  : "border-slate-200 focus:border-emerald-500 bg-white"
              }
            `}
          />
          {errors.name && <span className="text-xs font-bold text-rose-500">{errors.name}</span>}
        </div>

        {/* Species */}
        <div className="flex flex-col gap-2">
          <label htmlFor="species" className="text-sm font-bold text-slate-700">
            Species <span className="text-rose-500">*</span>
          </label>
          <select
            id="species"
            name="species"
            value={formData.species || ""}
            onChange={handleChange}
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              outline-none
              bg-white
              transition-all
              ${
                errors.species
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 focus:border-emerald-500"
              }
            `}
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Reptile">Reptile</option>
            <option value="Other">Other</option>
          </select>
          {errors.species && <span className="text-xs font-bold text-rose-500">{errors.species}</span>}
        </div>

        {/* Breed */}
        <div className="flex flex-col gap-2">
          <label htmlFor="breed" className="text-sm font-bold text-slate-700">
            Breed <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed || ""}
            onChange={handleChange}
            placeholder="e.g. Golden Retriever"
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              outline-none
              transition-all
              ${
                errors.breed
                  ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                  : "border-slate-200 focus:border-emerald-500 bg-white"
              }
            `}
          />
          {errors.breed && <span className="text-xs font-bold text-rose-500">{errors.breed}</span>}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label htmlFor="gender" className="text-sm font-bold text-slate-700">
            Gender <span className="text-rose-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              outline-none
              bg-white
              transition-all
              ${
                errors.gender
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 focus:border-emerald-500"
              }
            `}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
          {errors.gender && <span className="text-xs font-bold text-rose-500">{errors.gender}</span>}
        </div>

        {/* Birth Date */}
        <div className="flex flex-col gap-2">
          <label htmlFor="birthDate" className="text-sm font-bold text-slate-700">
            Birth Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate || ""}
            onChange={handleChange}
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              outline-none
              bg-white
              transition-all
              ${
                errors.birthDate
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 focus:border-emerald-500"
              }
            `}
          />
          {errors.birthDate && <span className="text-xs font-bold text-rose-500">{errors.birthDate}</span>}
        </div>

        {/* Weight */}
        <div className="flex flex-col gap-2">
          <label htmlFor="weight" className="text-sm font-bold text-slate-700">
            Weight (kg) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            id="weight"
            name="weight"
            value={formData.weight || ""}
            onChange={handleChange}
            placeholder="e.g. 15.5"
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              outline-none
              transition-all
              ${
                errors.weight
                  ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                  : "border-slate-200 focus:border-emerald-500 bg-white"
              }
            `}
          />
          {errors.weight && <span className="text-xs font-bold text-rose-500">{errors.weight}</span>}
        </div>

        {/* Color */}
        <div className="flex flex-col gap-2">
          <label htmlFor="color" className="text-sm font-bold text-slate-700">
            Coat Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color || ""}
            onChange={handleChange}
            placeholder="e.g. Black & Tan"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white"
          />
        </div>

        {/* Microchip ID */}
        <div className="flex flex-col gap-2">
          <label htmlFor="microchip" className="text-sm font-bold text-slate-700">
            Microchip ID (optional)
          </label>
          <input
            type="text"
            id="microchip"
            name="microchip"
            value={formData.microchip || ""}
            onChange={handleChange}
            placeholder="e.g. 985112000000"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
