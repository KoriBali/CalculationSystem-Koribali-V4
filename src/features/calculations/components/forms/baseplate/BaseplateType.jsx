import React from "react";
import { FormSelect } from "../../../../../shared/components/FormSelect";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */

// Small component to display validation error messages
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

const BASEPLATE_TYPE_OPTIONS = [
  { value: "4rib", label: "4 Rib Type" },
  { value: "8rib", label: "8 Rib Type" },
];

/**
 * MAIN COMPONENT: BaseplateType
 */
export function BaseplateType({ baseplateType, onUpdate, errors }) {
  return (
    <div
      className="
        bg-slate-50/40
        border border-slate-200
        rounded-xl
        px-4 py-4 md:px-5 md:py-5
        w-full xl:max-w-xl
      "
    >
      <div className="relative">
        <FormSelect
          id="type"
          value={baseplateType.type}
          onChange={(val) => onUpdate({ type: val })}
          options={BASEPLATE_TYPE_OPTIONS}
          hasError={!!errors.type}
          placeholder="Select Baseplate Type"
        />
        <ErrorStyle show={errors.type} text={errors.type} />
      </div>
    </div>
  );
}
