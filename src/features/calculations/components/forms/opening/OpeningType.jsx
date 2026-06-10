import React from "react";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */

// Dynamic styling for input fields based on validation state
const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

// Renders a red error message below an invalid field
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

/**
 * MAIN COMPONENT: OpeningType
 */
export function OpeningType({ openingType, onUpdate, errors }) {
  return (
    <div className="bg-white border border-gray-200 px-4 md:px-5 py-6 md:py-5 shadow-sm rounded-b-lg md:rounded-b-2xl">
      {/* HEADER */}
      <div>
        {/* CARD */}
        <div className="relative">
          <select
            value={openingType.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className={`${inputStyle(errors.type)} lg:px-2 xl:px-4 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px]`}
          >
            <option value="" disabled>
              Select Opening Part Type
            </option>

            <option value="box">Box Type</option>
            <option value="r">R Type</option>
          </select>
          <ErrorStyle show={errors.type} text={errors.type} />
        </div>
      </div>
    </div>
  );
}
