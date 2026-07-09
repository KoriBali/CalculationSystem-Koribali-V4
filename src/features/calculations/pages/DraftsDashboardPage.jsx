import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, FileText, FileEdit, Plus, Trash2, Edit3 } from "lucide-react";
import { motion } from "framer-motion";
import { getDraftsIndex, deleteDraft, handleSessionTransition } from "../utils/coreLogic";
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
  const formattedType = type
    ? type
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ")
    : "Project";

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

      {/* Hybrid Layout: No white header block, just max-w container ensuring perfect alignment */}
      <div className="w-full max-w-[1400px] mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Back button */}
        <button
          onClick={() => navigate("/calculation")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:bg-blue-50 hover:text-[#0d3b66] active:bg-blue-100 px-3 py-1.5 rounded-md transition-all mb-6 font-medium w-fit -ml-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project Types
        </button>

        {/* Header Section (Old styles) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {formattedType} Drafts
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage your recent calculations or start a new one (Limit: {drafts.length}/6).
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            disabled={drafts.length >= 6}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm
              ${
                drafts.length >= 6
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] text-white hover:brightness-110"
              }`}
          >
            <Plus className="w-4.5 h-4.5" />
            New Calculation
          </button>
        </div>

        {/* Drafts Grid (Old styles) */}
        <div className="w-full">
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center max-w-sm mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-[#f0f4f8] to-[#e6eef5] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FileEdit className="w-10 h-10 text-[#254b73]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No drafts found</h3>
              <p className="text-slate-500 text-sm mb-6">
                You haven't created any calculations for this project type yet.
              </p>
              <button
                onClick={handleCreateNew}
                className="text-[#0d3b66] font-medium text-sm hover:underline flex items-center gap-1"
              >
                Start your first calculation
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
            >
              {drafts.map((draft) => (
                <motion.div
                  key={draft.id}
                  variants={itemVariants}
                  onClick={() => handleOpenDraft(draft.id)}
                  className="group bg-white rounded-2xl border border-slate-200 p-5 md:p-6 cursor-pointer hover:border-[#3399cc] hover:shadow-md transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  {/* Delete button (shows on hover) */}
                  <button
                    onClick={(e) => handleDeleteClick(e, draft.id)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f0f4f8] to-[#e6eef5] text-[#2b6cb0] flex items-center justify-center shrink-0 border border-white shadow-sm">
                      <FileEdit className="w-5.5 h-5.5" strokeWidth={1.75} />
                    </div>
                    <div className="pr-8 w-full mt-0.5">
                      <h3 className="text-slate-900 font-bold text-[15px] leading-tight mb-0.5 group-hover:text-[#0d3b66] transition-colors line-clamp-1">
                        {draft.title || "Untitled"}
                      </h3>
                      <p className="text-slate-500 text-[13px] line-clamp-1">
                        {draft.subtitle || "No request number"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Last edited {formatDate(draft.lastEdited)}</span>
                    </div>
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
