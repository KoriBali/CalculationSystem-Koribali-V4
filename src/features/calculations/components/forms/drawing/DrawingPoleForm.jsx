import { RotateCcw, ChevronRight, FileText, Settings2, CheckCircle, Circle } from "lucide-react";
import { TaperPoleStandardForm } from "../pole/standard/TaperTypeForm";

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-3 md:-bottom-4 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
    {children}
  </h3>
);

const SectionCard = ({ children }) => (
  <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
    {children}
  </div>
);

const CardOption = ({ label, current, value, onChange, icon: Icon }) => {
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`group w-full text-left relative overflow-hidden rounded-lg hp:rounded-md border-2 p-3 md:p-5 transition-all duration-300 cursor-pointer active:scale-[0.98]
        ${
          isActive
            ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
            : "border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg hp:rounded-md transition-colors ${isActive ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:text-slate-600"}`}
          >
            <Icon size={16} />
          </div>
          <p
            className={`text-[12px] md:text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"}`}
          >
            {label}
          </p>
        </div>
        <div className="shrink-0 ml-2">
          {isActive ? (
            <CheckCircle className="w-5 h-5 text-blue-500" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
          )}
        </div>
      </div>
    </button>
  );
};

export function DrawingPoleForm({ pole, onUpdate, onReset, onNext, errors, onToast }) {
  return (
    <div className="bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 shadow-sm space-y-4 md:space-y-6">

        {/* ── Pole Selection ── */}
        <div className="mb-4">
          <SectionTitle>Select Pole Type</SectionTitle>
          <SectionCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardOption
                label="Lighting Pole Standard"
                value="lighting-pole"
                current={pole.poleType}
                icon={FileText}
                onChange={(val) => onUpdate({ poleType: val })}
              />
              <CardOption
                label="Custom Pole"
                value="custom"
                current={pole.poleType}
                icon={Settings2}
                onChange={() => {
                  if (onToast) {
                    onToast({ message: "Custom Pole drawing is not ready yet.", type: "error" });
                  }
                }}
              />
            </div>
            <ErrorStyle show={errors.poleType} text={errors.poleType} />
          </SectionCard>
        </div>

        {/* ── Taper Pole Form ── */}
        {pole.poleType === "lighting-pole" && (
          <div className="mb-4 relative">
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm pt-4 md:pt-6">
              <TaperPoleStandardForm
                hideReset={true}
                taperPoleStandard={pole.taperPoleStandard || { poleType: "", groundPosition: "", height: "" }}
                onUpdate={(data) =>
                  onUpdate({
                    taperPoleStandard: { ...(pole.taperPoleStandard || {}), ...data },
                  })
                }
              />
            </div>
            {(errors["taperPoleStandard.poleType"] || errors["taperPoleStandard.groundPosition"] || errors["taperPoleStandard.height"]) && (
              <ErrorStyle show={true} text="Please complete the Pole Standard Configuration" />
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 mt-6" />

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 md:pt-0">
          <button
            onClick={onReset}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6
            rounded-lg hp:rounded-md font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] text-xs sm:text-sm 
            ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Reset
          </button>

          <button
            onClick={onNext}
            className="flex justify-center items-center gap-2 px-5 py-2.5 md:px-6 
            rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-xs md:text-sm hover:brightness-110 shadow-sm transition-all"
          >
            Next Step
            <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
