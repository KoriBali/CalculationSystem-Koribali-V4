import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Calculator,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  PencilRuler,
  Plus,
  MoreVertical,
  Edit,
  UserCheck,
  Trash2,
  AlertCircle,
  Search,
  Info,
  Check,
  X,
  Circle,
  CheckCircle,
  Eye,
  FileText,
  Users,
  User,
  RotateCcw,
} from "lucide-react";
import { poleTypeOptions } from "../../../constants/poleTypeOptions";
import { formatShortDate } from "../../../utils/requestForm";
import { getUser } from "../../../../../utils/auth";
import { FormSelect } from "../../../../../shared/components/FormSelect";
import RequestFilterDropdown from "../RequestFilterDropdown";


const DRAWING_TYPE_OPTIONS = [
  { value: "Approval", label: "Approval (APD)" },
  { value: "Manufacturer", label: "Manufacturer (MFD)" },
  { value: "Order", label: "Order" },
  { value: "Meeting", label: "Meeting" },
];

const inputStyle = (hasError = false) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

const DRAWING_TYPE_LABELS = {
  Approval: "APD (Approval)",
  Manufacturer: "MFD (Manufacturer)",
  Order: "Order",
  Meeting: "Meeting",
};

const CASE_STATUS_STYLES = {
  "Not started": "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/80",
  "In progress": "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/80",
  "Ready for check": "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/80",
  Checked: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80",
  "Needs correction": "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/80",
};

const TH = "px-4 py-2.5 font-medium text-xs whitespace-nowrap";
const TD = "px-4 py-3 whitespace-nowrap";

function StatusChip({ status }) {
  const norm =
    status === "started"
      ? "In progress"
      : status === "new"
        ? "Not started"
        : status || "Not started";

  const style =
    CASE_STATUS_STYLES[norm] || "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/80";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {norm}
    </span>
  );
}

