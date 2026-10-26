/**
 * Maps NewRequestForm state into the RequestCreate schema for POST /api/requests
 */

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (val) => typeof val === "string" && UUID_REGEX.test(val.trim());

import {
  getCachedDesignStandards,
  getCachedRegions,
  getCachedPoleCategories,
} from "../services/masterDataService";

// Dynamic resolver for poleCategoryId from backend master data (zero hardcoded UUIDs)
export const resolvePoleCategoryId = (typeOrId, categoriesList = null) => {
  if (!typeOrId) return null;
  if (isUuid(typeOrId)) return typeOrId.trim();
  const list =
    categoriesList && categoriesList.length > 0
      ? categoriesList
      : getCachedPoleCategories();
  const key = String(typeOrId).toLowerCase().trim();
  const found = list.find((c) => {
    const name = String(c.name || "").toLowerCase().trim();
    return (
      c.id === typeOrId ||
      name === key ||
      (key.includes("light") && name.includes("light")) ||
      (key.includes("sign") && name.includes("sign")) ||
      ((key.includes("disaster") || key.includes("acemast")) &&
        name.includes("acemast")) ||
      ((key.includes("multi") || key.includes("multiple")) &&
        name.includes("multi"))
    );
  });
  return found?.id || typeOrId;
};

// Dynamic resolver for designStandardId from backend master data (zero hardcoded UUIDs)
export const resolveDesignStandardId = (std, standardsList = null) => {
  if (!std) return null;
  if (isUuid(std)) return std.trim();
  const list = standardsList && standardsList.length > 0 ? standardsList : getCachedDesignStandards();
  const key = String(std).toLowerCase().trim();
  const found = list.find((s) => {
    const name = String(s.name || "").toLowerCase().trim();
    const code = String(s.code || "").toLowerCase().trim();
    return (
      s.id === std ||
      name === key ||
      code === key ||
      (key.includes("jil") && (name.includes("jil") || code.includes("jil"))) ||
      (key.includes("haiden") && (name.includes("haiden") || code.includes("haiden"))) ||
      ((key.includes("act") || key.includes("law")) && (name.includes("act") || name.includes("law"))) ||
      (key.includes("v60") && (name.includes("v60") || code.includes("v60"))) ||
      (key.includes("tower") && (name.includes("tower") || code.includes("tower"))) ||
      (key.includes("signboard") && (name.includes("signboard") || code.includes("signboard")))
    );
  });
  return found?.id || null;
};

// Resolves UUID or code to frontend standard code ('jil' | 'haiden' | 'v60' | 'act' | 'tower' | 'signboard')
// Dynamically matches against backend master data design standards list (ZERO hardcoded UUIDs)
export const resolveDesignStandardCode = (val, standardsList = null) => {
  if (!val) return "";
  const trimmed = String(val).trim();

  const list =
    standardsList && standardsList.length > 0
      ? standardsList
      : getCachedDesignStandards();
  const found = list.find(
    (s) => s.id === trimmed || s.code === trimmed || s.name === trimmed
  );
  if (found) {
    const name = String(found.name || "").toLowerCase();
    const code = String(found.code || "").toLowerCase();
    if (name.includes("jil") || code.includes("jil")) return "jil";
    if (name.includes("haiden") || code.includes("haiden")) return "haiden";
    if (name.includes("v60") || code.includes("v60")) return "v60";
    if (name.includes("act") || name.includes("law") || code.includes("act")) return "act";
    if (name.includes("tower") || code.includes("tower")) return "tower";
    if (name.includes("signboard") || code.includes("signboard")) return "signboard";
    return found.code || found.name?.toLowerCase() || trimmed;
  }

  const key = trimmed.toLowerCase();
  if (key.includes("jil")) return "jil";
  if (key.includes("haiden")) return "haiden";
  if (key.includes("v60")) return "v60";
  if (key.includes("act") || key.includes("law")) return "act";
  if (key.includes("tower")) return "tower";
  if (key.includes("signboard")) return "signboard";
  return trimmed;
};

