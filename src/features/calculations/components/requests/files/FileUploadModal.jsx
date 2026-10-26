import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  Circle,
  Trash2,
  Layers,
  FileCheck,
  Paperclip,
  Compass,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { formatFileSize } from "../../../utils/requestForm";

const getCategoryIcon = (id) => {
  switch (id) {
    case "concept":
      return Layers;
    case "reference":
      return Compass;
    case "cover":
      return FileCheck;
    case "other":
    default:
      return Paperclip;
  }
};

const getStatusIcon = (id) => {
  switch (id) {
    case "need_revision":
      return AlertTriangle;
    case "approved":
      return CheckCircle2;
    case "under_review":
      return Clock;
    default:
      return FileText;
  }
};

/**
 * Reusable modal for uploading files with metadata (category, case assignment, review status, notes)
 * Redesigned to match the Add Case modal design language and full-screen portal overlay.
 */
export function FileUploadModal({
  isOpen,
  onClose,
  onUpload,
  title = "Upload Files",
  categoryOptions = null,
  statusOptions = null,
  targetCaseName = null,
  allowMultiple = true,
  accept = "*",
}) {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState(
    categoryOptions?.[0]?.id || "concept",
  );
  const [status, setStatus] = useState("need_revision");
  const [note, setNote] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (categoryOptions && categoryOptions.length > 0) {
      if (!category || !categoryOptions.some((c) => c.id === category)) {
        setCategory(categoryOptions[0].id);
      }
    }
  }, [categoryOptions]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => (allowMultiple ? [...prev, ...files] : files));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => (allowMultiple ? [...prev, ...files] : files));
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    const meta = {
      category: categoryOptions ? category : undefined,
      reviewStatus: statusOptions ? status : undefined,
      note: note.trim() || undefined,
    };

    onUpload(selectedFiles, meta);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setNote("");
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg sm:max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Matching Add Case Modal gradient */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3 text-white">
            <UploadCloud className="w-5 h-5 text-white shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="text-xs text-blue-100/80 font-normal">
                {targetCaseName
                  ? `Target: ${targetCaseName}`
                  : "Upload one or multiple files and configure category"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            title="Close modal"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-soft">
            {/* Category Picker (if available) */}
            {categoryOptions && (
              <div>
                <label className="block text-xs md:text-sm text-gray-700 mb-1.5 md:mb-2 font-medium">
                  File Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {categoryOptions.map((cat) => {
                    const Icon = getCategoryIcon(cat.id);
                    const isActive = category === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`group w-full flex items-center justify-between px-3 xl:px-4 py-2.5 lg:py-3 relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                          isActive
                            ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`p-1.5 rounded-md shrink-0 transition-colors ${
                              isActive
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-500 group-hover:text-slate-600"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <span
                            className={`text-xs md:text-sm font-medium truncate ${
                              isActive ? "text-slate-900" : "text-slate-700"
                            }`}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <div className="shrink-0 ml-2 flex items-center">
                          {isActive ? (
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                          ) : (
                            <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-slate-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status Picker (if available, e.g. for Checking & Review) */}
            {statusOptions && (
              <div>
                <label className="block text-xs md:text-sm text-gray-700 mb-1.5 md:mb-2 font-medium">
                  Review Result Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {statusOptions.map((st) => {
                    const Icon = getStatusIcon(st.id);
                    const isActive = status === st.id;

                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStatus(st.id)}
                        className={`group w-full flex items-center justify-between p-2.5 rounded-lg border transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                          isActive
                            ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`p-1 rounded-md shrink-0 transition-colors ${
                              isActive
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-500 group-hover:text-slate-600"
                            }`}
                          >
                            <Icon size={14} />
                          </div>
                          <span
                            className={`text-xs font-medium truncate ${
                              isActive ? "text-slate-900" : "text-slate-700"
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                        <div className="shrink-0 ml-1.5 flex items-center">
                          {isActive ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* File Dropzone */}
            <div>
              <div className="flex items-center justify-between mb-1.5 md:mb-2">
                <label className="block text-xs md:text-sm text-gray-700 font-medium">
                  Select File{allowMultiple ? "s" : ""}{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-100"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/80 bg-slate-50/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={allowMultiple}
                  accept={accept}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 transition-transform duration-200 group-hover:scale-105 group-hover:bg-blue-100">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs md:text-sm font-medium text-slate-800">
                  Click to browse or drop files here
                </p>
                <p className="text-[13px] text-slate-500 mt-1">
                  {allowMultiple ? (
                    <span className="text-sky-700 font-medium">
                      You can select or drag & drop multiple files at once.{" "}
                    </span>
                  ) : null}
                  {accept === ".pdf"
                    ? "PDF files only"
                    : "Supports PDF, DWG, DXF, XLSX, images, or documents"}
                </p>
              </div>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    Selected Files ({selectedFiles.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    className="text-[12px] text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-soft">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1 rounded-md bg-blue-100 text-blue-600 shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <span className="truncate font-medium text-slate-800">
                            {file.name}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelectedFile(idx);
                        }}
                        title="Remove file"
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors shrink-0 ml-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes / Instructions input */}
            <div>
              <label className="block text-xs md:text-sm text-gray-700 mb-1.5 md:mb-2 font-medium">
                Notes / Instructions{" "}
                <span className="text-slate-400 font-normal text-sm">
                  (Optional)
                </span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add short note or guidance about this file..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc] transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer Actions - Matching Add Case Modal */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 rounded-b-2xl shrink-0">
            <span className="text-xs md:text-sm text-slate-500">
              {selectedFiles.length > 0
                ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
                : "No files selected"}
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedFiles.length === 0}
                className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>
                  Upload{" "}
                  {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
