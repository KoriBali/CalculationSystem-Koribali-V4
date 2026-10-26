import api from "../../../config/api";

/**
 * Service to communicate with Requests, Cases, and Checking Queue endpoints on the API Gateway
 */

// ─── REQUESTS CRUD ─────────────────────────────────────────────────────────────

export const getRequests = async (params = {}) => {
  const { data } = await api.get("/api/requests", { params });
  return data?.data || data;
};

export const getRequestById = async (requestId) => {
  const { data } = await api.get(`/api/requests/${requestId}`);
  return data?.data || data;
};

export const createRequest = async (payload) => {
  const { data } = await api.post("/api/requests", payload);
  return data?.data || data;
};

export const updateRequest = async (requestId, payload) => {
  const { data } = await api.patch(`/api/requests/${requestId}`, payload);
  return data?.data || data;
};

export const updateRequestSharedDetails = async (requestId, payload) => {
  const { data } = await api.patch(
    `/api/requests/${requestId}/shared-details`,
    payload
  );
  return data?.data || data;
};

export const updateRequestYsDetails = async (requestId, payload) => {
  const { data } = await api.patch(
    `/api/requests/${requestId}/ys-details`,
    payload
  );
  return data?.data || data;
};

export const updateRequestYpDetails = async (requestId, payload) => {
  const { data } = await api.patch(
    `/api/requests/${requestId}/yp-details`,
    payload
  );
  return data?.data || data;
};

/**
 * Updates full request data across top-level, shared-details, and brand-specific (YS/YP) endpoints
 */
export const updateFullRequest = async (
  requestId,
  { requestUpdate, sharedDetails, ysDetails, ypDetails, coverType }
) => {
  const results = {};

  // 1. Update top-level request properties (requestNo, pjNo, subject, etc.)
  if (requestUpdate) {
    results.request = await updateRequest(requestId, requestUpdate);
  }

  // 2. Update shared details (delivery date, qty, pic, drawing type, cad)
  if (sharedDetails) {
    try {
      results.sharedDetails = await updateRequestSharedDetails(
        requestId,
        sharedDetails
      );
    } catch (err) {
      console.warn(
        "[updateFullRequest] Shared details update skipped/failed:",
        err?.message
      );
    }
  }

  // 3. Update brand-specific details
  if (coverType === "ys" && ysDetails) {
    try {
      results.ysDetails = await updateRequestYsDetails(requestId, ysDetails);
    } catch (err) {
      console.warn(
        "[updateFullRequest] YS details update skipped/failed:",
        err?.message
      );
    }
  } else if (coverType === "yp" && ypDetails) {
    try {
      results.ypDetails = await updateRequestYpDetails(requestId, ypDetails);
    } catch (err) {
      console.warn(
        "[updateFullRequest] YP details update skipped/failed:",
        err?.message
      );
    }
  }

  return results;
};

export const deleteRequest = async (requestId) => {
  const { data } = await api.delete(`/api/requests/${requestId}`);
  return data?.data || data;
};

/**
 * Validates request number duplication across all requests (YP / YS)
 */
export const checkRequestNo = async ({ requestNo, brandMark, excludeRequestId }) => {
  const { data } = await api.get("/api/requests/request-no-check", {
    params: { requestNo, brandMark, excludeRequestId },
  });
  return data?.data || data;
};

// ─── CHECKING QUEUE ────────────────────────────────────────────────────────────

/**
 * Fetches the queue of cases awaiting checker review
 */
export const getCheckQueue = async (params = {}) => {
  const { data } = await api.get("/api/check-queue", { params });
  return data?.data || data;
};

// ─── CASES (CALCULATION & DRAWING) ─────────────────────────────────────────────

export const getAllCases = async (requestId) => {
  const { data } = await api.get(`/api/requests/${requestId}/cases`);
  return data?.data || data;
};

export const getCalculationCases = async (requestId) => {
  const { data } = await api.get(`/api/requests/${requestId}/calculation-cases`);
  return data?.data || data;
};

export const createCalculationCase = async (requestId, payload) => {
  const { data } = await api.post(`/api/requests/${requestId}/calculation-cases`, payload);
  return data?.data || data;
};

export const getCalculationCaseById = async (requestId, caseId) => {
  const { data } = await api.get(`/api/requests/${requestId}/calculation-cases/${caseId}`);
  return data?.data || data;
};

