import { useState } from "react";
import { Helmet } from "react-helmet";
import { ChevronDown, ChevronUp } from "lucide-react";

import { HeaderCalculationPage } from "../../layout/HeaderCalculationPage";
import { ConditionForm } from "./ConditionForm";
import { ConfirmDisableModal } from "../../modals/ConfirmDisableModal";
import { ToastModal } from "../../modals/ToastModal";
import { useConditionForm } from "../../../hooks/useConditionFrom";

export default function CalculationSetupForm() {
  // UI-only state — lives in page, not in hook
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    projectType,
    localCondition,
    errors,
    toast,
    confirmDisable,
    prevCondition,

    setToast,
    setConfirmDisable,
    setLocalCondition,

    handleUpdate,
    handleNext,
    proceed,
  } = useConditionForm();

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

        <div className="flex-1 rounded-t-2xl bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />

          <div className="mx-6 2040:mx-[250px] pt-0 pb-8 hp:mx-2">
            {/* Section header — collapsible toggle */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#3399cc] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out
                ${isExpanded ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {/* Title */}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hp:px-3 hp:py-[8px]">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Initial Input
                </h2>
              </div>

              {/* Expand/collapse icon */}
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
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            {/* Collapsible body */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden
              ${
                isExpanded
                  ? "max-h-[5000px] rounded-b-2xl hp:rounded-b-xl"
                  : "max-h-0 rounded-b-2xl hp:rounded-b-xl"
              }`}
            >
              <ConditionForm
                projectType={projectType}
                condition={localCondition}
                onUpdate={handleUpdate}
                onFinish={handleNext}
                errors={errors}
              />
            </div>
          </div>
        </div>

        {/* Confirm modal — shown when user disables an active component */}
        <ConfirmDisableModal
          data={confirmDisable}
          onClose={() => {
            setConfirmDisable(null); // tutup modal
            setLocalCondition(prevCondition); // rollback ke state sebelumnya
          }}
          onConfirm={() => {
            setConfirmDisable(null); // tutup modal
            proceed(); // lanjut dengan perubahan
          }}
        />

        {/* Toast — shown on validation error */}
        <ToastModal toast={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
}
