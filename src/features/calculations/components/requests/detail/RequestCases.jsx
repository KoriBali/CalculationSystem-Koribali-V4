import { useState, useRef, useEffect, useMemo } from "react";
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
  AlertTriangle,
  Info,
  Check,
  X,
  Layers,
} from "lucide-react";
import { designStandardOptions } from "../../../constants/designStandards";
import { formatShortDate } from "../../../utils/requestForm";
import { getUser } from "../../../../../utils/auth";

const DRAWING_TYPE_LABELS = {
  Approval: "APD (Approval)",
  Manufacturer: "MFD (Manufacturer)",
  Order: "Order",
  Meeting: "Meeting",
};

const CASE_STATUS_STYLES = {
  "Not started": "bg-slate-100 text-slate-600",
  "In progress": "bg-blue-50 text-blue-700",
  "Ready for check": "bg-amber-50 text-amber-700",
  Checked: "bg-emerald-50 text-emerald-700",
  "Needs correction": "bg-rose-50 text-rose-700",
};

function StatusChip({ status }) {
  const norm =
    status === "started"
      ? "In progress"
      : status === "new"
        ? "Not started"
        : status || "Not started";

  const style =
    CASE_STATUS_STYLES[norm] || "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {norm}
    </span>
  );
}

function DisciplineDisplay({ workType, drawingType }) {
  if (workType === "drawing") {
    const dType =
      DRAWING_TYPE_LABELS[drawingType] || drawingType || "General";
    return (
      <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-normal">
        <PencilRuler className="w-4 h-4 text-slate-400 shrink-0" />
        <span>Drawing ({dType})</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-normal">
      <Calculator className="w-4 h-4 text-slate-400 shrink-0" />
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
  onToast, // (message) => void
}) {
  const me = getUser()?.name || "Rani Putri";
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

  // Active row dropdown menu: openCaseMenuId
  const [openMenuCaseId, setOpenMenuCaseId] = useState(null);
  const rowMenuRef = useRef(null);

  // Highlighted case id for flash animation
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setAddMenuOpen(false);
      }
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target)) {
        setOpenMenuCaseId(null);
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
      {/* ── Section Header matching condition/new request mockup ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-xs sm:text-sm text-gray-500">
          {allowedWorkTypes.length === 1
            ? `This request is ${allowedWorkTypes[0] === "calc" ? "calculation" : "drawing"} only. Open a case to work on it.`
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
                  ? "Cannot add cases to locked / completed requests"
                  : undefined
              }
              onClick={() => setAddModalType(allowedWorkTypes[0])}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#0d3b66] text-white hover:bg-[#0a2c4c] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 transition-all"
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
                    ? "Cannot add cases to locked / completed requests"
                    : undefined
                }
                onClick={() => setAddMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-[#0d3b66] text-white hover:bg-[#0a2c4c] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 transition-all"
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
                      setAddMenuOpen(false);
                      setAddModalType("calc");
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <span>Calculation Case</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
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

      {/* ── Table or Empty State ── */}
      {cases.length === 0 ? (
        <div className="flex flex-col items-center text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12">
          <div className="p-3 rounded-full bg-white border border-slate-200 text-slate-400 shadow-xs">
            <FolderPlus className="w-6 h-6 text-slate-400" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">
            No cases yet. Add a case to start working.
          </p>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Create a calculation or drawing case to start drafting structural
            computations or CAD drawings.
          </p>
          {allowedWorkTypes.length > 0 && !isLocked && (
            <button
              type="button"
              onClick={() => setAddModalType(allowedWorkTypes[0])}
              className="mt-4 inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-semibold text-[#0d3b66] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Case
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto scrollbar-soft">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="text-slate-500 font-normal border-b border-slate-100 bg-white">
                <tr>
                  <th className="px-6 py-3.5 whitespace-nowrap font-normal">Case No.</th>
                  <th className="px-6 py-3.5 whitespace-nowrap font-normal">Discipline</th>
                  <th className="px-6 py-3.5 whitespace-nowrap font-normal">Status</th>
                  <th className="px-6 py-3.5 whitespace-nowrap font-normal">Created</th>
                  <th className="px-6 py-3.5 whitespace-nowrap font-normal">Last Edited</th>
                  <th className="px-6 py-3.5 text-right whitespace-nowrap font-normal"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70">
                {cases.map((c, index) => {
                  const isNewlyAdded = c.id === recentlyAddedId;
                  const isOwner = c.owner === me;
                  const canEditDetails = isOwner || isAdmin;
                  const canTransfer = isOwner || isAdmin;
                  const canDelete = isOwner || isAdmin;
                  const caseNumDisplay =
                    c.case_label || c.no || String(index + 1).padStart(3, "0");

                  return (
                    <tr
                      key={c.id}
                      className={`group hover:bg-slate-50/60 transition-colors ${
                        isNewlyAdded
                          ? "bg-blue-50/70 ring-1 ring-blue-300 ring-inset"
                          : ""
                      }`}
                    >
                      {/* Case No. */}
                      <td className="px-6 py-4 font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                        {caseNumDisplay}
                      </td>

                      {/* Discipline */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DisciplineDisplay
                          workType={c.workType}
                          drawingType={c.drawingType}
                        />
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusChip status={c.status} />
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap text-xs sm:text-sm font-normal">
                        {c.createdAt ? formatShortDate(c.createdAt) : "—"}
                      </td>

                      {/* Last Edited */}
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap text-xs sm:text-sm font-normal">
                        {c.lastEdited ? formatShortDate(c.lastEdited) : "—"}
                      </td>

                      {/* Aksi: Open › text link and menu ⋮ */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2.5">
                          {/* Open › text link */}
                          <button
                            type="button"
                            onClick={() => onOpenCase(c)}
                            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#0d3b66] hover:text-[#0a2c4c] transition-colors"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Three dots ⋮ menu */}
                          <div
                            ref={openMenuCaseId === c.id ? rowMenuRef : null}
                            className="relative"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuCaseId(
                                  openMenuCaseId === c.id ? null : c.id,
                                );
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                              title="More actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openMenuCaseId === c.id && (
                              <div className="absolute right-0 z-30 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg text-left text-xs animate-in fade-in duration-150">
                                {/* Edit Details */}
                                {canEditDetails && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuCaseId(null);
                                      setEditModalCase(c);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Edit details</span>
                                  </button>
                                )}

                                {/* Transfer Ownership */}
                                {canTransfer && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuCaseId(null);
                                      setTransferModalCase(c);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                                  >
                                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Transfer ownership</span>
                                  </button>
                                )}

                                {/* Delete */}
                                {canDelete && (
                                  <button
                                    type="button"
                                    disabled={isLocked}
                                    title={
                                      isLocked
                                        ? "Cannot delete in locked requests"
                                        : undefined
                                    }
                                    onClick={() => {
                                      setOpenMenuCaseId(null);
                                      setDeleteModalCase(c);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    <span>Delete</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
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
          caseItem={editModalCase}
          onClose={() => setEditModalCase(null)}
          onSubmit={(updates) => {
            onUpdateCase(editModalCase.id, updates);
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
            onUpdateCase(transferModalCase.id, { owner: newOwner });
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

  const [title, setTitle] = useState(defaultTitle);
  const [poleKind, setPoleKind] = useState("standard"); // 'standard' | 'custom'
  const [drawingType, setDrawingType] = useState("Approval");
  const [caseLabel, setCaseLabel] = useState("");

  // Design condition preview for Calculation
  const standardVal =
    request.designConditions?.standard || request.fields?.standard || "";
  const standardObj = (
    designStandardOptions[request.projectType] || []
  ).find((o) => o.value === standardVal);
  const standardName = standardObj?.label || standardVal || "Default";
  const airDensityVal =
    request.designConditions?.airDensity ||
    request.fields?.airDensity ||
    "1.23";
  const windSpeedVal =
    request.designConditions?.windSpeed || request.fields?.windSpeed || "";

  // Check duplicate caseLabel soft warning
  const isDuplicateLabel = useMemo(() => {
    if (!caseLabel.trim()) return false;
    const clean = caseLabel.trim().toLowerCase();
    return existingCases.some(
      (c) =>
        (c.case_label || "").trim().toLowerCase() === clean && clean !== "",
    );
  }, [caseLabel, existingCases]);

  const isValid =
    title.trim() !== "" &&
    (isCalc || drawingType.trim() !== "") &&
    poleKind !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      title: title.trim(),
      poleKind,
      drawingType: !isCalc ? drawingType : "",
      case_label: caseLabel.trim(),
      owner: getUser()?.name || request.createdBy || "Rani Putri",
      status: "Not started",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-2.5 text-white">
            {isCalc ? (
              <Calculator className="w-5 h-5 text-blue-200 shrink-0" />
            ) : (
              <PencilRuler className="w-5 h-5 text-purple-200 shrink-0" />
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
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Readonly Design Conditions line for Calculation */}
            {isCalc && (
              <div>
                {windSpeedVal ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Design conditions: <strong>{standardName}</strong> · air density{" "}
                      <strong>{airDensityVal} N·sec²/m⁴</strong> · wind speed{" "}
                      <strong>{windSpeedVal} m/s</strong>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Wind speed isn't set yet. You can create the case, but
                      calculation can't run until it is.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Case title"
                required
                className="w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
              />
            </div>

            {/* Pole kind: Standard / Custom cards */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Pole kind <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPoleKind("standard")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    poleKind === "standard"
                      ? "border-[#0d3b66] bg-blue-50/50 ring-2 ring-[#0d3b66]/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800">
                      Standard
                    </span>
                    {poleKind === "standard" && (
                      <Check className="w-4 h-4 text-[#0d3b66]" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 font-normal">
                    Tiang dari katalog standar
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPoleKind("custom")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    poleKind === "custom"
                      ? "border-[#0d3b66] bg-blue-50/50 ring-2 ring-[#0d3b66]/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800">
                      Custom
                    </span>
                    {poleKind === "custom" && (
                      <Check className="w-4 h-4 text-[#0d3b66]" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 font-normal">
                    Segmen diketik sendiri
                  </p>
                </button>
              </div>
            </div>

            {/* Drawing type (Drawing only) */}
            {!isCalc && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Drawing type <span className="text-red-500">*</span>
                </label>
                <select
                  value={drawingType}
                  onChange={(e) => setDrawingType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
                  required
                >
                  <option value="Approval">Approval (APD)</option>
                  <option value="Manufacturer">Manufacturer (MFD)</option>
                  <option value="Order">Order</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>
            )}

            {/* Case label (External numbering) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Case label{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={caseLabel}
                onChange={(e) => setCaseLabel(e.target.value)}
                placeholder="e.g. /001 or 001"
                className="w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                External numbering from the Japan side, e.g. /001
              </p>
              {isDuplicateLabel && (
                <p className="mt-1 text-[11px] text-amber-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  This case label is already used by another case in this request.
                </p>
              )}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-2xl shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Create case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Edit Details
// ─────────────────────────────────────────────────────────────────────────────
function EditCaseModal({ caseItem, onClose, onSubmit }) {
  const isDrawing = caseItem.workType === "drawing";
  const [title, setTitle] = useState(caseItem.title || "");
  const [caseLabel, setCaseLabel] = useState(caseItem.case_label || "");
  const [drawingType, setDrawingType] = useState(
    caseItem.drawingType || "Approval",
  );

  const isValid = title.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      title: title.trim(),
      case_label: caseLabel.trim(),
      ...(isDrawing ? { drawingType } : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-2.5 text-white">
            <Edit className="w-4.5 h-4.5 text-blue-200 shrink-0" />
            <h3 className="text-base font-semibold text-white">
              Edit Case Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Case label{" "}
                <span className="text-slate-400 font-normal">(External numbering)</span>
              </label>
              <input
                type="text"
                value={caseLabel}
                onChange={(e) => setCaseLabel(e.target.value)}
                placeholder="e.g. /001"
                className="w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
              />
            </div>

            {isDrawing && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Drawing type <span className="text-red-500">*</span>
                </label>
                <select
                  value={drawingType}
                  onChange={(e) => setDrawingType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
                >
                  <option value="Approval">Approval (APD)</option>
                  <option value="Manufacturer">Manufacturer (MFD)</option>
                  <option value="Order">Order</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>
            )}
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-2xl shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm disabled:opacity-50 transition-all"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Transfer Ownership
// ─────────────────────────────────────────────────────────────────────────────
function TransferOwnershipModal({ caseItem, members, onClose, onTransfer }) {
  const [selectedOwner, setSelectedOwner] = useState(caseItem.owner || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOwner || selectedOwner === caseItem.owner) return;
    onTransfer(selectedOwner);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-2.5 text-white">
            <UserCheck className="w-4.5 h-4.5 text-blue-200 shrink-0" />
            <h3 className="text-base font-semibold text-white">
              Transfer Case Ownership
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <p className="text-xs sm:text-sm text-slate-600">
              Select a member assigned to this request to take over ownership of{" "}
              <strong className="text-slate-800">{caseItem.title || caseItem.no}</strong>.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                New Owner
              </label>
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
                required
              >
                <option value="" disabled>
                  Select member
                </option>
                {members.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} {m.department ? `(${m.department})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-2xl shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedOwner || selectedOwner === caseItem.owner}
              className="px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm disabled:opacity-50 transition-all"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: Delete Case
// ─────────────────────────────────────────────────────────────────────────────
function DeleteCaseModal({ caseItem, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Delete Case?</h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Are you sure you want to delete{" "}
            <strong className="text-slate-800">"{caseItem.title || caseItem.no}"</strong>? This action
            cannot be undone.
          </p>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
