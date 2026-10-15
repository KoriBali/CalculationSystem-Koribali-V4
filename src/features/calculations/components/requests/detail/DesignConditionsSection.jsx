import {
  useState,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Edit3, Info, Lightbulb } from "lucide-react";
import { designStandardOptions } from "../../../constants/designStandards";
import { FormSelect } from "../../../../../shared/components/FormSelect";

const inputStyle = (hasError = false) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${hasError
    ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
    : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

// Renders a red error message below an invalid field (matching Gambar 3)
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="flex items-center gap-1 text-[11px] text-red-500 mt-1 font-medium">
      <span>*{text}</span>
    </div>
  ) : null;

export const DesignConditionsSection = forwardRef(
  function DesignConditionsSection(
    {
      request,
      onSave, // (updatedConditions) => void
      onToast, // (message) => void
      onShowToastModal, // (message) => void
      onEditModeChange, // (isEditing) => void
    },
    ref,
  ) {
    // Check if conditions have been manually saved by user
    const isSaved = Boolean(request.designConditions?.isSaved);

    const [isEditing, setIsEditing] = useState(!isSaved);
    const [errors, setErrors] = useState({});

    // Standard options for this request's project pole type
    const activeOptions = useMemo(
      () => designStandardOptions[request.projectType] || [],
      [request.projectType],
    );

    // Reference values from cover information
    const rawStandard = request.fields?.standard;
    const coverStandardCode =
      (rawStandard === "v60" && request.projectType === "lighting-project") || !rawStandard
        ? "jil"
        : rawStandard;

    const coverStandardLabel =
      activeOptions.find((o) => o.value?.toLowerCase() === coverStandardCode?.toLowerCase())?.label ||
      (coverStandardCode?.toLowerCase() === "jil" ? "JIL" : coverStandardCode?.toUpperCase() || "JIL");

    const coverWindSpeed = request.fields?.windSpeed || "60";
    const coverAirDensity = request.fields?.airDensity || "1.23";

    // Default reference values when not saved yet
    const defaultStandard = coverStandardCode || "jil";
    const defaultWindSpeed = coverWindSpeed || "60";
    const defaultAirDensity = coverAirDensity || "1.23";

    // Saved / current conditions
    const currentStandard = request.designConditions?.standard || "";
    const currentAirDensity = request.designConditions?.airDensity || "";
    const currentWindSpeed = request.designConditions?.windSpeed || "";

    // Form states in edit mode - automatically populated from reference if not yet saved
    const [standard, setStandard] = useState(
      currentStandard || defaultStandard
    );
    const [airDensity, setAirDensity] = useState(
      currentAirDensity || defaultAirDensity
    );
    const [windSpeed, setWindSpeed] = useState(
      currentWindSpeed || defaultWindSpeed
    );

    // Adjust state during render if request or saved status changes
    const [prevReqData, setPrevReqData] = useState({
      id: request.id,
      saved: isSaved,
      cond: request.designConditions,
    });

    if (
      prevReqData.id !== request.id ||
      prevReqData.saved !== isSaved ||
      prevReqData.cond !== request.designConditions
    ) {
      setPrevReqData({
        id: request.id,
        saved: isSaved,
        cond: request.designConditions,
      });
      if (!isSaved) {
        setIsEditing(true);
      }
      setStandard(request.designConditions?.standard || defaultStandard);
      setWindSpeed(request.designConditions?.windSpeed || defaultWindSpeed);
      setAirDensity(request.designConditions?.airDensity || defaultAirDensity);
    }

    // Notify parent whenever edit mode changes
    useEffect(() => {
      onEditModeChange?.(isEditing);
    }, [isEditing, onEditModeChange]);

    // Expose isEditing and triggerValidation so parent can guard case actions
    useImperativeHandle(ref, () => ({
      isEditing,
      triggerValidation: () => {
        setIsEditing(true);
        const errs = {};
        if (!standard || !standard.trim()) {
          errs.standard = "Design Standard is required";
        }
        if (
          !windSpeed ||
          String(windSpeed).trim() === "" ||
          isNaN(Number(windSpeed)) ||
          Number(windSpeed) <= 0
        ) {
          errs.windSpeed = "Design Wind Speed is required";
        }
        if (
          !airDensity ||
          String(airDensity).trim() === "" ||
          isNaN(Number(airDensity)) ||
          Number(airDensity) <= 0
        ) {
          errs.airDensity = "Air Density is required";
        }

        setErrors(errs);
        const isValid = Object.keys(errs).length === 0 && isSaved;
        // Prioritize standard first, then wind speed, then air density
        const firstMsg =
          errs.standard || errs.windSpeed || errs.airDensity || null;
        return { isValid, firstMsg, errors: errs };
      },
    }));

    // When standard changes, auto-fill wind speed & air density for JIL or V60
    const handleStandardChange = (val) => {
      setStandard(val);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.standard;
        return next;
      });

      if (val === "jil" || val === "v60") {
        setWindSpeed("60");
        setAirDensity("1.23");
        setErrors((prev) => {
          const next = { ...prev };
          delete next.standard;
          delete next.windSpeed;
          delete next.airDensity;
          return next;
        });
      } else if (val) {
        if (!airDensity) setAirDensity("1.23");
      }
    };

    const handleWindSpeedChange = (val) => {
      setWindSpeed(val);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.windSpeed;
        return next;
      });
    };

    const handleAirDensityChange = (val) => {
      setAirDensity(val);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.airDensity;
        return next;
      });
    };

    const handleStartEdit = () => {
      setStandard(currentStandard || defaultStandard);
      setAirDensity(currentAirDensity || defaultAirDensity);
      setWindSpeed(currentWindSpeed || defaultWindSpeed);
      setErrors({});
      setIsEditing(true);
    };

    const handleCancel = () => {
      setStandard(currentStandard || defaultStandard);
      setAirDensity(currentAirDensity || defaultAirDensity);
      setWindSpeed(currentWindSpeed || defaultWindSpeed);
      setErrors({});
      setIsEditing(false);
    };

    const handleSave = (e) => {
      e?.preventDefault();
      const errs = {};
      if (!standard || !standard.trim()) {
        errs.standard = "Design Standard is required";
      }
      if (
        !windSpeed ||
        String(windSpeed).trim() === "" ||
        isNaN(Number(windSpeed)) ||
        Number(windSpeed) <= 0
      ) {
        errs.windSpeed = "Design Wind Speed is required";
      }
      if (
        !airDensity ||
        String(airDensity).trim() === "" ||
        isNaN(Number(airDensity)) ||
        Number(airDensity) <= 0
      ) {
        errs.airDensity = "Air Density is required";
      }

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        const firstMsg = errs.standard || errs.windSpeed || errs.airDensity;
        if (onShowToastModal) {
          onShowToastModal(firstMsg);
        }
        return;
      }

      onSave({
        standard,
        airDensity: String(airDensity),
        windSpeed: String(windSpeed),
        isSaved: true,
      });

      setErrors({});
      setIsEditing(false);
      if (onToast) {
        onToast("Design conditions saved successfully.");
      }
    };

    const standardLabel =
      activeOptions.find((o) => o.value === currentStandard)?.label ||
      currentStandard ||
      "—";

    return (
      <div className="space-y-3">
        {!isEditing && isSaved ? (
          /* ── VIEW MODE (Matching Gambar 1 without compass/wind/gauge icons) ── */
          <div className="space-y-3">
            {/* Top Bar inside SectionCard */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-gray-100">
              <p className="text-[14px] text-gray-500">
                Structural criteria applied across all calculation cases in this project.
              </p>

              {/* Slightly enlarged Edit button */}
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1.5 h-8.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-xs active:scale-95 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#0d3b66]" />
                Edit
              </button>
            </div>

            {/* Metrics Grid: Standard, Wind Speed, Air Density (No icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* 1. Design Standard */}
              <div className="px-3.5 py-2.5 rounded-lg bg-gray-50/70 border border-gray-200/80 flex flex-col justify-between transition-colors">
                <span className="text-xs font-medium text-gray-500">
                  Design Standard
                </span>
                <div className="mt-1">
                  <span className="text-sm sm:text-base font-medium text-gray-800 break-words">
                    {standardLabel}
                  </span>
                </div>
              </div>

              {/* 2. Wind Speed (Wind speed first) */}
              <div className="px-3.5 py-2.5 rounded-lg bg-gray-50/70 border border-gray-200/80 flex flex-col justify-between transition-colors">
                <span className="text-xs font-medium text-gray-500">
                  Wind Speed
                </span>
                <div className="mt-1 flex items-baseline">
                  <span className="text-sm sm:text-base font-medium text-gray-800">
                    {currentWindSpeed}
                  </span>
                  <span className="ml-1 text-sm text-gray-500 font-normal">
                    m/s
                  </span>
                </div>
              </div>

              {/* 3. Air Density */}
              <div className="px-3.5 py-2.5 rounded-lg bg-gray-50/70 border border-gray-200/80 flex flex-col justify-between transition-colors">
                <span className="text-xs font-medium text-gray-500">
                  Air Density
                </span>
                <div className="mt-1 flex items-baseline">
                  <span className="text-sm sm:text-base font-medium text-gray-800">
                    {currentAirDensity}
                  </span>
                  <span className="ml-1 text-sm text-gray-500 font-normal">
                    N·sec²/m⁴
                  </span>
                </div>
              </div>
            </div>

            {/* Simple Reference Info Box (Matching Gambar 1 without bold text) */}
            <div className="flex items-start sm:items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg hp:rounded-md px-4 py-2.5 text-xs md:text-sm text-gray-500">
              <Info className="w-4 h-4 shrink-0 text-gray-400 mt-0.5 sm:mt-0" />
              <span>
                Reference from Cover Information: Standard {coverStandardLabel} · Wind speed {coverWindSpeed} m/s · Air density {coverAirDensity} N·sec²/m⁴
              </span>
            </div>
          </div>
        ) : (
          /* ── EDIT / INITIAL INPUT MODE (Mandatory First Input) ── */
          <form onSubmit={handleSave} className="space-y-3">
            <div className="pb-2.5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                  {isSaved
                    ? "Edit Design Conditions for Calculation Cases"
                    : "Design Conditions for Calculation Cases"}
                </h4>
                <p className="text-[14px] text-gray-500 mt-0.5">
                  Structural criteria applied across all calculation cases in this project.
                </p>
              </div>
            </div>

            {/* Interactive Guidance Banner (Shown on initial unconfirmed state) */}
            {!isSaved && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-sky-50/70 border border-sky-200/80 text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 text-[#3399cc] shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <span className="font-semibold text-slate-800">
                    Values are prefilled from Cover Information.{" "}
                  </span>
                  <span className="text-slate-600">
                    You can adjust any field directly below if needed, or click{" "}
                    <strong className="font-semibold text-[#0d3b66]">
                      Save Design Conditions
                    </strong>{" "}
                    to confirm and proceed to cases.
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Field: Design standard */}
              <div>
                <label className="block text-xs md:text-sm text-gray-700 mb-1.5">
                  Design Standard <span className="text-red-500 font-normal">*</span>
                </label>
                <FormSelect
                  id="designStandard"
                  value={standard}
                  onChange={handleStandardChange}
                  options={activeOptions}
                  hasError={!!errors.standard}
                  placeholder="Select standard..."
                />
                <ErrorStyle show={errors.standard} text={errors.standard} />
              </div>

              {/* 2. Field: Wind speed (Required) */}
              <div>
                <label className="block text-xs md:text-sm text-gray-700 mb-1.5">
                  Design Wind Speed <span className="text-red-500 font-normal">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min="0"
                    value={windSpeed}
                    onChange={(e) => handleWindSpeedChange(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    placeholder="e.g. 60"
                    className={`${inputStyle(!!errors.windSpeed)} pr-10 xl:pr-10`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    m/s
                  </span>
                </div>
                <ErrorStyle show={errors.windSpeed} text={errors.windSpeed} />
              </div>

              {/* 3. Field: Air density (Required) */}
              <div>
                <label className="block text-xs md:text-sm text-gray-700 mb-1.5">
                  Air Density <span className="text-red-500 font-normal">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    value={airDensity}
                    onChange={(e) => handleAirDensityChange(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    placeholder="1.23"
                    className={`${inputStyle(!!errors.airDensity)} pr-[88px] xl:pr-[88px]`}
                  />
                  <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                    N・sec<sup>2</sup>/m<sup>4</sup>
                  </span>
                </div>
                <ErrorStyle show={errors.airDensity} text={errors.airDensity} />
              </div>
            </div>

            {/* Simple Reference Info Box (Matching Gambar 1) */}
            <div className="flex items-start sm:items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg hp:rounded-md px-4 py-2.5 text-xs md:text-sm text-gray-500">
              <Info className="w-4 h-4 shrink-0 text-gray-400 mt-0.5 sm:mt-0" />
              <span>
                Reference from Cover Information: Standard {coverStandardLabel} · Wind speed {coverWindSpeed} m/s · Air density {coverAirDensity} N·sec²/m⁴
              </span>
            </div>

            {/* Footer buttons (Without "Applies to all calculation cases" text) */}
            <div className="pt-2 flex justify-end items-center gap-2.5">
              {isSaved && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg hp:rounded-md text-xs sm:text-sm font-medium bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded-lg hp:rounded-md text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 shadow-sm active:scale-95 transition-all"
              >
                {isSaved ? "Save changes" : "Save Design Conditions"}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  },
);
