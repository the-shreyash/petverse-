import React from "react";

export default function FeedingInformationForm({ formData, errors, updateFields }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFields({
      feedingPreferences: {
        [name]: value
      }
    });
  };

  const preferences = formData.feedingPreferences || {};

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Feeding Preferences</h3>
        <p className="text-sm text-slate-500 mt-1">Configure nutritional and daily dietary specs.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Diet / Food Type */}
        <div className="flex flex-col gap-2">
          <label htmlFor="foodType" className="text-sm font-bold text-slate-700">
            Food Type <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="foodType"
            name="foodType"
            value={preferences.foodType || ""}
            onChange={handleChange}
            placeholder="e.g. Dry Kibble & Wet Food Mix"
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              outline-none
              transition-all
              ${
                errors.foodType
                  ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                  : "border-slate-200 focus:border-emerald-500 bg-white"
              }
            `}
          />
          {errors.foodType && <span className="text-xs font-bold text-rose-500">{errors.foodType}</span>}
        </div>

        {/* Portion Size */}
        <div className="flex flex-col gap-2">
          <label htmlFor="portionSize" className="text-sm font-bold text-slate-700">
            Portion Size <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="portionSize"
            name="portionSize"
            value={preferences.portionSize || ""}
            onChange={handleChange}
            placeholder="e.g. 1.5 Cups or 200g"
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              outline-none
              transition-all
              ${
                errors.portionSize
                  ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                  : "border-slate-200 focus:border-emerald-500 bg-white"
              }
            `}
          />
          {errors.portionSize && <span className="text-xs font-bold text-rose-500">{errors.portionSize}</span>}
        </div>

        {/* Daily Frequency */}
        <div className="flex flex-col gap-2">
          <label htmlFor="frequency" className="text-sm font-bold text-slate-700">
            Feeding Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            value={preferences.frequency || "2 times daily"}
            onChange={handleChange}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white"
          >
            <option value="1 time daily">1 time daily</option>
            <option value="2 times daily">2 times daily</option>
            <option value="3 times daily">3 times daily</option>
            <option value="Free feeding">Free feeding (Available all day)</option>
          </select>
        </div>

        {/* Allergies */}
        <div className="flex flex-col gap-2">
          <label htmlFor="allergies" className="text-sm font-bold text-slate-700">
            Allergies / Restrictions
          </label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            value={preferences.allergies || "None"}
            onChange={handleChange}
            placeholder="e.g. Dairy, Chicken grain-free"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white"
          />
        </div>

        {/* Custom Dietary Notes */}
        <div className="sm:col-span-2 flex flex-col gap-2">
          <label htmlFor="notes" className="text-sm font-bold text-slate-700">
            Special Instructions
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={preferences.notes || ""}
            onChange={handleChange}
            placeholder="e.g. Serve breakfast at 8am, add salmon oil on dinner."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
