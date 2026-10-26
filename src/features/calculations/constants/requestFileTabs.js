// Folders of a request's files on the Request Detail page, in tab order.
// `key` is where the files are stored on the request (request.files[key]).
export const REQUEST_FILE_TABS = [
  {
    key: "brief",
    label: "Brief & Concept",
    hint: "Initial cover document, preliminary sketches, reference drawings, and project specifications.",
  },
  {
    key: "calculation",
    label: "Calculation",
    hint: "Generated calculation reports, schematics, and supporting calculation files organized per case.",
  },
  {
    key: "drawing",
    label: "Drawing",
    hint: "CAD drawings, approval sheets, and production drawings organized per case.",
  },
  {
    key: "checking",
    label: "Checking & Review",
    hint: "Internal checker redline markups (Adobe PDF annotations) and review notes per case.",
  },
  {
    key: "output",
    label: "Output Package",
    hint: "Manifest checklist of final approved deliverables ready for distribution.",
  },
];

// Categories for Brief & Concept uploads
export const BRIEF_CATEGORIES = [
  { id: "concept", label: "Design Concept", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "reference", label: "Reference Drawing / Doc", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "cover", label: "Cover Sheet", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "other", label: "Other Reference", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

export const BRIEF_CATEGORY_MAP = Object.fromEntries(
  BRIEF_CATEGORIES.map((c) => [c.id, c])
);

// Review status options for Checking & Review
export const CHECK_STATUS_MAP = {
  approved: {
    id: "approved",
    label: "Approved",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  need_revision: {
    id: "need_revision",
    label: "Need Revision",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  under_review: {
    id: "under_review",
    label: "Under Review",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
};
