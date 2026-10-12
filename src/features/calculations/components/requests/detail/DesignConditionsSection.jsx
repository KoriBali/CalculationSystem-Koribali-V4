import { useState, useMemo } from "react";
import { Edit3, AlertTriangle, Check, Info, ArrowRight } from "lucide-react";
import { designStandardOptions } from "../../../constants/designStandards";

const STANDARD_REFERENCES = {
  v60: "Wind speed 60 m/s · Air density 1.23 N·sec²/m⁴",
  jil: "Wind speed 60 m/s · Air density 1.23 N·sec²/m⁴",
  act: "Air density 1.23 N·sec²/m⁴ · Wind speed per regional building code",
  tower: "Air density 1.23 N·sec²/m⁴ · Wind speed based on tower specifications",
  haiden: "Air density 1.23 N·sec²/m⁴ · Wind speed per Haiden utility guideline",
  signboard: "Air density 1.23 N·sec²/m⁴ · Wind speed per structure location criteria",
};

export function DesignConditionsSection({
  request,
  onSave, // (updatedConditions, reason) => void
  onToast, // (message) => void
}) {
  const [isEditing, setIsEditing] = useState(false);

  // Standard options for this request's project pole type
  const activeOptions = useMemo(
    () => designStandardOptions[request.projectType] || [],
    [request.projectType],
  );

  // Saved / current conditions
  const currentStandard =
    request.designConditions?.standard ||
    request.fields?.standard ||
    activeOptions[0]?.value ||
    "";
  const currentAirDensity =
    request.designConditions?.airDensity ??
    request.fields?.airDensity ??
    "1.23";
  const currentWindSpeed =
    request.designConditions?.windSpeed ??
    request.fields?.windSpeed ??
    "";

  // Form states in edit mode
  const [standard, setStandard] = useState(currentStandard);
  const [airDensity, setAirDensity] = useState(currentAirDensity);
  const [windSpeed, setWindSpeed] = useState(currentWindSpeed);
  const [reason, setReason] = useState("");

  const handleStartEdit = () => {
    setStandard(currentStandard);
    setAirDensity(currentAirDensity);
    setWindSpeed(currentWindSpeed);
    setReason("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setStandard(currentStandard);
    setAirDensity(currentAirDensity);
    setWindSpeed(currentWindSpeed);
    setReason("");
    setIsEditing(false);
  };

  const isDirty =
    standard !== currentStandard ||
    String(airDensity) !== String(currentAirDensity) ||
    String(windSpeed) !== String(currentWindSpeed) ||
    reason.trim() !== "";

  const isValid =
    standard.trim() !== "" &&
    String(airDensity).trim() !== "" &&
    !isNaN(Number(airDensity)) &&
    Number(airDensity) > 0;

  const canSave = isDirty && isValid;

  const handleSave = (e) => {
    e?.preventDefault();
    if (!canSave) return;

    onSave({
      standard,
      airDensity: String(airDensity),
      windSpeed: windSpeed ? String(windSpeed) : "",
      reasonForChange: reason.trim(),
    });

    setIsEditing(false);
    if (onToast) {
      onToast("Design conditions updated successfully.");
    }
  };

  const standardLabel =
    activeOptions.find((o) => o.value === currentStandard)?.label ||
    currentStandard ||
    "—";

  const referenceText =
    STANDARD_REFERENCES[standard] ||
    "Wind speed 60 m/s · Air density 1.23 N·sec²/m⁴";

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-medium text-slate-800">
            Design Conditions
          </h3>
          <span className="text-[11px] font-normal text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
            Calculation
          </span>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEdit}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-[#0d3b66] bg-[#eef2f6] hover:bg-[#e2e8f0] ring-1 ring-inset ring-[#d0d7e2] transition-colors active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#0d3b66]" />
            Edit
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6">
        {!isEditing ? (
          /* ── VIEW MODE ── */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Design Standard */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-xs font-normal text-slate-500">
                  Design Standard
                </span>
                <span className="mt-1 text-sm sm:text-base font-medium text-slate-800 break-words">
                  {standardLabel}
                </span>
              </div>

              {/* Air Density */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-xs font-normal text-slate-500">
                  Air Density
                </span>
                <span className="mt-1 text-sm sm:text-base font-medium text-slate-800">
                  {currentAirDensity ? (
                    <>
                      {currentAirDensity}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        N·sec²/m⁴
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </span>
              </div>

              {/* Wind Speed */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-xs font-normal text-slate-500">
                  Wind Speed
                </span>
                <div className="mt-1 flex items-center gap-2">
                  {currentWindSpeed ? (
                    <span className="text-sm sm:text-base font-medium text-slate-800">
                      {currentWindSpeed}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        m/s
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      Not set
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Warning if Wind speed is not set */}
            {!currentWindSpeed && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/90 text-amber-800 text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Wind speed isn't set yet.</strong> Calculation cases cannot be executed until wind speed is provided.
                </span>
              </div>
            )}
          </div>
        ) : (
          /* ── EDIT MODE (Inline in card, no modal) ── */
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Field: Design standard */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Design Standard <span className="text-red-500">*</span>
                </label>
                <select
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
                  required
                >
                  <option value="" disabled>
                    Select standard
                  </option>
                  {activeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field: Air density */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Air Density <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={airDensity}
                    onChange={(e) => setAirDensity(e.target.value)}
                    placeholder="1.23"
                    className="w-full pl-3.5 pr-20 py-2 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none">
                    N·sec²/m⁴
                  </span>
                </div>
              </div>

              {/* Field: Wind speed */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Wind Speed{" "}
                  <span className="text-slate-400 font-normal">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full pl-3.5 pr-12 py-2 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none">
                    m/s
                  </span>
                </div>
              </div>
            </div>

            {/* Helper: Reference for this standard */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>
                <strong>Reference for this standard:</strong> {referenceText}
              </span>
            </div>

            {/* Warning if Wind speed is empty */}
            {!windSpeed && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 text-amber-700 text-xs border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Perhitungan belum bisa dijalankan jika wind speed kosong. Anda tetap bisa menyimpan dan melengkapinya nanti.
                </span>
              </div>
            )}

            {/* Field: Reason for change */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Reason for change{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Adjusted to local regional wind regulations"
                className="w-full px-3.5 py-2 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
              />
            </div>

            {/* Footer with note & action buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-slate-500 italic">
                Applies to all calculation cases in this request.
              </p>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSave}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Save changes
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
