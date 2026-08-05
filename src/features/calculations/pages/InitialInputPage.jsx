import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { HeaderCalculationPage } from "../components/layout/HeaderCalculationPage";
import { ConditionForm } from "../components/forms/initial-setup/ConditionForm";
import { ConfirmDisableModal } from "../components/modals/ConfirmDisableModal";
import { ToastModal } from "../components/modals/ToastModal";
import { useConditionForm } from "../hooks/useConditionFrom";
import { useWorkflowMode } from "../hooks/useWorkflowMode";

export default function InitialInputPage() {
  const { type: projectType } = useParams();
  const [isConditionExpanded, setIsConditionExpanded] = useState(true);
  const workflowForm = useWorkflowMode(projectType);

  const {
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
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />

          <div className="w-full max-w-[1440px] mx-auto pt-0 pb-24 sm:pb-8 px-2">
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out
                ${isConditionExpanded ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
              onClick={() => setIsConditionExpanded(!isConditionExpanded)}
            >
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Initial Input
                </h2>
              </div>
              <div
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white border border-white/20 transition group-hover:bg-white/20 group-active:bg-white/25"
              >
                {isConditionExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden
              ${
                isConditionExpanded
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
            setConfirmDisable(null);
            setLocalCondition(prevCondition);
          }}
          onConfirm={() => {
            setConfirmDisable(null);
            proceed();
          }}
        />

        {/* Toast — shown on validation error */}
        <ToastModal toast={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
}
