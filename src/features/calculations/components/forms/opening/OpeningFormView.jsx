import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, Box } from "lucide-react";

import { HeaderCalculationPage } from "../../layout/HeaderCalculationPage";
import { OpeningType } from "./OpeningType";
import { BoxTypeForm } from "./BoxTypeForm";
import { RTypeForm } from "./RTypeForm";
import { OpeningResultTable } from "../../tables/opening-result/OpeningResultTable";

import * as Modal from "../../components/pole-analyzer/PoleAnalyzerModal";

import { useOpeningForm } from "../../../hooks/useOpeningForm";
import { useCoverForm } from "../../../hooks/useCoverForm";
import { useReport } from "../../../../report/hooks/useReport";

// Main view component for opening calculation form
export default function OpeningFormView() {
  const { type: projectType } = useParams();

  // ================= OPENING FORM HOOK =================
  const {
    // State
    openingType,
    boxType,
    rType,
    openingTypeErrors,
    boxTypeErrors,
    rTypeErrors,
    isOpeningExpanded,
    isSelectExpanded,
    isCalculated,
    showResultsOp,
    calculatedOp,
    buttonLabel,
    toast,
    typeLabelMap,
    loading,

    // Actions
    setIsOpeningExpanded,
    setIsSelectExpanded,
    handleOpeningTypeUpdate,
    handleBoxTypeUpdate,
    handleRTypeUpdate,
    handleCalculate,
    handleFinish,
    setToast,
    showToast,
  } = useOpeningForm();

  // ================= COVER HOOK =================
  const {
    cover,
    coverErrors,
    showCoverPopup,
    handleCoverUpdate,
    handleOpenCoverPopup,
    handleCloseCoverPopup,
    isCoverComplete,
    setCoverErrors,
  } = useCoverForm(projectType);

  // ================= REPORT HOOK =================
  const { handleMakeReport } = useReport(projectType);

  // Handle navigation to next step or open cover modal
  const handleNextStep = () => {
    const result = handleFinish();
    if (result === "OPEN_COVER") {
      handleOpenCoverPopup();
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Page metadata */}
        <Helmet>
          <title>Calculation Opening - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="min-h-screen bg-gray-50 border border-gray-250">
          <CalculationHeader />

          <div className="mx-2 md:mx-6 2040:mx-[250px] pt-1 pb-8">
            {/* ================= OPENING TYPE SECTION ================= */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] px-4 py-3 md:py-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
                isOpeningExpanded
                  ? "rounded-t-xl md:rounded-t-2xl"
                  : "rounded-xl md:rounded-2xl"
              }`}
              onClick={() => setIsOpeningExpanded(!isOpeningExpanded)}
            >
              {/* Section title */}
              <div className="bg-white/10 backdrop-blur-sm px-2 md:px-4 py-[8px] md:py-2 rounded-lg border border-white/20">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Opening Part Type
                </h2>
              </div>

              {/* Toggle icon */}
              <div className="p-2">
                {isOpeningExpanded ? (
                  <ChevronUp className="w-4 md:w-5 w-4 md:h-5 text-white" />
                ) : (
                  <ChevronDown className="w-4 md:w-5 w-4 md:h-5 text-white" />
                )}
              </div>
            </div>

            {/* Collapsible body */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isOpeningExpanded
                  ? "max-h-[5000px] rounded-b-xl md:rounded-b-2xl"
                  : "max-h-0 rounded-b-xl md:rounded-b-2xl"
              }`}
            >
              <OpeningType
                openingType={openingType}
                onUpdate={handleOpeningTypeUpdate}
                errors={openingTypeErrors}
              />
            </div>

            {/* ================= OPENING DETAIL SECTION ================= */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-10 transition-all duration-500 ease-in-out ${
                isSelectExpanded
                  ? "rounded-t-xl md:rounded-t-2xl"
                  : "rounded-xl md:rounded-2xl"
              }`}
              onClick={() => setIsSelectExpanded(!isSelectExpanded)}
            >
              {/* Dynamic title based on selected type */}
              <div>
                {openingType.type && (
                  <div className="bg-white/10 backdrop-blur-sm px-2 md:px-4 py-[8px] md:py-2 rounded-lg border border-white/20">
                    <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                      {typeLabelMap[openingType.type]}
                    </h2>
                  </div>
                )}
              </div>

              {/* Toggle icon */}
              <div className="p-2">
                {isSelectExpanded ? (
                  <ChevronUp className="w-4 md:w-5 w-4 md:h-5 text-white" />
                ) : (
                  <ChevronDown className="w-4 md:w-5 w-4 md:h-5 text-white" />
                )}
              </div>
            </div>

            {/* Collapsible body */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isSelectExpanded
                  ? "max-h-[5000px] rounded-b-xl md:rounded-b-2xl"
                  : "max-h-0 rounded-b-xl md:rounded-b-2xl"
              }`}
            >
              {/* Empty state when no type selected */}
              {!openingType.type && (
                <div className="bg-white border border-gray-200 rounded-b-2xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Box className="w-6 h-6 text-gray-400" />
                  </div>

                  <p className="text-gray-500 text-sm">
                    Please select opening type first
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Choose the type above to configure parameters
                  </p>
                </div>
              )}

              {/* Render Box Type form */}
              {openingType.type === "box" && (
                <BoxTypeForm
                  boxType={boxType}
                  onUpdate={handleBoxTypeUpdate}
                  errors={boxTypeErrors}
                  onCalculate={handleCalculate}
                  onNext={handleFinish}
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}

              {/* Render R Type form */}
              {openingType.type === "r" && (
                <RTypeForm
                  rType={rType}
                  onUpdate={handleRTypeUpdate}
                  errors={rTypeErrors}
                  onCalculate={handleCalculate}
                  onNext={handleFinish}
                  isCalculated={isCalculated}
                  buttonLabel={buttonLabel}
                />
              )}
            </div>

            {/* ================= RESULT TABLE ================= */}
            <div id="results-op">
              {showResultsOp && (
                <OpeningResultTable openingType={calculatedOp?.openingType} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= COVER MODAL ================= */}
      <Modal.CoverInputModal
        open={showCoverPopup}
        onClose={handleCloseCoverPopup}
        onUpdateCover={handleCoverUpdate}
        onMakeReport={() =>
          handleMakeReport({
            cover,
            validateCover,
            isCalculated,
            showToast,
          })
        }
      />

      {/* ================= TOAST ================= */}
      <Modal.ToastModal toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