export const updateCalculationCase = async (requestId, caseId, payload) => {
  const { data } = await api.patch(`/api/requests/${requestId}/calculation-cases/${caseId}`, payload);
  return data?.data || data;
};

export const deleteCalculationCase = async (requestId, caseId) => {
  const { data } = await api.delete(`/api/requests/${requestId}/calculation-cases/${caseId}`);
  return data?.data || data;
};

export const getDrawingCases = async (requestId) => {
  const { data } = await api.get(`/api/requests/${requestId}/drawing-cases`);
  return data?.data || data;
};

export const createDrawingCase = async (requestId, payload) => {
  const { data } = await api.post(`/api/requests/${requestId}/drawing-cases`, payload);
  return data?.data || data;
};

export const getDrawingCaseById = async (requestId, caseId) => {
  const { data } = await api.get(`/api/requests/${requestId}/drawing-cases/${caseId}`);
  return data?.data || data;
};

export const updateDrawingCase = async (requestId, caseId, payload) => {
  const { data } = await api.patch(`/api/requests/${requestId}/drawing-cases/${caseId}`, payload);
  return data?.data || data;
};

export const deleteDrawingCase = async (requestId, caseId) => {
  const { data } = await api.delete(`/api/requests/${requestId}/drawing-cases/${caseId}`);
  return data?.data || data;
};

// ─── CASE WORKFLOW ACTIONS ─────────────────────────────────────────────────────

export const markCaseReadyForCheck = async (requestId, workType, caseId) => {
  const { data } = await api.post(
    `/api/requests/${requestId}/cases/${workType}/${caseId}/ready-for-check`
  );
  return data?.data || data;
};

export const checkCase = async (requestId, workType, caseId, { checkResult, note }) => {
  const { data } = await api.post(
    `/api/requests/${requestId}/cases/${workType}/${caseId}/check`,
    { checkResult, note }
  );
  return data?.data || data;
};

export const transferCaseOwnership = async (requestId, workType, caseId, newOwnerUserId) => {
  const { data } = await api.post(
    `/api/requests/${requestId}/cases/${workType}/${caseId}/transfer-ownership`,
    { newOwnerUserId }
  );
  return data?.data || data;
};

// ─── CALCULATION CONDITIONS ───────────────────────────────────────────────────

/**
 * Define Calculation Conditions for a request (POST /api/requests/{request_id}/calculation-conditions)
 * Payload: { designStandardId: string, windSpeed: number | null, airDensity: number }
 */
export const defineCalculationConditions = async (requestId, payload) => {
  const { data } = await api.post(
    `/api/requests/${requestId}/calculation-conditions`,
    payload
  );
  return data?.data || data;
};

/**
 * Update Calculation Conditions for a request (PATCH /api/requests/{request_id}/calculation-conditions)
 * Payload: { designStandardId?: string | null, windSpeed?: number | null, airDensity?: number | null }
 */
export const updateCalculationConditions = async (requestId, payload) => {
  const { data } = await api.patch(
    `/api/requests/${requestId}/calculation-conditions`,
    payload
  );
  return data?.data || data;
};

// ─── DRAWING CONDITIONS ───────────────────────────────────────────────────────

/**
 * Define Drawing Conditions for a request (POST /api/requests/{request_id}/drawing-conditions)
 * Payload: { regionId: string, drawingType: 'approval' | 'manufacturer' | 'order' | 'meeting' }
 */
export const defineDrawingConditions = async (requestId, payload) => {
  const { data } = await api.post(
    `/api/requests/${requestId}/drawing-conditions`,
    payload
  );
  return data?.data || data;
};

/**
 * Update Drawing Conditions for a request (PATCH /api/requests/{request_id}/drawing-conditions)
 * Payload: { regionId?: string | null, drawingType?: string | null }
 */
export const updateDrawingConditions = async (requestId, payload) => {
  const { data } = await api.patch(
    `/api/requests/${requestId}/drawing-conditions`,
    payload
  );
  return data?.data || data;
};

// ─── MASTER DATA ──────────────────────────────────────────────────────────────

export const getMasterRegions = async () => {
  const { data } = await api.get("/api/master/regions");
  return data?.data || data;
};

export const getMasterDesignStandards = async () => {
  const { data } = await api.get("/api/master/design-standards");
  return data?.data || data;
};
