import React from "react";
import { ChevronRight } from "lucide-react";

/**
 * HELPER COMPONENTS & FUNCTIONS
 * Defined outside to prevent re-creation on every component re-render
 */

const inputStyle = (hasError) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${hasError
    ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
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
export function BaseplateType({ baseplateType, onUpdate, errors }) {
  return (
    <div className="bg-white border border-gray-200 px-4 md:px-5 py-6 md:py-5 shadow-sm rounded-b-xl md:rounded-b-2xl">
      {/* HEADER */}
      <div>
        {/* CARD */}
        <div className="relative">
          <div className="relative">
            <select
              value={baseplateType.type}
              onChange={(e) => onUpdate({ type: e.target.value })}
              className={`${inputStyle(errors.type)} lg:pl-3 xl:pl-4 pr-8 lg:pr-8 xl:pr-8 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] appearance-none`}
            >
              <option value="" disabled>
                Select Baseplate Type
              </option>

              <option value="4rib">4 Rib Type</option>
              <option value="8rib">8 Rib Type</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>
          <ErrorStyle show={errors.type} text={errors.type} />
        </div>
      </div>
    </div>
  );
}
