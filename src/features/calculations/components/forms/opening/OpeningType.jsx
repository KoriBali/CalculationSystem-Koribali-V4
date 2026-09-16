import React from "react";
import { FormSelect } from "../../../../../shared/components/FormSelect";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */

// Renders a red error message below an invalid field
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

const OPENING_TYPE_OPTIONS = [
  { value: "box", label: "Box Type" },
  { value: "r", label: "R Type" },
];

/**
 * MAIN COMPONENT: OpeningType
 */
export function OpeningType({ openingType, onUpdate, errors }) {
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
          value={openingType.type}
          onChange={(val) => onUpdate({ type: val })}
          options={OPENING_TYPE_OPTIONS}
          hasError={!!errors.type}
          placeholder="Select Opening Type"
        />
        <ErrorStyle show={errors.type} text={errors.type} />
      </div>
    </div>
  );
}
