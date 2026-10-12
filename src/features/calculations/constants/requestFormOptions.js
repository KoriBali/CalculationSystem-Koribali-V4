// Option lists for the New Request form (YP / YS covers).
// `jp` on an option: its wording as printed on the cover, shown as a hover
// tooltip so users copying from the paper can match it.
import { Calculator, FileText, PencilRuler } from "lucide-react";

// Disciplines a request can cover — pick one or both.
export const DISCIPLINE_OPTIONS = [
  { id: "calc", label: "Calculation", jp: "計算書", icon: Calculator },
  { id: "drawing", label: "Drawing", jp: "図面", icon: PencilRuler },
];

// `docTitle` is the title printed on that cover, so users can match the
// option to the paper in front of them.
export const COVER_TYPE_OPTIONS = [
  { id: "yp", label: "YP", docTitle: "設計依頼書", icon: FileText },
  {
    id: "ys",
    label: "YS",
    docTitle: "スミポール設計依頼兼発注伺書",
    icon: FileText,
  },
];

// "Reuse" stands for 流用新規 (reuse as new) — kept short so the group fits
// one column; the cover's wording is in the tooltip.
// Request Type (依頼種別) — both covers, in Request Identity.
export const REQUEST_TYPE_OPTIONS = [
  { value: "general", label: "General", jp: "一般" },
  { value: "special", label: "Special", jp: "特殊" },
];

export const CLASSIFICATION_OPTIONS = [
  { value: "new", label: "New", jp: "新規" },
  { value: "change", label: "Change", jp: "変更" },
  { value: "reuse_new", label: "Reuse", jp: "流用新規" },
];

export const DESIGN_ORIGIN_OPTIONS = [
  { value: "development", label: "Development", jp: "開発設計" },
  { value: "proposal", label: "Proposal", jp: "提案設計" },
  { value: "existing", label: "Existing", jp: "既存設計" },
  { value: "customer_spec", label: "Customer Spec", jp: "顧客仕様" },
];

export const SCHEDULE_FLEX_OPTIONS = [
  { value: "possible", label: "Flexible", jp: "可" },
  { value: "not_possible", label: "Fixed", jp: "不可" },
  { value: "strict", label: "Strict", jp: "厳守" },
];

// No before Yes, as on the cover (☐無 ☐有[ ]): the competitor's name field
// sits right after "Yes", the option it belongs to.
export const COMPETITOR_OPTIONS = [
  { value: "no", label: "No", jp: "無" },
  { value: "yes", label: "Yes", jp: "有" },
];

// "other": typed in next to the buttons.
export const PAPER_SIZE_OPTIONS = [
  { value: "none", label: "None", jp: "無し" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "A3", label: "A3" },
  { value: "A4", label: "A4" },
  { value: "other", label: "Other" },
];

// "designated": the customer's own frame.
export const PAPER_FRAME_OPTIONS = [
  { value: "yp", label: "YP Frame", jp: "YP枠" },
  { value: "none", label: "No Frame", jp: "枠無し" },
  { value: "designated", label: "Designated", jp: "指定枠有り" },
];

export const CAD_FORMAT_OPTIONS = [
  { value: "dxf", label: "DXF" },
  { value: "dwg", label: "DWG" },
  { value: "other", label: "Other" },
];

export const PLATING_OPTIONS = [
  { value: "HDZT77_HDZ55", label: "HDZT77 · HDZ55", jp: "溶融亜鉛メッキ" },
  { value: "HDZ55", label: "HDZ55", jp: "溶融亜鉛メッキ" },
  { value: "HDZT63_HDZ45", label: "HDZT63 · HDZ45", jp: "溶融亜鉛メッキ" },
  { value: "HDZ45", label: "HDZ45", jp: "溶融亜鉛メッキ" },
];

