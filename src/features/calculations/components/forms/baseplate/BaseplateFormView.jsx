import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Box } from "lucide-react";

import { HeaderCalculationPage } from "../../layout/HeaderCalculationPage";
import { BaseplateType } from "./BaseplateType";
import { FourRibTypeForm } from "./FourRibTypeForm";
import { EightRibTypeForm } from "./EightRibTypeForm";
import { BaseplateResultTable } from "../../tables/baseplate-result/BaseplateResultTable";

import { ToastModal } from "../../modals/ToastModal";
import { FinishCalculationModal } from "../../modals/FinishCalculationModal";
import { ConfirmSaveDatabaseModal } from "../../modals/ConfirmSaveDatabaseModal";
import { CoverFormModal } from "../../modals/CoverFormModal";
import { saveWorkingSessionToDraft, clearActiveDraftId } from "../../../utils/coreLogic";
import { clearCalculationSession } from "../../../utils";

import { useBaseplateForm } from "../../../hooks/useBaseplateForm";
import { useReport } from "../../../../report/hooks/useReport";
import { useState } from "react";

// Main view component for baseplate calculation form
export default function BaseplateFormView() {
  const { type: projectType, draftId } = useParams();

  
  const navigate = useNavigate();
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

// ================= BASEPLATE FORM HOOK =================
  const {
    // State
    baseplateType,
    fourRibType,
    eightRibType,
    baseplateTypeErrors,
    fourRibTypeErrors,
    eightRibTypeErrors,
    isBaseplateExpanded,
    isSelectExpanded,
    isCalculated,
    showResultsBaseplate, // PERBAIKAN: Sinkronkan dengan nama variabel di Hook (dengan 's')
    calculatedBaseplate,
    buttonLabel,
    toast,
    typeLabelMap,
    loading,

    // Actions
    setIsBaseplateExpanded,
    setIsSelectExpanded,
    handleBaseplateTypeUpdate,
    handleFourRibTypeUpdate,
    handleEightRibTypeUpdate,
    handleCalculate,
    handleFinish,
    handleBack,
    setToast,
    showToast,
  } = useBaseplateForm();

  // ================= REPORT HOOK =================
  const { makeReport } = useReport(projectType);

  // Handle navigation to next step or create report
  const handleNextStep = () => {
    const result = handleFinish();
    if (result === "OPEN_COVER") {
      setShowFinishModal(true);
    }
  };

  const handleConfirmCover = () => {
    setShowCoverModal(false);
    makeReport({ isCalculated, showToast });
  };

  const handleSaveDraft = () => {
    saveWorkingSessionToDraft(projectType, draftId);
    showToast("Draft successfully saved!", "success");
    setShowFinishModal(false);
  };

  const handleSaveDatabaseClick = () => {
    setShowFinishModal(false);
    setShowDbModal(true);
  };

  const handleConfirmSaveDb = () => {
    // Database save logic will go here
    showToast("Project successfully saved to database!", "success");
    setShowDbModal(false);
    setTimeout(() => {
      clearCalculationSession(projectType);
      clearActiveDraftId(projectType);
      navigate(`/calculation/${projectType}`);
    }, 2500);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Page metadata */}
        <Helmet>
          <title>Calculation Baseplate - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50 border border-gray-250">
          {/* PERBAIKAN: Menggunakan HeaderCalculationPage sesuai dengan import di atas */}
          <HeaderCalculationPage />

          <div className="w-full max-w-[1440px] mx-auto pt-0 pb-24 sm:pb-8 px-2">
            {/* ================= BASEPLATE TYPE SECTION ================= */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
                isBaseplateExpanded
                  ? "rounded-t-xl md:rounded-t-2xl"
                  : "rounded-xl md:rounded-2xl"
              }`}
              onClick={() => setIsBaseplateExpanded(!isBaseplateExpanded)}
            >
              {/* Section title */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Baseplate Type
                </h2>
              </div>

              {/* Toggle icon */}
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
                {isBaseplateExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            {/* Collapsible body */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isBaseplateExpanded
                  ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <BaseplateType
                baseplateType={baseplateType}
                onUpdate={handleBaseplateTypeUpdate}
                errors={baseplateTypeErrors}
              />
            </div>

            {/* ================= BASEPLATE DETAIL SECTION ================= */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-10 transition-all duration-500 ease-in-out ${
                isSelectExpanded
                  ? "rounded-t-2xl hp:rounded-t-xl"
                  : "rounded-2xl hp:rounded-xl"
              }`}
              onClick={() => setIsSelectExpanded(!isSelectExpanded)}
            >
              {/* Dynamic title based on selected type */}
              <div>
                {baseplateType.type && (
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                    <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                      {typeLabelMap[baseplateType.type]}
                    </h2>
                  </div>
                )}
              </div>

              {/* Toggle icon */}
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
                {isSelectExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            {/* Collapsible body */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isSelectExpanded
                  ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              {/* Empty state when no type selected */}
              {!baseplateType.type && (
                <div className="bg-white border border-gray-200 rounded-b-2xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Box className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Please select baseplate type first
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Choose the type above to configure parameters
                  </p>
                </div>
              )}

              {/* Render 4 Rib Type form */}
              {baseplateType.type === "4rib" && (
                <FourRibTypeForm
                  fourRibType={fourRibType}
                  onUpdate={handleFourRibTypeUpdate}
                  errors={fourRibTypeErrors}
                  onCalculate={handleCalculate}
                  onBack={handleBack}
                  onNext={handleNextStep} // PERBAIKAN: Gunakan handleNextStep untuk navigasi terpadu
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}

              {/* Render 8 Rib Type form */}
              {baseplateType.type === "8rib" && (
                <EightRibTypeForm
                  eightRibType={eightRibType}
                  onUpdate={handleEightRibTypeUpdate}
                  errors={eightRibTypeErrors}
                  onCalculate={handleCalculate}
                  onBack={handleBack}
                  onNext={handleNextStep} // PERBAIKAN: Gunakan handleNextStep untuk navigasi terpadu
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}
            </div>

            {/* ================= RESULT TABLE ================= */}
            <div id="results-baseplate">
              {showResultsBaseplate && (
                <BaseplateResultTable
                  baseplateType={calculatedBaseplate?.baseplateType}
                />
              )}
            </div>
          </div>
        </div>
      </div>



      {/* ================= MODALS ================= */}
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
      <ToastModal toast={toast} onClose={() => setToast(null)} />
      <CoverFormModal 
        open={showCoverModal} 
        onClose={() => setShowCoverModal(false)} 
        projectType={projectType} 
        draftId={draftId} 
        onConfirm={handleConfirmCover} 
      />
    </>
  );
}
