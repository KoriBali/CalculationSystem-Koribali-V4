import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { HeaderCalculationPage } from "../components/layout/HeaderCalculationPage";
import { ConditionForm } from "../components/forms/initial-setup/ConditionForm";
import { ConfirmDisableModal } from "../components/modals/ConfirmDisableModal";
import { ToastModal } from "../components/modals/ToastModal";
import { useConditionForm } from "../hooks/useConditionFrom";
import { useWorkflowMode } from "../hooks/useWorkflowMode";
import { CustomPoleModal } from "../components/modals/CustomPoleModal";

export default function InitialInputPage() {
  const { type: projectType } = useParams();
  const [isCustomPoleModalOpen, setIsCustomPoleModalOpen] = useState(false);
  const workflowForm = useWorkflowMode(projectType);
  const projectMode = workflowForm.workflowData.projectMode;

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

  const onNextStep = () => {
    if (projectMode === "both" && localCondition.poleType === "custom") {
      setIsCustomPoleModalOpen(true);
      return;
    }
    handleNext();
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <Helmet>
          <title>Calculation - KORI BALI</title>
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50">
          <HeaderCalculationPage />

          <div className="w-full max-w-[1440px] mx-auto pt-6 pb-24 sm:pb-8 px-2">
            <ConditionForm
              projectType={projectType}
              projectMode={projectMode}
              condition={localCondition}
              onUpdate={handleUpdate}
              onFinish={onNextStep}
              errors={errors}
            />
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

        <CustomPoleModal isOpen={isCustomPoleModalOpen} onClose={() => setIsCustomPoleModalOpen(false)} />
      </div>
    </>
  );
}
