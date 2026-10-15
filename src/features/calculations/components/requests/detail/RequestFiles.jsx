// The request's files, one tab per folder (see REQUEST_FILE_TABS): each
// with an Upload button (or drop files on it) and its list of files.
import { useRef, useState } from "react";
import { FileText, FolderOpen, Trash2, UploadCloud } from "lucide-react";

import { REQUEST_FILE_TABS } from "../../../constants/requestFileTabs";
import { fileBlob } from "../../../data/requestStore";
import { formatFileSize } from "../../../utils/requestForm";

const TAB = {
  active: "bg-[#0d3b66] text-white shadow-sm",
  idle: "text-slate-600 hover:bg-[#eef2f6] hover:text-[#0d3b66]",
};
const TH = "px-4 py-2.5 font-medium text-xs whitespace-nowrap";
const TD = "px-4 py-3 whitespace-nowrap";

const uploadedAt = (iso) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Opens the file in a new tab while it's still in memory (this session).
const openFile = (id) => {
  const blob = fileBlob(id);
  if (blob) window.open(URL.createObjectURL(blob), "_blank", "noopener");
};

function FileList({ files, onRemove }) {
  return (
    <div className="rounded-lg hp:rounded-md border border-gray-200 overflow-x-auto scrollbar-soft">
      <table className="w-full text-left text-xs md:text-sm">
        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
          <tr>
            <th className={TH}>Name</th>
            <th className={TH}>Size</th>
            <th className={TH}>Uploaded</th>
            <th className={TH}>By</th>
            <th className={TH}>
              <span className="sr-only">Remove</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {files.map((file) => {
            const canOpen = fileBlob(file.id) !== null;
            return (
              <tr key={file.id} className="text-slate-700">
                <td className={TD}>
                  <span className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 shrink-0 text-blue-500" />
                    {canOpen ? (
                      <button
                        type="button"
                        onClick={() => openFile(file.id)}
                        className="truncate font-medium text-slate-900 hover:text-[#0d3b66] hover:underline"
                      >
                        {file.name}
                      </button>
                    ) : (
                      <span className="truncate font-medium text-slate-900">
                        {file.name}
                      </span>
                    )}
                  </span>
                </td>
                <td className={`${TD} text-slate-500`}>
                  {formatFileSize(file.size)}
                </td>
                <td className={`${TD} text-slate-500`}>
                  {uploadedAt(file.uploadedAt)}
                </td>
                <td className={`${TD} text-slate-500`}>{file.uploadedBy}</td>
                <td className={`${TD} text-right`}>
                  <button
                    type="button"
                    onClick={() => onRemove(file)}
                    aria-label={`Remove ${file.name}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// `files`: request.files. `onUpload(tabKey, File[])`. `onRemove(tabKey,
// file)`.
export function RequestFiles({ files, onUpload, onRemove }) {
  const [activeKey, setActiveKey] = useState(REQUEST_FILE_TABS[0].key);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const tab = REQUEST_FILE_TABS.find((t) => t.key === activeKey);
  const tabFiles = files[activeKey] ?? [];

  const upload = (fileList) => {
    const picked = [...(fileList ?? [])];
    if (picked.length) onUpload(activeKey, picked);
  };

  return (
    <div>
      {/* ── Section Explanation Header ── */}
      <div className="pb-3 mb-3.5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Project References & Supporting Documents
          </p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            There are several file category tabs below. You can organize and adjust your uploads by selecting the corresponding tab according to the file type.
          </p>
        </div>
      </div>

      {/* Folder tabs */}
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto scrollbar-soft pb-1 -mb-1"
      >
        {REQUEST_FILE_TABS.map((t) => {
          const count = files[t.key]?.length ?? 0;
          const active = t.key === activeKey;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveKey(t.key)}
              className={`shrink-0 h-9 px-4 rounded-lg hp:rounded-md text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${TAB[active ? "active" : "idle"]}`}
            >
              {t.label}
              {count > 0 && (
                <span className={active ? "text-white/70" : "text-slate-400"}>
                  {" "}
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active folder: drop files anywhere on it */}
      <div
        role="tabpanel"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files);
        }}
        className={`mt-4 rounded-lg hp:rounded-md transition-colors ${dragging ? "bg-blue-50/60 outline-dashed outline-2 outline-offset-4 outline-blue-300" : ""}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-xs md:text-sm text-gray-500">{tab.hint}</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              upload(e.target.files);
              // Reset so picking the same file again still fires onChange.
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg hp:rounded-md text-xs md:text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm active:scale-[0.98] transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Upload
          </button>
        </div>

        {tabFiles.length > 0 ? (
          <FileList
            files={tabFiles}
            onRemove={(file) => onRemove(activeKey, file)}
          />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center text-center rounded-lg hp:rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
          >
            <span className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-400">
              <FolderOpen className="w-5 h-5" />
            </span>
            <span className="mt-3 text-sm font-medium text-slate-700">
              No files in {tab.label} yet
            </span>
            <span className="mt-1 text-xs md:text-sm text-slate-500">
              Click to upload, or drop files here.
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
