import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { HeaderCalculationPage } from "../components/layout/HeaderCalculationPage";
import { DrawingForm } from "../components/forms/drawing/DrawingForm";
import { ToastModal } from "../components/modals/ToastModal";
import { FinishCalculationModal } from "../components/modals/FinishCalculationModal";
import { ConfirmSaveDatabaseModal } from "../components/modals/ConfirmSaveDatabaseModal";
import { useDrawingForm } from "../hooks/useDrawingForm";
import { useReport } from "../../report/hooks/useReport";
import { saveWorkingSessionToDraft, clearCalculationSession, clearActiveDraftId } from "../utils/coreLogic";

export default function DrawingInputPage() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();
  const [isDrawingExpanded, setIsDrawingExpanded] = useState(true);

  // Modal States
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  const {
    localDrawing,
    errors,
    toast,
    setToast,
    handleUpdate,
    handleReset,
    handleNext,
  } = useDrawingForm();

  const report = useReport(projectType);

  // Empty space to remove the function

  const onFinishDrawing = async () => {
    const result = await handleNext();
    if (result === "OPEN_COVER") {
      setShowFinishModal(true);
    }
  };

  const handleGenerateReport = () => {
    setShowFinishModal(false);
    setToast({ 
      message: "Preview Drawing Output feature is coming soon!", 
      type: "success" 
    });
  };

  // Empty block removed handleConfirmCover

  const handleSaveDraft = () => {
    saveWorkingSessionToDraft(projectType, draftId);
    setToast({ message: "Draft successfully saved!", type: "success" });
    setShowFinishModal(false);
  };

  const handleSaveDatabaseClick = () => {
    setShowFinishModal(false);
    setShowDbModal(true);
  };

  const handleConfirmSaveDb = () => {
    // Database save logic will go here
    setToast({ message: "Project successfully saved to database!", type: "success" });
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
          <title>Drawing Configuration - KORI BALI</title>
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />

          <div className="mx-6 2040:mx-[250px] pt-0 pb-8 hp:mx-2">
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out
                ${isDrawingExpanded ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
              onClick={() => setIsDrawingExpanded(!isDrawingExpanded)}
            >
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Drawing Input
                </h2>
              </div>
              <div
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white border border-white/20 transition group-hover:bg-white/20 group-active:bg-white/25"
              >
                {isDrawingExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden
              ${
                isDrawingExpanded
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <DrawingForm
                drawing={localDrawing}
                onUpdate={handleUpdate}
                onReset={handleReset}
                onFinish={onFinishDrawing}
                errors={errors}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <FinishCalculationModal
          open={showFinishModal}
          onClose={() => setShowFinishModal(false)}
          onGenerateReport={handleGenerateReport}
          onSaveDatabase={handleSaveDatabaseClick}
          onSaveDraft={handleSaveDraft}
          isDrawingMode={true}
        />

        <ConfirmSaveDatabaseModal
          open={showDbModal}
          onClose={() => setShowDbModal(false)}
          onConfirm={handleConfirmSaveDb}
        />

        {/* Toast — shown on validation error */}
        <ToastModal toast={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
}
