import { useState } from "react";
import {
  Folder,
  FileText,
  UploadCloud,
  ExternalLink,
  Trash2,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatFileSize } from "../../../utils/requestForm";
import { fileBlob } from "../../../data/requestStore";
import { FileUploadModal } from "./FileUploadModal";

const TH = "px-4 py-2 font-medium text-xs whitespace-nowrap text-slate-500";
const TD = "px-4 py-2.5 whitespace-nowrap text-slate-700";

const openFileInTab = (id) => {
  const blob = fileBlob(id);
  if (blob) window.open(URL.createObjectURL(blob), "_blank", "noopener");
};

export function CaseOutputsTab({
  workType = "calculation",
  cases = [],
  files = [],
  onUpload,
  onRemove,
  request,
}) {
  const [selectedCaseForUpload, setSelectedCaseForUpload] = useState(null);
  const [collapsedCases, setCollapsedCases] = useState({});

  const isCalc = workType === "calculation";
  const tabKey = isCalc ? "calculation" : "drawing";

  // Filter cases relevant to this workType
  const relevantCases = cases.filter((c) => {
    if (!c.workType || c.workType === "both") return true;
    return c.workType === workType;
  });

  const toggleCollapse = (caseId) => {
    setCollapsedCases((prev) => ({ ...prev, [caseId]: !prev[caseId] }));
  };

  const handleUploadSubmit = (selectedFiles, meta) => {
    if (!selectedCaseForUpload) return;
    onUpload(tabKey, selectedFiles, {
      ...meta,
      caseId: selectedCaseForUpload.id,
      caseNo: selectedCaseForUpload.no,
    });
  };

  if (relevantCases.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs md:text-sm text-gray-500">
            {isCalc
              ? "Generated calculation reports, schematics, and supporting calculation files organized per case."
              : "CAD drawings, approval sheets, and production drawings organized per case."}
          </p>
        </div>

        <div className="w-full flex flex-col items-center text-center rounded-lg hp:rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 transition-colors">
          <span className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-400">
            <Folder className="w-5 h-5" />
          </span>
          <span className="mt-3 text-sm font-medium text-slate-700">
            No {isCalc ? "Calculation" : "Drawing"} Cases Created Yet
          </span>
          <span className="mt-1 text-xs md:text-sm text-slate-500 max-w-sm">
            Once you add a case in the section above and run the calculations or drawings, its output reports and diagrams will automatically appear here.
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
          {isCalc
            ? "Generated calculation reports, schematics, and supporting calculation files organized per case."
            : "CAD drawings, approval sheets, and production drawings organized per case."}
        </p>
      </div>
      {relevantCases.map((c, idx) => {
        const isCollapsed = Boolean(collapsedCases[c.id]);
        const caseNumber = c.no || `Case ${idx + 1}`;
        const caseTitle = c.title || (isCalc ? "Structural Analysis" : "Production Drawing");

        // Files uploaded specifically for this case
        const caseUploadedFiles = files.filter(
          (f) => f.caseId === c.id || f.caseNo === c.no
        );

        // System outputs defined for this case
        const systemOutputs = isCalc
          ? [
              {
                id: `auto_calc_${c.id}`,
                name: `Calculation_Report_${caseNumber.replace(/\s+/g, "_")}.pdf`,
                type: "Calculation Report",
                source: "System Generated",
                size: 2450000,
                isAuto: true,
              },
              {
                id: `auto_schematic_${c.id}`,
                name: `Schematic_Diagram_${caseNumber.replace(/\s+/g, "_")}.pdf`,
                type: "Schematic Diagram",
                source: "System Generated",
                size: 850000,
                isAuto: true,
              },
            ]
          : [
              {
                id: `auto_drw_${c.id}`,
                name: `Production_Drawing_${caseNumber.replace(/\s+/g, "_")}.pdf`,
                type: "Drawing Sheet",
                source: "System Generated",
                size: 3100000,
                isAuto: true,
              },
            ];

        return (
          <div
            key={c.id}
            className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
          >
            {/* Case Header Card */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200/80">
              <div
                className="flex items-center gap-2.5 cursor-pointer min-w-0"
                onClick={() => toggleCollapse(c.id)}
              >
                <Folder className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">
                  {caseNumber}: {caseTitle}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-medium">
                  {c.status || "In Progress"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCaseForUpload(c)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                  + Upload to {caseNumber}
                </button>
                <button
                  type="button"
                  onClick={() => toggleCollapse(c.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Content (Collapsible) */}
            {!isCollapsed && (
              <div className="p-3 space-y-3">
                {/* 1. System Generated Deliverables */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 px-1">
                    System Outputs
                  </span>
                  <div className="rounded-lg border border-slate-100 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className={TH}>File</th>
                          <th className={TH}>Type</th>
                          <th className={TH}>Origin</th>
                          <th className={TH}>Size</th>
                          <th className={`${TH} text-right`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {systemOutputs.map((file) => (
                          <tr key={file.id} className="hover:bg-slate-50/40">
                            <td className={TD}>
                              <div className="flex items-center gap-2 font-medium text-slate-800">
                                <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">{file.name}</span>
                              </div>
                            </td>
                            <td className={`${TD} text-slate-500`}>{file.type}</td>
                            <td className={TD}>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {file.source}
                              </span>
                            </td>
                            <td className={`${TD} text-slate-500`}>
                              {formatFileSize(file.size)}
                            </td>
                            <td className={`${TD} text-right`}>
                              <button
                                type="button"
                                onClick={() =>
                                  alert(`Opening preview for ${file.name}`)
                                }
                                className="inline-flex items-center gap-1 text-[11px] text-[#0d3b66] hover:underline font-medium"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Uploaded Supporting Files */}
                {caseUploadedFiles.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 px-1">
                      Uploaded Supporting Files ({caseUploadedFiles.length})
                    </span>
                    <div className="rounded-lg border border-slate-100 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <tbody className="divide-y divide-slate-100">
                          {caseUploadedFiles.map((file) => {
                            const canOpen = fileBlob(file.id) !== null;
                            return (
                              <tr key={file.id} className="hover:bg-slate-50/40">
                                <td className={TD}>
                                  <div className="flex items-center gap-2 font-medium text-slate-700">
                                    <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                    {file.note && (
                                      <span className="text-[10px] text-slate-400 italic">
                                        ({file.note})
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className={`${TD} text-slate-500`}>
                                  {formatFileSize(file.size)}
                                </td>
                                <td className={`${TD} text-slate-400 text-[11px]`}>
                                  Uploaded by {file.uploadedBy || "You"}
                                </td>
                                <td className={`${TD} text-right`}>
                                  <div className="inline-flex items-center gap-1 justify-end">
                                    {canOpen && (
                                      <button
                                        type="button"
                                        onClick={() => openFileInTab(file.id)}
                                        className="p-1 rounded text-slate-400 hover:text-[#0d3b66]"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => onRemove(tabKey, file)}
                                      className="p-1 rounded text-slate-400 hover:text-red-600"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Upload Modal pre-assigned to target case */}
      <FileUploadModal
        isOpen={Boolean(selectedCaseForUpload)}
        onClose={() => setSelectedCaseForUpload(null)}
        onUpload={handleUploadSubmit}
        title={`Upload File to ${selectedCaseForUpload?.no || "Case"}`}
        targetCaseName={selectedCaseForUpload?.title}
      />
    </div>
  );
}
