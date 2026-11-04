import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Edit3, Info, Lightbulb, Loader2 } from "lucide-react";
import { FormSelect } from "../../../../../shared/components/FormSelect";
import { DRAWING_TYPE_OPTIONS } from "../../../constants/drawingTypeOptions";
import {
  resolveRegionCode,
  canonicalDrawingType,
} from "../../../utils/requestPayloadMapper";

const REGION_OPTIONS = [
  { value: "east_japan", label: "East Japan (東日本)" },
  { value: "west_japan", label: "West Japan (西日本)" },
];

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="flex items-center gap-1 text-[11px] text-red-500 mt-1 font-medium">
      <span>*{text}</span>
    </div>
  ) : null;

export const DrawingConditionsSection = forwardRef(
  function DrawingConditionsSection(
    {
      request,
      canEdit = true,
      onSave, // ({ drawingType, region, isSaved }) => void
      onToast, // (message) => void
      onShowToastModal, // (message) => void
      onEditModeChange, // (isEditing) => void
    },
    ref,
  ) {
    // Only saved when explicitly marked isSaved: true or isSavedOnServer: true
    const isSaved = Boolean(
      request.drawingConditions?.isSaved || request.drawingConditions?.isSavedOnServer
    );

    const [isEditing, setIsEditing] = useState(!isSaved);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Helper to find matching option from DRAWING_TYPE_OPTIONS (case-insensitive & label matching)
    const findDrawingTypeOption = (val) => {
      if (!val) return null;
      const s = String(val).toLowerCase().trim();
      return DRAWING_TYPE_OPTIONS.find((o) => {
        const ov = o.value.toLowerCase();
        const ol = o.label.toLowerCase();
        return (
          ov === s ||
          ol === s ||
          (s.includes("approval") && ov.includes("approval")) ||
          (s.includes("manufacturer") && ov.includes("manufacturer")) ||
          (s.includes("order") && ov.includes("order")) ||
          (s.includes("meeting") && ov.includes("meeting"))
        );
      });
    };

    // Reference values from cover information (request input)
    const rawCoverDrawingType =
      request.fields?.drawingType ||
      request.fields?.deliverType ||
      "";
    const hasCoverDrawingType = Boolean(
      rawCoverDrawingType && String(rawCoverDrawingType).trim()
    );
    const matchedCoverOption = hasCoverDrawingType
      ? findDrawingTypeOption(rawCoverDrawingType)
      : null;
    const coverDrawingTypeValue =
      matchedCoverOption?.value ||
      (hasCoverDrawingType ? canonicalDrawingType(rawCoverDrawingType) : "");
    const coverDrawingTypeLabel =
      matchedCoverOption?.label ||
      (hasCoverDrawingType ? canonicalDrawingType(rawCoverDrawingType) : "");

    // Default reference values when not saved yet:
    // Drawing Type auto-populates from cover reference if specified; Region remains empty (must be selected manually)
    const defaultDrawingType = coverDrawingTypeValue || "";
    const currentDrawingType = isSaved
      ? (findDrawingTypeOption(request.drawingConditions?.drawingType)?.value ||
         canonicalDrawingType(request.drawingConditions?.drawingType) || "")
      : (findDrawingTypeOption(request.drawingConditions?.drawingType)?.value ||
         canonicalDrawingType(request.drawingConditions?.drawingType) ||
         defaultDrawingType || "");
    const rawRegion = request.drawingConditions?.region || "";
    const currentRegion = resolveRegionCode(rawRegion);

    // Form inputs state
    const [drawingType, setDrawingType] = useState(
      currentDrawingType || defaultDrawingType || ""
    );
    const [region, setRegion] = useState(currentRegion || "");

    // Sync when request id or saved status changes
    // CRITICAL: Do NOT wipe in-progress user inputs on background re-renders when isSaved is false!
    const [prevReqData, setPrevReqData] = useState({
      id: request.id,
      saved: isSaved,
    });

    if (
      prevReqData.id !== request.id ||
      prevReqData.saved !== isSaved
    ) {
      setPrevReqData({
        id: request.id,
        saved: isSaved,
      });
      if (!isSaved) {
        setIsEditing(true);
      }
      setDrawingType(
        isSaved
          ? (findDrawingTypeOption(request.drawingConditions?.drawingType)?.value ||
             canonicalDrawingType(request.drawingConditions?.drawingType) || "")
          : (findDrawingTypeOption(request.drawingConditions?.drawingType)?.value ||
             canonicalDrawingType(request.drawingConditions?.drawingType) ||
             defaultDrawingType || "")
      );
      const nextRaw = request.drawingConditions?.region || "";
      setRegion(resolveRegionCode(nextRaw));
    }

    // When conditions are already saved, sync with external updates when not actively editing
    const savedDrawingKey = isSaved && !isEditing
      ? `${request.drawingConditions?.drawingType}_${request.drawingConditions?.region}`
      : "";
    const [prevSavedDrawingKey, setPrevSavedDrawingKey] = useState(savedDrawingKey);

    if (isSaved && !isEditing && savedDrawingKey !== prevSavedDrawingKey) {
      setPrevSavedDrawingKey(savedDrawingKey);
      setDrawingType(
        findDrawingTypeOption(request.drawingConditions?.drawingType)?.value ||
        canonicalDrawingType(request.drawingConditions?.drawingType) ||
        ""
      );
      setRegion(resolveRegionCode(request.drawingConditions?.region || ""));
    }

    useEffect(() => {
      onEditModeChange?.(isEditing);
    }, [isEditing, onEditModeChange]);

    useImperativeHandle(ref, () => ({
      isEditing,
      isSaved,
      triggerValidation: () => {
        setIsEditing(true);
        const errs = {};
        if (!drawingType || !drawingType.trim()) {
          errs.drawingType = "Drawing Type is required";
        }
        if (!region || !region.trim()) {
          errs.region = "Region / Location is required";
        }
        setErrors(errs);
        const isValid = Object.keys(errs).length === 0 && isSaved;
        const firstMsg = errs.drawingType || errs.region || null;
        return { isValid, firstMsg, errors: errs };
      },
    }));

    const handleStartEdit = () => {
      setDrawingType(currentDrawingType || defaultDrawingType);
      setRegion(currentRegion);
      setErrors({});
      setIsEditing(true);
    };

    const handleCancel = () => {
      setDrawingType(currentDrawingType || defaultDrawingType);
      setRegion(currentRegion);
      setErrors({});
      setIsEditing(false);
    };

    const handleSave = async (e) => {
      e?.preventDefault();
      const errs = {};
      if (!drawingType || !drawingType.trim()) {
        errs.drawingType = "Drawing Type is required";
      }
      if (!region || !region.trim()) {
        errs.region = "Region / Location is required";
      }

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        const firstMsg = errs.drawingType || errs.region;
        if (onShowToastModal) {
          onShowToastModal(firstMsg);
        }
        return;
      }

      const payload = {
        drawingType,
        region,
        isSaved: true,
      };

      setIsSaving(true);
      try {
        await onSave?.(payload);
        setErrors({});
        setIsEditing(false);
        if (onToast) {
          onToast("Drawing conditions saved successfully.");
        }
      } catch (err) {
        // Handled by onSave error modal
      } finally {
        setIsSaving(false);
      }
    };

    // Label helpers for view mode
    const drawingTypeLabel =
      findDrawingTypeOption(currentDrawingType)?.label ||
      canonicalDrawingType(currentDrawingType) ||
      "—";

    const regionLabel =
      REGION_OPTIONS.find((o) => o.value === currentRegion)?.label ||
      (currentRegion === "east_japan"
        ? "East Japan (東日本)"
        : currentRegion === "west_japan"
        ? "West Japan (西日本)"
        : currentRegion) ||
      "—";

    return (
      <div className="space-y-3">
        {!isEditing && isSaved ? (
          /* ── VIEW / SUMMARY MODE ── */
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-gray-100">
              <p className="text-[14px] text-gray-500">
                General drawing criteria and region applied across all drawing cases in this project.
              </p>

              {canEdit && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-1.5 h-8.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-xs active:scale-95 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#0d3b66]" />
                  Edit
                </button>
              )}
            </div>

            {/* Metrics Grid: Drawing Type & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {/* 1. Drawing Type */}
              <div className="px-3.5 py-2.5 rounded-lg bg-gray-50/70 border border-gray-200/80 flex flex-col justify-between transition-colors">
                <span className="text-xs font-medium text-gray-500">
                  Drawing Type (図面種類)
                </span>
                <div className="mt-1">
                  <span className="text-sm font-medium text-gray-800 break-words">
                    {drawingTypeLabel}
                  </span>
                </div>
              </div>

              {/* 2. Region / Location */}
              <div className="px-3.5 py-2.5 rounded-lg bg-gray-50/70 border border-gray-200/80 flex flex-col justify-between transition-colors">
                <span className="text-xs font-medium text-gray-500">
                  Region / Location (地区)
                </span>
                <div className="mt-1">
                  <span className="text-sm font-medium text-gray-800 break-words">
                    {regionLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Simple Reference Info Box */}
            <div className="flex items-start sm:items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg hp:rounded-md px-4 py-2.5 text-xs md:text-sm text-gray-500">
              <Info className="w-4 h-4 shrink-0 text-gray-400 mt-0.5 sm:mt-0" />
              <span>
                {hasCoverDrawingType
                  ? `Reference from Cover Information: Drawing Type ${coverDrawingTypeLabel}`
                  : "Reference from Cover Information: None (not specified in Cover Information)"}
              </span>
            </div>
          </div>
        ) : (
          /* ── EDIT / INITIAL INPUT MODE ── */
          <form onSubmit={handleSave} className="space-y-4">
            <div className="pb-2.5 border-b border-gray-100 flex items-center justify-between">
              <p className="text-[14px] text-gray-500">
                General drawing criteria and region applied across all drawing cases in this project.
              </p>
            </div>

            {/* Interactive Guidance Banner (Shown on initial unconfirmed state) */}
            {!isSaved && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-sky-50/70 border border-sky-200/80 text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 text-[#3399cc] shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  {hasCoverDrawingType ? (
                    <>
                      <span className="font-semibold text-slate-800">
                        Drawing Type is prefilled from Cover Information.{" "}
                      </span>
                      <span className="text-slate-600">
                        Please select Region / Location below, then click{" "}
                        <strong className="font-semibold text-[#0d3b66]">
                          Save Design Conditions
                        </strong>{" "}
                        to confirm and proceed to cases.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-800">
                        No Drawing Type specified in Cover Information.{" "}
                      </span>
                      <span className="text-slate-600">
                        Please select Drawing Type and Region / Location below, then click{" "}
                        <strong className="font-semibold text-[#0d3b66]">
                          Save Design Conditions
                        </strong>{" "}
                        to confirm and proceed to cases.
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Row: Drawing Type & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1.5 font-normal">
                  Drawing Type (図面種類) <span className="text-red-500 font-normal">*</span>
                </label>
                <FormSelect
                  id="drawingType"
                  value={drawingType}
                  onChange={(val) => {
                    setDrawingType(val);
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.drawingType;
                      return next;
                    });
                  }}
                  options={DRAWING_TYPE_OPTIONS}
                  placeholder="Select Drawing Type"
                  hasError={!!errors.drawingType}
                />
                <ErrorStyle show={errors.drawingType} text={errors.drawingType} />
              </div>

              <div className="relative">
                <label className="block text-xs md:text-sm text-gray-700 mb-1.5 font-normal">
                  Region / Location (地区) <span className="text-red-500 font-normal">*</span>
                </label>
                <FormSelect
                  id="drawingRegion"
                  value={region}
                  onChange={(val) => {
                    setRegion(val);
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.region;
                      return next;
                    });
                  }}
                  options={REGION_OPTIONS}
                  placeholder="Select Region"
                  hasError={!!errors.region}
                />
                <ErrorStyle show={errors.region} text={errors.region} />
              </div>
            </div>

            {/* Simple Reference Info Box */}
            <div className="flex items-start sm:items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg hp:rounded-md px-4 py-2.5 text-xs md:text-sm text-gray-500">
              <Info className="w-4 h-4 shrink-0 text-gray-400 mt-0.5 sm:mt-0" />
              <span>
                {hasCoverDrawingType
                  ? `Reference from Cover Information: Drawing Type ${coverDrawingTypeLabel}`
                  : "Reference from Cover Information: None (not specified in Cover Information)"}
              </span>
            </div>

            {/* Footer Buttons: Cancel only if isSaved, Save changes / Save Design Conditions */}
            <div className="pt-2 flex justify-end items-center gap-2.5">
              {isSaved && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 min-w-[140px] px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>
                    {isSaved
                      ? "Save changes"
                      : "Save Drawing Conditions"}
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  },
);
