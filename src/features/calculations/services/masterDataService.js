// Fetches and caches shared master data (materials, object types, region
// codes, lighting company codes, etc.) from the backend bootstrap endpoint.
const STORAGE_KEY = "masterData";

// Backend refreshes its own master data cache every hour, so ours shouldn't
// outlive that — otherwise a long-lived tab could serve stale data all day.
const CACHE_TTL_MS = 60 * 60 * 1000;

// In-flight fetch promise, shared across all callers so simultaneous
// getMasterData() calls (e.g. from multiple mounted components) don't
// trigger duplicate network requests.
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
      // Cache expired — treat it the same as no cache.
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    // Corrupt cache — drop it and let the caller re-fetch.
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

async function fetchBootstrap() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/master/bootstrap`);

  if (!response.ok) {
    throw new Error(`Failed to load master data (status ${response.status})`);
  }

  const json = await response.json();
  if (!json?.success || !json?.data) {
    throw new Error("Invalid master data response");
  }

  return json.data;
}

// Returns cached master data if available, otherwise fetches it from
// /api/master/bootstrap and caches the result for the rest of the tab session.
export async function getMasterData() {
  const cached = readCache();
  if (cached) return cached;

  if (!inFlightRequest) {
    inFlightRequest = fetchBootstrap()
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

// Clears the cache so the next getMasterData() call re-fetches from the API.
export function clearMasterDataCache() {
  sessionStorage.removeItem(STORAGE_KEY);
}
