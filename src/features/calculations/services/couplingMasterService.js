// Fetches and caches coupling master data (positions, sizes, types, the
// 10 case configurations, plus the regions / external objects / EO
// availabilities the coupling feature needs) from its own dedicated
// endpoint — separate from /api/master/bootstrap.
const STORAGE_KEY = "couplingMasterData";

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

async function fetchCouplingMaster() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/master/coupling`);

  if (!response.ok) {
    throw new Error(`Failed to load coupling master data (status ${response.status})`);
  }

  const json = await response.json();
  if (!json?.success || !json?.data) {
    throw new Error("Invalid coupling master data response");
  }

  return json.data;
}

// Returns cached coupling master data if available, otherwise fetches it
// from /api/master/coupling and caches the result in sessionStorage for the
// rest of the tab's lifetime (or until it expires per CACHE_TTL_MS).
export async function getCouplingMasterData() {
  const cached = readCache();
  if (cached) return cached;

  if (!inFlightRequest) {
    inFlightRequest = fetchCouplingMaster()
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

export function clearCouplingMasterCache() {
  sessionStorage.removeItem(STORAGE_KEY);
}
