import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { HeaderCalculationPage } from "../../components/layout/HeaderCalculationPage";
import { SurfaceForm } from "../../components/forms/drawing/SurfaceForm";
import { ToastModal } from "../../components/modals/ToastModal";
import { useSurfaceForm } from "../../hooks/useSurfaceForm";
import { FinishCalculationModal } from "../../components/modals/FinishCalculationModal";
import { ConfirmSaveDatabaseModal } from "../../components/modals/ConfirmSaveDatabaseModal";
import { saveWorkingSessionToDraft, clearCalculationSession, clearActiveDraftId } from "../../utils/coreLogic";

export default function DrawingSurfacePage() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  const {
    localSurface,
    errors,
    toast,
    setToast,
    handleUpdate,
    handleReset,
    handleFinish,
  } = useSurfaceForm();

  const onFinishStep = async () => {
    const result = await handleFinish();
    if (result === "OPEN_FINISH") {
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
          <title>Surface Configuration - KORI BALI</title>
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />

          <div className="w-full max-w-[1440px] mx-auto pt-0 pb-24 sm:pb-8 px-2">
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out
                ${isExpanded ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Surface Input
                </h2>
              </div>
              <div
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white border border-white/20 transition group-hover:bg-white/20 group-active:bg-white/25"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden
              ${
                isExpanded
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <SurfaceForm
                surface={localSurface}
                onUpdate={handleUpdate}
                onReset={handleReset}
                onFinish={onFinishStep}
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

        {/* Toast */}
        <ToastModal toast={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
}
