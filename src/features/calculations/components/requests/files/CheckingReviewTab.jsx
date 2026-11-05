import { useState } from "react";
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  Trash2,
  ExternalLink,
  MessageSquare,
  UserCheck,
} from "lucide-react";
import { CHECK_STATUS_MAP } from "../../../constants/requestFileTabs";
import { formatFileSize } from "../../../utils/requestForm";
import { fileBlob } from "../../../data/requestStore";
import { FileUploadModal } from "./FileUploadModal";

const openFileInTab = (id) => {
  const blob = fileBlob(id);
  if (blob) window.open(URL.createObjectURL(blob), "_blank", "noopener");
};

export function CheckingReviewTab({
  cases = [],
  files = [],
  onUpload,
  onRemove,
}) {
  const [selectedCaseForReview, setSelectedCaseForReview] = useState(null);

  const STATUS_OPTIONS = [
    { id: "need_revision", label: "Need Revision (需修正)" },
    { id: "approved", label: "Approved (承認)" },
    { id: "under_review", label: "Under Review (確認中)" },
  ];

  const handleUploadSubmit = (selectedFiles, meta) => {
    if (!selectedCaseForReview) return;
    onUpload("checking", selectedFiles, {
      ...meta,
      caseId: selectedCaseForReview.id,
      caseNo: selectedCaseForReview.no,
    });
  };

  if (cases.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-slate-500">
            Internal checker redline markups (Adobe PDF annotations) and review notes per case.
          </p>
        </div>

        <div className="w-full flex flex-col items-center text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 transition-colors">
          <span className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 shadow-2xs">
            <FileCheck2 className="w-6 h-6" />
          </span>
          <span className="mt-3 text-base font-semibold text-slate-800">
            No Cases to Review Yet
          </span>
          <span className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
            Once calculation or drawing cases are submitted for check, reviewers can upload redline PDF markups and revision instructions here.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Sub-bar: Hint ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-slate-500">
          Internal checker redline markups (Adobe PDF annotations) and review notes per case.
        </p>
      </div>

      {cases.map((c, idx) => {
        const caseNumber = c.no || `Case ${idx + 1}`;
        const rawTitle = c.title?.trim();
        const caseTitle =
          rawTitle && rawTitle !== c.no
            ? rawTitle
            : c.workType === "drawing"
            ? "Drawing Case"
            : "Calculation Case";

        // Filter files uploaded for checking this case
        const caseMarkupFiles = files.filter(
          (f) => f.caseId === c.id || f.caseNo === c.no
        );

        // Derive check status from case or files
        const latestFile = caseMarkupFiles[caseMarkupFiles.length - 1];
        const statusKey =
          latestFile?.reviewStatus ||
          (c.status?.toLowerCase().includes("correction")
            ? "need_revision"
            : c.status?.toLowerCase().includes("cleared")
            ? "approved"
            : "under_review");

        const statusConfig =
          CHECK_STATUS_MAP[statusKey] || CHECK_STATUS_MAP.under_review;

        return (
          <div
            key={c.id}
            className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-xs"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-50/80 border-b border-slate-200/80">
              <div className="flex items-center gap-3 min-w-0 flex-wrap">
                <div className="w-8 h-8 rounded-lg bg-blue-50/80 border border-blue-200/60 flex items-center justify-center text-[#0d3b66] shrink-0">
                  <FileCheck2 className="w-4.5 h-4.5" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm sm:text-base font-bold text-slate-800">
                    {caseNumber}: {caseTitle}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.color}`}
                >
                  {statusKey === "approved" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : statusKey === "need_revision" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                  )}
                  {statusConfig.label}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-600 shadow-2xs">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Checker:</span>
                  <strong className="text-slate-800 font-semibold">
                    {c.checkedBy || "Internal Checker"}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCaseForReview(c)}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#0d3b66] hover:bg-[#092947] text-white shadow-xs transition-all active:scale-95 shrink-0"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>+ Upload Redline / Markup</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-3">
              {caseMarkupFiles.length === 0 ? (
                <div
                  onClick={() => setSelectedCaseForReview(c)}
                  className="group cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50/60 hover:bg-blue-50/30 hover:border-blue-400 p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400 group-hover:text-[#0d3b66] group-hover:border-blue-200 group-hover:scale-105 transition-all">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="mt-3 text-sm sm:text-base font-semibold text-slate-700 group-hover:text-[#0d3b66] transition-colors">
                    No checker redline markups uploaded for this case yet.
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed">
                    Download the report, annotate corrections in Adobe Acrobat, and upload the marked-up PDF here.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0d3b66] group-hover:text-blue-700 transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    Click to upload marked-up PDF
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Correction Markups & Feedback ({caseMarkupFiles.length}):
                  </span>
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                    {caseMarkupFiles.map((file) => {
                      const canOpen = fileBlob(file.id) !== null;
                      return (
                        <div
                          key={file.id}
                          className="p-3.5 sm:p-4 bg-white hover:bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-600 shrink-0 mt-0.5">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm text-slate-800">
                                  {file.name}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-medium">
                                  Annotated Markup
                                </span>
                                <span className="text-slate-400 text-xs">
                                  {formatFileSize(file.size)}
                                </span>
                              </div>
                              {file.note && (
                                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 flex items-start gap-1.5 bg-amber-50/70 border border-amber-200/60 p-2 rounded-lg">
                                  <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <span>{file.note}</span>
                                </p>
                              )}
                              <span className="text-xs text-slate-400 block mt-1.5">
                                By <strong className="text-slate-600 font-medium">{file.uploadedBy || "Checker"}</strong> ·{" "}
                                {new Date(file.uploadedAt).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {canOpen && (
                              <button
                                type="button"
                                onClick={() => openFileInTab(file.id)}
                                className="inline-flex items-center gap-1.5 h-8.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-[#0d3b66] bg-blue-50 hover:bg-blue-100 border border-blue-200/60 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View Markup
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onRemove("checking", file)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete markup"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={Boolean(selectedCaseForReview)}
        onClose={() => setSelectedCaseForReview(null)}
        onUpload={handleUploadSubmit}
        title={`Upload Redline Markup for ${selectedCaseForReview?.no || "Case"}`}
        targetCaseName={selectedCaseForReview?.title}
        statusOptions={STATUS_OPTIONS}
        accept=".pdf"
      />
    </div>
  );
}
