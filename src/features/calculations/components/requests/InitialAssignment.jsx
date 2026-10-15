import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  UserPlus,
  Search,
  Check,
  Plus,
  X,
  Lock,
  Users,
  AlertCircle,
} from "lucide-react";

// "Muhammad Rifa Alfadli" → "MA"; "Dimas P." → "DP"
const initials = (name = "") => {
  const parts = name.replace(/\./g, "").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

const Avatar = ({ name, strong = false }) => (
  <span
    aria-hidden="true"
    className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${strong
      ? "bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] text-white shadow-xs"
      : "bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2]"
      }`}
  >
    {initials(name)}
  </span>
);

const inputStyle = (hasError = false) =>
  `w-full px-3 xl:px-4 py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${hasError
    ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
    : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

export default function InitialAssignment({
  members,
  onChange,
  workers = [], // everyone who can be added: [{ id, name, department }]
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // Set of member IDs already officially assigned to this request
  const assignedMemberIds = useMemo(
    () => new Set(members.map((m) => m.id)),
    [members],
  );

  // Only workers who are NOT yet assigned appear in the modal candidates list
  const candidateWorkers = useMemo(
    () => workers.filter((w) => !assignedMemberIds.has(w.id)),
    [workers, assignedMemberIds],
  );

  const selectedIds = useMemo(
    () => new Set(selectedWorkers.map((w) => w.id)),
    [selectedWorkers],
  );

  const filteredCandidates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return candidateWorkers;
    return candidateWorkers.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        (w.department && w.department.toLowerCase().includes(q)),
    );
  }, [searchQuery, candidateWorkers]);

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSelectedWorkers([]);
    }
  }, [modalOpen]);

  const handleOpenModal = () => {
    setSelectedWorkers([]);
    setSearchQuery("");
    setModalOpen(true);
  };

  const handleToggleSelect = (worker) => {
    setSelectedWorkers((prev) => {
      if (prev.some((w) => w.id === worker.id)) {
        return prev.filter((w) => w.id !== worker.id);
      }
      return [...prev, worker];
    });
  };

  const handleDoneModal = () => {
    if (selectedWorkers.length > 0) {
      onChange([
        ...members,
        ...selectedWorkers.map((w) => ({
          ...w,
          isCreator: false,
        })),
      ]);
    }
    setModalOpen(false);
  };

  const handleCancelModal = () => {
    setSelectedWorkers([]);
    setModalOpen(false);
  };

  const handleRemoveMember = (id) => {
    onChange(members.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* ── Header with Title & "+ Assign Member" button ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-slate-800">
              Assigned Members
            </h4>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 ring-1 ring-inset ring-slate-200/80 px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-normal">
            Team members with access to view, edit, or work on cases in this request.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg hp:rounded-md text-xs md:text-sm font-medium bg-gradient-to-r from-[#0d3b66] to-[#3399cc] hover:brightness-110 text-white shadow-sm active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Assign Member
        </button>
      </div>

      {/* ── Members List ── */}
      <div className="rounded-lg hp:rounded-md border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={m.name} strong={m.isCreator} />
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-medium text-slate-800 text-xs sm:text-sm truncate">
                  {m.name}
                </span>
                {m.isCreator ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/80">
                    Creator · You
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/80">
                    Member
                  </span>
                )}
              </div>
            </div>

            {/* Lock / Remove button */}
            <div>
              {m.isCreator ? (
                <span
                  title="The request creator is always assigned"
                  className="inline-flex items-center justify-center w-8 h-8 text-slate-300"
                >
                  <Lock className="w-4 h-4" />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setMemberToRemove(m)}
                  title={`Remove ${m.name}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Hint if only creator is assigned */}
      {members.length === 1 && (
        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-2 font-normal">
          <Users className="w-4 h-4 text-slate-400 shrink-0" />
          Only you are assigned right now. Click "Assign Member" above to add colleagues.
        </p>
      )}

      {/* ── Confirmation Modal: Remove Member (matches screenshot) ── */}
      {memberToRemove &&
        createPortal(
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
            <div className="w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 text-center animate-in zoom-in-95 duration-200">
              {/* Danger icon */}
              <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>

              {/* Title */}
              <h2 className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
                Remove member?
              </h2>

              {/* Description */}
              <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-gray-800">
                  {memberToRemove.name}
                </span>
                ? This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setMemberToRemove(null)}
                  className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveMember(memberToRemove.id);
                    setMemberToRemove(null);
                  }}
                  className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ── Modal: Assign Member (Fullscreen Overlay, Candidates Only) ── */}
      {modalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-md sm:max-w-lg h-[520px] sm:h-[560px] lg:h-[580px] 2xl:h-[640px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-white shrink-0" />
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Assign Team Member
                    </h3>
                    <p className="text-xs text-blue-100/80 font-normal">
                      Search and add colleagues to this request
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Input Box */}
              <div className="p-4 border-b border-slate-100 bg-white shrink-0">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by worker name..."
                    className={`${inputStyle(false)} pl-10 text-slate-800 placeholder:text-slate-400`}
                  />
                </div>
              </div>

              {/* Candidates List (Only unassigned workers) */}
              <div className="overflow-y-auto p-3 divide-y divide-slate-100 flex-1">
                {candidateWorkers.length === 0 ? (
                  <div className="py-10 text-center px-4">
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">
                      All team members are already assigned.
                    </p>
                    <p className="text-[13px] text-slate-400 mt-1">
                      Everyone available is already part of this request.
                    </p>
                  </div>
                ) : filteredCandidates.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-500">
                    No workers found matching "{searchQuery.trim()}".
                  </div>
                ) : (
                  filteredCandidates.map((w) => {
                    const isSelected = selectedIds.has(w.id);
                    return (
                      <div
                        key={w.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar name={w.name} />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                              {w.name}
                            </p>
                          </div>
                        </div>

                        {isSelected ? (
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(w)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 transition-colors"
                            title="Click to remove from selection"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Added
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(w)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#eef2f6] hover:bg-[#0d3b66] text-[#0d3b66] hover:text-white ring-1 ring-inset ring-[#d0d7e2] active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer with Cancel & Done buttons */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 rounded-b-2xl">
                <span className="text-[13px] text-slate-500">
                  {selectedWorkers.length > 0
                    ? `${selectedWorkers.length} selected to add`
                    : "Select members to add"}
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCancelModal}
                    className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDoneModal}
                    className="px-5 py-2.5 rounded-lg hp:rounded-md font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm active:scale-95 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
