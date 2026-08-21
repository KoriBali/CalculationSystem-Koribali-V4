import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Box } from "lucide-react";

import { HeaderCalculationPage } from "../../layout/HeaderCalculationPage";
import { FoundationType } from "./FoundationType";
import { RoundCaissonTypeForm } from "./RoundCaissonTypeForm";
import { SquareCaissonTypeForm } from "./SquareCaissonTypeForm";
import { FoundationResultTable } from "../../tables/foundation-result/FoundationResultTable";
import { ToastModal } from "../../modals/ToastModal";
import { FinishCalculationModal } from "../../modals/FinishCalculationModal";
import { ConfirmSaveDatabaseModal } from "../../modals/ConfirmSaveDatabaseModal";
import { CoverFormModal } from "../../modals/CoverFormModal";
import { saveWorkingSessionToDraft, clearActiveDraftId } from "../../../utils/coreLogic";
import { clearCalculationSession } from "../../../utils";

import { useFoundationForm } from "../../../hooks/useFoundationForm";
import { useReport } from "../../../../report/hooks/useReport";

// Main view component for foundation calculation form
export default function FoundationFormView() {
  const { type: projectType, draftId } = useParams();
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  
  const navigate = useNavigate();
// ================= FOUNDATION FORM HOOK =================
  const {
    // State
    foundationType,
    squareCaisson,
    roundCaisson,
    foundationTypeErrors,
    squareCaissonErrors,
    roundCaissonErrors,
    isFoundationExpanded,
    isSelectExpanded,
    isCalculated,
    showResultsFoundation, // Pastikan menggunakan nama variabel yang sinkron dengan Hook (S di belakang)
    calculatedFoundation,
    buttonLabel,
    toast,
    typeLabelMap,
    loading,

    // Actions
    setIsFoundationExpanded,
    setIsSelectExpanded,
    handleFoundationTypeUpdate,
    handleSquareCaissonUpdate,
    handleRoundCaissonUpdate,
    handleCalculate,
    handleFinish,
    handleBack,
    setToast,
    showToast,
  } = useFoundationForm();



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
          <title>Calculation Foundation - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50 border border-gray-250">
          {/* PERBAIKAN: Menggunakan HeaderCalculationPage sesuai import */}
          <HeaderCalculationPage />

          <div className="w-full max-w-[1440px] mx-auto pt-0 pb-24 sm:pb-8 px-2">
            {/* ================= FOUNDATION TYPE SECTION ================= */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
                isFoundationExpanded
                  ? "rounded-t-xl md:rounded-t-2xl"
                  : "rounded-xl md:rounded-2xl"
              }`}
              onClick={() => setIsFoundationExpanded(!isFoundationExpanded)}
            >
              {/* Section title */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Foundation Type
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
                {isFoundationExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            {/* Collapsible body */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isFoundationExpanded
                  ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <FoundationType
                foundationType={foundationType}
                onUpdate={handleFoundationTypeUpdate}
                errors={foundationTypeErrors}
              />
            </div>

            {/* ================= FOUNDATION DETAIL SECTION ================= */}
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
                {foundationType.type && (
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                    <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                      {typeLabelMap[foundationType.type]}
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
              {!foundationType.type && (
                <div className="bg-white border border-gray-200 rounded-b-2xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Box className="w-6 h-6 text-gray-400" />
                  </div>

                  <p className="text-gray-500 text-sm">
                    Please select foundation type first
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Choose the type above to configure parameters
                  </p>
                </div>
              )}

              {/* Render Square Caisson Type form */}
              {foundationType.type === "square-caisson" && (
                <SquareCaissonTypeForm
                  squareCaisson={squareCaisson}
                  onUpdate={handleSquareCaissonUpdate}
                  errors={squareCaissonErrors}
                  onCalculate={handleCalculate}
                  onBack={handleBack}
                  onNext={handleNextStep} // PERBAIKAN: Gunakan handleNextStep agar sinkron dengan modal
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}

              {/* Render Round Caisson Type form */}
              {foundationType.type === "round-caisson" && (
                <RoundCaissonTypeForm
                  roundCaisson={roundCaisson}
                  onUpdate={handleRoundCaissonUpdate}
                  errors={roundCaissonErrors}
                  onCalculate={handleCalculate}
                  onBack={handleBack}
                  onNext={handleNextStep} // PERBAIKAN: Gunakan handleNextStep agar sinkron dengan modal
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}
            </div>

            {/* ================= RESULT TABLE ================= */}
            <div id="results-foundation">
              {showResultsFoundation && (
                <FoundationResultTable
                  foundationType={calculatedFoundation?.foundationType}
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
