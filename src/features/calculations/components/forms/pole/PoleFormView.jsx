import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  CheckCircle,
  Circle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Calculator,
  Copy,
  ClipboardPaste,
  CircleDot,
} from "lucide-react";

import { HeaderCalculationPage } from "../../layout/HeaderCalculationPage";
import { PoleConfigForm } from "./custom/PoleConfigForm";
import { PoleForm } from "./custom/PoleForm";
import { DirectObjectForm } from "./custom/DirectObjectForm";
import { OverheadWireForm } from "./custom/OverheadWireForm";
import { ArmForm } from "./custom/ArmForm";
import { ArmObjectForm } from "./custom/ArmObjectForm";
import { PoleTypeSelector } from "./standard/PoleType";
import { TaperPoleStandardForm } from "./standard/TaperTypeForm";
import { StraightPoleStandardForm } from "./standard/StraightTypeForm";
import { ResultsTableView } from "../../tables/pole-result/ResultTableView";

import { ToastModal } from "../../modals/ToastModal";
import { ConfirmDeleteModal } from "../../modals/ConfirmDeleteModal";
import { ConfirmReduceModal } from "../../modals/ConfirmReduceModal";
import { usePoleForm } from "../../../hooks/usePoleForm";
import { useDirectObjectForm } from "../../../hooks/useDirectObjectForm";
import { useOverheadWireForm } from "../../../hooks/useOverheadWireForm";
import { useArmForm } from "../../../hooks/useArmForm";
import { usePoleStandardForm } from "../../../hooks/usePoleStandardForm";
import { usePoleConfigForm } from "../../../hooks/usePoleConfigForm";
import { usePoleCalculation } from "../../../hooks/usePoleCalculation";
import { useReport } from "../../../../report/hooks/useReport";

