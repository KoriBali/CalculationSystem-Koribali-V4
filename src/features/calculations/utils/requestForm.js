// Pure helpers and field schema for the New Request form (YP / YS covers).
// No React here — everything is plain data and functions, easy to test.
import { getUser } from "../../../utils/auth";
import { designStandardOptions } from "../constants/designStandards";
import {
  CLASSIFICATION_OPTIONS,
  DISCIPLINE_OPTIONS,
  REQUEST_TYPE_OPTIONS,
} from "../constants/requestFormOptions";

// ─── Discipline ──────────────────────────────────────────────────────────────
// Nothing ticked by default: the user has to pick one or both.
export const NO_WORK_TYPES = { calc: false, drawing: false };

// Discipline lives in `workTypes` ({ calc, drawing }); for the cover
// auto-fill it's handled as one value: "both" | "calc" | "drawing" | "".
const DISCIPLINE_BY_FLAGS = {
  11: "both",
  10: "calc",
  "01": "drawing",
  "00": "",
};
const WORK_TYPES_BY_DISCIPLINE = {
  both: { calc: true, drawing: true },
  calc: { calc: true, drawing: false },
  drawing: { calc: false, drawing: true },
};
export const disciplineValue = (workTypes) =>
  DISCIPLINE_BY_FLAGS[`${+!!workTypes.calc}${+!!workTypes.drawing}`];
export const workTypesFrom = (value) =>
  WORK_TYPES_BY_DISCIPLINE[value] ?? NO_WORK_TYPES;

// The logged-in user — always the first member of a request, can't be
// removed.
export const creatorMember = () => {
  const user = getUser();
  return {
    id: "me",
    name: user?.name || "Guest User",
    department: user?.department?.name || user?.departmentName || "",
    isCreator: true,
    calc: true,
    drawing: true,
  };
};

// ─── YS fields ───────────────────────────────────────────────────────────────
// Every YS field the cover can fill. Also what "clear" resets them to.
export const YS_EMPTY = {
  mgmtNo: "",
  requestNo: "",
  receptionNo: "",
  classification: "new",
  requestType: "", // "general" | "special" — no default, picked by the user
  deliveryDate: "",
  requestDate: "",
  requestedDate: "",
  deliveryQty: "",
  companyName: "",
  projectNo: "",
  projectName: "",
  standard: "",
  windSpeed: "",
  foundation: "", // Foundation Shape
  foundationWidth: "",
  foundationLength: "",
  foundationDepth: "",
  openingHeight: "",
  openingDirection: "",
  drawingType: "",
  surfaceTreatment: "",
  coatingType: "",
  pic: "",
};

// Optional YS fields: not found on the cover is fine for these — an
// informational note, not a red error.
export const YS_OPTIONAL_KEYS = new Set([
  // Request Details
  "receptionNo",
  "pic",
  "deliveryDate",
  "deliveryQty",
  // Cover Design Conditions
  "standard",
  "windSpeed",
  "foundation",
  "foundationWidth",
  "foundationLength",
  "foundationDepth",
  "openingHeight",
  "openingDirection",
  "drawingType",
  "surfaceTreatment",
  "coatingType",
]);

// Fields that only matter for one discipline. They're hidden when that
// discipline isn't ticked and left out of the auto-fill counts; their values
// are kept in case it's ticked again.
const DISCIPLINE_ONLY_KEYS = {
  calc: new Set(["standard", "windSpeed"]),
  drawing: new Set(["drawingType", "surfaceTreatment", "coatingType"]),
};
// In play unless it belongs to a discipline that's unticked.
export const isKeyRelevant = (key, workTypes) =>
  Object.entries(DISCIPLINE_ONLY_KEYS).every(
    ([discipline, keys]) => workTypes[discipline] || !keys.has(key),
  );

// Fields in YS's Cover Design Conditions (reference values from the cover).
export const DESIGN_REF_KEYS = [
  "openingHeight",
  "openingDirection",
  "foundation",
  "foundationWidth",
  "foundationLength",
  "foundationDepth",
  "standard",
  "windSpeed",
  "drawingType",
  "surfaceTreatment",
  "coatingType",
];

