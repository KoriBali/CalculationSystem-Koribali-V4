// pages/steps/PoleStep.jsx
import { useState } from "react";
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
} from "lucide-react";

import { HeaderCalculationPage } from "../../components/layout/HeaderCalculationPage";
import { StructuralDesign } from "../../components/forms/pole/StructuralDesignInput";
import { PoleInput } from "../../components/forms/pole/PoleInput";
import { DirectObjectInput } from "../../components/forms/pole/DirectObjectInput";
import { OverheadWireInput } from "../../components/forms/pole/OverheadWireInput";
import { ArmInput } from "../../components/forms/pole/ArmInput";
import { ArmObjectInput } from "../../components/forms/pole/ArmObjectInput";
import { ResultsTable } from "../../components/tables/ResultsTable";
import { PoleTypeSelector } from "../../components/forms/pole/PoleTypeSelector";
import { PoleStandardForm } from "../../components/forms/pole/PoleStandardForm";
import { SteppedPoleForm } from "../../components/forms/pole/SteppedPoleForm";
import * as Modal from "../../components/modals";

import { usePoleSection } from "../../hooks/usePoleSection";
import { useDirectObject } from "../../hooks/useDirectObject";
import { useOverheadWire } from "../../hooks/useOverheadWire";
import { useArm } from "../../hooks/useArm";
import { usePoleStandard } from "../../hooks/usePoleStandard";
import { useCoverForm } from "../../hooks/useCoverForm";
import { usePoleCalculation } from "../../hooks/usePoleCalculation";
import { getCondition } from "../../utils/sessionStorage";

