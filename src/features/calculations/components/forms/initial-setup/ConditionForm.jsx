import {
  RotateCcw,
  ChevronRight,
  DoorOpen,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { BaseplateIcon } from "../../../../../assets/icon";
import { ConfirmResetAllModal } from "../../modals/ConfirmResetAllModal";

/**
 * HELPER COMPONENTS & FUNCTIONS
 */
// Reusable section title with left accent bar
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
    {children}
  </h3>
);

// Reusable section card wrapper
const SectionCard = ({ children }) => (
  <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
    {children}
  </div>
);

/**
 * MAIN COMPONENT: ConditionForm
 */
export function ConditionForm({
  projectType,
  projectMode,
  condition,
  onUpdate,
  onFinish,
  errors,
}) {
  // State for reset confirmation modal
  const [showResetModal, setShowResetModal] = useState(false);

  // Resets only additional components toggles, preserving request design conditions and pole type
  const handleReset = () => {
    const isStandard = condition?.poleType === "standard";
    onUpdate({
      openingEnabled: isStandard ? true : false,
      baseplateEnabled: isStandard ? true : false,
      foundationEnabled: false,
    });
  };

  return (
    <div className="relative">
      <div
        className="
          bg-white
          rounded-2xl hp:rounded-xl
          border border-gray-200
          shadow-[0_2px_10px_rgba(15,23,42,0.06)]
          overflow-hidden
        "
      >
        {/* Top accent strip — full-bleed rect, otomatis ke-clip mengikuti rounded corner parent */}
        <div
          aria-hidden="true"
          className="
            h-1.5
            bg-gradient-to-r from-[#0d3b66] to-[#3399cc]
          "
        />

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">

          {/* ── Additional Component (toggles) ── */}
          <div>
            <SectionTitle>Additional Components</SectionTitle>
            <SectionCard>
              <div className="grid xl:grid-cols-3 gap-6">
                {/* Opening */}
                <ToggleCard
                  label="Opening"
                  icon={<DoorOpen size={16} />}
                  enabled={condition.openingEnabled}
                  disabled={
                    projectMode === "both" && condition.poleType === "standard"
                  }
                  onToggle={() =>
                    onUpdate({ openingEnabled: !condition.openingEnabled })
                  }
                />

                {/* Baseplate */}
                <ToggleCard
                  label="Baseplate"
                  icon={<BaseplateIcon size={18} />}
                  enabled={condition.baseplateEnabled}
                  onToggle={() =>
                    onUpdate({ baseplateEnabled: !condition.baseplateEnabled })
                  }
                />

                {/* Foundation */}
                <ToggleCard
                  label="Foundation"
                  icon={<Layers size={16} />}
                  enabled={condition.foundationEnabled}
                  onToggle={() =>
                    onUpdate({
                      foundationEnabled: !condition.foundationEnabled,
                    })
                  }
                />
              </div>
            </SectionCard>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 md:pt-0">
            {/* Reset => clears all fields */}
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 md:px-6 rounded-lg hp:rounded-md bg-white text-red-500 font-medium text-xs md:text-sm hover:bg-red-50 hover:text-red-600 transition-colors border border-red-300"
            >
              <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
              Reset
            </button>

            {/* Finish => proceeds to next step */}
            <button
              onClick={onFinish}
              className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6 
            rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-xs md:text-sm hover:brightness-110 shadow-sm transition-all"
            >
              Next: Pole
              <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            </button>
          </div>
        </div>
      </div>
      <ConfirmResetAllModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={handleReset}
      />
    </div>
  );
}

// ─── SUB-COMPONENT ───────────────────────────────────────────────────────────

// Reusable toggle card for additional components (Opening, Baseplate, Foundation)
function ToggleCard({ label, icon, enabled, onToggle, disabled = false }) {
  return (
    <div
      onClick={disabled ? undefined : onToggle}
      className={`relative overflow-hidden rounded-lg border px-3 xl:px-4 py-2 lg:py-3 transition-all duration-300
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${disabled && !enabled ? "bg-slate-100 opacity-60" : ""}
        ${
          enabled
            ? "border-blue-500 bg-white shadow-sm ring-1 ring-blue-50"
            : disabled
              ? "border-slate-200"
              : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={`p-1.5 rounded-md ${enabled ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
          >
            {icon}
          </div>
          {/* Label */}
          <p
            className={`text-[12px] md:text-sm font-medium ${enabled ? "text-slate-900" : "text-slate-500"}`}
          >
            {label}
          </p>
        </div>

        {/* Toggle switch */}
        <button
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onToggle();
          }}
          className={`relative inline-flex h-5 w-10 md:h-6 md:w-11 items-center rounded-full ${enabled ? "bg-blue-500" : "bg-slate-300"} ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <span
            className={`inline-block h-2.5 w-2.5 md:h-4 md:w-4 transform rounded-full bg-white transition ${enabled ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>
    </div>
  );
}