// ─── YP fields ───────────────────────────────────────────────────────────────
// Every YP field — the cover data sent to the BE. Also what Reset puts them
// back to. Ordered as on the cover.
export const YP_EMPTY = {
  department: "",
  // Typed as on the cover; head / tail / PJNO / history are split from it
  // (see parseDocumentNo).
  documentNo: "",
  subject: "",
  requestDate: "",
  dueDate: "", // 完成希望日 (Expected Completion Date) — the request's due date
  classification: "new",
  requestType: "", // "general" | "special" — no default, picked by the user
  designOrigin: "",
  mgmtNo: "",
  deptCode: "",
  attachments: "",
  pic: "",
  // Request Details
  scheduleFlex: "",
  outsource: "yes",
  scheduleNote: "",
  submitTo1: "",
  submitTo2: "",
  submitTo3: "",
  orderProbability: "",
  hasCompetitor: "",
  competitorName: "",
  deliveryDate: "",
  quantityTypes: "",
  quantityUnits: "",
  // Request Scope (依頼区分) + 提出書類 — Calculation
  calcStrength: false,
  calcDesign: false,
  scopeMain: false,
  scopeJoint: false,
  scopeFoundation: false,
  scopeOtherOn: false,
  scopeOther: "",
  calcReportNo: "",
  finishedCopies: "",
  // Request Scope (依頼区分) + 提出書類 — Drawing
  draftTracing: false,
  draftDesign: false,
  deliverType: "",
  deliverCad: false,
  paperSize: "",
  paperSizeOther: "",
  paperFrame: "",
  frameData: "",
  cadFormat: "",
  cadFormatOther: "",
  cadEmail: "",
  // Plating
  plating: "",
  platingProviso: "",
  platingProvisoText: "", // the 特記 text, or the 理由 for 記載なし
};

// ─── Required fields ─────────────────────────────────────────────────────────
// The ones marked with a red *, per cover type, in on-screen order. Save
// checks them, marks the empty ones and scrolls to the first. Everything
// else is optional and may stay empty.
export const REQUIRED_KEYS = {
  ys: [
    "projectNo",
    "projectName",
    "requestNo",
    "companyName",
    "classification",
    "requestDate",
    "requestedDate",
    "requestType",
    "discipline",
  ],
  yp: [
    "department",
    "documentNo", // must also be a valid Request No.
    "subject",
    "classification",
    "requestDate",
    "dueDate",
    "requestType",
    "discipline",
  ],
};

// ─── Request No. (図番) ───────────────────────────────────────────────────────
// e.g. RPJ658053-1:
//   R      head — a letter, or "@" for 総務部 (General Affairs, no project)
//   PJ     tail brand — 2 letters (the BE works out the YP / YS brand mark)
//   658053 project number — always 6 digits
//   -1     history no. — counted per head + project number, across all
//          tails; a different head is a separate count (@PJ658053).
//          The first request of a head + project number may use any
//          history no. (none, -1, -7 …). After that each one must be exactly
//          the latest + 1: EJP123456-7 → next is -8, never -9 or -6.
export const DOCUMENT_NO_RE = /^([A-Z@])([A-Z]{2})(\d{6})(?:-(\d+))?$/;
// Still being typed: a correct start of the format.
export const DOCUMENT_NO_PREFIX_RE =
  /^(?:[A-Z@](?:[A-Z]{0,2}|[A-Z]{2}\d{0,6}|[A-Z]{2}\d{6}-\d*))?$/;

// Splits a Request No. into its parts as far as it's been typed, so the
// breakdown fills in live. `valid`: the whole number matches the format.
export const parseDocumentNo = (value) => {
  const [, head, tail, projectNo, historyNo = ""] =
    value.match(DOCUMENT_NO_RE) ?? [];
  return head
    ? { head, tail, projectNo, historyNo, valid: true }
    : {
        head: value.slice(0, 1),
        tail: value.slice(1, 3),
        projectNo: value.slice(3, 9),
        historyNo: value.split("-")[1] ?? "",
        valid: false,
      };
};

