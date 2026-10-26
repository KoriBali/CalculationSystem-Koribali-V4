import { useState, useMemo } from "react";
import {
  FileText,
  FolderOpen,
  Trash2,
  UploadCloud,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import RequestFilterDropdown from "../RequestFilterDropdown";
import {
  BRIEF_CATEGORIES,
  BRIEF_CATEGORY_MAP,
} from "../../../constants/requestFileTabs";
import { formatFileSize } from "../../../utils/requestForm";
import { fileBlob } from "../../../data/requestStore";
import { FileUploadModal } from "./FileUploadModal";

const TH = "px-4 py-2.5 font-medium text-xs whitespace-nowrap text-slate-500";
const TD = "px-4 py-3 whitespace-nowrap text-slate-700";

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const openFileInTab = (id) => {
  const blob = fileBlob(id);
  if (blob) window.open(URL.createObjectURL(blob), "_blank", "noopener");
};

export function BriefConceptTab({ files = [], onUpload, onRemove }) {
  const [filterCategory, setFilterCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Category options formatted for RequestFilterDropdown (same as Case section)
  const categoryOptions = useMemo(() => {
    return [
      { key: "all", label: `All Files (${files.length})` },
      ...BRIEF_CATEGORIES.map((cat) => {
        const count = files.filter(
          (f) => (f.category || "other") === cat.id
        ).length;
        return {
          key: cat.id,
          label: `${cat.label} (${count})`,
        };
      }),
    ];
  }, [files]);

  // Filter files by selected category
  const filteredFiles = useMemo(() => {
    if (filterCategory === "all") return files;
    return files.filter((f) => (f.category || "other") === filterCategory);
  }, [files, filterCategory]);

  const handleUploadSubmit = (selectedFiles, meta) => {
    onUpload("brief", selectedFiles, meta);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    if (droppedFiles.length > 0) {
      setIsModalOpen(true);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`space-y-4 rounded-lg transition-colors ${
        isDragging
          ? "bg-blue-50/60 ring-2 ring-dashed ring-blue-400 p-2"
          : ""
      }`}
    >
      {/* ── Sub-bar: Hint on left, Upload button on right ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs md:text-sm text-gray-500">
          The cover and the reference material that came with the project.
        </p>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 h-8.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-xs active:scale-95 transition-all shrink-0"
        >
          <UploadCloud className="w-3.5 h-3.5 text-[#0d3b66]" />
          Upload
        </button>
      </div>

      {/* ── Filter Toolbar (Dropdown like in Case section) ── */}
      {files.length > 0 && (
        <div className="relative z-20 flex flex-wrap items-center gap-2.5 pt-0.5">
          <RequestFilterDropdown
            prefix="Category"
            options={categoryOptions}
            selected={filterCategory}
            onChange={setFilterCategory}
          />
          {filterCategory !== "all" && (
            <button
              type="button"
              onClick={() => setFilterCategory("all")}
              className="h-10 inline-flex items-center gap-1.5 px-3 rounded-lg hp:rounded-md text-xs sm:text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filter
            </button>
          )}
        </div>
      )}

      {/* ── Files Table or Empty State (matches RequestCases) ── */}
      {files.length === 0 ? (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full flex flex-col items-center text-center rounded-lg hp:rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 hover:border-blue-400 hover:bg-blue-50/40 transition-colors cursor-pointer group"
        >
          <span className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors">
            <FolderOpen className="w-5 h-5" />
          </span>
          <span className="mt-3 text-sm font-medium text-slate-700">
            No files in Brief & Concept yet
          </span>
          <span className="mt-1 text-xs md:text-sm text-slate-500">
            Click to upload, or drop files here.
          </span>
        </button>
      ) : filteredFiles.length === 0 ? (
        <div className="w-full flex flex-col items-center text-center rounded-lg hp:rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 transition-colors">
          <p className="text-sm font-medium text-slate-700">
            No files match the selected category
          </p>
          <button
            type="button"
            onClick={() => setFilterCategory("all")}
            className="mt-2 text-xs sm:text-sm text-[#0d3b66] font-medium hover:underline"
          >
            Reset category filter
          </button>
        </div>
      ) : (
        <div className="rounded-lg hp:rounded-md border border-gray-200 overflow-x-auto scrollbar-soft">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className={TH}>File Name</th>
                <th className={TH}>Category</th>
                <th className={TH}>Notes</th>
                <th className={TH}>Size</th>
                <th className={TH}>Uploaded</th>
                <th className={TH}>By</th>
                <th className={`${TH} text-right`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFiles.map((file) => {
                const canOpen = fileBlob(file.id) !== null;
                const catConfig =
                  BRIEF_CATEGORY_MAP[file.category] || BRIEF_CATEGORY_MAP.other;

                return (
                  <tr
                    key={file.id}
                    className="text-slate-700 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* File Name */}
                    <td className={TD}>
                      <div className="flex items-center gap-2.5 min-w-0 max-w-xs sm:max-w-md">
                        <FileText className="w-4 h-4 shrink-0 text-blue-500" />
                        {canOpen ? (
                          <button
                            type="button"
                            onClick={() => openFileInTab(file.id)}
                            className="truncate font-medium text-slate-900 hover:text-[#0d3b66] hover:underline text-left"
                            title={file.name}
                          >
                            {file.name}
                          </button>
                        ) : (
                          <span
                            className="truncate font-medium text-slate-900"
                            title={file.name}
                          >
                            {file.name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className={TD}>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${catConfig.color}`}
                      >
                        {catConfig.label}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className={`${TD} text-slate-500`}>
                      {file.note ? (
                        <span
                          className="truncate block max-w-[200px]"
                          title={file.note}
                        >
                          {file.note}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Size */}
                    <td className={`${TD} text-slate-500`}>
                      {formatFileSize(file.size)}
                    </td>

                    {/* Date */}
                    <td className={`${TD} text-slate-500`}>
                      {formatDate(file.uploadedAt)}
                    </td>

                    {/* Uploaded By */}
                    <td className={`${TD} text-slate-500`}>
                      {file.uploadedBy || "—"}
                    </td>

                    {/* Actions */}
                    <td className={`${TD} text-right`}>
                      <div className="inline-flex items-center gap-1 justify-end">
                        {canOpen && (
                          <button
                            type="button"
                            onClick={() => openFileInTab(file.id)}
                            title="Open in new tab"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-[#0d3b66] hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onRemove("brief", file)}
                          title="Delete file"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── File Upload Modal ── */}
      <FileUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUploadSubmit}
        title="Upload Brief or Concept File"
        categoryOptions={BRIEF_CATEGORIES}
      />
    </div>
  );
}