export default function PoleFormContainer() {
  const { type: projectType } = useParams();
  const condition = getCondition(projectType);

  // UI-only state — accordion toggles live in page not in hooks
  const [isExpandedPole, setIsExpandedPole] = useState(true);
  const [isExpandedDo, setIsExpandedDo] = useState(true);
  const [isExpandedOhw, setIsExpandedOhw] = useState(true);
  const [isExpandedArm, setIsExpandedArm] = useState(true);

  // ── Hooks ──
  const poleSection = usePoleSection(projectType);
  const directObject = useDirectObject(projectType);
  const ohw = useOverheadWire(projectType);
  const arm = useArm(projectType);
  const poleStandard = usePoleStandard(projectType);
  const cover = useCoverForm(projectType);

  const calculation = usePoleCalculation({
    poleSection,
    directObject,
    ohw,
    arm,
    cover,
    poleStandard,
  });

  const isCustomMode =
    projectType !== "lighting-pole" || condition.method === "custom";

  return (
    <div className="min-h-screen">
      <HeaderCalculationPage />

      <div className="mx-6 2040:mx-[250px] pt-1 pb-8 hp:mx-2">
        {/* ── Pole Specifications ── */}
        <CollapsibleSection
          title="Pole Specifications"
          isExpanded={isExpandedPole}
          onToggle={() => setIsExpandedPole(!isExpandedPole)}
        >
          <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
            {/* Standard mode — lighting-pole only */}
            {projectType === "lighting-pole" &&
              condition.method === "standard" && (
                <>
                  <div className="pt-6 hp:pt-4" />
                  <PoleTypeSelector
                    poleTypeStandard={poleStandard.poleType}
                    onUpdate={poleStandard.updatePoleType}
                  />
                  {poleStandard.poleType.poleShape === "taper" && (
                    <PoleStandardForm
                      poleStandard={poleStandard.taperPole}
                      onUpdate={poleStandard.updateTaperPole}
                    />
                  )}
                  {poleStandard.poleType.poleShape === "straight" && (
                    <SteppedPoleForm
                      steppedPole={poleStandard.steppedPole}
                      onUpdate={poleStandard.updateSteppedPole}
                      errors={poleStandard.steppedPoleErrors}
                      condition={condition}
                    />
                  )}
                </>
              )}

            {/* Custom mode */}
            {isCustomMode && (
              <>
                {/* Structural Design */}
                <div className="border-b border-gray-200 px-6 pt-6 pb-7 hp:px-4 hp:pt-4">
                  <h2 className="text-[#0d3b66] font-medium flex items-center text-sm gap-2 mb-4 hp:text-xs">
                    <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
                    Structural Design
                  </h2>
                  <StructuralDesign
                    poleConfig={cover.structuralDesign}
                    onUpdate={cover.updateStructuralDesign}
                    errors={cover.structuralDesignErrors}
                  />
                </div>

                {/* Poles */}
                <div className="px-6 pt-6 hp:p-4">
                  <div className="flex items-center justify-between mb-4 hp:flex-col hp:items-start hp:gap-6 hp:mb-6">
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
                      onClick={poleSection.addPole}
                      disabled={poleSection.poles.length >= 6}
                      className={`flex items-center gap-2 text-sm px-7 py-3 rounded-lg font-medium transition-all shadow-md hp:text-xs hp:px-[22px] hp:py-[10px] hp:self-center
                        ${
                          poleSection.poles.length >= 6
                            ? "bg-gray-300 text-black opacity-40 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:shadow-xl hover:scale-105"
                        }`}
                    >
                      <Plus className="w-5 h-5 hp:w-4 hp:h-4" />
                      Add Step
                    </button>
                  </div>

                  {/* Pole tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 scroll-smooth scrollbar-hide">
                    {poleSection.poles.map((pole, index) => {
                      const isComplete = poleSection.isPoleComplete(pole);
                      const isActive = poleSection.activeTab === pole.id;

                      return (
                        <div key={pole.id} className="flex-shrink-0">
                          <button
                            onClick={() => poleSection.setActiveTab(pole.id)}
                            className={`flex items-center gap-3 px-7 py-2.5 rounded-lg border-2 transition-all hp:px-4 hp:py-2 hp:border hp:shadow-none hp:gap-2
                              ${
                                isActive
                                  ? "bg-blue-50  border-blue-500  text-blue-700  hover:bg-blue-100  shadow-md"
                                  : isComplete
                                    ? "bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
                                    : "bg-gray-50  border-gray-300  text-gray-600  hover:bg-gray-100"
                              }`}
                          >
                            {isComplete ? (
                              <CheckCircle className="w-5 h-5 hp:w-4 hp:h-4" />
                            ) : (
                              <Circle className="w-5 h-5 hp:w-4 hp:h-4" />
                            )}
                            <span className="text-sm font-medium hp:text-xs">
                              <span className="hidden hp:inline">
                                {index + 1}
                              </span>
                              <span className="hp:hidden">
                                {isActive ? `Step ${index + 1}` : index + 1}
                              </span>
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 border-t border-gray-200" />
                </div>

                {/* Active pole input */}
                {poleSection.activePole && (
                  <div className="p-6 hp:px-4 hp:pt-2 hp:pb-4">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 hp:mb-4 hp:pb-4">
                      <div className="flex items-center gap-3 hp:gap-2">
                        <div className="w-9 h-9 text-sm rounded-lg bg-gradient-to-br from-[#0d3b66] to-[#3399cc] flex items-center justify-center text-white hp:w-8 hp:h-8">
                          {poleSection.poles.findIndex(
                            (p) => p.id === poleSection.activeTab,
                          ) + 1}
                        </div>
                        <div>
                          <h4 className="text-[#0d3b66] text-sm font-medium hp:text-xs">
                            Step Pole
                            {poleSection.activePole.name &&
                              ` : ${poleSection.activePole.name}`}
                          </h4>
                          <p className="text-xs text-gray-500 hp:text-[10px]">
                            {poleSection.activePole.poleType} Type
                          </p>
                        </div>
                      </div>

                      {poleSection.poles.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            poleSection.setConfirmDelete?.(
                              poleSection.activePole.id,
                            );
                          }}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all font-medium shadow-sm hp:px-[11px] hp:py-[8px]"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-xs hp:hidden">Delete Step</span>
                        </button>
                      )}
                    </div>

                    <PoleInput
                      pole={poleSection.activePole}
                      onUpdate={(updates) =>
                        poleSection.updatePole(poleSection.activeTab, updates)
                      }
                      errors={
                        poleSection.poleErrors[poleSection.activeTab] || {}
                      }
                    />

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 hp:mt-5 hp:pt-4">
                      <button
                        onClick={poleSection.resetActivePole}
                        className="flex items-center text-sm gap-2 px-7 py-2.5 bg-[#eef2f6] text-[#0d3b66] border-2 border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium hp:text-xs hp:px-[22px] hp:py-[8px]"
                      >
                        <RotateCcw className="w-5 h-5 hp:w-4 hp:h-4" />
                        Reset
                      </button>

                      <div className="flex items-center gap-3 hp:gap-2">
                        <button
                          onClick={poleSection.goToPrev}
                          disabled={poleSection.isBackDisabled}
                          className={`flex items-center text-sm gap-2 px-7 py-2.5 rounded-lg font-medium border-2 transition-colors hp:text-xs hp:px-[22px] hp:py-[8px]
                            ${
                              poleSection.isBackDisabled
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-[#eef2f6] text-[#0d3b66] border-[#d0d7e2] hover:bg-[#e2e8f0]"
                            }`}
                        >
                          <ChevronLeft className="w-5 h-5 hp:w-4 hp:h-4" />
                          <span className="hp:hidden">Back</span>
                        </button>

                        <button
                          onClick={poleSection.goToNext}
                          disabled={poleSection.isNextDisabled}
                          className={`flex items-center text-sm gap-2 px-7 py-2.5 border-2 rounded-lg font-medium shadow-md transition-all hp:text-xs hp:px-[22px] hp:py-[8px]
                            ${
                              poleSection.isNextDisabled
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
        </CollapsibleSection>

        {/* ── Direct Object ── */}
        {isCustomMode && (
          <CollapsibleSection
            title="Direct Object"
            isExpanded={isExpandedDo}
            onToggle={() => setIsExpandedDo(!isExpandedDo)}
            className="mt-20"
          >
            <DirectObjectInput
              directObjects={directObject.directObjects}
              doInputValue={directObject.doInputValue}
              setDoInputValue={directObject.setDoInputValue}
              onUpdate={directObject.updateDo}
              errors={directObject.doErrors}
              onAddDo={directObject.addDoByInput}
              onCopyDo={directObject.copyDo}
              onPasteDo={directObject.pasteDo}
              hasClipboard={Boolean(directObject.doClipboard)}
              setConfirmDeleteDo={directObject.setConfirmDeleteDo}
              resetCurrentDo={directObject.resetDo}
              handleAddDo={directObject.addDo}
            />
          </CollapsibleSection>
        )}

        {/* ── Overhead Wire ── */}
        {isCustomMode && (
          <CollapsibleSection
            title="Overhead Wire"
            isExpanded={isExpandedOhw}
            onToggle={() => setIsExpandedOhw(!isExpandedOhw)}
            className="mt-20"
          >
            <OverheadWireInput
              overheadWires={ohw.overheadWires}
              ohwInputValue={ohw.ohwInputValue}
              setOhwInputValue={ohw.setOhwInputValue}
              onUpdate={ohw.updateOhw}
              errors={ohw.ohwErrors}
              onAddOhw={ohw.addOhwByInput}
              onCopyOhw={ohw.copyOhw}
              onPasteOhw={ohw.pasteOhw}
              hasClipboard={Boolean(ohw.ohwClipboard)}
              setConfirmDeleteOhw={ohw.setConfirmDeleteOhw}
              resetCurrentOhw={ohw.resetOhw}
              handleAddOhw={ohw.addOhw}
            />
          </CollapsibleSection>
        )}

        {/* ── Arm & Arm Objects ── */}
        {projectType !== "acemast" && isCustomMode && (
          <CollapsibleSection
            title="Arm and Object Specifications"
            isExpanded={isExpandedArm}
            onToggle={() => setIsExpandedArm(!isExpandedArm)}
            className="mt-20"
          >
            <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 hp:rounded-b-xl">
              <div className="px-6 pt-6 hp:p-4">
                <div className="flex items-center justify-between mb-4 hp:flex-col hp:items-start hp:gap-6 hp:mb-6">
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
                    onClick={arm.addArm}
                    disabled={arm.arms.length >= 6}
                    className={`flex items-center gap-2 text-sm px-7 py-3 rounded-lg font-medium transition-all shadow-md hp:text-xs hp:px-[22px] hp:py-[10px] hp:self-center
                      ${
                        arm.arms.length >= 6
                          ? "bg-gray-300 text-black opacity-40 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:shadow-xl hover:scale-105"
                      }`}
                  >
                    <Plus className="w-5 h-5 hp:w-4 hp:h-4" />
                    Add Arm
                  </button>
                </div>

                {/* Arm tabs */}
                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 scroll-smooth scrollbar-hide">
                  {arm.arms.map((a, index) => {
                    const isComplete = arm.isArmComplete(a);
                    const isActive = arm.activeTabArm === a.idArm;

                    return (
                      <div key={a.idArm} className="flex-shrink-0">
                        <button
                          onClick={() => arm.setActiveTabArm(a.idArm)}
                          className={`flex items-center gap-3 px-7 py-2.5 rounded-lg border-2 transition-all hp:px-4 hp:py-2 hp:border hp:shadow-none hp:gap-2
                            ${
                              isActive
                                ? "bg-blue-50  border-blue-500  text-blue-700  hover:bg-blue-100  shadow-md"
                                : isComplete
                                  ? "bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
                                  : "bg-gray-50  border-gray-300  text-gray-600  hover:bg-gray-100"
                            }`}
                        >
                          {isComplete ? (
                            <CheckCircle className="w-5 h-5 hp:w-4 hp:h-4" />
                          ) : (
                            <Circle className="w-5 h-5 hp:w-4 hp:h-4" />
                          )}
                          <span className="text-sm font-medium hp:text-xs">
                            <span className="hidden hp:inline">
                              {index + 1}
                            </span>
                            <span className="hp:hidden">
                              {isActive ? `Arm ${index + 1}` : index + 1}
                            </span>
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 border-t border-gray-200" />
              </div>

              {arm.activeArm && (
                <div className="p-6 hp:px-4 hp:pt-2 hp:pb-4">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 hp:mb-4 hp:pb-4">
                    <div className="flex items-center gap-3 hp:gap-2">
                      <div className="w-9 h-9 text-sm rounded-lg bg-gradient-to-br from-[#0d3b66] to-[#3399cc] flex items-center justify-center text-white hp:w-8 hp:h-8">
                        {arm.arms.findIndex(
                          (a) => a.idArm === arm.activeTabArm,
                        ) + 1}
                      </div>
                      <h4 className="text-[#0d3b66] text-sm font-medium hp:text-xs">
                        Arm
                        {arm.activeArm.nameArm && ` : ${arm.activeArm.nameArm}`}
                      </h4>
                    </div>

                    {arm.arms.length > 0 && (
                      <div className="flex items-center gap-6 hp:hidden">
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => arm.copyArm(arm.activeArm)}
                            className="p-2 rounded-md border bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => arm.pasteArm(arm.activeArm.idArm)}
                            disabled={!arm.armClipboard}
                            className={`p-2 rounded-md border transition ${arm.armClipboard ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                          >
                            <ClipboardPaste className="w-4 h-4" />
                          </button>
                          <div className="h-8 w-px mx-4 bg-gray-300 opacity-70" />
                          <button
                            onClick={arm.resetArm}
                            className="flex items-center gap-2 px-5 py-2 h-[40px] bg-[#eef2f6] text-[#0d3b66] border border-[#d0d7e2] rounded-lg hover:bg-[#e2e8f0] transition text-xs font-medium"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            arm.setConfirmDeleteArm(arm.activeArm.idArm);
                          }}
                          className="flex items-center gap-2 px-4 py-2 h-[40px] rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition text-xs font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Arm
                        </button>
                      </div>
                    )}
                  </div>

                  <ArmInput
                    arm={arm.activeArm}
                    onUpdate={(updates) =>
                      arm.updateArm(arm.activeTabArm, updates)
                    }
                    armError={arm.armsErrors[arm.activeTabArm] || {}}
                  />

                  <ArmObjectInput
                    armObjects={
                      Array.isArray(arm.activeArm.armObjects)
                        ? arm.activeArm.armObjects
                        : []
                    }
                    aoInputValue={arm.aoInputValue}
                    setAoInputValue={arm.setAoInputValue}
                    onUpdate={arm.updateAo}
                    errors={arm.aoErrors}
                    onAddAo={arm.addAoByInput}
                    onCopyAo={arm.copyAo}
                    onPasteAo={arm.pasteAo}
                    hasClipboard={Boolean(arm.aoClipboard)}
                    setConfirmDeleteAo={arm.setConfirmDeleteAo}
                    resetCurrentAo={arm.resetAo}
                    handleAddAo={arm.addAo}
                  />

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 hp:mt-5 hp:pt-4">
                    <button
                      onClick={() => {
                        if (!arm.isBackDisabledArm)
                          arm.setActiveTabArm(
                            arm.arms[arm.currentIndex - 1].idArm,
                          );
                      }}
                      disabled={arm.isBackDisabledArm}
                      className={`flex items-center text-sm gap-2 px-7 py-2.5 rounded-lg font-medium border-2 transition-colors hp:text-xs hp:px-[22px] hp:py-[8px]
                        ${arm.isBackDisabledArm ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-[#eef2f6] text-[#0d3b66] border-[#d0d7e2] hover:bg-[#e2e8f0]"}`}
                    >
                      <ChevronLeft className="w-5 h-5 hp:w-4 hp:h-4" />
                      <span className="hp:hidden">Back</span>
                    </button>

                    <button
                      onClick={() => {
                        if (!arm.isNextDisabledArm)
                          arm.setActiveTabArm(
                            arm.arms[arm.currentIndex + 1].idArm,
                          );
                      }}
                      disabled={arm.isNextDisabledArm}
                      className={`flex items-center text-sm gap-2 px-7 py-2.5 border-2 rounded-lg font-medium shadow-md transition-all hp:text-xs hp:px-[22px] hp:py-[8px]
                        ${arm.isNextDisabledArm ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110"}`}
                    >
                      Next Arm
                      <ChevronRight className="w-5 h-5 hp:w-4 hp:h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
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
            onClick={calculation.finish}
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
        <div id="results-section">
          {calculation.showResults && (
            <ResultsTable
              results={calculation.results}
              resultsDo={calculation.resultsDo}
              resultsOhw={calculation.resultsOhw}
              resultsArm={calculation.resultsArm}
            />
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal.CoverInputModal
        open={cover.showCoverPopup}
        onClose={cover.closeCoverPopup}
        cover={cover.coverData}
        onUpdateCover={cover.updateCover}
        onMakeReport={calculation.makeReport}
        coverErrors={cover.coverErrors}
      />

      <Modal.ToastModal
        toast={calculation.toast}
        onClose={() => calculation.setToast(null)}
      />

      <Modal.ConfirmDeleteModal
        open={poleSection.confirmDelete}
        onClose={() => poleSection.setConfirmDelete?.(null)}
        onConfirm={() => poleSection.removePole(poleSection.confirmDelete)}
        itemName="pole"
      />
      <Modal.ConfirmDeleteModal
        open={directObject.confirmDeleteDo}
        onClose={() => directObject.setConfirmDeleteDo(null)}
        onConfirm={() => directObject.removeDo(directObject.confirmDeleteDo)}
        itemName="object"
      />
      <Modal.ConfirmReduceModal
        open={directObject.confirmReduceDo}
        onClose={directObject.cancelReduce}
        onConfirm={directObject.confirmReduce}
        itemName="direct objects"
      />
      <Modal.ConfirmDeleteModal
        open={ohw.confirmDeleteOhw}
        onClose={() => ohw.setConfirmDeleteOhw(null)}
        onConfirm={() => ohw.removeOhw(ohw.confirmDeleteOhw)}
        itemName="overhead wire"
      />
      <Modal.ConfirmReduceModal
        open={ohw.confirmReduceOhw}
        onClose={ohw.cancelReduce}
        onConfirm={ohw.confirmReduce}
        itemName="overhead wires"
      />
      <Modal.ConfirmDeleteModal
        open={arm.confirmDeleteArm}
        onClose={() => arm.setConfirmDeleteArm(null)}
        onConfirm={() => arm.removeArm(arm.confirmDeleteArm)}
        itemName="arm"
      />
      <Modal.ConfirmDeleteModal
        open={arm.confirmDeleteAo}
        onClose={() => arm.setConfirmDeleteAo(null)}
        onConfirm={() => arm.removeAo(arm.confirmDeleteAo)}
        itemName="object"
      />
      <Modal.ConfirmReduceModal
        open={arm.confirmReduceAo}
        onClose={arm.cancelReduceArmObjects}
        onConfirm={arm.confirmReduceArmObjects}
        itemName="arm objects"
      />
    </div>
  );
}

// ─── SUB-COMPONENT ───────────────────────────────────────────────────────────

// Reusable collapsible section header — used for Pole, DO, OHW, Arm sections
function CollapsibleSection({
  title,
  isExpanded,
  onToggle,
  children,
  className = "",
}) {
  return (
    <>
      <div
        className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out hp:px-4 hp:py-3 ${className}
          ${isExpanded ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
        onClick={onToggle}
      >
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-2 hp:py-[8px]">
          <h2 className="text-white text-sm font-bold hp:text-xs hp:font-semibold">
            {title}
          </h2>
        </div>
        <div className="p-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-white hp:w-4 hp:h-4" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white hp:w-4 hp:h-4" />
          )}
        </div>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden
        ${isExpanded ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl" : "max-h-0 rounded-b-2xl hp:rounded-b-xl"}`}
      >
        {children}
      </div>
    </>
  );
}
