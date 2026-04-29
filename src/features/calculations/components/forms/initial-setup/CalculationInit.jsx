import { useConditionForm } from "../hooks/useConditionForm";

export default function CalculationSetup() {
  const {
    localCondition,
    errors,
    toast,
    confirmDisable,
    handleUpdate,
    handleNext,
  } = useConditionForm();

  return (
    <ConditionInput
      condition={localCondition}
      onUpdate={handleUpdate}
      onNext={handleNext}
      errors={errors}
    />
  );
}
