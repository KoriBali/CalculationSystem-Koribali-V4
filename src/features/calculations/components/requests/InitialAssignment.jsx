import { useState, useMemo, useRef, useEffect } from "react";
import { UserPlus, Search, Check, Plus, X, Lock, Users } from "lucide-react";

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
    className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-semibold ${
      strong ? "bg-[#0d3b66] text-white" : "bg-blue-100 text-blue-700"
    }`}
  >
    {initials(name)}
  </span>
);

export default function InitialAssignment({
  members,
  onChange,
  workers = [], // everyone who can be added: [{ id, name, department }]
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const memberIds = useMemo(
    () => new Set(members.map((m) => m.id)),
    [members],
  );

  const filteredWorkers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return workers;
    return workers.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        (w.department && w.department.toLowerCase().includes(q)),
    );
  }, [searchQuery, workers]);

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [modalOpen]);

  const handleAddMember = (worker) => {
    if (memberIds.has(worker.id)) return;
    onChange([
      ...members,
      {
        ...worker,
        isCreator: false,
      },
    ]);
  };

  const handleRemoveMember = (id) => {
    onChange(members.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* ── Header with Title & "+ Assign Member" button ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-medium text-slate-800">
              Assigned Members
            </h3>
            <span className="text-xs font-normal text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Team members with access to view, edit, or work on cases in this request.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs md:text-sm font-medium bg-[#0d3b66] text-white hover:bg-[#0b3157] shadow-xs active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Assign Member
        </button>
      </div>

      {/* ── Members List ── */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={m.name} strong={m.isCreator} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                    {m.name}
                  </span>
                  {m.isCreator ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-medium text-blue-700 border border-blue-200">
                      Creator · You
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
                      Member
                    </span>
                  )}
                </div>
                {m.department && (
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                    {m.department}
                  </p>
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
                  onClick={() => handleRemoveMember(m.id)}
                  title={`Remove ${m.name}`}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          Only you are assigned right now. Click "Assign Member" above to add colleagues.
        </p>
      )}

      {/* ── Assign Member Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-5 flex items-center justify-between shrink-0 rounded-t-2xl">
              <div className="flex items-center gap-2.5 text-white">
                <UserPlus className="w-5 h-5 text-blue-200 shrink-0" />
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Assign Team Member
                  </h3>
                  <p className="text-xs text-blue-100/80 font-normal">
                    Search and add colleagues to this request
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Box inside Modal */}
            <div className="p-4 border-b border-slate-100 bg-white shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by worker name or department..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-xs sm:text-sm bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d3b66]/20 focus:border-[#0d3b66] transition-all"
                />
              </div>
            </div>

            {/* Workers List */}
            <div className="overflow-y-auto p-3 divide-y divide-slate-100 flex-1">
              {filteredWorkers.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No workers found matching "{searchQuery.trim()}".
                </div>
              ) : (
                filteredWorkers.map((w) => {
                  const isAdded = memberIds.has(w.id);
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
                          <p className="text-[11px] text-slate-500 truncate">
                            {w.department}
                          </p>
                        </div>
                      </div>

                      {isAdded ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3.5 h-3.5" />
                          Added
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddMember(w)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 active:scale-95 transition-all"
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

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end shrink-0 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