// Resolves UUID or code to human-readable standard label
export const resolveDesignStandardLabel = (val, projectType = null, standardsList = null) => {
  const code = resolveDesignStandardCode(val, standardsList);
  switch (code) {
    case "jil":
      return "JIL 1003";
    case "haiden":
      return "Haiden";
    case "v60":
      return "V60";
    case "act":
      return "Standard Acts. (Law)";
    case "tower":
      return "Tower Standard";
    case "signboard":
      return "Signboard";
    default:
      return val || "—";
  }
};

// Maps DrawingType to frontend canonical option string ("APD (Approval Drawing)", etc.)
export const canonicalDrawingType = (val) => {
  if (!val) return "";
  const s = String(val).toLowerCase().trim();
  if (s.includes("approval") || s.includes("apd")) return "APD (Approval Drawing)";
  if (s.includes("manufacturer") || s.includes("mfd")) return "MFD (Manufacturer Drawing)";
  if (s.includes("order")) return "Order Drawing";
  if (s.includes("meeting")) return "Meeting Drawing";
  return val;
};

// Dynamic resolver for regionId from backend master data (zero hardcoded UUIDs)
export const resolveRegionId = (reg, regionsList = null) => {
  if (!reg) return null;
  if (isUuid(reg)) return reg.trim();
  const list = regionsList && regionsList.length > 0 ? regionsList : getCachedRegions();
  const key = String(reg).toLowerCase().trim();
  const found = list.find((r) => {
    const code = String(r.code || "").toLowerCase().trim();
    const label = String(r.label || "").toLowerCase().trim();
    return (
      r.id === reg ||
      code === key ||
      label === key ||
      (key.includes("east") && (code.includes("east") || label.includes("east"))) ||
      (key.includes("west") && (code.includes("west") || label.includes("west")))
    );
  });
  return found?.id || null;
};

// Resolves UUID or code to frontend code (e.g. 'east_japan' | 'west_japan')
export const resolveRegionCode = (val, regionsList = null) => {
  if (!val) return "";
  const list = regionsList && regionsList.length > 0 ? regionsList : getCachedRegions();
  const found = list.find((r) => r.id === val || r.code === val);
  return found?.code || val;
};

// Maps DrawingType enum: 'approval' | 'manufacturer' | 'order' | 'meeting'
export const mapDrawingType = (val) => {
  if (!val) return null;
  const s = String(val).toLowerCase().trim();
  if (s.includes("approval") || s.includes("apd")) return "approval";
  if (s.includes("manufacturer") || s.includes("mfd")) return "manufacturer";
  if (s.includes("order")) return "order";
  if (s.includes("meeting")) return "meeting";
  return null;
};

// Maps FoundationType enum: 'square' | 'circle'
const mapFoundationType = (val) => {
  if (!val) return null;
  const s = String(val).toLowerCase().trim();
  if (s.includes("square")) return "square";
  if (s.includes("circle") || s.includes("round") || s.includes("caisson")) return "circle";
  return null;
};

const toPositiveNumber = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(val);
  return isNaN(n) || n <= 0 ? null : n;
};

const toPositiveInt = (val) => {
  if (val === null || val === undefined || val === "") return null;
  const n = parseInt(val, 10);
  return isNaN(n) || n <= 0 ? null : n;
};

