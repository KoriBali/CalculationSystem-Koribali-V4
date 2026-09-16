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

const FOUNDATION_TYPE_OPTIONS = [
  { value: "square-caisson", label: "Square Caisson Type" },
  { value: "round-caisson", label: "Round Caisson Type" },
];

/**
 * MAIN COMPONENT: FoundationType
 */
export function FoundationType({ foundationType, onUpdate, errors }) {
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
          value={foundationType.type}
          onChange={(val) => onUpdate({ type: val })}
          options={FOUNDATION_TYPE_OPTIONS}
          hasError={!!errors.type}
          placeholder="Select Foundation Type"
        />
        <ErrorStyle show={errors.type} text={errors.type} />
      </div>
    </div>
  );
}
