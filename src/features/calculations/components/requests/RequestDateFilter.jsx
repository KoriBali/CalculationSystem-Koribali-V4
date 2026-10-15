import { DateInput } from "../../../../shared/components/DateInput";
import { isInvalidRange } from "../../utils/requestDateFilters";

// From / To date range: two bordered date inputs with "to" between them.
// Either end may be left empty for an open range ("from 1 Mar" = since then).
//   value     { from: "YYYY-MM-DD", to }
//   onChange  (nextValue) => void

const inputClass =
  "h-10 w-full min-w-0 px-3 rounded-lg hp:rounded-md border text-sm text-slate-700 outline-none transition-all focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]";

export default function RequestDateFilter({ value = { from: "", to: "" }, onChange }) {
  const invalid = isInvalidRange(value);

  // Red when the range is inverted, navy tint once a date is picked (same
  // "applied" cue as the dropdown filters), plain otherwise.
  const tone = (filled) =>
    invalid
      ? "border-red-400 bg-[#fff5f5]"
      : filled
        ? "border-[#0d3b66]/30 bg-[#0d3b66]/5"
        : "border-slate-200 bg-white hover:border-slate-300";

  return (
    <div>
      <div className="flex items-center gap-2">
        <DateInput
          value={value?.from || ""}
          onChange={(val) => onChange({ ...value, from: val || "" })}
          aria-label="From"
          placeholder="yyyy-mm-dd"
          className={`${inputClass} ${tone(Boolean(value?.from))}`}
        />
        <span className="shrink-0 text-sm text-slate-400">to</span>
        <DateInput
          value={value?.to || ""}
          onChange={(val) => onChange({ ...value, to: val || "" })}
          aria-label="To"
          placeholder="yyyy-mm-dd"
          className={`${inputClass} ${tone(Boolean(value?.to))}`}
        />
      </div>
      {invalid && (
        <p className="mt-1.5 text-xs text-red-500">
          Start date is after end date, so this filter isn't applied.
        </p>
      )}
    </div>
  );
}
