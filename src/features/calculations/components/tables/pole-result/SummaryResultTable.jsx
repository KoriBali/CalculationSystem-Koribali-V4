import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { getRows } from "../../../utils/formatResultTableRows";

// Status pill — shows the actual comparison (value vs limit) INSIDE the
// badge itself, e.g. "0.9 < 1.0", so the verdict is self-explanatory.
//
// When `value` is missing (null/undefined/"-"), we show a distinct
// "No Data" state instead of defaulting to NG — a missing safety factor
// means the check hasn't produced a number yet, not that it failed.
function StatusBadge({ value, limit }) {
  const displayLimit = limit ?? 1.0;
  const numericValue = typeof value === "number" ? value : Number(value);
  const hasValue =
    value != null && value !== "-" && !Number.isNaN(numericValue);

  if (!hasValue) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hp:text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        <HelpCircle className="w-4 h-4 hp:w-3.5 hp:h-3.5 shrink-0" />
        <span>No Data</span>
      </span>
    );
  }

  const isOk = numericValue < displayLimit;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm hp:text-[10px] font-semibold
      ${
        isOk
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {isOk ? (
        <CheckCircle2 className="w-4 h-4 hp:w-3.5 hp:h-3.5 shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 hp:w-3.5 hp:h-3.5 shrink-0" />
      )}
      <span>{isOk ? "OK" : "NG"}</span>
      <span className="opacity-40">·</span>
      <span className="tabular-nums font-normal">
        {numericValue} {isOk ? "<" : ">"} {displayLimit}
      </span>
    </span>
  );
}

// The 3 wind-load conditions evaluated for every pole. Pulled out as data
// instead of the table markup being copy-pasted 3 times.
const WIND_CONDITIONS = [
  "Direct Wind Condition A",
  "Direct Wind Condition B",
  "Oblique Wind Condition",
];

function ConditionTable({ label, rows }) {
  return (
    <div className="mb-8 last:mb-0">
      {/* Condition divider */}
      <div className="flex items-center mt-6 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <h4 className="mx-4 px-3 py-1.5 text-xs font-semibold text-[#0d3b66] bg-[#0d3b66]/10 rounded-md whitespace-nowrap">
          {label}
        </h4>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Table container — solid white + shadow, lifted off the tinted
          tray behind it (the pole card), so it reads as its own surface
          instead of blending into the surrounding white. */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full table-fixed text-sm hp:text-[10px]">
          <colgroup>
            <col className="w-12" />
            <col className="w-[32%]" />
            <col className="w-[20%]" />
            <col className="w-[38%]" />
          </colgroup>

          <thead>
            <tr className="bg-slate-100 border-b border-gray-300 divide-x divide-gray-300">
              <th className="px-4 py-3 hp:px-3 hp:py-2 text-center font-semibold hp:font-medium text-slate-500">
                No
              </th>
              <th className="px-4 py-3 hp:px-3 hp:py-2 text-left font-semibold hp:font-medium text-slate-500">
                Description
              </th>
              <th className="px-4 py-3 hp:px-3 hp:py-2 text-right font-semibold hp:font-medium text-slate-500">
                Safety Factor
              </th>
              <th className="px-4 py-3 hp:px-3 hp:py-2 text-center font-semibold hp:font-medium text-slate-500">
                Result
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => {
              // NOTE: safetyFactor/limit still fall back to the same
              // placeholder values (0.9 / 1.0) the original code hardcoded
              // for every single row. Wire these to row.safetyFactor /
              // row.limit once getRows() returns real per-row values —
              // right now every pole, every condition, always reads OK.
              const safetyFactor = row.safetyFactor ?? 0.9;
              const limit = row.limit ?? 1.0;
              return (
                <tr
                  key={i}
                  className="border-b border-gray-300 last:border-b-0 divide-x divide-gray-200 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-3 hp:px-3 hp:py-2 text-center text-slate-500 tabular-nums">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 hp:px-3 hp:py-2 text-slate-700 truncate">
                    {row.description}
                  </td>
                  <td className="px-4 py-3 hp:px-3 hp:py-2 text-right text-slate-700 tabular-nums font-medium">
                    {safetyFactor}
                  </td>
                  <td className="px-4 py-3 hp:px-3 hp:py-2 text-center">
                    <StatusBadge value={safetyFactor} limit={limit} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SummaryResultTable({ resultPole }) {
  return (
    <div className="mx-6 my-6 space-y-6 hp:mx-2 hp:mt-4 hp:mb-8">
      {resultPole.map((_, poleIndex) => {
        const rows = getRows(poleIndex, resultPole);
        return (
          <div
            key={poleIndex}
            className="bg-slate-50 rounded-2xl border border-gray-200 shadow-sm p-5 hp:p-4"
          >
            {/* Pole header — accent bar, same pattern as Opening/Baseplate Evaluation */}
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 hp:h-3.5 bg-[#3399cc] rounded-full" />
              <h3 className="text-[#0d3b66] font-medium text-sm hp:text-xs leading-tight">
                Pole {poleIndex + 1} Evaluation
              </h3>
            </div>

            {WIND_CONDITIONS.map((label) => (
              <ConditionTable key={label} label={label} rows={rows} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
