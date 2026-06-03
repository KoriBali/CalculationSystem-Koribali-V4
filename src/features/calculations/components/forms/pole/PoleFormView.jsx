import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
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
import { CoverFormModal } from "../../modals/CoverFormModal";
import { ConfirmDeleteModal } from "../../modals/ConfirmDeleteModal";
import { ConfirmReduceModal } from "../../modals/ConfirmReduceModal";
import { usePoleForm } from "../../../hooks/usePoleForm";
import { useDirectObjectForm } from "../../../hooks/useDirectObjectForm";
import { useOverheadWireForm } from "../../../hooks/useOverheadWireForm";
import { useArmForm } from "../../../hooks/useArmForm";
import { usePoleStandardForm } from "../../../hooks/usePoleStandardForm";
import { usePoleConfigForm } from "../../../hooks/usePoleConfigForm";
import { useCoverForm } from "../../../hooks/useCoverForm";
import { usePoleCalculation } from "../../../hooks/usePoleCalculation";

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function PoleFormView() {
  const { type: projectType } = useParams();

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

  // ── UI-only accordion state — lives in page, not in hooks ──
  const [isExpandedPole, setIsExpandedPole] = useState(true);
  const [isExpandedDo, setIsExpandedDo] = useState(true);
  const [isExpandedOhw, setIsExpandedOhw] = useState(true);
  const [isExpandedArm, setIsExpandedArm] = useState(true);

  // ── Hooks ──
  const poleForm = usePoleForm(projectType);
  const doForm = useDirectObjectForm(projectType);
  const ohwForm = useOverheadWireForm(projectType);
  const armForm = useArmForm(projectType);
  const poleStandardForm = usePoleStandardForm(projectType);
  const poleConfigForm = usePoleConfigForm(projectType);
  const coverForm = useCoverForm(projectType); // cover info only

  const calculation = usePoleCalculation({
    poleForm,
    directObjectForm: doForm,
    ohwForm,
    armForm,
    poleStandardForm,
    poleConfigForm,
    coverForm,
  });

  // Opens cover modal if last step, otherwise navigates to next
  const handleFinish = () => {
    const result = calculation.finish();
    if (result === "OPEN_COVER") coverForm.openCoverPopup();
  };

  // custom mode — non lighting-pole always custom, lighting-pole only if poleType === custom
  const isCustomMode =
    projectType !== "lighting-pole" || condition.poleType === "custom";

  return (
    <div className="flex flex-col h-full">
      <Helmet>
        <title>Calculation Pole - KORI BALI</title>
        <meta name="calculation" content="Calculation System CV. KORI BALI" />
      </Helmet>

      <div className="flex-1 rounded-t-2xl hp:rounded-xl bg-gray-50 border border-gray-250">
        <HeaderCalculationPage />

        <div className="mx-6 2040:mx-[250px] pt-1 pb-8 hp:mx-2">
          {/* ── Pole Specifications ── */}
          <div
            className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out
            ${isExpandedPole ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
            onClick={() => setIsExpandedPole(!isExpandedPole)}
          >
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
              <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                Pole Specifications
              </h2>
            </div>

            <div
              className="
                  flex h-8 w-8
                  sm:h-9 sm:w-9
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-white/15
                  text-white
                  border border-white/20
                  transition
                  group-hover:bg-white/20
                  group-active:bg-white/25
                "
            >
              {isExpandedPole ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden
          ${
            isExpandedPole
              ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl"
              : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
          }`}
          >
            <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
              {/* Standard mode — lighting-pole only */}
              {projectType === "lighting-pole" &&
                condition.poleType === "standard" && (
                  <>
                    <div className="pt-6 hp:pt-4" />
                    <PoleTypeSelector
                      poleTypeStandard={poleStandardForm.poleTypeStandard}
                      onUpdate={poleStandardForm.updatePoleTypeStandard}
                    />
                    {poleStandardForm.poleTypeStandard.type === "taper" && (
                      <TaperPoleStandardForm
                        taperPoleStandard={poleStandardForm.taperPoleStandard}
                        onUpdate={poleStandardForm.updateTaperPoleStandard}
                      />
                    )}
                    {poleStandardForm.poleTypeStandard.type === "straight" && (
                      <StraightPoleStandardForm
                        straightPoleStandard={
                          poleStandardForm.straightPoleStandard
                        }
                        onUpdate={poleStandardForm.updateStraightPoleStandard}
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

                  {/* Pole tabs */}
                  <div className="px-6 pt-6 hp:p-4">
                    <div className="flex items-center justify-between mb-6 xl:mb-4 hp:items-start hp:flex-col hp:gap-6 hp:mb-6">
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
                      <button
                        onClick={poleForm.addPole}
                        disabled={poleForm.poles.length >= 6}
                        className={`flex justify-center items-center gap-2 p-2.5 sm:px-4 sm:py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md font-medium shadow-sm text-sm hp:text-xs hp:px-4 hp:self-center transition-all
                        ${
                          poleForm.poles.length >= 6
                            ? "bg-gray-300 text-black opacity-40"
                            : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:scale-105"
                        }`}
                      >
                        <Plus className="w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5" />
                        Add Step
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-1 xl:gap-2 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide">
                      {poleForm.poles.map((pole, index) => {
                        const isActive = poleForm.activeTab === pole.id;
                        return (
                          <button
                            key={pole.id}
                            onClick={() => poleForm.setActiveTab(pole.id)}
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
                            <span className="hp:hidden">Step {index + 1}</span>
                            <span className="hidden hp:inline">
                              {index + 1}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-5 border-t border-gray-200" />
                  </div>

                  {/* Active pole input */}
                  {poleForm.activePole && (
                    <div className="p-6 hp:px-4 hp:pt-0 hp:pb-4">
                      <div className="space-y-6 hp:space-y-4">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 hp:mb-4 hp:pb-4">
                          <div className="flex items-center gap-3 hp:gap-2">
                            <div>
                              <h4 className="text-[#0d3b66] text-sm font-semibold hp:text-xs">
                                Step Pole {poleForm.activeIndex + 1}
                                {poleForm.activePole.name &&
                                  ` : ${poleForm.activePole.name}`}
                              </h4>
                              <p className="text-xs text-gray-500 hp:text-[10px]">
                                {poleForm.activePole.type} Type
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 sm:gap-3 justify-end itmes-center">
                            {/* Reset */}
                            <button
                              onClick={poleForm.resetActivePole}
                              className="flex justify-center items-center gap-2 p-2.5 sm:px-4 sm:py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] 
                              text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
                            >
                              <RotateCcw className="w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5" />
                              <span className="hidden sm:block text-sm">
                                Reset
                              </span>
                            </button>

                            {poleForm.poles.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  poleForm.setConfirmDelete?.(
                                    poleForm.activePole.id,
                                  );
                                }}
                                className="flex justify-center items-center gap-2 p-2.5 sm:px-4 sm:py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md font-medium bg-red-50 hover:bg-red-100
                                text-red-600 ring-1 ring-inset ring-red-200 hover:ring-red-300 shadow-sm transition-all"
                              >
                                <Trash2 className="w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5" />
                                <span className="hidden sm:block text-sm">
                                  Delete Step
                                </span>
                              </button>
                            )}
                          </div>
                        </div>

                        <PoleForm
                          pole={poleForm.activePole}
                          onUpdate={(updates) =>
                            poleForm.updatePole(poleForm.activeTab, updates)
                          }
                          errors={poleForm.poleErrors[poleForm.activeTab] || {}}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 hp:mt-5 hp:pt-4">
                        <button
                          onClick={poleForm.goToPrev}
                          disabled={poleForm.isBackDisabled}
                          className={`flex justify-center items-center gap-2 text-sm px-3.5 py-2.5 sm:px-4 sm:py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md ring-1 ring-inset font-medium transition-colors
                            ${
                              poleForm.isBackDisabled
                                ? "bg-gray-100 text-gray-400 ring-gray-200 cursor-not-allowed"
                                : "bg-[#eef2f6] text-[#0d3b66] ring-[#d0d7e2] hover:bg-[#e2e8f0] hover:ring-[#b8c2d1]"
                            }`}
                        >
                          <ChevronLeft className="w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5" />
                          <span className="hp:hidden">Back</span>
                        </button>

                        <button
                          onClick={poleForm.goToNext}
                          disabled={poleForm.isNextDisabled}
                          className={`flex justify-center items-center gap-2 text-sm px-3.5 py-2.5 sm:px-4 sm:py-2 md:px-5 lg:py-2.5 rounded-lg hp:rounded-md font-medium transition-all
                            ${
                              poleForm.isNextDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110"
                            }`}
                        >
                          <span className="hp:hidden">Next Step</span>
                          <ChevronRight className="w-3.5 sm:w-4 lg:w-4.5 h-3.5 sm:h-4 lg:h-4.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Direct Object ── */}
          {isCustomMode && (
            <>
              <div
                className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-16 md:mt-20 transition-all duration-500 ease-in-out
                ${isExpandedDo ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
                onClick={() => setIsExpandedDo(!isExpandedDo)}
              >
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                  <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                    Direct Object
                  </h2>
                </div>
                <div
                  className="
                  flex h-8 w-8
                  sm:h-9 sm:w-9
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-white/15
                  text-white
                  border border-white/20
                  transition
                  group-hover:bg-white/20
                  group-active:bg-white/25
                "
                >
                  {isExpandedDo ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
              </div>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden
              ${isExpandedDo ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl" : "max-h-0 rounded-b-2xl hp:rounded-b-xl"}`}
              >
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
            </>
          )}

          {/* ── Overhead Wire ── */}
          {isCustomMode && (
            <>
              <div
                className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-16 md:mt-20 transition-all duration-500 ease-in-out
                ${isExpandedOhw ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
                onClick={() => setIsExpandedOhw(!isExpandedOhw)}
              >
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                  <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                    Overhead Wire
                  </h2>
                </div>
                <div
                  className="
                  flex h-8 w-8
                  sm:h-9 sm:w-9
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-white/15
                  text-white
                  border border-white/20
                  transition
                  group-hover:bg-white/20
                  group-active:bg-white/25
                "
                >
                  {isExpandedOhw ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
              </div>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden
              ${isExpandedOhw ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl" : "max-h-0 rounded-b-2xl hp:rounded-b-xl"}`}
              >
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
            </>
          )}

          {/* ── Arm & Arm Objects ── */}
          {projectType !== "acemast" && isCustomMode && (
            <>
              <div
                className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-16 md:mt-20 transition-all duration-500 ease-in-out
                ${isExpandedArm ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
                onClick={() => setIsExpandedArm(!isExpandedArm)}
              >
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                  <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                    Arm and Object Specifications
                  </h2>
                </div>
                <div
                  className="
                  flex h-8 w-8
                  sm:h-9 sm:w-9
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-white/15
                  text-white
                  border border-white/20
                  transition
                  group-hover:bg-white/20
                  group-active:bg-white/25
                "
                >
                  {isExpandedArm ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
              </div>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden
              ${isExpandedArm ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl" : "max-h-0 rounded-b-2xl hp:rounded-b-xl"}`}
              >
                <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
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
                                      armForm.pasteArm(armForm.activeArm.idArm)
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
                                  className="flex justify-center items-center gap-2 px-4 py-2 md:px-5 lg:py-2.5 rounded-lg text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
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
                                      armForm.pasteArm(armForm.activeArm.idArm)
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
                                    className="w-[34px] h-[34px] flex-shrink-0 rounded-md border bg-[#eef2f6] text-[#0d3b66] hover:bg-[#e2e8f0] transition flex items-center justify-center"
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
            </>
          )}

          {/* ── Calculate / Finish footer ── */}
          <div className="flex items-center justify-between p-5 mt-12 mb-20 bg-gradient-to-b from-white to-slate-50 rounded-2xl hp:rounded-xl border border-gray-200 shadow-sm">
            <div className="w-[120px] hidden sm:inline" />

            <button
              onClick={calculation.calculate}
              className="flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 md:px-6 
              rounded-lg hp:rounded-md font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white text-sm hp:text-xs hover:brightness-110 shadow-sm transition-all"
            >
              <Calculator className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
              Calculate Result
            </button>

            <button
              onClick={handleFinish}
              disabled={!calculation.isCalculated}
              className={`flex justify-center items-center gap-2 px-5 py-2.5 sm:py-2 lg:py-2.5 md:px-6 
              rounded-lg hp:rounded-md font-medium transition-all text-sm hp:text-xs
              ${
                !calculation.isCalculated
                  ? "bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-200 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm"
              }`}
            >
              {calculation.buttonLabel}
              <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            </button>
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

      {/* ── Cover modal ── */}
      <CoverFormModal
        open={coverForm.showCoverPopup}
        onClose={coverForm.closeCoverPopup}
        cover={coverForm.coverData}
        onUpdateCover={coverForm.updateCover}
        coverErrors={coverForm.coverErrors}
        onMakeReport={calculation.makeReport}
      />

      {/* ── Toast ── */}
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
    </div>
  );
}
