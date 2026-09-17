import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { HeaderCalculationPage } from "../components/layout/HeaderCalculationPage";
import { CoverForm } from "../components/forms/cover/CoverForm";
import { ToastModal } from "../components/modals/ToastModal";
import { useProjectIdentityForm } from "../hooks/useProjectIdentityForm";
import { useWorkflowMode } from "../hooks/useWorkflowMode";
import { useState } from "react";

export default function ProjectIdentityPage() {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();
  const identityForm = useProjectIdentityForm(projectType);
  const workflowForm = useWorkflowMode(projectType);
  const [toast, setToast] = useState(null);

  const handleFinishCover = async () => {
    const { isValid, errors } = await identityForm.validate();
    if (!isValid) {
      const firstErrorField = Object.keys(errors)[0];
      setToast({ message: errors[firstErrorField], type: "error" });

      const fieldEl = document.getElementById(firstErrorField);
      fieldEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      fieldEl?.focus({ preventScroll: true });
      return;
    }

    const mode = workflowForm.workflowData.projectMode || "calculation";
    if (mode === "drawing") {
      navigate(`/calculation/${projectType}/${draftId}/drawing`);
    } else {
      // Both 'calculation' and 'both' start at the calculation condition
      navigate(`/calculation/${projectType}/${draftId}/calculation-condition`);
    }
  };

  const handleReset = () => {
    identityForm.resetIdentity();
    workflowForm.resetMode();
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

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50">
          <HeaderCalculationPage />

          <div className="w-full max-w-[1440px] mx-auto pt-6 pb-24 sm:pb-8 px-2">
            <div>
              <CoverForm
                identityData={identityForm.identityData}
                identityErrors={identityForm.identityErrors}
                onUpdateIdentity={identityForm.updateIdentity}
                projectMode={workflowForm.workflowData.projectMode}
                onSelectMode={(mode) =>
                  workflowForm.updateWorkflow({ projectMode: mode })
                }
                onReset={handleReset}
                onFinish={handleFinishCover}
              />
            </div>
          </div>
        </div>
        <ToastModal toast={toast} onClose={() => setToast(null)} />
      </div>
    </>
  );
}
