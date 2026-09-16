import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "lucide-react";

import { HeaderCalculationPage } from "../../layout/HeaderCalculationPage";
import { OpeningType } from "./OpeningType";
import { BoxTypeForm } from "./BoxTypeForm";
import { RTypeForm } from "./RTypeForm";
import { OpeningResultTable } from "../../tables/opening-result/OpeningResultTable";
import { ToastModal } from "../../modals/ToastModal";
import { FinishCalculationModal } from "../../modals/FinishCalculationModal";
import { ConfirmSaveDatabaseModal } from "../../modals/ConfirmSaveDatabaseModal";
import { CoverFormModal } from "../../modals/CoverFormModal";
import {
  saveWorkingSessionToDraft,
  clearActiveDraftId,
} from "../../../utils/coreLogic";
import { clearCalculationSession } from "../../../utils";
import { useOpeningForm } from "../../../hooks/useOpeningForm";
import { useReport } from "../../../../report/hooks/useReport";
import { useState } from "react";

// Main view for the opening calculation step
export default function OpeningFormView() {
  const { type: projectType, draftId } = useParams();

  const navigate = useNavigate();
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);

  // ── Hooks ──
  const opening = useOpeningForm();
  const { makeReport } = useReport(projectType);

  // Opens cover modal if this is the last step, otherwise navigates to next
  const handleNextStep = () => {
    const result = opening.finish();
    if (result === "OPEN_COVER") {
      setShowFinishModal(true);
    }
  };

  const handleConfirmCover = () => {
    setShowCoverModal(false);
    makeReport({
      isCalculated: opening.isCalculated,
      showToast: opening.showToast,
    });
  };

  const handleSaveDraft = () => {
    saveWorkingSessionToDraft(projectType, draftId);
    opening.showToast("Draft successfully saved!", "success");
    setShowFinishModal(false);
  };

  const handleSaveDatabaseClick = () => {
    setShowFinishModal(false);
    setShowDbModal(true);
  };

  const handleConfirmSaveDb = () => {
    // Database save logic will go here
    opening.showToast("Project successfully saved to database!", "success");
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
        <Helmet>
          <title>Calculation Opening - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50">
          <HeaderCalculationPage />

          <div className="w-full max-w-[1440px] mx-auto pt-0 pb-24 sm:pb-8 px-2">
            {/* ── Opening configuration (Opening Type + Detail) ── */}
            <div
              className="
                bg-white
                mt-6
                rounded-2xl hp:rounded-xl
                border border-gray-200
                shadow-[0_2px_10px_rgba(15,23,42,0.06)]
                overflow-hidden
              "
            >
              {/* Top accent strip */}
              <div
                aria-hidden="true"
                className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]"
              />

              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* ── Opening Type selector ── */}
                <div>
                  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
                    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
                    Opening Type
                  </h3>
                  <OpeningType
                    openingType={opening.openingType}
                    onUpdate={opening.updateOpeningType}
                    errors={opening.openingTypeErrors}
                  />
                </div>

                {/* ── Opening detail section ── */}
                <div>
                  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
                    <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
                    Opening Specifications
                  </h3>

                  {/* Empty state — prompt user to select type first */}
                  {!opening.openingType.type && (
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200">
                      <div className="flex flex-col items-center justify-center text-center py-10">
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
                    </div>
                  )}

                  {/* Box type form */}
                  {opening.openingType.type === "box" && (
                    <BoxTypeForm
                      boxType={opening.boxType}
                      onUpdate={opening.updateBoxType}
                      errors={opening.boxTypeErrors}
                      onCalculate={opening.calculate}
                      onBack={opening.goBack}
                      onNext={handleNextStep}
                      isCalculated={opening.isCalculated}
                      buttonLabel={opening.buttonLabel}
                      isCalculationAndDrawing={opening.isCalculationAndDrawing}
                    />
                  )}

                  {/* R type form */}
                  {opening.openingType.type === "r" && (
                    <RTypeForm
                      rType={opening.rType}
                      onUpdate={opening.updateRType}
                      errors={opening.rTypeErrors}
                      onCalculate={opening.calculate}
                      onBack={opening.goBack}
                      onNext={handleNextStep}
                      isCalculated={opening.isCalculated}
                      buttonLabel={opening.buttonLabel}
                      isCalculationAndDrawing={opening.isCalculationAndDrawing}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ── Result table ── */}
            <div id="results-op">
              {opening.showResultsOp && (
                <OpeningResultTable
                  openingType={opening.calculatedOp?.openingType}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast notification ── */}
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
        toast={opening.toast}
        onClose={() => opening.setToast(null)}
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
    </>
  );
}
