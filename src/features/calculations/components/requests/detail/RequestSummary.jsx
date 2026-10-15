import { useState } from "react";
import { ChevronDown, Pencil } from "lucide-react";
import { REQUEST_SUMMARY } from "../../../constants/requestSummary";

function Field({ label, jp, value, wide }) {
  const isFilled = Boolean(value && value !== "—");

  return (
    <div
      className={`px-3.5 py-2.5 rounded-lg border transition-all ${wide ? "sm:col-span-2 xl:col-span-4" : ""
        } ${isFilled
          ? "bg-gray-50/70 hover:bg-gray-50 border-gray-200/80"
          : "bg-gray-50/30 border-dashed border-gray-200/80"
        }`}
    >
      <dt className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span className="text-[13px] font-medium text-gray-500">
          {label}
        </span>
        {jp && (
          <>
            <span aria-hidden="true" className="text-gray-400">
              ·
            </span>
            <span lang="ja" className="text-xs font-medium text-gray-500">
              {jp}
            </span>
          </>
        )}
      </dt>
      <dd
        className={`mt-1 text-xs sm:text-sm break-words whitespace-pre-line leading-relaxed ${isFilled ? "font-medium text-gray-800" : "text-gray-400 italic"
          }`}
      >
        {value || "—"}
      </dd>
    </div>
  );
}

function Section({ title, fields, request }) {
  return (
    <div className="space-y-2.5">
      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3399cc]" />
        <span>{title}</span>
      </h4>
      <dl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
        {fields.map((field) => (
          <Field
            key={field.label}
            {...field}
            value={field.value(request.fields || {}, request)}
          />
        ))}
      </dl>
    </div>
  );
}

export function RequestSummary({ request, onEdit }) {
  const [showAll, setShowAll] = useState(false);

  const sections = REQUEST_SUMMARY[request.coverType] || [];
  const visibleSections = sections.filter(
    (section) => !section.when || section.when(request),
  );

  const [first, ...rest] = visibleSections;

  return (
    <div className="space-y-3">
      {/* ── Top Bar (No Cover Type) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-gray-100">
        <p className="text-xs sm:text-sm text-gray-500">
          General project identity and parameters submitted for this project.
        </p>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 h-8.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-xs active:scale-95 transition-all shrink-0"
          >
            <Pencil className="w-3.5 h-3.5 text-[#0d3b66]" />
            <span>Edit Project</span>
          </button>
        )}
      </div>

      {/* ── Primary Identity Section ── */}
      {first && <Section {...first} request={request} />}

      {/* ── Additional Sections when Expanded ── */}
      {showAll &&
        rest.map((section) => (
          <div
            key={section.title}
            className="pt-3 border-t border-gray-100 animate-in fade-in duration-200"
          >
            <Section {...section} request={request} />
          </div>
        ))}

      {/* ── Show All Details / Show Less Toggle ── */}
      {rest.length > 0 && (
        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="inline-flex items-center gap-1.5 h-8.5 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-xs active:scale-95 transition-all"
          >
            <span>
              {showAll
                ? "Show less"
                : `Show all details (${rest.length} more sections)`}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${showAll ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
