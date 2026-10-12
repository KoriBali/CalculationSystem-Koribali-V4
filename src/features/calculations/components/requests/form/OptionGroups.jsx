// Option button groups of the New Request form.
//   BtnGroup   — pick one (radio)
//   CheckGroup — pick any (checkbox; square check, like the Discipline cards)
// Styling is chosen through small lookup tables instead of nested ternaries.
import { Check } from "lucide-react";

// Group layout: a row of equal buttons; on phones optionally a 2- or
// 3-column grid; or `fit` — buttons as wide as their label, left aligned and
// wrapping (for groups that don't sit in a grid column).
const GROUP_LAYOUT = {
  fit: "flex flex-wrap gap-2",
  2: "grid grid-cols-2 sm:flex w-full gap-2",
  3: "grid grid-cols-3 sm:flex w-full gap-2",
  row: "flex w-full gap-2",
};
const groupLayout = (mobileCols, fit) =>
  GROUP_LAYOUT[fit ? "fit" : mobileCols] ?? GROUP_LAYOUT.row;

// Side padding of stretched buttons.
//   tight   — a group squeezed into one column of the 4-column grid (xl)
//   compact — small padding on xl too, for a narrow column
const BTN_PADDING = {
  tight: "px-2 xl:px-1",
  compact: "px-2",
  normal: "px-2 xl:px-4",
};
const btnSizing = (fit, padding) =>
  fit ? "flex-none min-w-[80px] px-4" : `flex-1 min-w-0 ${padding}`;

const BTN_BASE =
  "flex items-center justify-center gap-1.5 whitespace-nowrap py-2 lg:py-2.5 rounded-lg hp:rounded-md border text-xs md:text-sm font-medium cursor-pointer transition-colors active:scale-[0.98]";

// Button look by state.
const BTN_TONE = {
  active: "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-50",
  // Still the value the cover gave: same dashed border as auto-filled inputs.
  activeAutoFilled: "border-dashed border-blue-400 bg-blue-50 text-blue-700",
  // Nothing picked and one is needed.
  error: "border-red-500 bg-[#fff5f5] text-gray-600 hover:bg-red-50",
  idle: "border-gray-300 bg-white text-gray-600 hover:border-slate-400 hover:bg-slate-50 hover:text-gray-800",
};
const btnTone = ({ active, autoFilled, hasError }) =>
  (active && (autoFilled ? "activeAutoFilled" : "active")) ||
  (hasError && "error") ||
  "idle";

// Pick-one group (New / Change / Reuse, …): equal, separate buttons that
// line up with the inputs around them.
// `autoFilled` / `hasError`: see BTN_TONE. `mobileCols`, `fit`: see
// GROUP_LAYOUT. `tight` / `compact`: see BTN_PADDING. `disabled`: greyed out.
// `allowDeselect`: clicking the picked option again clears the choice — for
// optional groups, which may be left empty.
export function BtnGroup({
  options,
  value,
  onChange,
  autoFilled = false,
  hasError = false,
  mobileCols,
  fit = false,
  disabled = false,
  compact = false,
  tight = false,
  allowDeselect = false,
}) {
  const padding =
    BTN_PADDING[(tight && "tight") || (compact && "compact") || "normal"];
  return (
    <div role="radiogroup" className={groupLayout(mobileCols, fit)}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={opt.jp}
            onClick={() => onChange(allowDeselect && active ? "" : opt.value)}
            disabled={disabled}
            className={`${btnSizing(fit, padding)} ${BTN_BASE} disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${BTN_TONE[btnTone({ active, autoFilled, hasError })]}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// Pick-any group. Each option's `value` is the key in `values` it toggles.
// `stretchXl`: with `fit`, from xl the buttons share the group's width
// instead (for a group set to one grid column wide).
export function CheckGroup({
  options,
  values,
  onToggle,
  mobileCols,
  fit = false,
  stretchXl = false,
}) {
  const stretch = stretchXl ? "xl:flex-1 xl:min-w-0" : "";
  return (
    <div
      role="group"
      className={`${groupLayout(mobileCols, fit)} ${stretchXl ? "xl:flex-nowrap" : ""}`}
    >
      {options.map((opt) => {
        const on = !!values[opt.value];
        return (
          <button
            key={opt.value}
            type="button"
            role="checkbox"
            aria-checked={on}
            title={opt.jp}
            onClick={() => onToggle(opt.value)}
            className={`${btnSizing(fit, "px-2 xl:px-3")} ${stretch} ${BTN_BASE} ${BTN_TONE[on ? "active" : "idle"]}`}
          >
            <span
              aria-hidden="true"
              className={`shrink-0 flex items-center justify-center w-3.5 h-3.5 md:w-4 md:h-4 rounded-[4px] border transition-colors ${
                on
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-slate-300"
              }`}
            >
              {on && (
                <Check className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
              )}
            </span>
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
