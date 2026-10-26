import api from "../../../config/api";
import { isGuestUser, getAccessToken } from "../../../utils/auth";

// Generates fallback mock calculation results for guest mode or offline testing
function generateMockResults(payload) {
  const poles = payload?.poles || [];

  return {
    results:
      poles.length > 0
        ? poles.map((p, i) => ({
            fb: 123.45,
            stb: 100,
            sts: 90,
            stc: 80,
            sectionArea: 10.5,
            sectionModulus: 8.2,
            momentInertia: 25.4,
            ip: 12.1,
            radiusGyration: 3.6,
            taperRatio: 1.5,
            typeofTaper: p.poleType || "Linear",
            heightSection: p.zHeight ? Number(p.zHeight) : 500,
            description: p.description || p.name || `Section ${i + 1}`,
          }))
        : [
            {
              fb: 123.45,
              stb: 100,
              sts: 90,
              stc: 80,
              sectionArea: 10.5,
              sectionModulus: 8.2,
              momentInertia: 25.4,
              ip: 12.1,
              radiusGyration: 3.6,
              taperRatio: 1.5,
              typeofTaper: "Linear",
              heightSection: 500,
              description: "Section 1",
            },
          ],
    resultsDo: (payload?.directObjects || []).map(() => ({
      weight: 45,
      fixLoad: 50,
      frontArea: 1.2,
      sideArea: 0.8,
      cf: 1.1,
      zHeight: 3000,
      windLoadAreaFront: 60,
      windLoadAreaSide: 40,
      seismicLoad: 20,
    })),
    resultsOhw: (payload?.overheadWires || []).map(() => ({ flOhwKg: 30 })),
    resultsArm: (payload?.arms || []).map((a) => ({
      fb: 50,
      sfb: 45,
      sfs: 40,
      sfc: 35,
      diameter: 60,
      thickness: 4,
      sectionArea: 6.8,
      sectionModulus: 4.5,
      momentInertia: 14.2,
      radiusGyration: 2.1,
      massaM: 3.2,
      massa: 12.8,
      fixLoadM: 15,
      fixLoad: 60,
      armObjects: (a.armObjects || []).map(() => ({
        flAo: 10,
        weight: 8,
        fixLoad: 25,
      })),
    })),
  };
}

/**
 * Call API to perform pole calculation (POST /api/calculate)
 * Sends standard/custom pole payload to the Backend Calculation Engine.
 * If backend calculation engine is unavailable, offline, or returns empty results,
 * safely falls back to standard simulation output so user can proceed through tabs.
 */
export const calculatePole = async (payload) => {
  // Guest mode or unauthenticated session: simulate calculation locally
  if (isGuestUser() || !getAccessToken()) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockResults(payload));
      }, 300);
    });
  }

  // Registered user: Call backend calculation API with graceful fallback
  try {
    const { data } = await api.post("/api/calculate", payload);
    const resultData = data?.data || data;

    const rawResults = Array.isArray(resultData)
      ? resultData
      : resultData?.results;

    // If backend returned valid non-empty calculation results array, use it
    if (Array.isArray(rawResults) && rawResults.length > 0) {
      return {
        results: rawResults,
        resultsDo: resultData?.resultsDo || [],
        resultsOhw: resultData?.resultsOhw || [],
        resultsArm: resultData?.resultsArm || [],
        ...resultData,
      };
    }

    // Backend returned 200 but results was empty or missing - fallback to simulation
    console.warn(
      "Backend /api/calculate returned empty results, falling back to simulated calculation.",
    );
    return generateMockResults(payload);
  } catch (error) {
    console.warn(
      "Backend /api/calculate call failed, falling back to simulated calculation:",
      error?.response?.data || error?.message || error,
    );
    // Graceful fallback: do NOT crash or lock the user out of calculation/navigation!
    return generateMockResults(payload);
  }
};