// The wording printed after the plating spec (以降の文言).
// `text`: the option has its own text box — `textLabel` names it and
// `textJp` is its cover caption.
export const PLATING_PROVISO_OPTIONS = [
  {
    value: "t6_jis",
    label: "Plate thickness under 6.0 mm: per JIS H 8641",
    jp: "ただし、板厚t6.0未満はJIS H 8641に基づく。",
  },
  {
    value: "t32_hdz40",
    label:
      "Plate thickness under 3.2 mm: HDZ40 (when both are stated: HDZT56, HDZ40)",
    jp: "ただし、板厚t3.2未満はHDZ40とする。(併記の時は HDZT56, HDZ40)",
  },
  {
    value: "special",
    label: "Special note",
    jp: "特記",
    text: true,
    textLabel: "Special note",
  },
  {
    value: "none",
    label: "Not stated",
    jp: "記載なし",
    text: true,
    textLabel: "Reason",
    textJp: "理由",
  },
];

// Request Scope (依頼区分) checkboxes. `value` is the `yp` key it toggles.
export const CALC_TYPE_OPTIONS = [
  { value: "calcStrength", label: "Strength", jp: "強度計算" },
  { value: "calcDesign", label: "Design", jp: "設計計算" },
];
export const SCOPE_OPTIONS = [
  { value: "scopeMain", label: "Main Member", jp: "主構造部材" },
  { value: "scopeJoint", label: "Joint", jp: "仕口部" },
  { value: "scopeFoundation", label: "Foundation", jp: "基礎部" },
  { value: "scopeOtherOn", label: "Other" },
];
export const DRAFTING_OPTIONS = [
  { value: "draftTracing", label: "Tracing", jp: "トレース" },
  { value: "draftDesign", label: "Design", jp: "設計作図" },
];
// Which drawing is requested (pick one).
export const DELIVER_TYPE_OPTIONS = [
  { value: "order", label: "Order", jp: "発注図" },
  { value: "meeting", label: "Meeting", jp: "打合図" },
  { value: "approval", label: "Approval", jp: "承認図" },
];

// Confirm dialogs for cover actions that would wipe or overwrite values.
// `description` always takes the number of edited fields, so every dialog
// is resolved the same way (see coverConfirmCopy).
const plural = (n, one, many) => (n === 1 ? one : many);
export const COVER_CONFIRM = {
  overwrite: {
    title: "Overwrite Existing Entries?",
    description: () =>
      "Some fields already have values. Auto-fill will replace them with the data from the cover.",
    confirmLabel: "Auto-fill",
  },
  replace: {
    title: "Replace Cover?",
    description: () =>
      "All fields filled in from the current cover will be cleared, including any changes you made to them. You can run Auto-fill again with the new file.",
    confirmLabel: "Replace",
  },
  restoreAll: {
    title: "Use Cover Values?",
    description: (count) =>
      `${count} edited ${plural(count, "field", "fields")} will be set back to the values from the cover. Your changes to ${plural(count, "this field", "these fields")} will be lost.`,
    confirmLabel: "Use cover values",
  },
  remove: {
    title: "Remove Cover?",
    description: () =>
      "All fields filled in from this cover will be cleared, including any changes you made to them. This action cannot be undone.",
    confirmLabel: "Remove",
  },
};

// Props for the cover confirm dialog, or none while it's closed.
export const coverConfirmCopy = (kind, editedCount) => {
  const copy = COVER_CONFIRM[kind];
  return copy ? { ...copy, description: copy.description(editedCount) } : {};
};

// Reset dialog copy per cover type: Reset clears only the form on screen.
export const RESET_COPY = {
  yp: {
    title: "Reset YP Form?",
    description:
      "This will clear all YP fields. The cover type stays selected. This action cannot be undone.",
  },
  ys: {
    title: "Reset YS Form?",
    description:
      "This will clear all YS fields and the uploaded cover. The cover type stays selected. This action cannot be undone.",
  },
};

// Leaving the New Request form inside the Requests menu (useLeaveNewRequest).
export const LEAVE_NEW_REQUEST_COPY = {
  title: "Leave this request?",
  description:
    "Your entries haven't been saved and will be discarded if you leave. Save the request first to keep them.",
  confirmLabel: "Discard & Leave",
  cancelLabel: "Keep Editing",
};

// Discarding the unfinished request from the Project Type page.
export const DISCARD_NEW_REQUEST_COPY = {
  title: "Discard this request?",
  description:
    "All entries of the unfinished request will be cleared. This action cannot be undone.",
  confirmLabel: "Discard",
};
