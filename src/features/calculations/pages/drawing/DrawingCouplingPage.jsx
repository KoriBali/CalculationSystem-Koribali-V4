import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { HeaderCalculationPage } from "../../components/layout/HeaderCalculationPage";
import { CouplingForm } from "../../components/forms/drawing/CouplingForm";
import { ToastModal } from "../../components/modals/ToastModal";

export default function DrawingCouplingPage() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [toast, setToast] = useState(null);

  const handleBack = () => {
    navigate(`/calculation/${projectType}/${draftId}/drawing/general`);
  };

  const handleNext = () => {
    sessionStorage.setItem(`${projectType}_drawing_coupling_completed`, "true");
    navigate(`/calculation/${projectType}/${draftId}/drawing/surface`);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <Helmet>
          <title>Coupling Configuration - KORI BALI</title>
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
                  Coupling Configuration
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
              <CouplingForm 
                onBack={handleBack}
                onReset={() => {}}
                onNext={handleNext}
                onError={(msg) => setToast({ message: msg })}
              />
            </div>
          </div>
        </div>
        <ToastModal toast={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
}
