// Shared class names for the New Request form controls.

// Border / background of an input by state — one lookup instead of a chain
// of ternaries.
const INPUT_STATE = {
  error: "border-red-500 bg-[#fff5f5] ring-1 ring-red-200",
  // Value still matches what the cover gave: dashed border and a light tint
  // so the user knows what to review.
  autoFilled:
    "border-dashed border-blue-300 bg-blue-50/40 focus:border-solid focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]",
  default:
    "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]",
};
const inputState = (hasError, autoFilled) =>
  (hasError && "error") || (autoFilled && "autoFilled") || "default";

// Text / number / date input — same look as ConditionForm's inputs.
// Fixed heights = the natural height of a text input, so date inputs (whose
// native picker makes them a bit taller) line up with the rest. Number
// inputs lose the browser's up/down arrows: they covered the unit shown on
// the right (m/s, sheets, …), and these values are typed anyway.
export const inputStyle = (hasError = false, autoFilled = false) =>
  `w-full h-[34px] md:h-[38px] lg:h-[42px] px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border placeholder:text-gray-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${INPUT_STATE[inputState(hasError, autoFilled)]}`;

// Disabled look for the text boxes that open with an option ("Other …",
// a competitor's name, …).
export const DISABLED_INPUT =
  "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";
