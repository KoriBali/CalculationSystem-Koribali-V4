import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, Box } from "lucide-react";

import { HeaderCalculationPage } from "../../layout/HeaderCalculationPage";
import { FoundationType } from "./FoundationType";
import { RoundCaissonTypeForm } from "./RoundCaissonTypeForm";
import { SquareCaissonTypeForm } from "./SquareCaissonTypeForm";
import { FoundationResultTable } from "../../tables/foundation-result/FoundationResultTable";

import { CoverFormModal } from "../../modals/CoverFormModal";
import { ToastModal } from "../../modals/ToastModal";

import { useFoundationForm } from "../../../hooks/useFoundationForm";
import { useCoverForm } from "../../../hooks/useCoverForm";
import { useReport } from "../../../../report/hooks/useReport";

// Main view component for foundation calculation form
export default function FoundationFormView() {
  const { type: projectType } = useParams();

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
    setToast,
    showToast,
  } = useFoundationForm();

  // ================= COVER HOOK =================
  const {
    cover,
    coverErrors,
    showCoverPopup,
    handleCoverUpdate,
    handleOpenCoverPopup,
    handleCloseCoverPopup,
    validate: validateCover, // Mapping validate ke validateCover agar sesuai fungsi report
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
          <title>Calculation Foundation - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="min-h-screen bg-gray-50 border border-gray-250">
          {/* PERBAIKAN: Menggunakan HeaderCalculationPage sesuai import */}
          <HeaderCalculationPage />

          <div className="mx-2 md:mx-6 2040:mx-[250px] pt-1 pb-8">
            {/* ================= FOUNDATION TYPE SECTION ================= */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] px-4 py-3 md:py-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out ${
                isFoundationExpanded
                  ? "rounded-t-xl md:rounded-t-2xl"
                  : "rounded-xl md:rounded-2xl"
              }`}
              onClick={() => setIsFoundationExpanded(!isFoundationExpanded)}
            >
              {/* Section title */}
              <div className="bg-white/10 backdrop-blur-sm px-2 md:px-4 py-[8px] md:py-2 rounded-lg border border-white/20">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Foundation Type
                </h2>
              </div>

              {/* Toggle icon */}
              <div className="p-2">
                {isFoundationExpanded ? (
                  <ChevronUp className="w-4 md:w-5 h-4 md:h-5 text-white" />
                ) : (
                  <ChevronDown className="w-4 md:w-5 h-4 md:h-5 text-white" />
                )}
              </div>
            </div>

            {/* Collapsible body */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isFoundationExpanded
                  ? "max-h-[5000px] rounded-b-xl md:rounded-b-2xl"
                  : "max-h-0 rounded-b-xl md:rounded-b-2xl"
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
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between cursor-pointer mt-10 transition-all duration-500 ease-in-out ${
                isSelectExpanded
                  ? "rounded-t-xl md:rounded-t-2xl"
                  : "rounded-xl md:rounded-2xl"
              }`}
              onClick={() => setIsSelectExpanded(!isSelectExpanded)}
            >
              {/* Dynamic title based on selected type */}
              <div>
                {foundationType.type && (
                  <div className="bg-white/10 backdrop-blur-sm px-2 md:px-4 py-[8px] md:py-2 rounded-lg border border-white/20">
                    <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                      {typeLabelMap[foundationType.type]}
                    </h2>
                  </div>
                )}
              </div>

              {/* Toggle icon */}
              <div className="p-2">
                {isSelectExpanded ? (
                  <ChevronUp className="w-4 md:w-5 h-4 md:h-5 text-white" />
                ) : (
                  <ChevronDown className="w-4 md:w-5 h-4 md:h-5 text-white" />
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

      {/* ================= COVER MODAL ================= */}
      <CoverFormModal
        open={showCoverPopup}
        onClose={handleCloseCoverPopup}
        cover={cover} // Menambahkan data cover ke modal
        coverErrors={coverErrors} // Menambahkan error data ke modal
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
      <ToastModal toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
