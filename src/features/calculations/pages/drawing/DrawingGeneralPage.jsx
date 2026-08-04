import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { HeaderCalculationPage } from "../../components/layout/HeaderCalculationPage";
import { DrawingGeneralForm } from "../../components/forms/drawing/DrawingGeneralForm";
import { ToastModal } from "../../components/modals/ToastModal";
import { CustomPoleModal } from "../../components/modals/CustomPoleModal";
import { useDrawingGeneralForm } from "../../hooks/useDrawingGeneralForm";

export default function DrawingGeneralPage() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCustomPoleModalOpen, setIsCustomPoleModalOpen] = useState(false);

  const {
    localGeneral,
    errors,
    toast,
    setToast,
    handleUpdate,
    handleReset,
    handleNext,
    projectMode,
  } = useDrawingGeneralForm();

  const onNextStep = async () => {
    if (localGeneral.poleType === "Custom Pole") {
      setIsCustomPoleModalOpen(true);
      return;
    }

    const result = await handleNext();
    if (result === "GO_POLE") {
      navigate(`/calculation/${projectType}/${draftId}/drawing/pole`);
    } else if (result === "GO_COUPLING") {
      navigate(`/calculation/${projectType}/${draftId}/drawing/coupling`);
    } else if (result === "GO_SURFACE") {
      navigate(`/calculation/${projectType}/${draftId}/drawing/surface`);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <Helmet>
          <title>General Drawing Input - KORI BALI</title>
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />

          <div className="w-full max-w-[1440px] mx-auto pt-0 pb-8 px-6 hp:px-2">
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out
                ${isExpanded ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  General Drawing Input
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
              <DrawingGeneralForm
                general={localGeneral}
                onUpdate={handleUpdate}
                onReset={handleReset}
                onNext={onNextStep}
                errors={errors}
                projectMode={projectMode}
              />
            </div>
          </div>
        </div>

        <ToastModal toast={toast} onClose={() => setToast(null)} />
        <CustomPoleModal isOpen={isCustomPoleModalOpen} onClose={() => setIsCustomPoleModalOpen(false)} />
      </div>
    </>
  );
}
