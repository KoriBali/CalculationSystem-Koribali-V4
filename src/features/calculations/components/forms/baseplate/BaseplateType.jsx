import React from "react";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */

// Dynamic styling for input fields based on validation state
const inputStyle = (hasError) =>
  `w-full pl-2 md:pl-4 pr-10 md:pr-4 py-2 md:py-2.5 rounded-md md:rounded-lg outline-none transition-all border text-xs md:text-sm
  ${
    hasError
      ? "border border-red-500 bg-[#fff5f5] ring-1 ring-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

// Small component to display validation error messages
const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

/**
 * MAIN COMPONENT: BaseplateType
 */
export function BaseplateType({ BaseplateType, onUpdate, errors }) {
  return (
    <div className="bg-white border border-gray-200 px-4 md:px-5 py-6 md:py-5 shadow-sm rounded-b-lg md:rounded-b-2xl">
      {/* HEADER */}
      <div>
        {/* CARD */}
        <div className="relative">
          <select
            value={BaseplateType.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className={`${inputStyle(errors.type)} min-h-[42px]`}
          >
            <option value="" disabled>
              Select Baseplate Type
            </option>

            <option value="4rib">4 Rib Type</option>
            <option value="8rib">8 Rib Type</option>
          </select>
          <ErrorStyle show={errors.type} text={errors.type} />
        </div>
      </div>
    </div>
  );
}
