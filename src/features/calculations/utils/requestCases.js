// Cases of a request: each case is one piece of work — a calculation or a
// drawing — done in its own draft (/requests/:type/:draftId). Cases are the
// only way into a draft: it opens on Project Setup, and leaving goes back to
// the case's request.
import { findRequestOfCase } from "../data/requestStore";
import { DEFAULT_IDENTITY } from "../hooks/useProjectIdentityForm";
import { getDraftsIndex } from "./coreLogic";
import { parseDocumentNo } from "./requestForm";

// Discipline of a case: its label and the draft workflow mode it opens in.
export const CASE_WORK_TYPES = {
  calc: { label: "Calculation", projectMode: "calculation" },
  drawing: { label: "Drawing", projectMode: "drawing" },
};

// The disciplines a new case can take: the ones ticked on the request.
// One → new cases take it automatically; both → the user picks.
export const caseWorkTypesFor = (workTypes) =>
  Object.keys(CASE_WORK_TYPES).filter((key) => workTypes[key]);

// "001", "002", … — continues after the highest one so far.
const nextCaseNo = (cases) =>
  String(Math.max(0, ...cases.map((c) => Number(c.no))) + 1).padStart(3, "0");

// ─── Project Setup, filled in from the request ───────────────────────────────
// Project Setup's own option values for the request's choices. Reuse has no
// matching category, so it's left for the user to pick.
const SETUP_REQUEST_TYPE = { general: "General", special: "Special" };
const SETUP_CATEGORY = { new: "New", change: "Modification" };
// Project Setup fields per cover type. Responsible Department isn't filled:
// it's a master-data code, the cover only has free text.
const SETUP_FROM_COVER = {
  yp: (f) => ({
    requestNo: f.documentNo,
    projectNo: parseDocumentNo(f.documentNo).projectNo,
    requestedDueDate: f.dueDate,
    projectName: f.subject,
  }),
  ys: (f) => ({
    requestNo: f.requestNo,
    receiptNo: f.receptionNo,
    companyName: f.companyName,
    projectNo: f.projectNo,
    requestedDueDate: f.requestedDate,
    projectName: f.projectName,
  }),
};
const setupIdentityFrom = (request) => {
  const coverFn = SETUP_FROM_COVER[request.coverType];
  const coverFields = coverFn ? coverFn(request.fields || {}) : {};
  return {
    ...DEFAULT_IDENTITY,
    requestType: SETUP_REQUEST_TYPE[request.fields?.requestType] ?? "",
    requestCategory: SETUP_CATEGORY[request.fields?.classification] ?? "",
    ...coverFields,
  };
};

// A new case plus its draft: set to the case's discipline and with Project
// Setup filled in from the request, so it opens ready to work on.
export const createCase = (request, workType, options = {}) => {
  const id = `draft_${Date.now()}`;
  const workflow = {
    projectMode: CASE_WORK_TYPES[workType].projectMode,
    withReport: false,
  };
  const designConditions = request.designConditions || {};
  const poleKind = options.poleKind || (request.projectType === "lighting-project" ? "standard" : "custom");
  const isStandard = poleKind === "standard";
  const initialCondition = {
    designStandard: designConditions.standard || "",
    designWindSpeed: designConditions.windSpeed || "",
    designAirDensity: designConditions.airDensity || "",
    poleType: poleKind,
    openingEnabled: isStandard ? true : false,
    baseplateEnabled: isStandard ? true : false,
    foundationEnabled: false,
  };
  const initialDrawingGeneral = {
    drawingType: options.drawingType || (workType === "drawing" ? "Approval" : ""),
    drawingNumber: "",
    partNumber: "",
    openingDirection: "",
    lightingCompanyName: "",
    poleType: isStandard ? "Standard Pole" : "Custom Pole",
    additionalComponents: {
      opening: isStandard ? true : false,
      baseplate: isStandard ? true : false,
      foundation: false,
    },
    useCoupling: null,
  };

  // Draft data keeps each value as its raw stored (JSON) string.
  sessionStorage.setItem(
    `${request.projectType}_draft_data_${id}`,
    JSON.stringify({
      workflow: JSON.stringify(workflow),
      projectIdentity: JSON.stringify(setupIdentityFrom(request)),
      condition: JSON.stringify(initialCondition),
      drawing_general: JSON.stringify(initialDrawingGeneral),
    }),
  );
  const nextNo = nextCaseNo(request.cases || []);
  const fallbackTitle =
    request.fields?.subject ||
    request.fields?.projectName ||
    `Case ${nextNo}`;

  return {
    id,
    no: nextNo,
    case_label: options.case_label || "",
    title: options.title || fallbackTitle,
    poleKind: options.poleKind || "standard",
    drawingType:
      options.drawingType || (workType === "drawing" ? "Approval" : ""),
    workType,
    owner: options.owner || request.createdBy || "Unassigned",
    createdBy: options.createdBy || options.owner || request.createdBy || "Unassigned",
    status: options.status || "Not started",
    createdAt: new Date().toISOString(),
    lastEdited: null,
  };
};

// When the case's draft was last saved, or null if it hasn't been opened
// and saved yet.
export const caseLastEdited = (projectType, caseId) =>
  getDraftsIndex(projectType).find((d) => d.id === caseId)?.lastEdited ?? null;

// ─── Leaving a draft ─────────────────────────────────────────────────────────
// Where to go when leaving a draft: its request, or the request list for a
// draft that isn't a case.
export const requestPathForDraft = (draftId) => {
  const found = draftId ? findRequestOfCase(draftId) : null;
  return found ? `/requests/detail/${found.request.id}` : "/requests";
};
// Same, for the draft open in this project type — read it before the
// session is cleared.
export const activeDraftRequestPath = (projectType) =>
  requestPathForDraft(sessionStorage.getItem(`${projectType}_active_draft_id`));
