import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectStorage } from "../../../hooks/useProjectStorage";
import { validateWithYup } from "../../../utils/validation";
import { CouplingSchema } from "../../../schemas/drawing/CouplingSchema";
import { CouplingTypeModal } from "../../modals/CouplingTypeModal";
import { CouplingCaseFormModal } from "../../modals/CouplingCaseFormModal";
import {
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Settings2,
  CheckCircle,
  Circle,
  Plus,
  Minus,
} from "lucide-react";

/**
 * HELPER COMPONENTS
 */
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
    {children}
  </h3>
);

const SectionCard = ({ children }) => (
  <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
    {children}
  </div>
);

const CardOption = ({ label, current, value, onChange }) => {
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`group w-full flex items-center justify-between px-3 xl:px-4 py-2 lg:py-2.5 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] relative overflow-hidden rounded-lg hp:rounded-md border transition-all duration-300 cursor-pointer active:scale-[0.98]
        ${isActive
          ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
          : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm"
        }`}
    >
      <p
        className={`text-[12px] md:text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-700"}`}
      >
        {label}
      </p>
      <div className="shrink-0 ml-2 flex items-center">
        {isActive ? (
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
        ) : (
          <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-hover:text-slate-500" />
        )}
      </div>
    </button>
  );
};

const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${hasError
    ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
    : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

export function CouplingForm({ onReset, onNext, onBack, onError }) {
  const { type: projectType } = useParams();

  const [location, setLocation] = useProjectStorage(projectType || "default", "drawing_coupling_location", "");
  const [couplingCount, setCouplingCount] = useProjectStorage(projectType || "default", "drawing_coupling_count", 1);
  const [couplings, setCouplings] = useProjectStorage(projectType || "default", "drawing_coupling_data", [
    { height: "", withHookband: false, caseDetails: null },
  ]);
  const [errors, setErrors] = useState({});
  const [modalState, setModalState] = useState({ isOpen: false, index: null, step: "grid", selectedCaseId: null });

  const handleReset = () => {
    setLocation("");
    setCouplings((prev) => prev.map(() => ({ height: "", withHookband: false, caseDetails: null })));
    setErrors({});
    if (onReset) onReset();
  };

  const handleNext = async () => {
    const { isValid, errors: validationErrors } = await validateWithYup(
      CouplingSchema,
      {
        location,
        couplings,
      },
    );

    if (!isValid) {
      setErrors(validationErrors);
      if (onError) onError("Please correct the errors in Coupling Configuration.");
      return;
    }

    setErrors({});
    if (onNext) onNext();
  };

  const handleCountChange = (newCount) => {
    if (newCount < 1 || newCount > 3) return;
    setCouplingCount(newCount);
    setCouplings((prev) => {
      const updated = [...prev];
      if (newCount > prev.length) {
        for (let i = prev.length; i < newCount; i++) {
          updated.push({ height: "", withHookband: false, caseDetails: null });
        }
      } else {
        updated.splice(newCount);
      }
      return updated;
    });
  };

  const updateCoupling = (index, field, value) => {
    setCouplings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`couplings[${index}].${field}`];
      return newErrors;
    });
  };

  return (
    <div className="bg-white rounded-b-2xl hp:rounded-b-xl shadow-sm border border-gray-200">
      <style>{`
        .stagger-spacer { width: calc(var(--stagger-idx) * 12%); }
        @media (min-width: 640px) { .stagger-spacer { width: calc(var(--stagger-idx) * 20%); } }
        @media (min-width: 768px) { .stagger-spacer { width: calc(var(--stagger-idx) * 24%); } }
        @media (min-width: 1280px) { .stagger-spacer { width: calc(var(--stagger-idx) * 30%); } }
      `}</style>
      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        {/* --- Input Location of Project --- */}
        <div className="relative">
          <SectionTitle>Input Location of Project</SectionTitle>
          <SectionCard>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-[220px]">
                <CardOption
                  label="West Japan"
                  value="West Japan"
                  current={location}
                  onChange={(val) => {
                    setLocation(val);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.location;
                      return newErrors;
                    });
                  }}
                />
              </div>
              <div className="w-full sm:w-[220px]">
                <CardOption
                  label="East Japan"
                  value="East Japan"
                  current={location}
                  onChange={(val) => {
                    setLocation(val);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.location;
                      return newErrors;
                    });
                  }}
                />
              </div>
            </div>
          </SectionCard>
          {errors.location && (
            <p className="absolute -bottom-5 left-1 text-red-500 text-xs">
              {errors.location}
            </p>
          )}
        </div>

        {/* --- Coupling Input --- */}
        <div>
          <SectionTitle>Coupling Input</SectionTitle>
          <SectionCard>
            <div className="mb-8">
              <label className="block text-xs md:text-sm text-gray-700 mb-2 md:mb-3">
                Input Coupling Height Number
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm w-fit transition-all focus-within:border-[#3399cc] focus-within:ring-1 focus-within:ring-[#3399cc] h-[34px] sm:h-[38px] lg:h-[42px]">
                <button
                  onClick={() => handleCountChange(couplingCount - 1)}
                  disabled={couplingCount <= 1}
                  className="px-3 md:px-4 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors border-r border-gray-300"
                >
                  <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <div className="px-4 md:px-6 h-full flex items-center justify-center text-sm font-semibold text-slate-800 min-w-[3rem] bg-white">
                  {couplingCount}
                </div>
                <button
                  onClick={() => handleCountChange(couplingCount + 1)}
                  disabled={couplingCount >= 3}
                  className="px-3 md:px-4 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors border-l border-gray-300"
                >
                  <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Diagram Area */}
            <div className="relative mt-4 mb-4 mx-auto w-full max-w-4xl overflow-hidden z-0">
              {/* The Vertical Pole Background */}
              <div className="absolute left-[40%] sm:left-[45%] md:left-[50%] top-8 bottom-16 w-6 md:w-8 bg-gradient-to-r from-[#d0d7e2] via-[#e2e8f0] to-[#b8c2d1] border-x border-t border-[#94a3b8] z-0 rounded-t shadow-inner transform -translate-x-1/2" />

              {/* GL Blocker (Hides infinite vertical lines below GL) */}
              <div className="absolute left-0 bottom-0 right-0 h-16 bg-white z-20" />

              {/* Ground Level Line */}
              <div className="absolute left-0 bottom-16 right-0 h-1.5 bg-[#0d3b66] z-30 opacity-90" />
              <div className="absolute left-[40%] sm:left-[45%] md:left-[50%] ml-8 bottom-[70px] text-base md:text-lg font-black text-[#0d3b66] tracking-wider bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded z-30">
                GL
              </div>

              <div className="flex flex-col gap-24 sm:gap-20 md:gap-16 xl:gap-20 relative z-10 pb-56 md:pb-72 pt-16 md:pt-20">
                {[0, 1, 2].map((i) => {
                  const isVisible = i < couplingCount;
                  const c = isVisible ? couplings[i] : { height: "", withHookband: false };

                  return (
                    <div
                      key={i}
                      className={`flex items-center w-full group relative z-10 min-h-[40px] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      {/* Left Side: CAD Dimension Lines & Height Input */}
                      <div className="w-[40%] sm:w-[45%] md:w-[50%] pl-2 sm:pl-4 md:pl-8 flex relative h-full items-center">
                        {/* Spacer to create the staggered effect (H1 furthest left, H5 closest to pole) */}
                        <div
                          style={{ "--stagger-idx": i }}
                          className="stagger-spacer shrink-0 transition-all duration-300"
                        />

                        {/* Dimension lines container */}
                        <div className="flex-1 relative flex flex-col justify-center w-full h-full">
                          {/* Input Area (Absolutely positioned ABOVE the horizontal dimension line) */}
                          <div className="absolute bottom-[calc(50%+8px)] left-0 flex flex-col items-start w-[80px] sm:w-[100px] md:w-[120px]">
                            <label className="text-[10px] sm:text-xs md:text-sm text-gray-700 mb-1.5 ml-1">
                              H{i + 1} (mm)
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              className={`w-full min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border ${errors[`couplings[${i}].height`]
                                  ? "border-red-500 bg-[#fff5f5] focus:ring-red-200"
                                  : "border-gray-300 bg-white focus:border-[#0d3b66] focus:ring-1 focus:ring-[#0d3b66]"
                                }`}
                              value={c.height}
                              onChange={(e) =>
                                updateCoupling(i, "height", e.target.value)
                              }
                            />
                          </div>

                          {/* Error Message (Absolutely positioned BELOW the horizontal dimension line) */}
                          {errors[`couplings[${i}].height`] && (
                            <div className="absolute top-[calc(50%+4px)] left-2 w-[80px] sm:w-[100px] md:w-[120px]">
                              <p className="text-red-500 text-[9px] sm:text-[10px] md:text-xs leading-tight">
                                {errors[`couplings[${i}].height`]}
                              </p>
                            </div>
                          )}

                          {/* Horizontal Connection Line */}
                          <div className="w-full h-[2px] bg-gray-400 group-hover:bg-[#0d3b66] transition-colors" />

                          {/* Infinite Vertical Line extending downwards from the horizontal line */}
                          <div className="absolute top-[50%] left-0 w-[2px] h-[1000px] bg-gray-400 group-hover:bg-[#0d3b66] transition-colors -z-10" />
                        </div>
                      </div>

                      {/* Pole Intersection Node */}
                      <div className="absolute left-[40%] sm:left-[45%] md:left-[50%] top-1/2 w-4 h-4 md:w-5 md:h-5 bg-white border-[3px] md:border-[4px] border-[#0d3b66] group-hover:border-[#0d3b66] rounded-full shadow-md z-20 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-all duration-300" />

                      {/* Right Side: Options */}
                      <div className="w-[60%] sm:w-[55%] md:w-[50%] pl-5 sm:pl-8 md:pl-10 xl:pl-12 pr-2 sm:pr-4 md:pr-8 flex flex-col xl:flex-row items-stretch xl:items-center gap-2 sm:gap-3 xl:gap-4">
                        <label className="flex items-center justify-start gap-2 sm:gap-3 cursor-pointer group/cb bg-white hover:bg-gray-50 pl-2 pr-4 sm:px-4 py-2 lg:py-2.5 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] rounded-lg border border-gray-300 shadow-sm transition-all w-full xl:w-[160px]">
                          <div className="relative flex items-center justify-center shrink-0">
                            <input
                              type="checkbox"
                              className="peer appearance-none w-4 h-4 md:w-5 md:h-5 border-2 border-gray-300 rounded bg-white checked:bg-[#0d3b66] checked:border-[#0d3b66] transition-all cursor-pointer"
                              checked={c.withHookband}
                              onChange={(e) =>
                                updateCoupling(
                                  i,
                                  "withHookband",
                                  e.target.checked,
                                )
                              }
                            />
                            <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                              <svg
                                className="w-3 h-3 md:w-3.5 md:h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                          <span className="text-[10px] sm:text-[11px] md:text-sm font-medium text-gray-700 group-hover/cb:text-[#0d3b66] transition-colors whitespace-nowrap flex-1">
                            with Hookband
                          </span>
                        </label>
                        <div className="flex flex-col items-end relative">
                          <button 
                            type="button"
                            onClick={() => {
                              const existingCase = couplings[i]?.caseDetails;
                              if (existingCase) {
                                setModalState({ isOpen: true, index: i, step: "form", selectedCaseId: existingCase.caseId });
                              } else {
                                setModalState({ isOpen: true, index: i, step: "grid", selectedCaseId: null });
                              }
                            }}
                            className={`group/btn flex items-center justify-start gap-1.5 sm:gap-3 pl-2 pr-4 sm:px-4 py-2 lg:py-2.5 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] border shadow-sm rounded-lg text-[10px] sm:text-[11px] md:text-sm font-medium transition-all w-full xl:w-auto ${
                              errors[`couplings[${i}].caseDetails`]
                                ? "bg-red-50 border-red-400 text-red-600 hover:bg-red-100 hover:border-red-500"
                                : c.caseDetails 
                                  ? "bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500" 
                                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                            }`}
                          >
                            {c.caseDetails ? (
                              <CheckCircle className={`hidden sm:block w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 transition-colors ${errors[`couplings[${i}].caseDetails`] ? "text-red-500" : "text-emerald-600"}`} />
                            ) : (
                              <Settings2 className={`hidden sm:block w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 transition-colors ${errors[`couplings[${i}].caseDetails`] ? "text-red-500" : "text-slate-500"}`} />
                            )}
                            <span className="whitespace-nowrap">
                              {c.caseDetails ? `Coupling H${i + 1} Configured` : `Input Coupling at H${i + 1}`}
                            </span>
                          </button>
                          {errors[`couplings[${i}].caseDetails`] && (
                            <span className="absolute top-[105%] right-0 text-[9px] sm:text-[10px] text-red-500 whitespace-nowrap mt-0.5">
                              {errors[`couplings[${i}].caseDetails`]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-8" />

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 mt-4">
          <button
            onClick={handleReset}
            className="flex justify-center items-center gap-2 px-5 py-2.5
            rounded-lg font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] text-sm 
            ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={handleNext}
            className="flex justify-center items-center gap-2 px-6 py-2.5 
            rounded-lg font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-sm hover:brightness-110 shadow-sm transition-all"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <CouplingTypeModal
        isOpen={modalState.isOpen && modalState.step === "grid"}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        couplingIndex={modalState.index}
        onSelect={(caseObj) => {
          setModalState(prev => ({ ...prev, step: "form", selectedCaseId: caseObj.id }));
        }}
      />
      <CouplingCaseFormModal
        isOpen={modalState.isOpen && modalState.step === "form"}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onChangeCase={() => setModalState(prev => ({ ...prev, step: "grid", selectedCaseId: null }))}
        caseData={modalState.selectedCaseId ? {
          id: modalState.selectedCaseId,
          title: `Case ${modalState.selectedCaseId} of Coupling`,
          image: `/images/CPdetail-Case${modalState.selectedCaseId}.svg`
        } : null}
        location={location}
        initialData={
          modalState.index !== null && 
          couplings[modalState.index]?.caseDetails?.caseId === modalState.selectedCaseId
            ? couplings[modalState.index].caseDetails
            : null
        }
        onSave={(details) => {
          updateCoupling(modalState.index, "caseDetails", details);
          setModalState({ isOpen: false, index: null, step: "grid", selectedCaseId: null });
        }}
      />
    </div>
  );
}