export function buildRequestPayload({
  projectType = "lighting-project",
  coverType = "ys",
  fields = {},
  workTypes = { calc: true, drawing: true },
  notes = null,
  currentUser = null,
}) {
  const brandLine = coverType === "yp" ? "yp" : "ys";

  // 1. Determine designType ('calculation' | 'drawing' | 'drawing_calculation')
  let designType = "calculation";
  if (workTypes.calc && workTypes.drawing) {
    designType = "drawing_calculation";
  } else if (workTypes.drawing) {
    designType = "drawing";
  } else {
    designType = "calculation";
  }

  // 2. Request classification ('new' | 'change' | 'reuse_new')
  const validClassifications = ["new", "change", "reuse_new"];
  const requestClassification = validClassifications.includes(fields.classification)
    ? fields.classification
    : "new";

  // 3. Request type ('general' | 'special')
  const requestType = fields.requestType === "special" ? "special" : "general";

  // 4. Request No & PJ No
  const requestNo = String(
    fields.requestNo ||
    fields.documentNo ||
    fields.mgmtNo ||
    `REQ-${Date.now().toString().slice(-6)}`
  ).trim();

  const pjNo = String(
    fields.projectNo ||
    fields.pjNo ||
    `PJ-${Date.now().toString().slice(-6)}`
  ).trim();

  // 5. Subject / Project Name
  const subject = String(
    fields.subject ||
    fields.projectName ||
    "Standard Lighting Pole Project"
  ).trim();

  // 6. Dates (YYYY-MM-DD format)
  const todayStr = new Date().toISOString().slice(0, 10);
  const formatDate = (d) => {
    if (!d) return null;
    const clean = String(d).trim().replace(/\//g, "-");
    return /^\d{4}-\d{2}-\d{2}$/.test(clean) ? clean : null;
  };

  const requestDate =
    formatDate(fields.requestDate) ||
    formatDate(fields.requestedDate) ||
    todayStr;

  const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const dueDate =
    formatDate(fields.dueDate) ||
    formatDate(fields.deliveryDate) ||
    defaultDue;

  // 7. Requesting Department
  const requestingDepartmentName = String(
    fields.department ||
    fields.companyName ||
    currentUser?.department?.name ||
    currentUser?.departmentName ||
    "Head Office"
  ).trim();

  // 8. Notes: user note or null (never Indonesian)
  const finalNotes =
    notes && typeof notes === "string" && notes.trim()
      ? notes.trim()
      : null;

  // 9. Conditions
  const conditions = {
    designStandardId: resolveDesignStandardId(fields.standard),
    windSpeed: fields.windSpeed ? Number(fields.windSpeed) : 60,
    airDensity: fields.airDensity ? Number(fields.airDensity) : 1.23,
  };

  // 10. Shared Details
  const sharedDetails = {
    scheduledDeliveryDate: fields.deliveryDate ? String(fields.deliveryDate) : null,
    deliveryQuantity: toPositiveInt(fields.deliveryQty),
    requesterPicName: fields.pic ? String(fields.pic).trim() : null,
    drawingType:
      mapDrawingType(fields.drawingType || fields.deliverType) ||
      (workTypes.drawing ? "approval" : null),
    paperSize: fields.paperSize ? String(fields.paperSize) : null,
    isCadDataRequested: Boolean(fields.deliverCad || fields.cadFormat),
    cadFormat: fields.cadFormat ? String(fields.cadFormat) : null,
  };

  // 11. YP Details (if brandLine === "yp")
  let ypDetails = null;
  if (brandLine === "yp") {
    ypDetails = {
      tailCode: fields.tailCode ? String(fields.tailCode).slice(0, 10) : null,
      calcStrength: Boolean(fields.calcStrength),
      calcDesign: Boolean(fields.calcDesign),
      scopeMainMember: Boolean(fields.scopeMain),
      scopeJoint: Boolean(fields.scopeJoint),
      scopeFoundation: Boolean(fields.scopeFoundation),
      scopeOther: fields.scopeOther ? String(fields.scopeOther).slice(0, 200) : null,
      draftingTracing: Boolean(fields.draftTracing),
      draftingDesign: Boolean(fields.draftDesign),
      submissionDestination1: fields.submitTo1 ? String(fields.submitTo1).slice(0, 200) : null,
      submissionDestination2: fields.submitTo2 ? String(fields.submitTo2).slice(0, 200) : null,
      submissionDestination3: fields.submitTo3 ? String(fields.submitTo3).slice(0, 200) : null,
      hasCompetitor: fields.hasCompetitor === "yes",
      designOrigin: ["development", "proposal", "existing", "customer_spec"].includes(fields.designOrigin)
        ? fields.designOrigin
        : null,
      scheduleFlexibility: fields.scheduleFlex ? String(fields.scheduleFlex).slice(0, 200) : null,
      paperFrame: fields.paperFrame ? String(fields.paperFrame).slice(0, 100) : null,
      finishedCopies: toPositiveInt(fields.finishedCopies),
      platingProviso: fields.platingProviso ? String(fields.platingProviso) : null,
    };
  }

  // 12. YS Details (if brandLine === "ys")
  let ysDetails = null;
  if (brandLine === "ys") {
    ysDetails = {
      receiptNo: fields.receptionNo ? String(fields.receptionNo).slice(0, 100) : null,
      materialText: fields.material ? String(fields.material).slice(0, 200) : null,
      materialId: isUuid(fields.materialId) ? fields.materialId : null,
      foundationType: mapFoundationType(fields.foundation),
      foundationWidthX: toPositiveNumber(fields.foundationWidth),
      foundationWidthY: toPositiveNumber(fields.foundationLength),
      embedmentDepth: toPositiveNumber(fields.foundationDepth),
      designStandardText: fields.standard ? String(fields.standard).slice(0, 200) : null,
      openingHeight: fields.openingHeight ? String(fields.openingHeight).slice(0, 100) : null,
      concreteStrength: fields.concreteStrength ? String(fields.concreteStrength).slice(0, 200) : null,
      openingDirectionNote: fields.openingDirection ? String(fields.openingDirection) : null,
    };
  }

  // 13. Assignments: only include if assigneeUserId is a valid UUID
  const assignments = [];
  if (currentUser?.id && isUuid(String(currentUser.id))) {
    assignments.push({
      assigneeUserId: String(currentUser.id),
      workType:
        workTypes.calc && workTypes.drawing
          ? "calculation"
          : workTypes.drawing
            ? "drawing"
            : "calculation",
    });
  }

  return {
    brandLine,
    poleCategoryId: resolvePoleCategoryId(projectType) || projectType || "lighting-project",
    requestNo,
    pjNo,
    requestType,
    designType,
    requestClassification,
    subject,
    requestDate,
    dueDate,
    requestingDepartmentName,
    notes: finalNotes,
    sharedDetails,
    ypDetails,
    ysDetails,
    finish: null,
    assignments,
  };
}

/**
 * Maps technical API field paths to human-friendly UI form labels.
 */
const API_FIELD_LABEL_MAP = {
  // Shared / Request General
  "sharedDetails.deliveryQuantity": "Delivery Quantity (数量)",
  "sharedDetails.scheduledDeliveryDate": "Delivery Date (納期)",
  "sharedDetails.requesterPicName": "PIC Name (担当者)",
  "sharedDetails.drawingType": "Drawing Type (図面種類)",
  "sharedDetails.paperSize": "Paper Size",
  "sharedDetails.cadFormat": "CAD Format",
  "deliveryQuantity": "Delivery Quantity (数量)",
  "scheduledDeliveryDate": "Delivery Date (納期)",
  "requesterPicName": "PIC Name (担当者)",
  "drawingType": "Drawing Type (図面種類)",
  "requestNo": "Request No (管理番号)",
  "pjNo": "Project No (物件番号)",
  "subject": "Project Name (件名)",
  "projectName": "Project Name (件名)",
  "requestClassification": "Classification (区分)",
  "requestType": "Request Type",
  "requestDate": "Request Date",
  "dueDate": "Delivery Date (納期)",
  "requestingDepartmentName": "Department / Company",
  "notes": "Notes",

  // Conditions
  "conditions.windSpeed": "Wind Speed (風速)",
  "conditions.airDensity": "Air Density",
  "conditions.designStandardId": "Standard (規格)",
  "windSpeed": "Wind Speed (風速)",
  "designStandardId": "Standard (規格)",

  // YS Details
  "ysDetails.receiptNo": "Reception No (受付番号)",
  "ysDetails.materialText": "Material (材質)",
  "ysDetails.foundationType": "Foundation Shape (基礎形状)",
  "ysDetails.foundationWidthX": "Foundation Width (基礎幅)",
  "ysDetails.foundationWidthY": "Foundation Length (基礎長)",
  "ysDetails.embedmentDepth": "Foundation Depth (根入れ)",
  "ysDetails.designStandardText": "Standard (規格)",
  "ysDetails.concreteStrength": "Concrete Strength",
  "ysDetails.openingHeight": "Opening Height",
  "ysDetails.openingDirectionNote": "Opening Direction",
  "foundationType": "Foundation Shape (基礎形状)",
  "foundationWidthX": "Foundation Width (基礎幅)",
  "foundationWidthY": "Foundation Length (基礎長)",
  "embedmentDepth": "Foundation Depth (根入れ)",

  // YP Details
  "ypDetails.tailCode": "Tail Code",
  "ypDetails.finishedCopies": "Finished Copies",
  "ypDetails.paperFrame": "Paper Frame",
};

function cleanValidationMessage(msg) {
  if (!msg) return "is invalid";
  let s = String(msg).trim();

  // Handle specific backend compound validator messages:
  if (
    /sharedDetails\.regionId and sharedDetails\.drawingType are required/i.test(s) ||
    /drawingType are required when designType includes drawing/i.test(s)
  ) {
    return "Region and Drawing Type (図面種類) are required when Drawing is selected";
  }
  if (/drawingType.*required/i.test(s)) {
    return "Drawing Type (図面種類) is required when Drawing is selected";
  }
  if (/regionId.*required/i.test(s)) {
    return "Region is required for drawing requests";
  }

  // Replace common technical paths with user-friendly terms
  s = s
    .replace(/sharedDetails\.drawingType/g, "Drawing Type (図面種類)")
    .replace(/sharedDetails\.regionId/g, "Region")
    .replace(/sharedDetails\.deliveryQuantity/g, "Delivery Quantity (数量)")
    .replace(/conditions\.designStandardId/g, "Standard (規格)")
    .replace(/conditions\.windSpeed/g, "Wind Speed (風速)")
    .replace(/ysDetails\./g, "")
    .replace(/sharedDetails\./g, "")
    .replace(/when designType includes drawing/gi, "when Drawing is selected");

  if (/input should be a valid integer/i.test(s)) {
    return "must be a valid whole number";
  }
  if (/input should be a valid number/i.test(s)) {
    return "must be a valid number";
  }
  if (/input should be greater than 0/i.test(s)) {
    return "must be greater than 0";
  }
  if (/field required/i.test(s)) {
    return "is required";
  }
  if (/input should be a valid string/i.test(s)) {
    return "invalid text format";
  }
  return s.replace(/^Value error,\s*/i, "");
}

function getHumanFieldName(loc) {
  if (!Array.isArray(loc) || loc.length === 0) return "";
  const parts = loc.filter((p) => p !== "body" && p !== "__root__");
  if (parts.length === 0) return "";

  const fullPath = parts.join(".");
  if (API_FIELD_LABEL_MAP[fullPath]) return API_FIELD_LABEL_MAP[fullPath];

  const lastKey = parts[parts.length - 1];
  if (!lastKey) return "";
  if (API_FIELD_LABEL_MAP[lastKey]) return API_FIELD_LABEL_MAP[lastKey];

  return String(lastKey)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

/**
 * Formats API errors (including FastAPI 422 arrays) into user-friendly messages without technical jargon.
 */
export function formatApiErrorMessage(err) {
  const detail = err?.response?.data?.detail;

  if (Array.isArray(detail) && detail.length > 0) {
    const errorItems = detail.map((d) => {
      const fieldName = getHumanFieldName(d.loc);
      const cleanMsg = cleanValidationMessage(d.msg);
      if (!fieldName) {
        return cleanMsg;
      }
      return `${fieldName}: ${cleanMsg}`;
    });

    if (errorItems.length === 1) {
      return errorItems[0];
    }

    return errorItems.slice(0, 3).join("; ");
  }

  if (typeof detail === "string") {
    return cleanValidationMessage(detail);
  }
  if (err?.response?.data?.message) {
    return cleanValidationMessage(err.response.data.message);
  }
  if (err?.message) {
    return err.message;
  }
  return "Failed to save request. Please try again.";
}

/**
 * Maps form values into schemas required for updating an existing request
 */
export function buildRequestUpdatePayload({
  projectType = "lighting-project",
  coverType = "ys",
  fields = {},
  workTypes = { calc: true, drawing: true },
  notes = null,
  currentUser = null,
}) {
  const full = buildRequestPayload({
    projectType,
    coverType,
    fields,
    workTypes,
    notes,
    currentUser,
  });

  return {
    requestUpdate: {
      poleCategoryId: full.poleCategoryId,
      requestNo: full.requestNo,
      pjNo: full.pjNo,
      requestType: full.requestType,
      designType: full.designType,
      requestClassification: full.requestClassification,
      subject: full.subject,
      requestDate: full.requestDate,
      dueDate: full.dueDate,
      requestingDepartmentName: full.requestingDepartmentName,
      notes: full.notes,
    },
    sharedDetails: full.sharedDetails,
    ysDetails: full.ysDetails,
    ypDetails: full.ypDetails,
    conditions: full.conditions,
    coverType,
  };
}
