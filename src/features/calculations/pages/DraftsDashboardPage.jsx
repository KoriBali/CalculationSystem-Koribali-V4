import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, FileText, FileEdit, Plus, Trash2, Edit3, Hash, Building2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getDraftsIndex, deleteDraft, handleSessionTransition } from "../utils/coreLogic";
import { projectTypeLabel } from "../constants/projectTypes";
import { ConfirmDeleteModal } from "../components/modals/ConfirmDeleteModal";

// Animation configs
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

export default function DraftsDashboardPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [draftToDelete, setDraftToDelete] = useState(null);

  // Format the project type name for display
  const formattedType = projectTypeLabel(type);

  useEffect(() => {
    // If there is an active draft left behind (e.g. user used sidebar to navigate here), auto-save it!
    handleSessionTransition(type, null);
    setDrafts(getDraftsIndex(type));
  }, [type]);

  const handleDeleteClick = (e, draftId) => {
    e.stopPropagation();
    setDraftToDelete(draftId);
  };

  const confirmDelete = () => {
    if (draftToDelete) {
      deleteDraft(type, draftToDelete);
      setDrafts(getDraftsIndex(type));
      setDraftToDelete(null);
    }
  };

  const handleCreateNew = () => {
    if (drafts.length >= 6) return;
    const newDraftId = `draft_${Date.now()}`;
    navigate(`/calculation/${type}/${newDraftId}`);
  };

  const handleOpenDraft = (draftId) => {
    navigate(`/calculation/${type}/${draftId}`);
  };

  // Format date safely
  const formatDate = (isoString) => {
    if (!isoString) return "Unknown date";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Unknown date";

    const now = new Date();
    const isToday = d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday) {
      return `Today, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
    }

    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-full flex flex-col">
      <Helmet>
        <title>{formattedType} Drafts - KORI BALI</title>
      </Helmet>

      {/* Layout matching UserManagement spacing */}
      <div className="mx-auto w-full max-w-[1600px] px-6 hp:px-3 py-4 sm:py-6 lg:py-8">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {formattedType} Drafts
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Manage your recent calculations or start a new one.
              <span className="ml-1 text-slate-400">({drafts.length} of 6 used)</span>
            </p>
          </div>

          {/* Action buttons — same size/shape, hierarchy by colour:
              Back = outlined secondary, New Project = filled primary. */}
          <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
            <button
              onClick={() => navigate("/calculation")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 active:scale-[0.98] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Project Types
            </button>

            <button
              onClick={handleCreateNew}
              disabled={drafts.length >= 6}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm
                ${drafts.length >= 6
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "bg-[#0d3b66] text-white hover:bg-[#0a2c4c] active:scale-[0.98]"
                }`}
            >
              <Plus className="w-4.5 h-4.5" />
              New Project
            </button>
          </div>
        </div>

        {/* Drafts Grid */}
        <div className="w-full pt-4">
          {drafts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 sm:py-20 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                <FileEdit className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">No drafts yet</h3>
              <p className="text-slate-500 text-sm max-w-md mb-6">
                Create your first {formattedType} calculation to get started. Each
                one is saved as a draft you can return to anytime.
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-[#0d3b66] text-white hover:bg-[#0a2c4c] active:scale-[0.98] transition-all shadow-sm"
              >
                <Plus className="w-4.5 h-4.5" />
                New Project
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
            >
              {drafts.map((draft) => (
                <motion.div
                  key={draft.id}
                  variants={itemVariants}
                  onClick={() => handleOpenDraft(draft.id)}
                  className="group bg-white rounded-xl border border-slate-200 p-5 md:p-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all duration-200 relative flex flex-col justify-between"
                >
                  {/* Top row: icon + content + chevron */}
                  <div className="flex items-start gap-4 md:gap-5">

                    {/* Icon */}
                    <div className="flex-shrink-0 p-3 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors duration-300">
                      <FileEdit className="w-5 h-5 stroke-[1.5]" />
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base font-semibold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors duration-300 line-clamp-1">
                        {draft.title || "Untitled Project"}
                      </h3>

                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2 text-[13px]">
                          <div className="flex items-center gap-1.5 w-[82px] text-slate-400 flex-shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Req No</span>
                          </div>
                          <span className="font-medium text-slate-700 truncate">{draft.requestNo || draft.subtitle || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px]">
                          <div className="flex items-center gap-1.5 w-[82px] text-slate-400 flex-shrink-0">
                            <Hash className="w-3.5 h-3.5" />
                            <span>Project No</span>
                          </div>
                          <span className="font-medium text-slate-700 truncate">{draft.projectNo || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px]">
                          <div className="flex items-center gap-1.5 w-[82px] text-slate-400 flex-shrink-0">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Company</span>
                          </div>
                          <span className="font-medium text-slate-700 truncate">{draft.companyName || "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chevron + Delete (stacked, right side) */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-3 self-stretch justify-between">
                      {/* Delete — visible on hover */}
                      <button
                        onClick={(e) => handleDeleteClick(e, draft.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all z-10"
                        title="Delete Draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {/* Chevron */}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400">
                    <Edit3 className="w-3 h-3" />
                    <span>Last edited {formatDate(draft.lastEdited)}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={!!draftToDelete}
        onClose={() => setDraftToDelete(null)}
        onConfirm={confirmDelete}
        itemName={
          draftToDelete
            ? `Draft "${drafts.find(d => d.id === draftToDelete)?.title || 'Untitled'}"`
            : "Draft"
        }
      />
    </div>
  );
}