import { FinishCalculationModal } from "../../modals/FinishCalculationModal";
import { ConfirmSaveDatabaseModal } from "../../modals/ConfirmSaveDatabaseModal";
import { CoverFormModal } from "../../modals/CoverFormModal";
import {
  saveWorkingSessionToDraft,
  clearActiveDraftId,
} from "../../../utils/coreLogic";
import { clearCalculationSession } from "../../../utils";

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function PoleFormView() {
  const { type: projectType, draftId } = useParams();

  const navigate = useNavigate();
  // Read condition from sessionStorage
  const condition = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`${projectType}_condition`) || "{}",
      );
    } catch {
      return {};
    }
  })();

  const workflow = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`${projectType}_workflow`) || "{}",
      );
    } catch {
      return {};
    }
  })();

  const isCalculationAndDrawing = workflow.projectMode === "both";

  // ── UI-only accordion state — lives in page, not in hooks ──
  const [isExpandedPole, setIsExpandedPole] = useState(true);
  const [isExpandedDo, setIsExpandedDo] = useState(true);
  const [isExpandedOhw, setIsExpandedOhw] = useState(true);
  const [isExpandedArm, setIsExpandedArm] = useState(true);

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

  // ── Hooks ──
  const poleForm = usePoleForm(projectType);
  const doForm = useDirectObjectForm(projectType);
  const ohwForm = useOverheadWireForm(projectType);
  const armForm = useArmForm(projectType);
  const poleStandardForm = usePoleStandardForm(projectType);
  const poleConfigForm = usePoleConfigForm(projectType);

  const calculation = usePoleCalculation({
    poleForm,
    directObjectForm: doForm,
    ohwForm,
    armForm,
    poleStandardForm,
    poleConfigForm,
    expandPole: setIsExpandedPole,
    expandDo: setIsExpandedDo,
    expandOhw: setIsExpandedOhw,
    expandArm: setIsExpandedArm,
  });

  const report = useReport(projectType);

  // Automatically select taper pole in calculation & drawing mode
  useEffect(() => {
    if (
      projectType === "lighting-project" &&
      condition.poleType === "standard" &&
      isCalculationAndDrawing
    ) {
      if (poleStandardForm.poleTypeStandard.type !== "taper") {
        poleStandardForm.updatePoleTypeStandard({ type: "taper" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    projectType,
    condition.poleType,
    isCalculationAndDrawing,
    poleStandardForm.poleTypeStandard.type,
  ]);

  // Opens cover modal if last step, otherwise navigates to next.
  // calculation.finish() itself silently no-ops when not yet calculated —
  // fine when the button was natively `disabled` (it couldn't be clicked
  // at all), but the button below no longer is, so this needs to explain
  // why nothing happened instead of just doing nothing.
  const handleFinish = () => {
    if (!calculation.isCalculated) {
      calculation.showToast("Click \"Calculate Results\" first", "error");
      return;
    }
    const result = calculation.finish();
    if (result === "OPEN_COVER") {
      setShowFinishModal(true);
    }
  };

  const handleConfirmCover = () => {
    setShowCoverModal(false);
    report.makeReport({
      isCalculated: calculation.isCalculated,
      showToast: calculation.showToast,
    });
  };

  const handleSaveDraft = () => {
    saveWorkingSessionToDraft(projectType, draftId);
    calculation.showToast("Draft successfully saved!", "success");
    setShowFinishModal(false);
  };

  const handleSaveDatabaseClick = () => {
    setShowFinishModal(false);
    setShowDbModal(true);
  };

  const handleConfirmSaveDb = () => {
    // Database save logic will go here
    calculation.showToast("Project successfully saved to database!", "success");
    setShowDbModal(false);
    setTimeout(() => {
      clearCalculationSession(projectType);
      clearActiveDraftId(projectType);
      navigate(`/calculation/${projectType}`);
    }, 2500);
  };

  // custom mode — non lighting-project always custom, lighting-project only if poleType === custom
  const isCustomMode =
    projectType !== "lighting-project" || condition.poleType === "custom";

  return (
    <div className="flex flex-col h-full">
      <Helmet>
        <title>Calculation Pole - KORI BALI</title>
        <meta name="calculation" content="Calculation System CV. KORI BALI" />
      </Helmet>

      {/* MODALS */}
      <ConfirmReduceModal
        open={poleForm.confirmReducePole}
        onClose={poleForm.cancelReduce}
        onConfirm={poleForm.confirmReduce}
        itemName="step poles"
      />

      <div className="flex-1 rounded-t-2xl hp:rounded-xl bg-gray-50">
        <HeaderCalculationPage />

        <div className="w-full max-w-[1440px] mx-auto pt-0 pb-24 sm:pb-8 px-2">
          {/* ── Pole Specifications ── */}
          <div
            className="
              bg-white
              mt-6 md:mt-8
              rounded-2xl hp:rounded-xl
              border border-slate-200
              shadow-[0_2px_10px_rgba(15,23,42,0.06)]
              overflow-hidden
            "
          >
            {/* Top accent strip — same gradient/style as ConditionForm's card strip */}
            <div
              aria-hidden="true"
              className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]"
            />

            {/* Expand / collapse header */}
            <button
              type="button"
              onClick={() => setIsExpandedPole((prev) => !prev)}
              aria-expanded={isExpandedPole}
              className={`
                group
                w-full
                flex items-center justify-between
                gap-4
                px-4 md:px-5
                py-3.5
                bg-slate-50/60
                hover:bg-slate-50
                transition-colors
                duration-200
                ${isExpandedPole ? "border-b border-slate-200" : ""}
              `}
            >
              <h2
                className="
                  text-[#0d3b66]
                  text-sm md:text-[15px]
                  font-medium
                  tracking-normal
                  whitespace-nowrap
                "
              >
                Pole Specifications
              </h2>

              {/* Expand / collapse icon */}
              <span
                className="
                  flex
                  h-8 w-8
                  sm:h-9 sm:w-9
                  shrink-0
                  items-center justify-center
                  rounded-full

                  text-slate-400

                  group-hover:text-[#0d3b66]
                  group-hover:bg-blue-50

                  transition-colors
                  duration-200
                "
              >
                <ChevronDown
                  className={`
                    w-4 h-4
                    sm:w-[20px] sm:h-[20px]
                    transition-transform
                    duration-300
                    ${isExpandedPole ? "rotate-180" : ""}
                  `}
                />
              </span>
            </button>

            {/* Expandable content */}
            <div
              className={`
                grid
                transition-[grid-template-rows]
                duration-300
                ease-in-out
                ${isExpandedPole ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
              `}
            >
              <div className="min-h-0 overflow-hidden">
                {/* Standard mode — lighting-project only */}
                {projectType === "lighting-project" &&
                  condition.poleType === "standard" && (
                    <>
                      <div className="pt-6 hp:pt-4" />

                      {!isCalculationAndDrawing && (
                        <PoleTypeSelector
                          poleTypeStandard={poleStandardForm.poleTypeStandard}
                          onUpdate={poleStandardForm.updatePoleTypeStandard}
                        />
                      )}

                      {(isCalculationAndDrawing ||
                        poleStandardForm.poleTypeStandard.type === "taper") && (
                        <TaperPoleStandardForm
                          taperPoleStandard={poleStandardForm.taperPoleStandard}
                          onUpdate={poleStandardForm.updateTaperPoleStandard}
                          isBaseplate={condition.baseplateEnabled}
                          errors={poleStandardForm.taperPoleErrors}
                        />
                      )}

                      {!isCalculationAndDrawing &&
                        poleStandardForm.poleTypeStandard.type ===
                          "straight" && (
                          <StraightPoleStandardForm
                            straightPoleStandard={
                              poleStandardForm.straightPoleStandard
                            }
                            onUpdate={
                              poleStandardForm.updateStraightPoleStandard
                            }
                            errors={poleStandardForm.straightPoleErrors}
                            condition={condition}
                          />
                        )}
                    </>
                  )}

                {/* Custom mode */}
                {isCustomMode && (
                  <>
                    {/* Structural Design — [CHANGE 4] bind ke poleConfigForm, bukan coverForm */}
                    <div className="border-b border-gray-200 px-6 pt-6 pb-7 hp:px-4 hp:pt-4">
                      <div className="flex items-center justify-between mb-4 hp:mb-2">
                        <h3 className="text-[#0d3b66] mb-2 flex items-center gap-2 text-xs md:text-sm font-medium hp:text-xs hp:gap-1">
                          <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
                          Structural Design
                        </h3>
                      </div>
                      <PoleConfigForm
                        poleConfig={poleConfigForm.poleConfig}
                        onUpdate={poleConfigForm.updatePoleConfig}
                        errors={poleConfigForm.poleConfigErrors}
                      />
                    </div>

                    {/* Pole Header */}
                    <div className="px-6 pt-6 pb-3 hp:px-4 hp:pt-4 hp:pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="text-[#0d3b66] flex items-center gap-2 text-xs md:text-sm font-medium hp:text-xs hp:gap-1">
                            <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
                            <span className="font-semibold">
                              Configure up to 6 Step Poles
                            </span>
                            <span className="font-medium hp:hidden">
                              {" "}
                              with detailed specifications
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* INPUT CONTROL SECTION */}
                    <div className="border-b border-gray-200">
                      <div
                        className="
                          flex items-center justify-start
                          px-6 pt-3 pb-6
                          hp:flex-col
                          hp:items-stretch
                          hp:gap-3
                          hp:px-3
                          hp:pt-2
                          hp:pb-4
                        "
                      >
                        {/* INPUT + ACTION BUTTON */}
                        <div
                          className="
                            flex items-center gap-3
                            hp:flex-row
                            hp:items-center
                            hp:gap-2
                            hp:w-full
                          "
                        >
                          {/* Current object count display */}
                          <div
                            className="
                              flex items-center gap-2 px-5 py-2 lg:py-2.5 text-sm rounded-md sm:rounded-lg
                              bg-slate-50 border border-slate-200 text-slate-700 font-medium
                              whitespace-nowrap
                              hp:px-3
                              hp:py-2
                              hp:text-xs
                              hp:justify-center
                              hp:flex-shrink-0
                            "
                          >
                            <span className="text-[#0d3b66] font-semibold">
                              {poleForm.poles.length}
                            </span>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-600">6 Poles</span>
                          </div>

                          {/* Input for number of object to add */}
                          <input
                            type="number"
                            min={1}
                            max={6}
                            placeholder="Input Pole Number"
                            value={poleForm.poleCountInput}
                            onChange={(e) =>
                              poleForm.setPoleCountInput(e.target.value)
                            }
                            onWheel={(e) => e.target.blur()}
                            className="
                              w-[180px] px-3.5 py-2 lg:py-2.5 text-center text-sm rounded-md sm:rounded-lg outline-none
                              transition-all border border-slate-300 bg-white
                              focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]
                              hp:flex-1
                              hp:min-w-0
                              hp:w-auto
                              hp:px-2
                              hp:py-2
                              hp:text-xs
                            "
                          />

                          {/* Confirm add object button */}
                          <button
                            onClick={poleForm.handleAddPoleBulk}
                            disabled={
                              !poleForm.poleCountInput ||
                              isNaN(poleForm.poleCountInput) ||
                              Number(poleForm.poleCountInput) <= 0 ||
                              Number(poleForm.poleCountInput) > 6 ||
                              Number(poleForm.poleCountInput) ===
                                poleForm.poles.length
                            }
                            className={`
                              flex items-center gap-2 px-7 py-2 lg:py-2.5 text-sm font-medium rounded-md sm:rounded-lg
                              transition-all border whitespace-nowrap
                              hp:px-4
                              hp:py-2
                              hp:text-xs
                              hp:gap-1.5
                              hp:flex-shrink-0
                              ${
                                !poleForm.poleCountInput ||
                                isNaN(poleForm.poleCountInput) ||
                                Number(poleForm.poleCountInput) <= 0 ||
                                Number(poleForm.poleCountInput) > 6 ||
                                Number(poleForm.poleCountInput) ===
                                  poleForm.poles.length
                                  ? "bg-gray-50 border-gray-300 text-gray-600 opacity-40 cursor-not-allowed"
                                  : "bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100"
                              }
                            `}
                          >
                            {!poleForm.poleCountInput ||
                            isNaN(poleForm.poleCountInput) ||
                            Number(poleForm.poleCountInput) <= 0 ||
                            Number(poleForm.poleCountInput) > 6 ||
                            Number(poleForm.poleCountInput) ===
                              poleForm.poles.length ? (
                              <Circle className="w-4 h-4 text-gray-400 hp:w-3.5 hp:h-3.5" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-blue-500 hp:w-3.5 hp:h-3.5" />
                            )}
                            OK
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* List of Pole Forms */}
                    {poleForm.poles.map((pole, index) => {
                      const isLast = index === poleForm.poles.length - 1;
                      const hasMultiple = poleForm.poles.length > 1;

                      return (
                        <div
                          key={pole.id}
                          className={`hover:bg-blue-50/50 p-6 
                          ${hasMultiple && !isLast ? "border-b border-gray-200" : ""} hp:px-4 hp:pb-6 hp:pt-4`}
                        >
                          <div className="space-y-6 hp:space-y-4">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 hp:flex-col hp:items-start hp:gap-3">
                              <div className="flex items-center gap-3 hp:gap-2">
                                {/* Index badge */}
                                <div
                                  className="
                                    w-9 h-9 lg:w-10 lg:h-10 rounded-md sm:rounded-lg flex-shrink-0
                                    bg-gradient-to-br from-[#0d3b66] to-[#3399cc]
                                    flex items-center justify-center
                                    text-white text-sm font-medium
                                    hp:w-[34px] hp:h-[34px]
                                  "
                                >
                                  {index + 1}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-[#0d3b66] text-sm font-semibold hp:text-xs truncate">
                                    Step Pole {index + 1}
                                    {pole.name && ` : ${pole.name}`}
                                  </h4>
                                  <p className="text-xs text-gray-500 hp:text-[10px]">
                                    {pole.type} Type
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2 sm:gap-3 justify-end items-center">
                                {/* Copy & Paste */}
                                <div className="flex items-center gap-1.5 sm:gap-2 mr-1 sm:mr-2">
                                  <button
                                    onClick={() => poleForm.copyPole(pole)}
                                    title="Copy this Pole Spec"
                                    className="flex justify-center items-center w-9 h-9 lg:w-10 lg:h-10 rounded-md sm:rounded-lg border bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                  >
                                    <Copy className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                                  </button>
                                  <button
                                    onClick={() => poleForm.pastePole(pole.id)}
                                    disabled={!poleForm.poleClipboard}
                                    title={
                                      poleForm.poleClipboard
                                        ? "Paste copied Pole Spec"
                                        : "No copied Pole Spec"
                                    }
                                    className={`flex justify-center items-center w-9 h-9 lg:w-10 lg:h-10 rounded-md sm:rounded-lg border transition ${
                                      poleForm.poleClipboard
                                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                                  >
                                    <ClipboardPaste className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                                  </button>
                                </div>

                                {/* Divider */}
                                <div className="h-8 w-px bg-gray-300 opacity-70" />

                                {/* Reset */}
                                <button
                                  onClick={() =>
                                    poleForm.resetActivePole(pole.id)
                                  }
                                  className="flex justify-center items-center gap-2 px-4 py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md font-medium bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-300 transition-colors"
                                >
                                  <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                                  <span className="text-sm">Reset</span>
                                </button>

                                {poleForm.poles.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      poleForm.setConfirmDelete?.(pole.id);
                                    }}
                                    className="flex justify-center items-center gap-2 px-4 py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md font-medium bg-red-50 hover:bg-red-100
                                    text-red-600 ring-1 ring-inset ring-red-200 hover:ring-red-300 shadow-sm transition-all"
                                  >
                                    <Trash2 className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                                    <span className="text-sm">Delete Step</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <PoleForm
                              pole={pole}
                              onUpdate={(updates) =>
                                poleForm.updatePole(pole.id, updates)
                              }
                              errors={poleForm.poleErrors[pole.id] || {}}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Divider */}
                    <div className="border-t border-gray-200" />

                    {/* Add Step Button */}
                    <div className="flex justify-center items-center p-6 hp:p-4">
                      <button
                        onClick={poleForm.addPole}
                        disabled={poleForm.poles.length >= 6}
                        className={`
                          w-full py-2 lg:py-2.5 font-medium text-sm rounded-md sm:rounded-lg
                          flex items-center justify-center gap-2
                          transition-all duration-200
              
                          ${
                            poleForm.poles.length >= 6
                              ? "border-2 border-dashed border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                              : "border-2 border-dashed border-[#3399cc] text-[#3399cc] bg-transparent hover:bg-[#3399cc] hover:text-white"
                          }
              
                          hp:text-xs
                        `}
                      >
                        <Plus className="w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5" />
                        Add Step
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Direct Object ── */}
          {isCustomMode && (
            <>
              <div
                className="
                  bg-white
                  mt-6 md:mt-8
                  rounded-2xl hp:rounded-xl
                  border border-slate-200
                  shadow-[0_2px_10px_rgba(15,23,42,0.06)]
                  overflow-hidden
                "
              >
                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]"
                />

                {/* Expand / collapse header */}
                <button
                  type="button"
                  onClick={() => setIsExpandedDo((prev) => !prev)}
                  aria-expanded={isExpandedDo}
                  className={`
                    group
                    w-full
                    flex items-center justify-between
                    gap-4
                    px-4 md:px-5
                    py-3.5
                    bg-slate-50/60
                    hover:bg-slate-50
                    transition-colors
                    duration-200
                    ${isExpandedDo ? "border-b border-slate-200" : ""}
                  `}
                >
                  <h2
                    className="
                      text-[#0d3b66]
                      text-sm md:text-[15px]
                      font-medium
                      tracking-normal
                      whitespace-nowrap
                    "
                  >
                    Direct Object Specifications
                  </h2>

                  {/* Expand / collapse icon */}
                  <span
                    className="
                      flex
                      h-8 w-8
                      sm:h-9 sm:w-9
                      shrink-0
                      items-center justify-center
                      rounded-full

                      text-slate-400

                      group-hover:text-[#0d3b66]
                      group-hover:bg-blue-50

                      transition-colors
                      duration-200
                    "
                  >
                    <ChevronDown
                      className={`
                        w-4 h-4
                        sm:w-[20px] sm:h-[20px]
                        transition-transform
                        duration-300
                        ${isExpandedDo ? "rotate-180" : ""}
                      `}
                    />
                  </span>
                </button>

                {/* Expandable content */}
                <div
                  className={`
                    grid
                    transition-[grid-template-rows]
                    duration-300
                    ease-in-out
                    ${isExpandedDo ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                  `}
                >
                  <div className="min-h-0 overflow-hidden">
                    <DirectObjectForm
                      directObjects={doForm.directObjects}
                      doCountInput={doForm.doInputValue}
                      setDoCountInput={doForm.setDoInputValue}
                      onUpdate={doForm.updateDo}
                      errors={doForm.doErrors}
                      onAddDo={doForm.addDoByInput}
                      onCopyDo={doForm.copyDo}
                      onPasteDo={doForm.pasteDo}
                      hasClipboard={Boolean(doForm.doClipboard)}
                      setConfirmDeleteDo={doForm.setConfirmDeleteDo}
                      resetCurrentDo={doForm.resetDo}
                      handleAddDo={doForm.addDo}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Overhead Wire ── */}
          {isCustomMode && (
            <>
              <div
                className="
                  bg-white
                  mt-6 md:mt-8
                  rounded-2xl hp:rounded-xl
                  border border-slate-200
                  shadow-[0_2px_10px_rgba(15,23,42,0.06)]
                  overflow-hidden
                "
              >
                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]"
                />

                {/* Expand / collapse header */}
                <button
                  type="button"
                  onClick={() => setIsExpandedOhw((prev) => !prev)}
                  aria-expanded={isExpandedOhw}
                  className={`
                    group
                    w-full
                    flex items-center justify-between
                    gap-4
                    px-4 md:px-5
                    py-3.5
                    bg-slate-50/60
                    hover:bg-slate-50
                    transition-colors
                    duration-200
                    ${isExpandedOhw ? "border-b border-slate-200" : ""}
                  `}
                >
                  <h2
                    className="
                      text-[#0d3b66]
                      text-sm md:text-[15px]
                      font-medium
                      tracking-normal
                      whitespace-nowrap
                    "
                  >
                    Overhead Wire (OHW) Specifications
                  </h2>

                  {/* Expand / collapse icon */}
                  <span
                    className="
                      flex
                      h-8 w-8
                      sm:h-9 sm:w-9
                      shrink-0
                      items-center justify-center
                      rounded-full

                      text-slate-400

                      group-hover:text-[#0d3b66]
                      group-hover:bg-blue-50

                      transition-colors
                      duration-200
                    "
                  >
                    <ChevronDown
                      className={`
                        w-4 h-4
                        sm:w-[20px] sm:h-[20px]
                        transition-transform
                        duration-300
                        ${isExpandedOhw ? "rotate-180" : ""}
                      `}
                    />
                  </span>
                </button>

                {/* Expandable content */}
                <div
                  className={`
                    grid
                    transition-[grid-template-rows]
                    duration-300
                    ease-in-out
                    ${isExpandedOhw ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                  `}
                >
                  <div className="min-h-0 overflow-hidden">
                    <OverheadWireForm
                      overheadWires={ohwForm.overheadWires}
                      wireCountInput={ohwForm.ohwInputValue}
                      setWireCountInput={ohwForm.setOhwInputValue}
                      onUpdate={ohwForm.updateOhw}
                      errors={ohwForm.ohwErrors}
                      onAddOhw={ohwForm.addOhwByInput}
                      onCopyOhw={ohwForm.copyOhw}
                      onPasteOhw={ohwForm.pasteOhw}
                      hasClipboard={Boolean(ohwForm.ohwClipboard)}
                      setConfirmDeleteOhw={ohwForm.setConfirmDeleteOhw}
                      resetCurrentOhw={ohwForm.resetOhw}
                      handleAddOhw={ohwForm.addOhw}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Arm & Arm Objects ── */}
          {projectType !== "disaster-prevention-project" && isCustomMode && (
            <>
              <div
                className="
                  bg-white
                  mt-6 md:mt-8
                  rounded-2xl hp:rounded-xl
                  border border-slate-200
                  shadow-[0_2px_10px_rgba(15,23,42,0.06)]
                  overflow-hidden
                "
              >
                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]"
                />

                {/* Expand / collapse header */}
                <button
                  type="button"
                  onClick={() => setIsExpandedArm((prev) => !prev)}
                  aria-expanded={isExpandedArm}
                  className={`
                    group
                    w-full
                    flex items-center justify-between
                    gap-4
                    px-4 md:px-5
                    py-3.5
                    bg-slate-50/60
                    hover:bg-slate-50
                    transition-colors
                    duration-200
                    ${isExpandedArm ? "border-b border-slate-200" : ""}
                  `}
                >
                  <h2
                    className="
                      text-[#0d3b66]
                      text-sm md:text-[15px]
                      font-medium
                      tracking-normal
                      whitespace-nowrap
                    "
                  >
                    Arm & Object Specifications
                  </h2>

                  {/* Expand / collapse icon */}
                  <span
                    className="
                      flex
                      h-8 w-8
                      sm:h-9 sm:w-9
                      shrink-0
                      items-center justify-center
                      rounded-full

                      text-slate-400

                      group-hover:text-[#0d3b66]
                      group-hover:bg-blue-50

                      transition-colors
                      duration-200
                    "
                  >
                    <ChevronDown
                      className={`
                        w-4 h-4
                        sm:w-[20px] sm:h-[20px]
                        transition-transform
                        duration-300
                        ${isExpandedArm ? "rotate-180" : ""}
                      `}
                    />
                  </span>
                </button>

                {/* Expandable content */}
                <div
                  className={`
                    grid
                    transition-[grid-template-rows]
                    duration-300
                    ease-in-out
                    ${isExpandedArm ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                  `}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="px-6 pt-6 hp:p-4">
                      <div className="flex items-center justify-between mb-6 xl:mb-4 hp:items-start hp:flex-col hp:gap-6 hp:mb-6">
                        <h3 className="text-[#0d3b66] flex items-center gap-2 text-xs md:text-sm font-medium hp:text-xs hp:gap-1">
                          <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
                          <span className="font-semibold">
                            Configure up to 6 Arms
                          </span>
                          <span className="font-medium hp:hidden">
                            {" "}
                            with detailed specifications
                          </span>
                        </h3>
                        <button
                          onClick={armForm.addArm}
                          disabled={armForm.arms.length >= 6}
                          className={`flex justify-center items-center gap-2 p-2.5 sm:px-4 sm:py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md font-medium shadow-sm text-sm hp:text-xs hp:px-4 hp:self-center transition-all
                          ${
                            armForm.arms.length >= 6
                              ? "bg-gray-300 text-black opacity-40"
                              : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:scale-105"
                          }`}
                        >
                          <Plus className="w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5" />
                          Add Arm
                        </button>
                      </div>

                      {/* Arm tabs */}
                      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-1 xl:gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide">
                        {armForm.arms.map((arm, index) => {
                          const isActive = armForm.activeTabArm === arm.idArm;
                          return (
                            <button
                              key={arm.idArm}
                              onClick={() => armForm.setActiveTabArm(arm.idArm)}
                              className={`flex items-center gap-2 px-5 xl:px-6 py-2 rounded-lg border-[1.5px] text-sm 
                                font-medium transition-all
                                hp:px-3 hp:py-1.5 hp:text-xs hp:rounded-md
                                ${
                                  isActive
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-300"
                                }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors
                                ${isActive ? "bg-blue-500" : "bg-gray-300"}`}
                              />
                              <span className="hp:hidden">Arm {index + 1}</span>
                              <span className="hidden hp:inline">
                                {index + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-5 border-t border-gray-200" />
                    </div>

                    {/* Active arm input */}
                    {armForm.activeArm && (
                      <div className="p-6 hp:px-4 hp:pt-0 hp:pb-4">
                        <div className="space-y-6 hp:space-y-4">
                          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 hp:flex-col hp:items-start hp:gap-3 hp:mb-4 hp:pb-4">
                            <div className="flex items-center gap-2 hp:gap-1">
                              {/* Accent bar */}
                              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#3399cc] to-[#3399cc] flex-shrink-0 hp:hidden" />

                              <h4 className="text-[#0d3b66] text-sm font-semibold hp:text-xs">
                                Arm {armForm.currentIndex + 1}
                                {armForm.activeArm.name &&
                                  ` : ${armForm.activeArm.name}`}
                              </h4>
                            </div>

                            {armForm.arms.length > 0 && (
                              <>
                                {/* ACTION BUTTONS (DESKTOP) */}
                                <div className="flex items-center gap-3 hp:hidden">
                                  <div className="flex items-center gap-2 ml-2">
                                    <button
                                      onClick={() =>
                                        armForm.copyArm(armForm.activeArm)
                                      }
                                      title="Copy this Arm Spec"
                                      className="flex justify-center items-center w-9 h-9 lg:w-10 lg:h-10 rounded-md sm:rounded-lg border bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                    >
                                      <Copy className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        armForm.pasteArm(
                                          armForm.activeArm.idArm,
                                        )
                                      }
                                      disabled={!armForm.armClipboard}
                                      title={
                                        armForm.armClipboard
                                          ? "Paste copied Arm Spec"
                                          : "No copied Arm Spec"
                                      }
                                      className={`flex justify-center items-center w-9 h-9 lg:w-10 lg:h-10 rounded-md sm:rounded-lg border transition ${
                                        armForm.armClipboard
                                          ? "bg-green-50 text-green-600 hover:bg-green-100"
                                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      }`}
                                    >
                                      <ClipboardPaste className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                                    </button>
                                  </div>

                                  {/* DIVIDER */}
                                  <div className="h-8 w-px bg-gray-300 opacity-70" />

                                  {/* RESET BUTTON */}
                                  <button
                                    onClick={armForm.resetArm}
                                    className="flex justify-center items-center gap-2 px-4 py-2 md:px-5 lg:py-2.5 rounded-lg text-sm font-medium bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-300 transition-colors"
                                  >
                                    <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                                    Reset
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      armForm.setConfirmDeleteArm(
                                        armForm.activeArm.idArm,
                                      );
                                    }}
                                    className="flex justify-center items-center gap-2 px-4 py-2 md:px-5 lg:py-2.5 rounded-lg text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 ring-1 ring-inset ring-red-200 hover:ring-red-300 shadow-sm transition-all"
                                  >
                                    <Trash2 className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                                    Delete Arm
                                  </button>
                                </div>

                                {/* ACTION BUTTONS (MOBILE / hp) */}
                                <div className="hidden hp:flex items-center justify-between gap-2 w-full">
                                  {/* LEFT: COPY & PASTE */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        armForm.copyArm(armForm.activeArm)
                                      }
                                      title="Copy this Arm Spec"
                                      className="w-[34px] h-[34px] flex-shrink-0 rounded-md border bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() =>
                                        armForm.pasteArm(
                                          armForm.activeArm.idArm,
                                        )
                                      }
                                      disabled={!armForm.armClipboard}
                                      title={
                                        armForm.armClipboard
                                          ? "Paste copied Arm Spec"
                                          : "No copied Arm Spec"
                                      }
                                      className={`w-[34px] h-[34px] flex-shrink-0 rounded-md border transition flex items-center justify-center ${
                                        armForm.armClipboard
                                          ? "bg-green-50 text-green-600 hover:bg-green-100"
                                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      }`}
                                    >
                                      <ClipboardPaste className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* RIGHT: RESET & DELETE */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={armForm.resetArm}
                                      title="Reset"
                                      className="w-[34px] h-[34px] flex-shrink-0 rounded-md border border-red-300 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        armForm.setConfirmDeleteArm(
                                          armForm.activeArm.idArm,
                                        );
                                      }}
                                      title="Delete"
                                      className="w-[34px] h-[34px] flex-shrink-0 rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition flex items-center justify-center"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <ArmForm
                            arm={armForm.activeArm}
                            onUpdate={(updates) =>
                              armForm.updateArm(armForm.activeTabArm, updates)
                            }
                            armError={
                              armForm.armsErrors[armForm.activeTabArm] || {}
                            }
                          />

                          <ArmObjectForm
                            armObjects={
                              Array.isArray(armForm.activeArm.armObjects)
                                ? armForm.activeArm.armObjects
                                : []
                            }
                            aoCountInput={armForm.aoInputValue}
                            setAoCountInput={armForm.setAoInputValue}
                            onUpdate={armForm.updateAo}
                            errors={armForm.aoErrors}
                            onAddAo={armForm.addAoByInput}
                            onCopyAo={armForm.copyAo}
                            onPasteAo={armForm.pasteAo}
                            hasClipboard={Boolean(armForm.aoClipboard)}
                            setConfirmDeleteAo={armForm.setConfirmDeleteAo}
                            resetCurrentAo={armForm.resetAo}
                            handleAddAo={armForm.addAo}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 hp:mt-5 hp:pt-4">
                          <button
                            onClick={armForm.goToPrevArm}
                            disabled={armForm.isBackDisabledArm}
                            className={`flex justify-center items-center gap-2 text-sm px-3.5 py-2.5 sm:px-4 sm:py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md ring-1 ring-inset font-medium transition-colors
                            ${
                              armForm.isBackDisabledArm
                                ? "bg-gray-100 text-gray-400 ring-gray-200 cursor-not-allowed"
                                : "bg-[#eef2f6] text-[#0d3b66] ring-[#d0d7e2] hover:bg-[#e2e8f0] hover:ring-[#b8c2d1]"
                            }`}
                          >
                            <ChevronLeft className="w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5" />
                            <span className="hp:hidden">Back</span>
                          </button>

                          <button
                            onClick={armForm.goToNextArm}
                            disabled={armForm.isNextDisabledArm}
                            className={`flex justify-center items-center gap-2 text-sm px-3.5 py-2.5 sm:px-4 sm:py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md font-medium transition-all
                            ${
                              armForm.isNextDisabledArm
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110"
                            }`}
                          >
                            <span className="hp:hidden">Next Arm</span>
                            <ChevronRight className="w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Calculate / Finish footer ── */}
          <div className="flex items-center justify-between p-5 mt-12 mb-20 bg-gradient-to-b from-white to-slate-50 rounded-2xl hp:rounded-xl border border-gray-200 shadow-sm hp:gap-2">
            {/* Back => returns to Initial Input step */}
            <button
              onClick={() =>
                navigate(
                  `/calculation/${projectType}/${draftId}/calculation-condition`,
                )
              }
              className="flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 hp:px-3 hp:py-2 md:px-6
              rounded-lg hp:rounded-md font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] text-sm
              ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 md:w-5 h-4 md:h-5 hp:w-4 hp:h-4" />
              <span className="hp:hidden">Back</span>
            </button>

            <div className="flex items-center gap-3 hp:gap-0">
              {/* Calculate button — steps aside to the secondary style
                  once calculated, so Next/Finish reads as the thing to do
                  now. Stays fully clickable either way (e.g. to
                  recalculate on purpose without editing anything). */}
              <button
                onClick={calculation.calculate}
                className={`flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 hp:px-4 hp:py-2 md:px-6
                rounded-lg hp:rounded-md font-medium text-sm transition-all
                ${
                  calculation.isCalculated
                    ? "bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm"
                    : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm"
                }`}
              >
                <Calculator className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                <span className="hp:text-[11px] whitespace-nowrap">
                  Calculate Results
                </span>
              </button>

              {/* Next/Finish button — becomes the primary button once
                  calculated (mirrors Calculate stepping aside above),
                  regardless of whether this is a mid-flow "Next" or the
                  final step's label. */}
              <button
                onClick={handleFinish}
                aria-disabled={!calculation.isCalculated}
                title={
                  !calculation.isCalculated
                    ? 'Click "Calculate Results" first'
                    : calculation.buttonLabel
                }
                className={`flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 hp:px-3 hp:py-2 md:px-6
                rounded-lg hp:rounded-md font-medium transition-all text-sm
                ${
                  !calculation.isCalculated
                    ? "bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-200 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm"
                }`}
              >
                <span className="hp:hidden">{calculation.buttonLabel}</span>
                <ChevronRight className="w-4 md:w-5 h-4 md:h-5 hp:w-4 hp:h-4" />
              </button>
            </div>
          </div>

          {/* Results table */}
          <div id="results-pole">
            {calculation.showResults && (
              <ResultsTableView
                results={calculation.results}
                resultsDo={calculation.resultsDo}
                resultsOhw={calculation.resultsOhw}
                resultsArm={calculation.resultsArm}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      <FinishCalculationModal
        open={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onSaveDraft={handleSaveDraft}
        onSaveDatabase={handleSaveDatabaseClick}
        onGenerateReport={() => {
          setShowFinishModal(false);
          setShowCoverModal(true);
        }}
      />
      <ConfirmSaveDatabaseModal
        open={showDbModal}
        onClose={() => setShowDbModal(false)}
        onConfirm={handleConfirmSaveDb}
      />
      <ToastModal
        toast={calculation.toast}
        onClose={() => calculation.setToast(null)}
      />

      {/* ── Delete/Reduce modals ── */}
      <ConfirmDeleteModal
        open={poleForm.confirmDelete}
        onClose={() => poleForm.setConfirmDelete?.(null)}
        onConfirm={() => poleForm.removePole(poleForm.confirmDelete)}
        itemName="pole"
      />
      <ConfirmDeleteModal
        open={doForm.confirmDeleteDo}
        onClose={() => doForm.setConfirmDeleteDo(null)}
        onConfirm={() => doForm.removeDo(doForm.confirmDeleteDo)}
        itemName="object"
      />
      <ConfirmReduceModal
        open={doForm.confirmReduceDo}
        onClose={doForm.cancelReduce}
        onConfirm={doForm.confirmReduce}
        itemName="direct objects"
      />
      <ConfirmDeleteModal
        open={ohwForm.confirmDeleteOhw}
        onClose={() => ohwForm.setConfirmDeleteOhw(null)}
        onConfirm={() => ohwForm.removeOhw(ohwForm.confirmDeleteOhw)}
        itemName="overhead wire"
      />
      <ConfirmReduceModal
        open={ohwForm.confirmReduceOhw}
        onClose={ohwForm.cancelReduce}
        onConfirm={ohwForm.confirmReduce}
        itemName="overhead wires"
      />
      <ConfirmDeleteModal
        open={armForm.confirmDeleteArm}
        onClose={() => armForm.setConfirmDeleteArm(null)}
        onConfirm={() => armForm.removeArm(armForm.confirmDeleteArm)}
        itemName="arm"
      />
      <ConfirmDeleteModal
        open={armForm.confirmDeleteAo}
        onClose={() => armForm.setConfirmDeleteAo(null)}
        onConfirm={() => armForm.removeAo(armForm.confirmDeleteAo)}
        itemName="object"
      />
      <ConfirmReduceModal
        open={armForm.confirmReduceAo}
        onClose={armForm.cancelReduceArmObjects}
        onConfirm={armForm.confirmReduceArmObjects}
        itemName="arm objects"
      />

      <CoverFormModal
        open={showCoverModal}
        onClose={() => {
          setShowCoverModal(false);
          setShowFinishModal(true);
        }}
        projectType={projectType}
        draftId={draftId}
        onConfirm={handleConfirmCover}
      />
    </div>
  );
}
