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
import { getUser } from "../../../utils/auth";

const STORAGE_KEY = "requests_store";
const fileBlobs = new Map();

const readAll = () => {
  try {
    const fromSession = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (fromSession && typeof fromSession === "object" && Object.keys(fromSession).length > 0) {
      return fromSession;
    }
    const fromLocal = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (fromLocal && typeof fromLocal === "object" && Object.keys(fromLocal).length > 0) {
      return fromLocal;
    }
    return fromSession ?? fromLocal ?? {};
  } catch {
    return {};
  }
};
const writeAll = (all) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage full or blocked — the change is lost on reload.
  }
};

export const mapItemStatusToCaseStatus = (st, idx) => {
  if (typeof st === "object" && st?.label) return st.label;
  if (!st) return idx === 0 ? "In progress" : "Not started";
  switch (st) {
    case "ready_check":
      return "Ready for check";
    case "internal_correction":
      return "Internal correction";
    case "ready_submit":
      return "Ready to submit";
    case "submitted":
      return "Submitted";
    case "cleared":
      return "Cleared";
    case "returned":
      return "Returned by Japan";
    case "in_progress":
      return "In progress";
    case "cancel":
      return "Cancelled";
    default:
      return st;
  }
};

const mockToRecord = (mock) => {
  const isCalc =
    mock.designType === "calculation" ||
    mock.designType === "drawing_calculation" ||
    mock.designType === "both" ||
    !mock.designType;
  const isDrawing =
    mock.designType === "drawing" ||
    mock.designType === "drawing_calculation" ||
    mock.designType === "both";
  const coverType = mock.brandLine || "ys";
  const fields = {
    projectNo: mock.pjNo || "12345",
    projectName: mock.subject || "Project",
    mgmtNo: "2609-0418",
    requestNo: mock.requestNo || "REQ-0001",
    companyName: mock.companyName || "Tokyo Electric Co., Ltd.",
    classification: mock.requestClassification || "new",
    requestDate: mock.requestDate || "2026-10-01",
    requestedDate: mock.dueDate || "2026-10-20",
    dueDate: mock.dueDate || "2026-10-20",
    requestType: mock.requestType || "general",
    receptionNo: mock.receiptNo || "R-2609-001",
    pic: mock.requesterPicName || "Tanaka Shinji",
    standard: "jil",
    windSpeed: "60",
    airDensity: "1.23",
  };

  const cases = (mock.items || []).map((it, idx) => {
    const label = it.caseNo ? `/${it.caseNo}` : `/${String(idx + 1).padStart(3, "0")}`;
    const defaultCreator = getUser()?.fullName || getUser()?.name || "Drafter";
    return {
      id: `draft_${mock.id}_${idx + 1}`,
      no: it.caseNo || String(idx + 1).padStart(3, "0"),
      caseLabel: label,
      case_label: label,
      title: `${mock.subject || "Case"} #${idx + 1}`,
      poleKind: mock.poleKind || "standard",
      drawingType: it.work_type === "drawing" ? "Approval" : "",
      workType: it.work_type || (isCalc ? "calc" : "drawing"),
      owner: mock.picName || mock.createdByName || defaultCreator,
      createdBy: mock.createdByName || mock.picName || defaultCreator,
      checkedBy: it.checkedBy || (it.status === "internal" || it.status === "internal_correction" || it.status === "Internal correction" ? "Rina Kusuma" : null),
      status: mapItemStatusToCaseStatus(it.status, idx),
      createdAt: mock.createdAt || new Date().toISOString(),
      lastEdited: mock.updatedAt || null,
    };
  });

  if (cases.length === 0) {
    const defaultCreator = getUser()?.fullName || getUser()?.name || "Drafter";
    cases.push({
      id: `draft_${mock.id}_1`,
      no: "001",
      caseLabel: "/001",
      case_label: "/001",
      title: mock.subject || "Standard Lighting Case",
      poleKind: mock.poleKind || "standard",
      drawingType: isDrawing ? "Approval" : "",
      workType: isCalc ? "calc" : "drawing",
      owner: mock.picName || mock.createdByName || defaultCreator,
      createdBy: mock.createdByName || mock.picName || defaultCreator,
      checkedBy: null,
      status: "In progress",
      createdAt: mock.createdAt || new Date().toISOString(),
      lastEdited: mock.updatedAt || null,
    });
  }

  const defaultCreator = getUser()?.fullName || getUser()?.name || "Drafter";
  return {
    ...mock,
    id: mock.id,
    projectType: "lighting-project",
    coverType,
    pjNo: mock.pjNo || "12345",
    requestNo: mock.requestNo || "REQ-0001",
    subject: mock.subject || "Project",
    companyName: mock.companyName || "Tokyo Electric Co., Ltd.",
    requestClassification: mock.requestClassification || "new",
    classification: mock.requestClassification || "new",
    requestType: mock.requestType || "general",
    requestDate: mock.requestDate || "2026-10-01",
    dueDate: mock.dueDate || "2026-10-20",
    fields,
    workTypes: { calc: isCalc, drawing: isDrawing },
    note: "Initial request note",
    members: [
      {
        id: "u-creator",
        name: mock.createdByName || defaultCreator,
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
    createdBy: mock.createdByName || defaultCreator,
    designConditions: {
      standard: mock.fields?.standard || "jil",
      airDensity: mock.fields?.airDensity || "1.23",
      windSpeed: mock.fields?.windSpeed || "60",
      isSaved: true,
    },
    drawingConditions: mock.drawingConditions || {
      drawingType: mock.fields?.drawingType || mock.drawingType || "",
      region: mock.region || "",
      isSaved: Boolean(mock.drawingConditions?.isSaved),
    },
  };
};

export const getAllRequests = () => {
  const all = readAll();
  let changed = false;
  for (const mock of MOCK_REQUESTS) {
    if (!all[mock.id]) {
      all[mock.id] = mockToRecord(mock);
      changed = true;
    } else {
      const existing = all[mock.id];
      if (existing) {
        let recChanged = false;
        if (!existing.companyName || existing.companyName === "—" || existing.companyName === "null") {
          existing.companyName = mock.companyName || "Tokyo Electric Co., Ltd.";
          recChanged = true;
        }
        if (!existing.fields?.companyName || existing.fields.companyName === "—" || existing.fields.companyName === "null") {
          existing.fields = {
            ...existing.fields,
            companyName: mock.companyName || "Tokyo Electric Co., Ltd.",
          };
          recChanged = true;
        }
        if (!existing.fields?.projectNo || existing.fields.projectNo === "—") {
          existing.fields = {
            ...existing.fields,
            projectNo: mock.pjNo || existing.pjNo || "12345",
          };
          recChanged = true;
        }
        if (!existing.fields?.classification || existing.fields.classification === "—") {
          existing.fields = {
            ...existing.fields,
            classification: mock.requestClassification || "new",
          };
          recChanged = true;
        }
        if (!existing.fields?.requestType || existing.fields.requestType === "—") {
          existing.fields = {
            ...existing.fields,
            requestType: mock.requestType || "general",
          };
          recChanged = true;
        }
        if (!existing.requestNo || existing.requestNo === "—" || existing.requestNo === "null") {
          existing.requestNo = mock.requestNo || `REQ-${mock.id.replace("req-", "")}`;
          recChanged = true;
        }
        if (!existing.fields?.requestNo || existing.fields.requestNo === "—" || existing.fields.requestNo === "null") {
          existing.fields = {
            ...existing.fields,
            requestNo: existing.requestNo,
          };
          recChanged = true;
        }
        if (!existing.pjNo || existing.pjNo === "—") {
          existing.pjNo = mock.pjNo || "12345";
          recChanged = true;
        }
        if (!existing.requestClassification || existing.requestClassification === "—") {
          existing.requestClassification = mock.requestClassification || "new";
          recChanged = true;
        }
        if (!existing.classification || existing.classification === "—") {
          existing.classification = mock.requestClassification || "new";
          recChanged = true;
        }
        if (!existing.requestType || existing.requestType === "—") {
          existing.requestType = mock.requestType || "general";
          recChanged = true;
        }
        if (!existing.requestDate) {
          existing.requestDate = mock.requestDate || "2026-10-01";
          recChanged = true;
        }
        if (!existing.dueDate) {
          existing.dueDate = mock.dueDate || "2026-10-25";
          recChanged = true;
        }
        if (mock.items) {
          const updatedCases = (existing.cases || []).map((c, idx) => {
            let caseChanged = false;
            let updatedCase = { ...c };
            const item = mock.items[idx];
            if (item && item.status) {
              const mappedStatus = mapItemStatusToCaseStatus(item.status, idx);
              if (c.status === "In progress" && mappedStatus !== "In progress") {
                updatedCase.status = mappedStatus;
                caseChanged = true;
              }
            }
            const expectedCheckedBy =
              item?.checkedBy ||
              (item?.status === "internal" || item?.status === "internal_correction" || c.status === "Internal correction"
                ? "Rina Kusuma"
                : null);
            if (expectedCheckedBy && c.checkedBy !== expectedCheckedBy) {
              updatedCase.checkedBy = expectedCheckedBy;
              caseChanged = true;
            }
            if (caseChanged) {
              recChanged = true;
              return updatedCase;
            }
            return c;
          });
          if (recChanged) {
            existing.cases = updatedCases;
          }
        }
        if (recChanged) {
          all[mock.id] = { ...existing };
          changed = true;
        }
      }
    }
  }
  if (changed) {
    writeAll(all);
  }
  return Object.values(all);
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
    drawingConditions: data?.drawingConditions || {
      drawingType: "",
      region: "",
      isSaved: false,
    },
    ...data,
  };
  writeAll({ ...readAll(), [request.id]: request });
  return request;
};

export const saveRequest = (request) => {
  if (!request?.id) return null;
  const all = readAll();
  const current = all[request.id] || {};
  const merged = {
    ...current,
    ...request,
    designConditions:
      request.designConditions !== undefined
        ? request.designConditions
        : current.designConditions,
    drawingConditions:
      request.drawingConditions !== undefined
        ? request.drawingConditions
        : current.drawingConditions,
    cases:
      Array.isArray(request.cases) && request.cases.length > 0
        ? request.cases
        : current.cases || [],
    members:
      Array.isArray(request.members) && request.members.length > 0
        ? request.members
        : current.members || [],
  };
  all[request.id] = merged;
  writeAll(all);
  return merged;
};

// `change(request)` returns the updated request; returns it, or null when
// the request doesn't exist.
export const updateRequest = (id, change) => {
  const all = readAll();
  const current = all[id] || {};
  const updated = typeof change === "function" ? change(current) : { ...current, ...change };
  all[id] = updated;
  writeAll(all);
  return updated;
};

// Removes a request from storage
export const deleteRequest = (id) => {
  const all = readAll();
  if (!all[id]) return false;
  const next = { ...all };
  delete next[id];
  writeAll(next);
  return true;
};

// ─── Files ───────────────────────────────────────────────────────────────────
// Details to store for an uploaded File; the File itself stays in memory.
export const fileRecord = (file, uploadedBy, meta = {}) => {
  const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  fileBlobs.set(id, file);
  return {
    id,
    name: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    uploadedBy,
    ...meta,
  };
};

// The uploaded file, while it's still in memory (not after a reload).
export const fileBlob = (id) => fileBlobs.get(id) ?? null;

export const forgetFileBlob = (id) => fileBlobs.delete(id);

export const getLocalRequestsMap = () => readAll();
