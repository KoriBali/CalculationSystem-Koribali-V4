// Requests created from the New Request form — a stand-in for the requests
// API, kept in sessionStorage (per browser tab). Swap these functions for API
// calls once the BE endpoints exist; the pages only use what's exported here.
//
// A request:
//   { id, projectType, coverType, fields, workTypes, note, members,
//     cases: [{ id, no, workType, createdAt }],
//     files: { [tabKey]: [{ id, name, size, uploadedAt, uploadedBy }] },
//     createdAt, createdBy }
//
// Uploaded files: only their details are stored. The file itself is held in
// memory for this session (to open it), until the upload API exists.

import { MOCK_REQUESTS } from "./mockRequests";

const STORAGE_KEY = "requests_store";
const fileBlobs = new Map();

const readAll = () => {
  try {
    const raw = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? {};
    let changed = false;
    for (const key of Object.keys(raw)) {
      const item = raw[key];
      if (item) {
        if (item.fields && (item.fields.windSpeed === "34" || !item.fields.windSpeed)) {
          item.fields.windSpeed = "60";
          changed = true;
        }
        if (!item.designConditions || typeof item.designConditions.isSaved !== "boolean") {
          item.designConditions = {
            standard: "",
            airDensity: "",
            windSpeed: "",
            isSaved: false,
          };
          changed = true;
        }
      }
    }
    if (changed) {
      writeAll(raw);
    }
    return raw;
  } catch {
    return {};
  }
};
const writeAll = (all) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage full or blocked — the change is lost on reload.
  }
};

const mockToRecord = (mock) => {
  const isCalc =
    mock.designType === "calculation" ||
    mock.designType === "both" ||
    !mock.designType;
  const isDrawing =
    mock.designType === "drawing" || mock.designType === "both";
  const coverType = mock.brandLine || "ys";
  const fields =
    coverType === "ys"
      ? {
          projectNo: mock.pjNo || "12345",
          projectName: mock.subject || "Project",
          mgmtNo: "2609-0418",
          requestNo: mock.requestNo || "REQ-0001",
          companyName: mock.companyName || "Tokyo Electric",
          classification: mock.requestClassification || "new",
          requestDate: mock.requestDate || "2026-10-01",
          requestedDate: mock.dueDate || "2026-10-20",
          requestType: mock.requestType || "general",
          receptionNo: mock.receiptNo || "R-2609-001",
          pic: mock.requesterPicName || "Tanaka",
          standard: "jil",
          windSpeed: "60",
          airDensity: "1.23",
        }
      : {
          documentNo: mock.requestNo || "REQ-0001",
          department: "Sales Dept",
          subject: mock.subject || "Project",
          mgmtNo: "2609-0418",
          classification: mock.requestClassification || "new",
          requestDate: mock.requestDate || "2026-10-01",
          dueDate: mock.dueDate || "2026-10-20",
          requestType: mock.requestType || "general",
          standard: "jil",
          windSpeed: "60",
          airDensity: "1.23",
        };

  const cases = (mock.items || []).map((it, idx) => ({
    id: `draft_${mock.id}_${idx + 1}`,
    no: it.caseNo || String(idx + 1).padStart(3, "0"),
    case_label: it.caseNo ? `/${it.caseNo}` : `/${String(idx + 1).padStart(3, "0")}`,
    title: `${mock.subject || "Case"} #${idx + 1}`,
    poleKind: mock.poleKind || "standard",
    drawingType: it.work_type === "drawing" ? "Approval" : "",
    workType: it.work_type || (isCalc ? "calc" : "drawing"),
    owner: mock.picName || mock.createdByName || "Rani Putri",
    status:
      typeof it.status === "object" && it.status?.label
        ? it.status.label
        : idx === 0
          ? "In progress"
          : "Not started",
    createdAt: mock.createdAt || new Date().toISOString(),
    lastEdited: mock.updatedAt || null,
  }));

  if (cases.length === 0) {
    cases.push({
      id: `draft_${mock.id}_1`,
      no: "001",
      case_label: "/001",
      title: mock.subject || "Standard Lighting Case",
      poleKind: mock.poleKind || "standard",
      drawingType: isDrawing ? "Approval" : "",
      workType: isCalc ? "calc" : "drawing",
      owner: mock.picName || mock.createdByName || "Rani Putri",
      status: "In progress",
      createdAt: mock.createdAt || new Date().toISOString(),
      lastEdited: mock.updatedAt || null,
    });
  }

  return {
    id: mock.id,
    projectType: "lighting-project",
    coverType,
    fields,
    workTypes: { calc: isCalc, drawing: isDrawing },
    note: "Initial request note",
    members: [
      {
        id: "u-creator",
        name: mock.createdByName || "Bintarjo Agus Priyadi",
        department: "Lighting Design Dept.",
        isCreator: true,
      },
      ...(mock.picName
        ? [
            {
              id: "u-pic",
              name: mock.picName,
              department: "Structural Dept.",
              isCreator: false,
            },
          ]
        : []),
    ],
    cases,
    files: {},
    createdAt: mock.createdAt || new Date().toISOString(),
    createdBy: mock.createdByName || "Bintarjo Agus Priyadi",
    designConditions: {
      standard: "",
      airDensity: "",
      windSpeed: "",
      isSaved: false,
    },
  };
};

export const getRequest = (id) => {
  const all = readAll();
  if (all[id]) return all[id];
  const mock = MOCK_REQUESTS.find((m) => m.id === id);
  if (mock) {
    const record = mockToRecord(mock);
    writeAll({ ...all, [id]: record });
    return record;
  }
  return null;
};

// The request a case (draft) belongs to, with that case; null for a draft
// that isn't a case of any request.
export const findRequestOfCase = (caseId) => {
  for (const request of Object.values(readAll())) {
    const found = request.cases?.find((c) => c.id === caseId);
    if (found) return { request, case: found };
  }
  return null;
};

// Saves a new request and returns it.
export const createRequest = (data) => {
  const request = {
    id: `req_${Date.now()}`,
    cases: [],
    files: {},
    createdAt: new Date().toISOString(),
    designConditions: data?.designConditions || {
      standard: "",
      airDensity: "",
      windSpeed: "",
      isSaved: false,
    },
    ...data,
  };
  writeAll({ ...readAll(), [request.id]: request });
  return request;
};

// `change(request)` returns the updated request; returns it, or null when
// the request doesn't exist.
export const updateRequest = (id, change) => {
  const all = readAll();
  if (!all[id]) return null;
  const updated = change(all[id]);
  writeAll({ ...all, [id]: updated });
  return updated;
};

// ─── Files ───────────────────────────────────────────────────────────────────
// Details to store for an uploaded File; the File itself stays in memory.
export const fileRecord = (file, uploadedBy) => {
  const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  fileBlobs.set(id, file);
  return {
    id,
    name: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    uploadedBy,
  };
};

// The uploaded file, while it's still in memory (not after a reload).
export const fileBlob = (id) => fileBlobs.get(id) ?? null;

export const forgetFileBlob = (id) => fileBlobs.delete(id);
