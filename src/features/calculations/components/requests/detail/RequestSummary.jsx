import { useState } from "react";
import {
  ChevronDown,
  Pencil,
  FileText,
  Layers,
  Calendar,
  Building,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { REQUEST_SUMMARY } from "../../../constants/requestSummary";

function Field({ label, jp, value, wide }) {
  const isFilled = Boolean(value && value !== "—");

  return (
    <div
      className={`p-3 rounded-lg border transition-colors ${
        wide ? "sm:col-span-2 xl:col-span-4" : ""
      } ${
        isFilled
          ? "bg-slate-50/70 border-slate-200/60"
          : "bg-slate-50/30 border-dashed border-slate-200/60"
      }`}
    >
      <dt className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span className="text-xs sm:text-[13px] font-medium text-slate-600">
          {label}
        </span>
        {jp && (
          <>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span lang="ja" className="text-[11px] sm:text-xs text-slate-500">
              {jp}
            </span>
          </>
        )}
      </dt>
      <dd
        className={`mt-1.5 text-xs sm:text-sm break-words whitespace-pre-line leading-relaxed ${
          isFilled ? "font-medium text-slate-800" : "text-slate-400 italic"
        }`}
      >
        {value || "—"}
      </dd>
    </div>
  );
}

function Section({ title, fields, request }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs sm:text-sm font-medium text-slate-700">{title}</h4>
      <dl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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
    <div className="space-y-5">
      {/* ── Top Bar with Edit Request Button ── */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Cover Type:</span>
          <span className="font-medium text-slate-700 uppercase px-2 py-0.5 rounded bg-slate-100 text-[11px]">
            {request.coverType || "YS"}
          </span>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-[#0d3b66] bg-blue-50 hover:bg-blue-100 border border-blue-200/80 shadow-xs active:scale-95 transition-all"
          >
            <Pencil className="w-3.5 h-3.5 text-[#0d3b66]" />
            Edit Request
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
            className="pt-5 border-t border-slate-200/80 animate-in fade-in duration-200"
          >
            <Section {...section} request={request} />
          </div>
        ))}

      {/* ── Show All Details / Show Less Toggle ── */}
      {rest.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 shadow-xs active:scale-95 transition-all"
          >
            <span>
              {showAll
                ? "Show less"
                : `Show all details (${rest.length} more sections)`}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
