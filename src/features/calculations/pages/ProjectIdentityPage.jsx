import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { HeaderCalculationPage } from "../components/layout/HeaderCalculationPage";
import { CoverForm } from "../components/forms/cover/CoverForm";
import { ToastModal } from "../components/modals/ToastModal";
import { useCoverForm } from "../hooks/useCoverForm";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { NextStepModal } from "../components/modals/NextStepModal";

export default function ProjectIdentityPage() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();
  const coverForm = useCoverForm(projectType);
  const [toast, setToast] = useState(null);
  const [isCoverExpanded, setIsCoverExpanded] = useState(true);
  const [showNextStepModal, setShowNextStepModal] = useState(false);

  const handleFinishCover = async () => {
    const isValid = await coverForm.validate();
    if (isValid) {
      if (coverForm.coverData.withDrawing) {
        setShowNextStepModal(true);
      } else {
        navigate(`/calculation/${projectType}/${draftId}/initial`);
      }
    } else {
      setToast({
        message: "Please fill all required project information fields.",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <Helmet>
          <title>Calculation - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />

          <div className="mx-6 2040:mx-[250px] pt-0 pb-8 hp:mx-2">
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out
                ${isCoverExpanded ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
              onClick={() => setIsCoverExpanded(!isCoverExpanded)}
            >
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Project Setup
                </h2>
              </div>
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white border border-white/20 transition group-hover:bg-white/20 group-active:bg-white/25">
                {isCoverExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden
              ${
                isCoverExpanded
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <CoverForm
                coverData={coverForm.coverData}
                onUpdate={coverForm.updateCover}
                onFinish={handleFinishCover}
                errors={coverForm.coverErrors}
              />
            </div>
          </div>
        </div>
        <ToastModal toast={toast} onClose={() => setToast(null)} />

        <NextStepModal
          isOpen={showNextStepModal}
          onClose={() => setShowNextStepModal(false)}
          withDrawing={coverForm.coverData.withDrawing}
          projectType={projectType}
          draftId={draftId}
        />
      </div>
    </>
  );
}
