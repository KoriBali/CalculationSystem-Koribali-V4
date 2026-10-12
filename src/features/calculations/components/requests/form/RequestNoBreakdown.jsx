// Read-only breakdown of a YP Request No. (図番): Head Code · Tail Brand ·
// Project No. · History No., filled in live from what's been typed.

// One part: its name over the value. Not typed yet: the placeholder in light
// grey. `note`: small text after the value (e.g. what "@" means), or in its
// place when there's no value. Values sit at the bottom, so they stay in
// line when a label wraps in a narrow column.
function Part({ label, value, placeholder = "—", note }) {
  return (
    <div className="flex flex-col justify-between bg-gray-50 px-3 xl:px-4 py-2 lg:py-2.5">
      <p className="text-xs md:text-[13px] text-gray-500">{label}</p>
      <p className="mt-1 text-xs md:text-sm font-semibold tracking-wide text-slate-900">
        {value ||
          (!note && <span className="text-slate-300">{placeholder}</span>)}
        {note && (
          <span
            className={`font-normal tracking-normal text-gray-500 ${value ? "ml-1.5" : ""}`}
          >
            {note}
          </span>
        )}
      </p>
    </div>
  );
}

// `docNo`: the parsed number (parseDocumentNo). `className`: placement in the
// parent grid.
export function RequestNoBreakdown({ docNo, className = "" }) {
  const parts = [
    {
      label: "Head Code",
      value: docNo.head,
      note: docNo.head === "@" ? "総務部 · no project" : null,
    },
    { label: "Tail Brand", value: docNo.tail },
    { label: "Project No. (PJNO)", value: docNo.projectNo },
    {
      label: "History No.",
      value: docNo.historyNo,
      note: docNo.valid && !docNo.historyNo ? "none" : null,
    },
  ];
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-lg hp:rounded-md border border-gray-200 bg-gray-200 ${className}`}
    >
      {parts.map((part) => (
        <Part key={part.label} {...part} />
      ))}
    </div>
  );
}
