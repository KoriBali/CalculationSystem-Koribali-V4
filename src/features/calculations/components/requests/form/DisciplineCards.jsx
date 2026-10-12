// Calculation / Drawing cards — pick one or both. Square check = "pick any"
// (the YP / YS cover cards use a circle = "pick one").
import { Check } from "lucide-react";

import { DISCIPLINE_OPTIONS } from "../../../constants/requestFormOptions";

// Card look by state.
const CARD_TONE = {
  active: "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50",
  // Still the value the cover gave: dashed, like auto-filled inputs.
  activeAutoFilled: "border-dashed border-blue-400 bg-blue-50 shadow-sm",
  error: "border-red-500 bg-[#fff5f5] hover:bg-red-50",
  idle: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
};
const cardTone = ({ active, autoFilled, hasError }) =>
  (active && (autoFilled ? "activeAutoFilled" : "active")) ||
  (hasError && "error") ||
  "idle";

// `value`: { calc, drawing }. `onToggle(id)`: flips one discipline.
// `autoFilled` / `hasError`: see CARD_TONE.
export function DisciplineCards({ value, onToggle, autoFilled, hasError }) {
  return (
    // Same column gap as the input grids; from xl a card per column of the
    // 4-column field grid, so the label and its check stay close.
    <div
      data-field="discipline"
      role="group"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-4"
    >
      {DISCIPLINE_OPTIONS.map(({ id, label, jp, icon }) => {
        const Icon = icon;
        const active = !!value[id];
        return (
          <button
            key={id}
            type="button"
            role="checkbox"
            aria-checked={active}
            title={jp}
            onClick={() => onToggle(id)}
            className={`group w-full flex items-center justify-between px-3 xl:px-4 py-2.5 lg:py-3 rounded-lg hp:rounded-md border text-left transition-all duration-300 cursor-pointer active:scale-[0.98] ${CARD_TONE[cardTone({ active, autoFilled, hasError })]}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-0.5 rounded shrink-0 ${active ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
              >
                <Icon size={16} />
              </div>
              <p
                className={`text-[12px] md:text-sm font-medium ${active ? "text-blue-700" : "text-slate-700"}`}
              >
                {label}
              </p>
            </div>
            <span
              aria-hidden="true"
              className={`shrink-0 ml-2 flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-[5px] border transition-colors ${
                active
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-slate-300 group-hover:border-slate-400"
              }`}
            >
              {active && (
                <Check className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={3} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
