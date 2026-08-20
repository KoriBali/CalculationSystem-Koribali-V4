// Fetches and caches pole standard master data (stepped/taper pole types,
// diameters, combinations, thicknesses, heights) from its own dedicated
// bootstrap-style endpoint — separate from /api/master/bootstrap.
const STORAGE_KEY = "poleStandardData";

// Backend refreshes its own master data cache every hour.
const CACHE_TTL_MS = 60 * 60 * 1000;

let inFlightRequest = null;

function readCache() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const { data, cachedAt } = JSON.parse(raw);
    if (!data || typeof cachedAt !== "number") {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (Date.now() - cachedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writeCache(data) {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ data, cachedAt: Date.now() }),
  );
}

async function fetchPoleStandards() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/master/pole-standards`);

  if (!response.ok) {
    throw new Error(`Failed to load pole standard data (status ${response.status})`);
  }

  const json = await response.json();
  if (!json?.success || !Array.isArray(json?.data)) {
    throw new Error("Invalid pole standard data response");
  }

  return json.data;
}

// Returns cached pole standard data if available, otherwise fetches it from
// /api/master/pole-standards and caches the result for the rest of the tab session.
export async function getPoleStandardData() {
  const cached = readCache();
  if (cached) return cached;

  if (!inFlightRequest) {
    inFlightRequest = fetchPoleStandards()
      .then((data) => {
        writeCache(data);
        return data;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }

  return inFlightRequest;
}

export function clearPoleStandardCache() {
  sessionStorage.removeItem(STORAGE_KEY);
}