// Which part of a wrong Request No. breaks the format, checked left to right;
// the first rule that fails gives the message.
const projectDigits = (value) => value.slice(3).match(/^\d*/)[0].length;
const DOCUMENT_NO_RULES = [
  { ok: /^[A-Z@]/, message: () => "Head Code must be one letter or @" },
  { ok: /^.[A-Z]{2}/, message: () => "Tail Brand must be 2 letters" },
  {
    ok: /^.{3}\d{6}(?!\d)/,
    message: (v) =>
      `Project No. must be exactly 6 digits (${projectDigits(v)} typed)`,
  },
  {
    ok: /^.{9}(?:-\d+)?$/,
    message: () => "History No. must be a number after a dash",
  },
];
export const documentNoProblem = (value) =>
  DOCUMENT_NO_RULES.find(({ ok }) => !ok.test(value))?.message(value) ?? null;

export const formatDocumentNo = (head, tail, projectNo, historyNo) =>
  `${head}${tail}${projectNo}${historyNo ? `-${historyNo}` : ""}`;

// History numbers are shown without the dash (1, 2, 3); none = "none".
export const historyLabel = (n) => (n ? String(n) : "none");

// Where a typed History No. stands against the project's earlier requests
// (`history`, newest first). The first rule that matches wins:
//   "first"  no earlier requests — any history no. is fine
//   "used"   that history no. already exists
//   "next"   exactly the latest + 1
//   "behind" / "ahead"  lower / higher than the next one
const HISTORY_RULES = [
  ["first", ({ latest }) => latest === null],
  ["used", ({ history, typed }) => history.some((h) => h.historyNo === typed)],
  ["next", ({ typed, next }) => typed === next],
  ["behind", ({ typed, next }) => typed < next],
  ["ahead", () => true],
];
export const getHistoryStatus = (docNo, history) => {
  const typed = Number(docNo.historyNo || 0);
  const latest = history[0]?.historyNo ?? null;
  const next = latest === null ? null : latest + 1;
  const ctx = { history, typed, latest, next };
  const [status] = HISTORY_RULES.find(([, matches]) => matches(ctx));
  return {
    ...ctx,
    status,
    ok: status === "first" || status === "next",
    nextDocumentNo:
      next === null
        ? ""
        : formatDocumentNo(docNo.head, docNo.tail, docNo.projectNo, next),
  };
};

// ─── Formatting ──────────────────────────────────────────────────────────────
export const formatFileSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export const formatShortDate = (iso) => {
  if (!iso) return "—";
  const str = String(iso).trim();
  const d =
    str.includes("T") || str.includes(" ")
      ? new Date(str)
      : new Date(`${str}T00:00:00`);
  if (isNaN(d.getTime())) return str;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// A cover value as the user would read it (for the "Use cover value"
// tooltip): one formatter per field that needs one, the raw value otherwise.
const labelOf = (options, value, key = "value") =>
  options.find((o) => o[key] === value)?.label ?? value;
// Only real dates are reformatted; free text (e.g. YS's "End of year"
// delivery schedule) is shown as is.
const dateOrText = (v) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) ? formatShortDate(v) : v;
const COVER_VALUE_FORMATTERS = {
  classification: (v) => labelOf(CLASSIFICATION_OPTIONS, v),
  requestType: (v) => labelOf(REQUEST_TYPE_OPTIONS, v),
  discipline: (v) =>
    v === "both"
      ? "Calculation & Drawing"
      : labelOf(DISCIPLINE_OPTIONS, v, "id"),
  deliveryDate: dateOrText,
  requestDate: dateOrText,
  requestedDate: dateOrText,
  windSpeed: (v) => `${v} m/s`,
  standard: (v) => labelOf(Object.values(designStandardOptions).flat(), v),
};
export const formatCoverValue = (key, value) =>
  value === "" || value == null
    ? "(empty)"
    : (COVER_VALUE_FORMATTERS[key] ?? String)(value);
