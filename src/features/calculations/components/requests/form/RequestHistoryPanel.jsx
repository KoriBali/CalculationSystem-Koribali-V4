// Earlier requests of a YP Request No.'s head + project number, and whether
// the typed History No. continues them correctly. 5 rows show, the rest
// scroll.
import { CheckCircle, Info } from "lucide-react";

import { CLASSIFICATION_OPTIONS } from "../../../constants/requestFormOptions";
import {
  formatDocumentNo,
  formatShortDate,
  historyLabel,
} from "../../../utils/requestForm";
import { SubGroupTitle } from "./FormPrimitives";

// Status bar look and icon per result of getHistoryStatus.
const STATUS_LOOK = {
  ok: {
    className: "border-gray-200 bg-white text-emerald-700",
    Icon: CheckCircle,
  },
  used: {
    className: "border-red-100 bg-red-50/60 text-red-700",
    Icon: Info,
  },
  warn: {
    className: "border-amber-100 bg-amber-50/60 text-amber-700",
    Icon: Info,
  },
};
const LOOK_BY_STATUS = {
  first: "ok",
  next: "ok",
  used: "used",
  behind: "warn",
  ahead: "warn",
};

// Message per status. `c` = the status context plus the typed number.
const outOfOrder = (c, what) =>
  `History No. ${historyLabel(c.typed)} ${what}. History No. must continue in order, so the next one is ${c.next}: ${c.nextDocumentNo}.`;
const STATUS_MESSAGE = {
  first: (c) =>
    `${c.documentNo} is fine: it's the first request for this project, so it can start at any History No.`,
  next: (c) =>
    `${c.documentNo} is correct: History No. ${historyLabel(c.typed)} comes right after the latest (${historyLabel(c.latest)}).`,
  used: (c) => outOfOrder(c, "is already used (highlighted above)"),
  behind: (c) =>
    outOfOrder(c, `is lower than the latest (${historyLabel(c.latest)})`),
  ahead: (c) => outOfOrder(c, "skips ahead"),
};

const TH = "px-4 py-2 font-medium text-xs whitespace-nowrap";
const COLUMNS = [
  "History No.",
  "Request No.",
  "Classification",
  "Scheduled Delivery",
];

// `docNo`: the parsed Request No. `documentNo`: as typed. `history`: earlier
// requests, newest first. `result`: getHistoryStatus(docNo, history).
// `onUseNext`: puts the next free number in the field.
export function RequestHistoryPanel({
  docNo,
  documentNo,
  history,
  result,
  onUseNext,
}) {
  const { className, Icon } = STATUS_LOOK[LOOK_BY_STATUS[result.status]];
  const message = STATUS_MESSAGE[result.status]({ ...result, documentNo });

  return (
    <div className="mt-6">
      <SubGroupTitle>
        Request History
        <span className="font-normal text-gray-500">
          (Head Code {docNo.head} + Project No. {docNo.projectNo})
        </span>
      </SubGroupTitle>
      <div className="rounded-lg hp:rounded-md border border-gray-200 overflow-hidden">
        {history.length > 0 ? (
          <div className="max-h-[219px] overflow-auto scrollbar-soft">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="sticky top-0 bg-gray-50 text-gray-500 shadow-[inset_0_-1px_0_0_#e5e7eb]">
                <tr>
                  {COLUMNS.map((col) => (
                    <th key={col} className={TH}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((h) => {
                  const taken =
                    result.status === "used" && h.historyNo === result.typed;
                  const cls = CLASSIFICATION_OPTIONS.find(
                    (o) => o.value === h.classification,
                  );
                  return (
                    <tr
                      key={h.historyNo}
                      className={
                        taken ? "bg-red-50 text-red-700" : "text-slate-700"
                      }
                    >
                      <td className="px-4 py-2 font-medium whitespace-nowrap">
                        {h.historyNo || (
                          <span className="font-normal text-gray-500">
                            None
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 tracking-wide whitespace-nowrap">
                        {formatDocumentNo(
                          docNo.head,
                          h.tail,
                          docNo.projectNo,
                          h.historyNo,
                        )}
                      </td>
                      <td
                        className="px-4 py-2 whitespace-nowrap"
                        title={cls?.jp}
                      >
                        {cls?.label ?? h.classification}
                      </td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
                        {formatShortDate(h.deliveryDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-4 py-3 text-xs md:text-sm text-gray-500">
            No requests have been issued for this project yet.
          </p>
        )}

        {/* Is the typed History No. the right one? */}
        <div
          className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 border-t text-xs md:text-sm ${className}`}
        >
          <span className="flex items-start gap-2">
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{message}</span>
          </span>
          {!result.ok && (
            <button
              type="button"
              onClick={() => onUseNext(result.nextDocumentNo)}
              className="inline-flex items-center h-8 px-3 shrink-0 rounded-lg hp:rounded-md text-xs md:text-sm font-medium bg-white text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#eef2f6] shadow-sm active:scale-[0.98] transition-all"
            >
              Use {result.nextDocumentNo}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
