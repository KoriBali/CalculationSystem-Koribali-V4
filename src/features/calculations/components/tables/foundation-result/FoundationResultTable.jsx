import {
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

// Maps the internal foundation type key to a human-readable description
const typeLabelMap = {
  "square-caisson": "Square Caisson Foundation",
  "round-caisson": "Round Caisson Foundation",
};

// Status pill — shows the actual comparison (value vs limit) INSIDE the
// badge itself, e.g. "0.85 < 1.0", so the verdict is self-explanatory.
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
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs md:text-sm font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        <HelpCircle className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
        <span>No Data</span>
      </span>
    );
  }

  const isOk = numericValue < displayLimit;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs md:text-sm font-semibold
      ${
        isOk
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {isOk ? (
        <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
      )}
      <span>{isOk ? "OK" : "NG"}</span>
      <span className="opacity-40">·</span>
      <span className="tabular-nums font-normal">
        {numericValue} {isOk ? "<" : ">"} {displayLimit}
      </span>
    </span>
  );
}

// Component to display foundation calculation results in a table format
export function FoundationResultTable({ data }) {
  const limitValue = data?.limit ?? 1.0;

  const rows = [
    {
      no: 1,
      description: typeLabelMap[data?.type] ?? "-",
      safetyFactor: data?.safetyFactor ?? "-",
      limit: limitValue,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-12">
      {/* Top accent strip — thin gradient line */}
      <div
        aria-hidden="true"
        className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]"
      />

      {/* Header — light background, navy text/icon */}
      <div className="px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 border-b border-gray-100">
        <div className="bg-blue-50 p-2 rounded-lg shrink-0">
          <CheckCircle2 className="w-5 h-5 text-[#0d3b66]" />
        </div>
        <div>
          <h2 className="text-[#0d3b66] text-xs md:text-sm font-semibold mb-0.5">
            Calculation Results
          </h2>
          <p className="text-slate-500 text-xs font-medium hidden md:block">
            Comprehensive structural analysis output
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 md:px-6 pt-5 pb-6 space-y-3">
        {/* Section label — accent bar + text */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
          <h3 className="text-[#0d3b66] text-xs md:text-sm font-medium">
            Foundation Evaluation (Actual Size)
          </h3>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full table-fixed text-xs md:text-sm">
            <colgroup>
              <col className="w-12 md:w-16" />
              <col className="w-[32%]" />
              <col className="w-[20%]" />
              <col className="w-[38%]" />
            </colgroup>

            {/* Table header — light neutral background with column dividers,
                so the grid reads clearly as a table at a glance */}
            <thead>
              <tr className="bg-slate-100 border-b border-gray-300 divide-x divide-gray-300">
                <th className="px-4 py-3 text-center font-semibold text-slate-500 text-xs md:text-sm">
                  No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-500 text-xs md:text-sm">
                  Description
                </th>
                <th className="px-4 py-3 text-right font-semibold text-slate-500 text-xs md:text-sm">
                  Safety Factor
                </th>
                <th className="px-4 py-3 text-center font-semibold text-slate-500 text-xs md:text-sm">
                  Result
                </th>
              </tr>
            </thead>

            {/* Table body — row + column dividers, subtle hover state */}
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.no}
                  className="border-b border-gray-300 last:border-b-0 divide-x divide-gray-200 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-3 text-center text-slate-500 tabular-nums">
                    {row.no}
                  </td>
                  <td className="px-4 py-3 text-slate-700 truncate">
                    {row.description}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700 tabular-nums font-medium">
                    {row.safetyFactor}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge value={row.safetyFactor} limit={row.limit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
