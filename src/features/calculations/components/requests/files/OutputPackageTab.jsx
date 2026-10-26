import { useState, useMemo } from "react";
import {
  PackageCheck,
  CheckSquare,
  Square,
  Download,
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileArchive,
} from "lucide-react";
import JSZip from "jszip";
import { formatFileSize } from "../../../utils/requestForm";
import { fileBlob } from "../../../data/requestStore";

const TH = "px-4 py-2.5 font-medium text-xs whitespace-nowrap text-slate-500";
const TD = "px-4 py-3 whitespace-nowrap text-slate-700";

export function OutputPackageTab({ cases = [], files = [], request }) {
  // Generate manifest of all deliverables across cases
  const manifestItems = useMemo(() => {
    const items = [];

    cases.forEach((c, idx) => {
      const caseNumber = c.no || `Case ${idx + 1}`;
      const caseClean = caseNumber.replace(/\s+/g, "_");
      const title = c.title || "Design";
      const isCalc = !c.workType || c.workType === "calculation" || c.workType === "both";
      const isDrawing = c.workType === "drawing" || c.workType === "both";

      if (isCalc) {
        items.push({
          id: `calc_rpt_${c.id}`,
          caseId: c.id,
          caseName: `${caseNumber}: ${title}`,
          folderName: `${caseClean}_${title.replace(/\s+/g, "_")}`,
          name: `Calculation_Report_${caseClean}.pdf`,
          type: "Calculation Report",
          revision: "Rev 0",
          status: "Approved",
          size: 2450000,
        });

        items.push({
          id: `calc_sch_${c.id}`,
          caseId: c.id,
          caseName: `${caseNumber}: ${title}`,
          folderName: `${caseClean}_${title.replace(/\s+/g, "_")}`,
          name: `Schematic_Diagram_${caseClean}.pdf`,
          type: "Schematic Diagram",
          revision: "Rev 0",
          status: "Approved",
          size: 850000,
        });
      }

      if (isDrawing) {
        items.push({
          id: `drw_sheet_${c.id}`,
          caseId: c.id,
          caseName: `${caseNumber}: ${title}`,
          folderName: `${caseClean}_${title.replace(/\s+/g, "_")}`,
          name: `Production_Drawing_${caseClean}.pdf`,
          type: "Drawing Sheet",
          revision: "Rev 0",
          status: "Approved",
          size: 3100000,
        });
      }

      // Also include any approved files uploaded in calculation or drawing
      const caseExtraFiles = (files || []).filter(
        (f) => (f.caseId === c.id || f.caseNo === c.no) && f.reviewStatus !== "need_revision"
      );
      caseExtraFiles.forEach((f) => {
        items.push({
          id: f.id,
          caseId: c.id,
          caseName: `${caseNumber}: ${title}`,
          folderName: `${caseClean}_${title.replace(/\s+/g, "_")}`,
          name: f.name,
          type: "Supporting File",
          revision: "Final",
          status: "Approved",
          size: f.size || 500000,
          blobId: f.id,
        });
      });
    });

    return items;
  }, [cases, files]);

  // Selected item IDs for packaging
  const [selectedIds, setSelectedIds] = useState(() =>
    manifestItems.map((item) => item.id)
  );
  const [isPackaging, setIsPackaging] = useState(false);

  // Sync selection if manifest changes
  const allSelected =
    manifestItems.length > 0 && selectedIds.length === manifestItems.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(manifestItems.map((item) => item.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedItems = useMemo(
    () => manifestItems.filter((item) => selectedIds.includes(item.id)),
    [manifestItems, selectedIds]
  );

  const totalSize = useMemo(
    () => selectedItems.reduce((acc, curr) => acc + (curr.size || 0), 0),
    [selectedItems]
  );

  // Generate and download ZIP package
  const handleDownloadZip = async () => {
    if (selectedItems.length === 0) return;
    setIsPackaging(true);

    try {
      const zip = new JSZip();
      const requestNo = request?.requestNo || request?.fields?.requestNo || "REQ-PKG";
      const rootFolder = zip.folder(`Package_${requestNo}`);

      // Add a clean manifest summary text file
      let manifestText = `========================================================\n`;
      manifestText += `PROJECT DELIVERY PACKAGE MANIFEST\n`;
      manifestText += `Request No : ${requestNo}\n`;
      manifestText += `Generated  : ${new Date().toLocaleString()}\n`;
      manifestText += `Total Files: ${selectedItems.length}\n`;
      manifestText += `========================================================\n\n`;

      selectedItems.forEach((item, index) => {
        manifestText += `${index + 1}. [${item.caseName}] ${item.name} (${item.type}) - ${item.revision} - ${item.status}\n`;
      });
      rootFolder.file("MANIFEST.txt", manifestText);

      // Add each item into its case folder
      for (const item of selectedItems) {
        const caseFolder = rootFolder.folder(item.folderName);
        const actualBlob = item.blobId ? fileBlob(item.blobId) : null;

        if (actualBlob) {
          caseFolder.file(item.name, actualBlob);
        } else {
          // Provide placeholder PDF / text representation for auto-generated files in mock session
          const placeholderContent = `Project: ${requestNo}\nCase: ${item.caseName}\nDocument: ${item.name}\nType: ${item.type}\nStatus: Approved\n\n[Official System Generated Document]`;
          caseFolder.file(item.name.replace(".pdf", ".txt"), placeholderContent);
        }
      }

      // Generate zip blob
      const zipContent = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipContent);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Project_${requestNo}_Final_Package.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Failed to generate ZIP package:", err);
      alert("Failed to generate zip package. Please try again.");
    } finally {
      setIsPackaging(false);
    }
  };

  if (manifestItems.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs md:text-sm text-gray-500">
            Manifest checklist of final approved deliverables ready for distribution.
          </p>
        </div>

        <div className="w-full flex flex-col items-center text-center rounded-lg hp:rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 transition-colors">
          <span className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-400">
            <PackageCheck className="w-5 h-5" />
          </span>
          <span className="mt-3 text-sm font-medium text-slate-700">
            No Deliverables in Output Package Yet
          </span>
          <span className="mt-1 text-xs md:text-sm text-slate-500 max-w-sm">
            Once your calculation and drawing cases are generated and approved, their final reports and drawings will be catalogued here for package release.
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
          Manifest checklist of final approved deliverables ready for distribution.
        </p>
      </div>
      {/* Package Header Banner */}
      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-900">
              Release Package Manifest ({selectedItems.length} of {manifestItems.length} Files Selected)
            </h4>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Review and select which final reports and drawings to bundle for delivery to Japan. Total package size: {formatFileSize(totalSize)}.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleDownloadZip}
          disabled={selectedItems.length === 0 || isPackaging}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#0d3b66] text-white hover:bg-[#092947] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all active:scale-95"
        >
          {isPackaging ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Compressing ZIP...
            </>
          ) : (
            <>
              <FileArchive className="w-4 h-4 text-sky-300" />
              Download Package (.ZIP)
            </>
          )}
        </button>
      </div>

      {/* Manifest Table */}
      <div className="rounded-xl border border-slate-200 overflow-x-auto scrollbar-soft bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 w-10">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="flex items-center text-slate-500 hover:text-slate-700"
                >
                  {allSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#0d3b66]" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className={TH}>Case / Scope</th>
              <th className={TH}>Deliverable File Name</th>
              <th className={TH}>Type</th>
              <th className={TH}>Revision</th>
              <th className={TH}>Status</th>
              <th className={TH}>Size</th>
              <th className={`${TH} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {manifestItems.map((item) => {
              const isChecked = selectedIds.includes(item.id);
              return (
                <tr
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`cursor-pointer transition-colors ${
                    isChecked ? "bg-blue-50/20 hover:bg-blue-50/40" : "hover:bg-slate-50/60"
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => toggleSelect(item.id)}
                      className="flex items-center text-slate-500 hover:text-slate-700"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#0d3b66]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Case / Scope */}
                  <td className={TD}>
                    <span className="font-semibold text-slate-800">
                      {item.caseName}
                    </span>
                  </td>

                  {/* Deliverable File Name */}
                  <td className={TD}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-800">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Document Type */}
                  <td className={`${TD} text-slate-500`}>{item.type}</td>

                  {/* Revision */}
                  <td className={TD}>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      {item.revision}
                    </span>
                  </td>

                  {/* Status */}
                  <td className={TD}>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>

                  {/* Size */}
                  <td className={`${TD} text-slate-500`}>
                    {formatFileSize(item.size)}
                  </td>

                  {/* Action */}
                  <td className={`${TD} text-right`} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => alert(`Downloading individual file: ${item.name}`)}
                      title={`Download ${item.name}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-600 hover:text-[#0d3b66] hover:bg-slate-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
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