function WorkTypeDisplay({ workType }) {
  if (workType === "drawing") {
    return (
      <span className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-700 font-normal">
        <PencilRuler className="w-4 h-4 text-purple-600 shrink-0" />
        <span>Drawing</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-700 font-normal">
      <Calculator className="w-4 h-4 text-[#3399cc] shrink-0" />
      <span>Calculation</span>
    </span>
  );
}

export function RequestCases({
  request,
  onAddCase, // (workType, details) => void
  onUpdateCase, // (caseId, updates) => void
  onDeleteCase, // (caseId) => void
  onOpenCase, // (caseItem) => void
  onViewReport, // (caseItem) => void
  onToast, // (message) => void
  onShowToastModal, // (message) => void
  onBeforeAddCase, // () => boolean
}) {
  const me = getUser()?.name || "Bintarjo Agus Priyadi";
  const userRole = getUser()?.role || "drafter";
  const isAdmin =
    userRole === "admin" ||
    userRole === "superadmin" ||
    userRole === "admin_department";

  const isLocked =
    request.status === "submitted" ||
    request.status === "diajukan" ||
    request.status === "cleared" ||
    request.status === "selesai" ||
    request.status === "cancelled";

  // Allowed work types
  const allowedWorkTypes = useMemo(() => {
    const list = [];
    if (request.workTypes?.calc) list.push("calc");
    if (request.workTypes?.drawing) list.push("drawing");
    return list;
  }, [request.workTypes]);

  // Modal states
  const [addModalType, setAddModalType] = useState(null); // 'calc' | 'drawing' | null
  const [editModalCase, setEditModalCase] = useState(null); // case object | null
  const [transferModalCase, setTransferModalCase] = useState(null); // case object | null
  const [deleteModalCase, setDeleteModalCase] = useState(null); // case object | null

  // Dropdown header menu state
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addMenuRef = useRef(null);

  // Highlighted case id for flash animation
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sorted cases by created date / no
  const cases = useMemo(() => {
    return [...(request.cases || [])].sort((a, b) =>
      (a.no || "").localeCompare(b.no || ""),
    );
  }, [request.cases]);

  // Filter states
  const [scopeFilter, setScopeFilter] = useState("all"); // 'all' | 'mine'
  const [workTypeFilter, setWorkTypeFilter] = useState("all"); // 'all' | 'calc' | 'drawing'

  const myCasesCount = useMemo(() => {
    return cases.filter(
      (c) =>
        c.createdBy === me ||
        (!c.createdBy && c.owner === me) ||
        c.owner === me,
    ).length;
  }, [cases, me]);

  const calcCount = useMemo(() => {
    return cases.filter((c) => c.workType === "calc").length;
  }, [cases]);

  const drawingCount = useMemo(() => {
    return cases.filter((c) => c.workType === "drawing").length;
  }, [cases]);

  const scopeOptions = useMemo(
    () => [
      { key: "all", label: `All (${cases.length})` },
      { key: "mine", label: `My Cases (${myCasesCount})` },
    ],
    [cases.length, myCasesCount],
  );

  const workTypeOptions = useMemo(
    () => [
      { key: "all", label: `All (${cases.length})` },
      { key: "calc", label: `Calculation (${calcCount})` },
      { key: "drawing", label: `Drawing (${drawingCount})` },
    ],
    [cases.length, calcCount, drawingCount],
  );

  const isFiltered = scopeFilter !== "all" || workTypeFilter !== "all";

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (scopeFilter === "mine") {
        const isMine =
          c.createdBy === me ||
          (!c.createdBy && c.owner === me) ||
          c.owner === me;
        if (!isMine) return false;
      }
      if (workTypeFilter !== "all") {
        if (c.workType !== workTypeFilter) return false;
      }
      return true;
    });
  }, [cases, scopeFilter, workTypeFilter, me]);

  // Handler for adding case from modal
  const handleCreateCaseSubmit = (workType, details) => {
    const createdId = onAddCase(workType, details);
    setAddModalType(null);
    if (createdId) {
      setRecentlyAddedId(createdId);
      setTimeout(() => setRecentlyAddedId(null), 3500);
    }
    if (onToast) {
      onToast(`Case "${details.title}" added successfully.`);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <p className="text-xs sm:text-sm text-gray-500">
          {allowedWorkTypes.length === 1
            ? `This project is ${allowedWorkTypes[0] === "calc" ? "calculation" : "drawing"} only. Open a case to work on it.`
            : "Each case is a calculation or a drawing. Open a case to work on it."}
        </p>

        {/* ── Header Button: + Add Case ▾ ── */}
        <div ref={addMenuRef} className="relative self-start sm:self-auto shrink-0">
          {allowedWorkTypes.length === 0 ? null : allowedWorkTypes.length === 1 ? (
            <button
              type="button"
              disabled={isLocked}
              title={
                isLocked
                  ? "Cannot add cases to locked / completed projects"
                  : undefined
              }
              onClick={() => {
                if (onBeforeAddCase && !onBeforeAddCase()) return;
                setAddModalType(allowedWorkTypes[0]);
              }}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg hp:rounded-md text-xs md:text-sm font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add {allowedWorkTypes[0] === "calc" ? "Calculation" : "Drawing"} Case
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={isLocked}
                title={
                  isLocked
                    ? "Cannot add cases to locked / completed projects"
                    : undefined
                }
                onClick={() => {
                  if (onBeforeAddCase && !onBeforeAddCase()) return;
                  setAddMenuOpen((v) => !v);
                }}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg hp:rounded-md text-xs md:text-sm font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Case
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${addMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {addMenuOpen && (
                <div className="absolute right-0 z-30 mt-1.5 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl animate-in fade-in duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      if (onBeforeAddCase && !onBeforeAddCase()) return;
                      setAddMenuOpen(false);
                      setAddModalType("calc");
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Calculator className="w-4 h-4 text-[#3399cc]" />
                    <span>Calculation Case</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onBeforeAddCase && !onBeforeAddCase()) return;
                      setAddMenuOpen(false);
                      setAddModalType("drawing");
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <PencilRuler className="w-4 h-4 text-purple-600" />
                    <span>Drawing Case</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Filters Toolbar (when there are cases in the request) ── */}
      {cases.length > 0 && (
        <div className="relative z-20 flex flex-wrap items-center gap-2.5 pt-0.5">
          <RequestFilterDropdown
            prefix="Cases"
            options={scopeOptions}
            selected={scopeFilter}
            onChange={setScopeFilter}
          />
          <RequestFilterDropdown
            prefix="Work Type"
            options={workTypeOptions}
            selected={workTypeFilter}
            onChange={setWorkTypeFilter}
          />
          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setScopeFilter("all");
                setWorkTypeFilter("all");
              }}
              className="h-10 inline-flex items-center gap-1.5 px-3 rounded-lg hp:rounded-md text-xs sm:text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </button>
          )}
        </div>
      )}

      {/* ── Table or Empty State (matches RequestFiles) ── */}
      {cases.length === 0 ? (
        <div className="w-full flex flex-col items-center text-center rounded-lg hp:rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 hover:border-blue-400 hover:bg-blue-50/40 transition-colors">
          <span className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-400">
            <FolderPlus className="w-5 h-5" />
          </span>
          <span className="mt-3 text-sm font-medium text-slate-700">
            No cases yet in this project
          </span>
          <span className="mt-1 text-xs md:text-sm text-slate-500 max-w-sm">
            Create a calculation or drawing case to start drafting structural
            computations or CAD drawings.
          </span>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="w-full flex flex-col items-center text-center rounded-lg hp:rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 transition-colors">
          <p className="text-sm font-medium text-slate-700">
            No cases match the selected filters
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try switching back to "All Cases" or "All Work Types".
          </p>
          <button
            type="button"
            onClick={() => {
              setScopeFilter("all");
              setWorkTypeFilter("all");
            }}
            className="mt-3 px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="rounded-lg hp:rounded-md border border-gray-200 overflow-x-auto scrollbar-soft">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className={TH}>Case No.</th>
                <th className={TH}>Work Type</th>
                <th className={TH}>Pole Type</th>
                <th className={TH}>Status</th>
                <th className={TH}>Owner</th>
                <th className={TH}>Created By</th>
                <th className={TH}>Created</th>
                <th className={TH}>Last Edited</th>
                <th className={`${TH} text-right min-w-[190px]`}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.map((c, index) => {
                const isNewlyAdded = c.id === recentlyAddedId;
                const isOwner = c.owner === me;
                const canEditDetails = isOwner || isAdmin;
                const canTransfer = isOwner || isAdmin || c.createdBy === me;
                const canDelete = isOwner || isAdmin;
                const caseNumDisplay =
                  c.case_label || c.no || String(index + 1).padStart(3, "0");
                const caseNoForNotice =
                  c.case_label ||
                  (c.no
                    ? c.no.toLowerCase().includes("case")
                      ? c.no
                      : `Case ${c.no}`
                    : `Case ${String(index + 1).padStart(2, "0")}`);
                const creatorName =
                  c.createdBy || c.owner || request.createdBy || "—";

                const hasGeneratedReport = (() => {
                  if (c.workType === "drawing") return false;
                  try {
                    const raw = sessionStorage.getItem(
                      `${request.projectType}_draft_data_${c.id}`
                    );
                    if (!raw) return false;
                    const data = JSON.parse(raw);

                    // 1. Report snapshot must exist (generated when user clicks Generate Report at the end)
                    if (!data.reportSnapshot) return false;
                    const snapshot =
                      typeof data.reportSnapshot === "string"
                        ? JSON.parse(data.reportSnapshot)
                        : data.reportSnapshot;
                    if (!snapshot || typeof snapshot !== "object") return false;

                    // 2. Cover Report Information must be filled (reportNumber + author + department/region)
                    const cover =
                      snapshot.cover ||
                      (data.cover
                        ? typeof data.cover === "string"
                          ? JSON.parse(data.cover)
                          : data.cover
                        : null);
                    const hasValidCover = Boolean(
                      cover &&
                        (cover.reportNumber?.trim() ||
                          cover.calculationNumber?.trim()) &&
                        cover.author?.trim() &&
                        (cover.responsibleDepartment?.trim() ||
                          cover.region?.trim() ||
                          cover.managementCode?.trim())
                    );
                    if (!hasValidCover) return false;

                    // 3. Calculation must have finished all required steps up to the final step
                    const cond =
                      snapshot.condition ||
                      (data.condition
                        ? typeof data.condition === "string"
                          ? JSON.parse(data.condition)
                          : data.condition
                        : {});

                    const poleResults =
                      snapshot.results ||
                      (data.results
                        ? typeof data.results === "string"
                          ? JSON.parse(data.results)
                          : data.results
                        : null);
                    const hasPole = Array.isArray(poleResults) && poleResults.length > 0;
                    if (!hasPole) return false;

                    if (cond.openingEnabled) {
                      const opRes =
                        snapshot.calculatedOp ||
                        (data.calculatedOp
                          ? typeof data.calculatedOp === "string"
                            ? JSON.parse(data.calculatedOp)
                            : data.calculatedOp
                          : null);
                      if (!opRes || Object.keys(opRes).length === 0) return false;
                    }

                    if (cond.baseplateEnabled) {
                      const bpRes =
                        snapshot.calculatedBaseplate ||
                        (data.calculatedBaseplate
                          ? typeof data.calculatedBaseplate === "string"
                            ? JSON.parse(data.calculatedBaseplate)
                            : data.calculatedBaseplate
                          : null);
                      if (!bpRes || Object.keys(bpRes).length === 0) return false;
                    }

                    if (cond.foundationEnabled) {
                      const fdRes =
                        snapshot.calculatedFoundation ||
                        (data.calculatedFoundation
                          ? typeof data.calculatedFoundation === "string"
                            ? JSON.parse(data.calculatedFoundation)
                            : data.calculatedFoundation
                          : null);
                      if (!fdRes || Object.keys(fdRes).length === 0) return false;
                    }

                    // 4. Report generation flag
                    const hasReportFlag =
                      data.hasReport === true ||
                      data.hasReport === "true" ||
                      snapshot.hasReport === true ||
                      snapshot.hasReport === "true";
                    if (!hasReportFlag) return false;

                    return true;
                  } catch {
                    return false;
                  }
                })();

                return (
                  <tr
                    key={c.id}
                    className={`text-slate-700 group hover:bg-slate-50/70 transition-colors ${
                      isNewlyAdded
                        ? "bg-blue-50/60 ring-1 ring-blue-300 ring-inset"
                        : ""
                    }`}
                  >
                    {/* Case No. */}
                    <td className={`${TD} font-semibold text-slate-900 tabular-nums`}>
                      {caseNumDisplay}
                    </td>

                    {/* Work Type */}
                    <td className={TD}>
                      <WorkTypeDisplay workType={c.workType} />
                    </td>

                    {/* Pole Type */}
                    <td className={TD}>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200/80">
                        {c.poleKind === "custom" ? "Custom" : "Standard"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className={TD}>
                      <StatusChip status={c.status} />
                    </td>

                    {/* Owner */}
                    <td className={`${TD} font-medium text-slate-800`}>
                      <span>{c.owner || "Unassigned"}</span>
                    </td>

                    {/* Created By */}
                    <td className={`${TD} font-medium text-slate-700`}>
                      <span>{creatorName}</span>
                    </td>

                    {/* Created */}
                    <td className={`${TD} text-slate-500 whitespace-nowrap`}>
                      {c.createdAt ? formatShortDate(c.createdAt) : "—"}
                    </td>

                    {/* Last Edited */}
                    <td className={`${TD} text-slate-500 whitespace-nowrap`}>
                      {c.lastEdited ? (
                        <div className="flex flex-col">
                          <span className="text-slate-700 font-medium">{formatShortDate(c.lastEdited)}</span>
                          <span className="text-[11px] text-slate-400">
                            by {c.lastEditedBy || c.owner || creatorName || "—"}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Action buttons: Inline Action Icons */}
                    <td className={`${TD} text-right whitespace-nowrap min-w-[210px]`}>
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* Primary Action: Open vs View Button */}
                        <button
                          type="button"
                          onClick={() => onOpenCase(c)}
                          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-xs active:scale-95 transition-all cursor-pointer"
                          title={
                            isOwner
                              ? "Open case workspace"
                              : `Read-only mode (Owned by ${c.owner || "another member"})`
                          }
                        >
                          <Eye className="w-3.5 h-3.5 text-[#0d3b66]" />
                          <span>{isOwner ? "Open" : "View"}</span>
                        </button>

                        {/* Report Button (Active if calculated & generated, informative if pending) */}
                        {c.workType !== "drawing" && (
                          <button
                            type="button"
                            onClick={() => {
                              if (hasGeneratedReport) {
                                onViewReport?.(c);
                              } else {
                                const msg = `Report for ${caseNoForNotice} is not available yet. Please open this case and run calculations first.`;
                                if (onShowToastModal) {
                                  onShowToastModal(msg);
                                } else if (onToast) {
                                  onToast(msg);
                                }
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium transition-all active:scale-95 ${
                              hasGeneratedReport
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-300 shadow-xs cursor-pointer font-medium"
                                : "bg-gray-50/80 hover:bg-gray-100/90 text-gray-400 hover:text-gray-500 border border-dashed border-gray-300/80 cursor-pointer"
                            }`}
                            title={
                              hasGeneratedReport
                                ? "View calculation report & schematic"
                                : `Report for ${caseNoForNotice} is not available yet. Click to view details.`
                            }
                          >
                            <FileText
                              className={`w-3.5 h-3.5 ${
                                hasGeneratedReport
                                  ? "text-emerald-700"
                                  : "text-gray-400"
                              }`}
                            />
                            <span className={hasGeneratedReport ? "" : "text-gray-400"}>Report</span>
                          </button>
                        )}

                        {/* Divider between Open/Report and secondary actions */}
                        {(canEditDetails || canTransfer || canDelete) && (
                          <div
                            className="w-[1px] h-4 bg-slate-200 mx-1"
                            aria-hidden="true"
                          />
                        )}

                        {/* Edit Details */}
                        {canEditDetails && (
                          <button
                            type="button"
                            onClick={() => setEditModalCase(c)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-[#0d3b66] hover:bg-slate-100 transition-colors"
                            title="Edit details"
                            aria-label="Edit details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {/* Transfer Ownership */}
                        {canTransfer && (
                          <button
                            type="button"
                            onClick={() => setTransferModalCase(c)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-[#0d3b66] hover:bg-slate-100 transition-colors"
                            title="Transfer ownership"
                            aria-label="Transfer ownership"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        {canDelete && (
                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => setDeleteModalCase(c)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors"
                            title={
                              isLocked
                                ? "Cannot delete in locked projects"
                                : "Delete case"
                            }
                            aria-label="Delete case"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODAL: Add Case ── */}
      {addModalType && (
        <AddCaseModal
          workType={addModalType}
          request={request}
          existingCases={cases}
          onClose={() => setAddModalType(null)}
          onSubmit={(details) => handleCreateCaseSubmit(addModalType, details)}
        />
      )}

      {/* ── MODAL: Edit Details ── */}
      {editModalCase && (
        <EditCaseModal
          key={editModalCase.id}
          caseItem={editModalCase}
          existingCases={cases}
          onClose={() => setEditModalCase(null)}
          onSubmit={(updates) => {
            onUpdateCase(editModalCase.id, {
              ...updates,
              lastEditedBy: me,
              lastEdited: new Date().toISOString(),
            });
            setEditModalCase(null);
            if (onToast) onToast("Case details updated successfully.");
          }}
        />
      )}

      {/* ── MODAL: Transfer Ownership ── */}
      {transferModalCase && (
        <TransferOwnershipModal
          caseItem={transferModalCase}
          members={request.members || []}
          onClose={() => setTransferModalCase(null)}
          onTransfer={(newOwner) => {
            onUpdateCase(transferModalCase.id, {
              owner: newOwner,
              lastEditedBy: me,
              lastEdited: new Date().toISOString(),
            });
            setTransferModalCase(null);
            if (onToast)
              onToast(`Ownership transferred to ${newOwner} successfully.`);
          }}
        />
      )}

      {/* ── MODAL: Delete Case ── */}
      {deleteModalCase && (
        <DeleteCaseModal
          caseItem={deleteModalCase}
          onClose={() => setDeleteModalCase(null)}
          onConfirm={() => {
            onDeleteCase(deleteModalCase.id);
            setDeleteModalCase(null);
            if (onToast) onToast("Case deleted successfully.");
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Add Case
// ─────────────────────────────────────────────────────────────────────────────
function AddCaseModal({ workType, request, existingCases, onClose, onSubmit }) {
  const isCalc = workType === "calc";
  const defaultTitle =
    request.fields?.subject || request.fields?.projectName || "New Case";

  const [caseLabel, setCaseLabel] = useState("");
  const [poleKind, setPoleKind] = useState("standard"); // 'standard' | 'custom'
  const [touched, setTouched] = useState(false);

  const isValid = caseLabel.trim() !== "" && poleKind !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    onSubmit({
      title: caseLabel.trim() || defaultTitle,
      poleKind,
      drawingType: !isCalc ? "Approval" : "",
      case_label: caseLabel.trim(),
      owner: getUser()?.name || request.createdBy || "Bintarjo Agus Priyadi",
      createdBy: getUser()?.name || request.createdBy || "Bintarjo Agus Priyadi",
      status: "Not started",
    });
  };

  const hasLabelError = touched && !caseLabel.trim();

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header (No close button X as requested) */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3 text-white">
            {isCalc ? (
              <Calculator className="w-5 h-5 text-white shrink-0" />
            ) : (
              <PencilRuler className="w-5 h-5 text-white shrink-0" />
            )}
            <div>
              <h3 className="text-base font-semibold text-white">
                {isCalc ? "Add Calculation Case" : "Add Drawing Case"}
              </h3>
              <p className="text-xs text-blue-100/80 font-normal">
                Configure your new case parameters
              </p>
            </div>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Case label / No. (Mandatory, at the very top) */}
            <div>
              <label className="block text-xs md:text-sm text-gray-700 mb-1.5 md:mb-2 font-medium">
                Case No. / Label <span className="text-red-500">*</span>
              </label>
              <input
                id="caseLabel"
                type="text"
                value={caseLabel}
                onChange={(e) => setCaseLabel(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="e.g. /001 or Case-01"
                required
                className={`${inputStyle(hasLabelError)} text-slate-800 placeholder-slate-400`}
              />
              {hasLabelError ? (
                <p className="mt-1 text-[11px] text-red-500 font-medium">
                  *Case No. / Label is required
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500">
                  External numbering from the Japan side, e.g. /001
                </p>
              )}
            </div>

            {/* Pole Type: Standard / Custom pole selection */}
            <div id="poleType">
              <label className="block text-xs md:text-sm text-gray-700 mb-1.5 md:mb-2 font-medium">
                Pole Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {poleTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = poleKind === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      title={option.desc}
                      onClick={() => setPoleKind(option.id)}
                      className={`group w-full flex items-center justify-between px-3 xl:px-4 py-2.5 lg:py-3 relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                        isActive
                          ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-md ${
                            isActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <p
                            className={`text-[12px] md:text-sm font-medium ${
                              isActive ? "text-slate-900" : "text-slate-700"
                            }`}
                          >
                            {option.title}
                          </p>
                          <p
                            className={`text-[11px] md:text-xs mt-0.5 ${
                              isActive ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {option.desc}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 ml-2 flex items-center">
                        {isActive ? (
                          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                        ) : (
                          <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 rounded-b-2xl shrink-0">
            <span className="text-xs md:text-sm text-slate-500">
              Standard or Custom pole
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                Create case
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Edit Details
// ─────────────────────────────────────────────────────────────────────────────
function EditCaseModal({ caseItem, existingCases, onClose, onSubmit }) {
  const initialLabel = useMemo(() => {
    return (
      caseItem.case_label ||
      (caseItem.no
        ? String(caseItem.no).startsWith("/")
          ? caseItem.no
          : `/${caseItem.no}`
        : "") ||
      ""
    ).trim();
  }, [caseItem]);

  const initialPoleKind = caseItem.poleKind || "standard";

  const [caseLabel, setCaseLabel] = useState(initialLabel);
  const [poleKind, setPoleKind] = useState(initialPoleKind);
  const [touched, setTouched] = useState(false);


  // Trigger active only when changes were made and input is valid
  const hasChanges =
    caseLabel.trim() !== initialLabel || poleKind !== initialPoleKind;
  const isValid = hasChanges && caseLabel.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    onSubmit({
      case_label: caseLabel.trim(),
      title: caseLabel.trim() || caseItem.title,
      poleKind,
    });
  };

  const hasLabelError = touched && !caseLabel.trim();

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header (No close button X) */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3 text-white">
            <Edit className="w-5 h-5 text-white shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Edit Case Details
              </h3>
              <p className="text-xs text-blue-100/80 font-normal">
                Update case number and pole specification
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Case label / No. (Mandatory, at the very top) */}
            <div>
              <label className="block text-xs md:text-sm text-gray-700 mb-1.5 md:mb-2 font-medium">
                Case No. / Label <span className="text-red-500">*</span>
              </label>
              <input
                id="editCaseLabel"
                type="text"
                value={caseLabel}
                onChange={(e) => setCaseLabel(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="e.g. /001 or Case-01"
                required
                className={`${inputStyle(hasLabelError)} text-slate-800 placeholder-slate-400`}
              />
              {hasLabelError ? (
                <p className="mt-1 text-[11px] text-red-500 font-medium">
                  *Case No. / Label is required
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500">
                  External numbering from the Japan side, e.g. /001
                </p>
              )}
            </div>

            {/* Pole Type: Standard / Custom pole selection in 2 rows */}
            <div id="editPoleType">
              <label className="block text-xs md:text-sm text-gray-700 mb-1.5 md:mb-2 font-medium">
                Pole Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {poleTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = poleKind === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      title={option.desc}
                      onClick={() => setPoleKind(option.id)}
                      className={`group w-full flex items-center justify-between px-3.5 xl:px-4 py-2.5 lg:py-3 relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                        isActive
                          ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-md ${
                            isActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <p
                            className={`text-[12px] md:text-sm font-medium ${
                              isActive ? "text-slate-900" : "text-slate-700"
                            }`}
                          >
                            {option.title}
                          </p>
                          <p
                            className={`text-[11px] md:text-xs mt-0.5 ${
                              isActive ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {option.desc}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 ml-2 flex items-center">
                        {isActive ? (
                          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                        ) : (
                          <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-slate-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 rounded-b-2xl shrink-0">
            <span className="text-xs md:text-sm text-slate-500">
              {hasChanges ? (
                <span className="text-amber-600 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Unsaved changes
                </span>
              ) : (
                "Change values to enable save"
              )}
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                Save changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Transfer Ownership
// ─────────────────────────────────────────────────────────────────────────────
function TransferOwnershipModal({ caseItem, members = [], onClose, onTransfer }) {
  const [selectedOwner, setSelectedOwner] = useState("");
  const [searchMember, setSearchMember] = useState("");

  // Normalize assigned members from the Assignment section
  const memberList = useMemo(() => {
    const raw = Array.isArray(members) ? members : [];
    return raw.map((m) => {
      if (typeof m === "string") {
        return { id: m, name: m, isCreator: false };
      }
      return {
        id: m.id || m.name,
        name: m.name || "Unknown",
        isCreator: Boolean(m.isCreator),
      };
    });
  }, [members]);

  const filteredMembers = useMemo(() => {
    const q = searchMember.trim().toLowerCase();
    if (!q) return memberList;
    return memberList.filter((m) => m.name.toLowerCase().includes(q));
  }, [searchMember, memberList]);

  const currentOwner = caseItem.owner || "Unassigned";
  const isValidSelection = Boolean(
    selectedOwner && selectedOwner !== currentOwner,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidSelection) return;
    onTransfer(selectedOwner);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header (No close button X) */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3 text-white">
            <UserCheck className="w-5 h-5 text-white shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Transfer Case Ownership
              </h3>
              <p className="text-xs text-blue-100/80 font-normal">
                Reassign this case to another team member
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Case Info Strip (Target Case & Current Owner) */}
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div className="min-w-0">
              <span className="text-xs font-medium text-slate-500">
                Target Case
              </span>
              <p className="text-sm font-semibold text-slate-800 truncate">
                {caseItem.case_label || caseItem.title || `Case ${caseItem.no}`}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-medium text-slate-500">
                Current Owner
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {currentOwner}
              </p>
            </div>
          </div>

          {/* Search Member Input (when more than 3 members) */}
          {memberList.length > 3 && (
            <div className="p-3 border-b border-slate-100 bg-white shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  placeholder="Search assigned member by name..."
                  className={`${inputStyle(false)} pl-10 text-slate-800 placeholder:text-slate-400`}
                />
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="overflow-y-auto p-4 space-y-2.5 flex-1 max-h-[300px] scrollbar-soft">
            <div className="pb-1">
              <span className="text-sm font-semibold text-slate-800">
                Assigned Members ({memberList.length})
              </span>
            </div>

            {memberList.length === 0 ? (
              <div className="py-8 text-center px-4">
                <div className="mx-auto w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0d3b66] mb-2.5">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-sm text-slate-800 font-semibold">
                  No members assigned yet
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Please assign team members in the{" "}
                  <span className="font-semibold text-slate-700">Assignment</span>{" "}
                  section above first to transfer case ownership.
                </p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No assigned members found matching "{searchMember.trim()}".
              </div>
            ) : (
              filteredMembers.map((m) => {
                const isCurrent = currentOwner === m.name;
                const isSelected = selectedOwner === m.name;

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (!isCurrent) setSelectedOwner(m.name);
                    }}
                    className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ease-out active:scale-[0.99] ${
                      isCurrent
                        ? "opacity-60 cursor-not-allowed bg-slate-50/70 border-slate-200"
                        : isSelected
                          ? "bg-blue-50/50 border-[#3399cc] shadow-xs cursor-pointer"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white shadow-xs"
                            : "bg-[#0d3b66] text-white"
                        }`}
                      >
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <p
                        className={`text-sm font-medium truncate transition-colors duration-200 ${
                          isSelected
                            ? "text-blue-900 font-semibold"
                            : "text-slate-800"
                        }`}
                      >
                        {m.name}
                      </p>
                    </div>

                    <div className="shrink-0 ml-3">
                      {isCurrent ? (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                          Current Owner
                        </span>
                      ) : isSelected ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0d3b66] text-white shadow-xs animate-in fade-in zoom-in-95 duration-200">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                          Selected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] group-hover:bg-[#dbe4ef] transition-colors">
                          <Circle className="w-3.5 h-3.5 text-[#0d3b66]/60" />
                          Select
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValidSelection}
              className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              Transfer ownership
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Delete Case (matching Remove Member modal in InitialAssignment)
// ─────────────────────────────────────────────────────────────────────────────
function DeleteCaseModal({ caseItem, onClose, onConfirm }) {
  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Danger icon */}
        <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full">
          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
          Delete case?
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">
            {caseItem.case_label || caseItem.title || `Case ${caseItem.no}`}
          </span>
          ? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
