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
    <div className="min-h-screen">
      <Helmet>
        <title>Calculation Pole - KORI BALI</title>
        <meta name="calculation" content="Calculation System CV. KORI BALI" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 border border-gray-250">
        <HeaderCalculationPage />
        <div className="mx-6 2040:mx-[250px] pt-1 pb-8 hp:mx-2">
          {/* ── Pole Specifications ── */}
          <div
            className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out hp:px-4 hp:py-3
            ${isExpandedPole ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
            onClick={() => setIsExpandedPole(!isExpandedPole)}
          >
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
              <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                Pole Specifications
              </h2>
            </div>
            <div className="p-2">
              {isExpandedPole ? (
                <ChevronUp className="w-5 h-5 text-white hp:w-4 hp:h-4" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white hp:w-4 hp:h-4" />
              )}
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden
          ${isExpandedPole ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl" : "max-h-0 rounded-b-2xl hp:rounded-b-xl"}`}
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
                      <h2 className="text-[#0d3b66] font-medium flex items-center text-sm gap-2 hp:text-xs">
                        <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
                        Structural Design
                      </h2>
                    </div>
                    <PoleConfigForm
                      poleConfig={poleConfigForm.poleConfig}
                      onUpdate={poleConfigForm.updatePoleConfig}
                      errors={poleConfigForm.poleConfigErrors}
                    />
                  </div>

                  {/* Pole tabs */}
                  <div className="px-6 pt-6 hp:p-4">
                    <div className="flex items-center justify-between mb-4 hp:items-start hp:flex-col hp:gap-6 hp:mb-6">
                      <h2 className="text-[#0d3b66] text-sm flex items-center gap-1 hp:text-xs">
                        <div className="w-1 h-5 bg-[#3399cc] rounded-full mr-1 hp:h-4" />
                        <span className="font-semibold">
                          Configure up to 6 Step Poles
                        </span>
                        <span className="font-medium hp:hidden">
                          {" "}
                          with detailed specifications
                        </span>
                      </h2>
                      <button
                        onClick={poleForm.addPole}
                        disabled={poleForm.poles.length >= 6}
                        className={`flex items-center gap-2 text-sm px-7 py-3 rounded-lg font-medium transition-all shadow-md hp:text-xs hp:px-[22px] hp:py-[10px] hp:self-center
                        ${
                          poleForm.poles.length >= 6
                            ? "bg-gray-300 text-black opacity-40 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:shadow-xl hover:scale-105"
                        }`}
                      >
                        <Plus className="w-5 h-5 hp:w-4 hp:h-4" />
                        Add Step
                      </button>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap pb-2 hp:gap-2 hp:px-2 scroll-smooth scrollbar-hide">
                      {poleForm.poles.map((pole, index) => {
                        const isActive = poleForm.activeTab === pole.id;
                        return (
                          <div key={pole.id} className="flex-shrink-0">
                            <button
                              onClick={() => poleForm.setActiveTab(pole.id)}
                              className={`flex items-center gap-2 px-5 py-2 rounded-lg border-[1.5px] text-sm font-medium transition-all hp:px-4 hp:py-1.5 hp:text-xs
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
                              <span className="hp:hidden">
                                Step {index + 1}
                              </span>
                              <span className="hidden hp:inline">
                                {index + 1}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-5 border-t border-gray-200" />
                  </div>

                  {/* Active pole input */}
                  {poleForm.activePole && (
                    <div className="p-6 hp:px-4 hp:pt-2 hp:pb-4">
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

                          {poleForm.poles.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                poleForm.setConfirmDelete?.(
                                  poleForm.activePole.id,
                                );
                              }}
                              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all font-medium shadow-sm hp:px-[11px] hp:py-[8px]"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-xs hp:hidden">
                                Delete Step
                              </span>
                            </button>
                          )}
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
                          onClick={poleForm.resetActivePole}
                          className="flex items-center text-sm gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66] border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs hp:px-[22px] hp:py-[8px]"
                        >
                          <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
                          Reset
                        </button>

                        <div className="flex items-center gap-3 hp:gap-2">
                          <button
                            onClick={poleForm.goToPrev}
                            disabled={poleForm.isBackDisabled}
                            className={`flex items-center text-sm gap-2 px-7 py-2.5 rounded-lg font-medium border-2 transition-colors hp:text-xs hp:px-[22px] hp:py-[8px]
                            ${
                              poleForm.isBackDisabled
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-[#eef2f6] text-[#0d3b66] border-[#d0d7e2] hover:bg-[#e2e8f0]"
                            }`}
                          >
                            <ChevronLeft className="w-5 h-5 hp:w-4 hp:h-4" />
                            <span className="hp:hidden">Back</span>
                          </button>

                          <button
                            onClick={poleForm.goToNext}
                            disabled={poleForm.isNextDisabled}
                            className={`flex items-center text-sm gap-2 px-7 py-2.5 border-2 rounded-lg font-medium shadow-md transition-all hp:text-xs hp:px-[22px] hp:py-[8px]
                            ${
                              poleForm.isNextDisabled
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none"
                                : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110"
                            }`}
                          >
                            Next Step
                            <ChevronRight className="w-5 h-5 hp:w-4 hp:h-4" />
                          </button>
                        </div>
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
                className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-20 transition-all duration-500 ease-in-out hp:px-4 hp:py-3
                ${isExpandedDo ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
                onClick={() => setIsExpandedDo(!isExpandedDo)}
              >
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                  <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                    Direct Object
                  </h2>
                </div>
                <div className="p-2">
                  {isExpandedDo ? (
                    <ChevronUp className="w-5 h-5 text-white hp:w-4 hp:h-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white hp:w-4 hp:h-4" />
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
                className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-20 transition-all duration-500 ease-in-out hp:px-4 hp:py-3
                ${isExpandedOhw ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
                onClick={() => setIsExpandedOhw(!isExpandedOhw)}
              >
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                  <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                    Overhead Wire
                  </h2>
                </div>
                <div className="p-2">
                  {isExpandedOhw ? (
                    <ChevronUp className="w-5 h-5 text-white hp:w-4 hp:h-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white hp:w-4 hp:h-4" />
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
                className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-20 transition-all duration-500 ease-in-out hp:px-4 hp:py-3
                ${isExpandedArm ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
                onClick={() => setIsExpandedArm(!isExpandedArm)}
              >
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
                  <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
                    Arm and Object Specifications
                  </h2>
                </div>
                <div className="p-2">
                  {isExpandedArm ? (
                    <ChevronUp className="w-5 h-5 text-white hp:w-4 hp:h-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white hp:w-4 hp:h-4" />
                  )}
                </div>
              </div>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden
              ${isExpandedArm ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl" : "max-h-0 rounded-b-2xl hp:rounded-b-xl"}`}
              >
                <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
                  <div className="px-6 pt-6 hp:p-4">
                    <div className="flex items-center justify-between mb-4 hp:items-start hp:flex-col hp:gap-6 hp:mb-6">
                      <h2 className="text-[#0d3b66] text-sm flex items-center gap-1 hp:text-xs">
                        <div className="w-1 h-5 bg-[#3399cc] rounded-full mr-1 hp:h-4" />
                        <span className="font-semibold">
                          Configure up to 6 Arms
                        </span>
                        <span className="font-medium hp:hidden">
                          {" "}
                          with detailed specifications
                        </span>
                      </h2>
                      <button
                        onClick={armForm.addArm}
                        disabled={armForm.arms.length >= 6}
                        className={`flex items-center gap-2 text-sm px-7 py-3 rounded-lg font-medium transition-all shadow-md hp:text-xs hp:px-[22px] hp:py-[10px] hp:self-center
                        ${
                          armForm.arms.length >= 6
                            ? "bg-gray-300 text-black opacity-40 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:shadow-xl hover:scale-105"
                        }`}
                      >
                        <Plus className="w-5 h-5 hp:w-4 hp:h-4" />
                        Add Arm
                      </button>
                    </div>

                    {/* Arm tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 hp:gap-2 hp:px-2 scroll-smooth scrollbar-hide">
                      {armForm.arms.map((arm, index) => {
                        const isActive = armForm.activeTabArm === arm.idArm;
                        return (
                          <div key={arm.idArm} className="flex-shrink-0">
                            <button
                              onClick={() => armForm.setActiveTabArm(arm.idArm)}
                              className={`flex items-center gap-2 px-5 py-2 rounded-lg border-[1.5px] text-sm font-medium transition-all hp:px-4 hp:py-1.5 hp:text-xs
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
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-5 border-t border-gray-200" />
                  </div>

                  {/* Active arm input */}
                  {armForm.activeArm && (
                    <div className="p-6 hp:px-4 hp:pt-2 hp:pb-4">
                      <div className="space-y-6 hp:space-y-4">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 hp:mb-4 hp:pb-4">
                          <div className="flex items-center gap-3 hp:gap-2">
                            {/* Accent bar */}
                            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#3399cc] to-[#3399cc] flex-shrink-0 hp:h-7" />

                            <h4 className="text-[#0d3b66] text-sm font-semibold hp:text-xs">
                              Arm {armForm.currentIndex + 1}
                              {armForm.activeArm.nameArm &&
                                ` : ${armForm.activeArm.nameArm}`}
                            </h4>
                          </div>

                          {armForm.arms.length > 0 && (
                            <div className="flex items-center gap-6 hp:hidden">
                              <div className="flex items-center gap-2 ml-2">
                                <button
                                  onClick={() =>
                                    armForm.copyArm(armForm.activeArm)
                                  }
                                  title="Copy this Arm Spec"
                                  className="p-2 rounded-md border bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                >
                                  <Copy className="w-4 h-4" />
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
                                  className={`p-2 rounded-md border transition ${
                                    armForm.armClipboard
                                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  <ClipboardPaste className="w-4 h-4" />
                                </button>
                                <div className="h-8 w-px mx-4 bg-gray-300 opacity-70" />
                                <button
                                  onClick={armForm.resetArm}
                                  className="flex items-center gap-2 px-5 py-2 h-[40px] bg-[#eef2f6] text-[#0d3b66] border border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition text-xs font-medium"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  Reset
                                </button>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  armForm.setConfirmDeleteArm(
                                    armForm.activeArm.idArm,
                                  );
                                }}
                                className="flex items-center gap-2 px-4 py-2 h-[40px] rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition text-xs font-medium"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-xs hp:hidden">
                                  Delete Arm
                                </span>
                              </button>
                            </div>
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
                          className={`flex items-center text-sm gap-2 px-7 py-2.5 rounded-lg font-medium border-2 transition-colors hp:text-xs hp:px-[22px] hp:py-[8px]
                          ${
                            armForm.isBackDisabledArm
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-[#eef2f6] text-[#0d3b66] border-[#d0d7e2] hover:bg-[#e2e8f0]"
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5 hp:w-4 hp:h-4" />
                          <span className="hp:hidden">Back</span>
                        </button>

                        <button
                          onClick={armForm.goToNextArm}
                          disabled={armForm.isNextDisabledArm}
                          className={`flex items-center text-sm gap-2 px-7 py-2.5 border-2 rounded-lg font-medium shadow-md transition-all hp:text-xs hp:px-[22px] hp:py-[8px]
                          ${
                            armForm.isNextDisabledArm
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none"
                              : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110"
                          }`}
                        >
                          Next Arm
                          <ChevronRight className="w-5 h-5 hp:w-4 hp:h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Calculate / Finish footer ── */}
          <div className="flex items-center justify-between p-5 mt-12 mb-20 bg-gradient-to-b from-white to-slate-50 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-[120px]" />

            <button
              onClick={calculation.calculate}
              className="flex items-center gap-2 px-7 py-2.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white rounded-lg text-sm hover:brightness-110 transition-all shadow-sm font-medium hp:text-xs hp:px-[22px] hp:py-[10px]"
            >
              <Calculator className="w-5 h-5 hp:w-4 hp:h-4" />
              Calculate Results
            </button>

            <button
              onClick={handleFinish}
              disabled={!calculation.isCalculated}
              className={`flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-medium transition-all hp:text-xs hp:px-[22px] hp:py-[10px]
              ${
                !calculation.isCalculated
                  ? "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm"
              }`}
            >
              {calculation.buttonLabel}
              <ChevronRight className="w-5 h-5 hp:w-4 hp:h-4" />
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
