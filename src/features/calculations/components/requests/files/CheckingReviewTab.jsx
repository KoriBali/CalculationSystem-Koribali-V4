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
          <p className="text-xs md:text-sm text-gray-500">
            Internal checker redline markups (Adobe PDF annotations) and review notes per case.
          </p>
        </div>

        <div className="w-full flex flex-col items-center text-center rounded-lg hp:rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 transition-colors">
          <span className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-400">
            <FileCheck2 className="w-5 h-5" />
          </span>
          <span className="mt-3 text-sm font-medium text-slate-700">
            No Cases to Review Yet
          </span>
          <span className="mt-1 text-xs md:text-sm text-slate-500 max-w-sm">
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
        <p className="text-xs md:text-sm text-gray-500">
          Internal checker redline markups (Adobe PDF annotations) and review notes per case.
        </p>
      </div>
      {cases.map((c, idx) => {
        const caseNumber = c.no || `Case ${idx + 1}`;
        const caseTitle = c.title || "Design Case";

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
            className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck2 className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">
                  {caseNumber}: {caseTitle}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${statusConfig.color}`}
                >
                  {statusKey === "approved" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : statusKey === "need_revision" ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {statusConfig.label}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  Checker: <strong className="text-slate-700">{c.checkedBy || "Internal Checker"}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCaseForReview(c)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#0d3b66] text-white hover:bg-[#092947] shadow-2xs transition-all active:scale-95"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  + Upload Redline / Markup
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              {caseMarkupFiles.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center">
                  <p className="text-xs text-slate-500">
                    No checker redline markups uploaded for this case yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Download the report, annotate corrections in Adobe Acrobat, and upload the marked-up PDF here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Correction Markups & Feedback ({caseMarkupFiles.length}):
                  </span>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    {caseMarkupFiles.map((file) => {
                      const canOpen = fileBlob(file.id) !== null;
                      return (
                        <div
                          key={file.id}
                          className="p-3 bg-white hover:bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-600 shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-xs text-slate-800">
                                  {file.name}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-medium">
                                  Annotated Markup
                                </span>
                                <span className="text-slate-400 text-[11px]">
                                  {formatFileSize(file.size)}
                                </span>
                              </div>
                              {file.note && (
                                <p className="text-xs text-slate-600 mt-1 flex items-start gap-1 bg-amber-50/60 border border-amber-200/50 p-1.5 rounded">
                                  <MessageSquare className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                                  <span>{file.note}</span>
                                </p>
                              )}
                              <span className="text-[10px] text-slate-400 block mt-1">
                                By {file.uploadedBy || "Checker"} ·{" "}
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
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-[#0d3b66] bg-blue-50 hover:bg-blue-100 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View Markup
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onRemove("checking", file)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete markup"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
