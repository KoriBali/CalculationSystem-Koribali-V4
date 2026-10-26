import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPoleStandardData,
  clearPoleStandardCache,
} from "../services/poleStandardService";
import STANDARD_POLE_DATA from "../data/specStandardPole.json";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// "Type-I (IS)" -> "IS" — the short code baked into local image maps
// (DIAGRAM_IMAGE_MAP in TaperTypeForm.jsx) and other unrelated local logic,
// so it must keep matching those exactly.
const extractShortCode = (name) => {
  const match = name.match(/\(([^)]+)\)/);
  return match ? match[1] : name;
};

function deriveStraightOptions(straightEntry) {
  if (!straightEntry) {
    return { steppedPoleOptions: [], combinationGroups: [], combinations: {}, tplMap: {} };
  }

  const combinationGroups = straightEntry.poleDiameters.map((d) => String(d.diameter));

  const combinations = {};
  const tplMap = {};
  straightEntry.poleDiameters.forEach((d) => {
    const group = String(d.diameter);
    combinations[group] = d.poleCombinations.map((c) => c.name);

    const [prefix] = (d.poleCombinations[0]?.name || "").split("-");
    if (prefix && d.poleCombinations[0]) {
      tplMap[prefix] = d.poleCombinations[0].poleThicknesses
        .filter((t) => t.position === "lower")
        .map((t) => t.thickness);
    }
  });

  return {
    // id stays the fixed "steppedPole" literal — StraightTypeForm.jsx compares
    // straightPoleStandard.poleType === "steppedPole" directly.
    steppedPoleOptions: [{ id: "steppedPole", label: straightEntry.name }],
    combinationGroups,
    combinations,
    tplMap,
  };
}

// Fallback heights derived from specStandardPole.json in case API is unavailable
// or has missing height entries.
function deriveFallbackHeightOptions() {
  const result = {};
  const tapered =
    STANDARD_POLE_DATA?.tapered || STANDARD_POLE_DATA?.taper || {};

  Object.entries(tapered).forEach(([shortCode, groups]) => {
    let onGLKeys = Object.keys(groups.onGL || {});
    let underGLKeys = Object.keys(groups.underGL || {});

    const isTypeWith100 = shortCode !== "IS" && shortCode !== "IA";
    if (isTypeWith100) {
      // For LS, LA, TS, TA: prefer the +100mm heights (e.g. 4.6, 5.1, 8.1, 10.1, 12.1 for onGL; 4.9, 5.4, 8.4, 10.4, 12.4 for underGL)
      const has100OnGL = onGLKeys.some((k) => String(k).includes(".1") || String(k).includes(".6"));
      if (has100OnGL) {
        onGLKeys = onGLKeys.filter((k) => String(k).includes(".1") || String(k).includes(".6"));
      }
      const has100UnderGL = underGLKeys.some((k) => String(k).includes(".4") || String(k).includes(".9"));
      if (has100UnderGL) {
        underGLKeys = underGLKeys.filter((k) => String(k).includes(".4") || String(k).includes(".9"));
      }
    }

    const toOption = (k) => ({
      id: String(k),
      label: `${Math.round(Number(k) * 1000)} mm`,
    });

    result[shortCode] = {
      onGL: onGLKeys.sort((a, b) => Number(a) - Number(b)).map(toOption),
      underGL: underGLKeys.sort((a, b) => Number(a) - Number(b)).map(toOption),
    };
  });

  return result;
}

function deriveTaperOptions(taperEntries) {
  if (!taperEntries || taperEntries.length === 0) {
    const tapered =
      STANDARD_POLE_DATA?.tapered || STANDARD_POLE_DATA?.taper || {};
    const fullNameMap = {
      IS: "Type-I (IS)",
      IA: "Type-I (IA)",
      LS: "Type-L (LS)",
      LA: "Type-L (LA)",
      TS: "Type-T (TS)",
      TA: "Type-T (TA)",
    };
    return Object.keys(tapered).map((shortCode) => ({
      id: shortCode,
      label: fullNameMap[shortCode] || shortCode,
    }));
  }

  return taperEntries.map((entry) => ({
    id: extractShortCode(entry.name),
    label: entry.name,
  }));
}

// The API returns a flat list of heights per taper standard with no ground
// position field — e.g. Type-I (IS): [8000, 10000, 12000, 8300, 10300, 12300]
// in mm (or [8, 10, 12, 8.3, 10.3, 12.3] in m).
// Ground position is paired via underGL = onGL + 0.3.
// id is String(height in meters) matching keys in specStandardPole.json (e.g. "8", "8.3").
function deriveHeightOptions(taperEntries) {
  const fallback = deriveFallbackHeightOptions();
  if (!taperEntries || taperEntries.length === 0) {
    return fallback;
  }

  const result = { ...fallback };

  taperEntries.forEach((entry) => {
    const shortCode = extractShortCode(entry.name);
    const rawHeights = (entry.poleStandardHeights || []).map((h) =>
      Number(h.height),
    );
    if (rawHeights.length === 0) return;

    // Convert mm to meters if needed (e.g. 8000 -> 8, 8300 -> 8.3)
    const heights = rawHeights.map((h) => {
      const inMeters = h > 100 ? h / 1000 : h;
      return Math.round(inMeters * 10) / 10;
    });

    const heightSet = new Set(heights.map((h) => Math.round(h * 10)));

    const onGL = [];
    const underGL = [];

    heights.forEach((h) => {
      const hasUnderGLPair = heightSet.has(Math.round((h + 0.3) * 10));
      const isUnderGLPair = heightSet.has(Math.round((h - 0.3) * 10));

      if (hasUnderGLPair) {
        onGL.push(h);
      } else if (isUnderGLPair) {
        underGL.push(h);
      }
    });

    const toOption = (h) => ({
      id: String(h),
      label: `${Math.round(h * 1000)} mm`,
    });

    if (onGL.length > 0 || underGL.length > 0) {
      result[shortCode] = {
        onGL: onGL.sort((a, b) => a - b).map(toOption),
        underGL: underGL.sort((a, b) => a - b).map(toOption),
      };
    }
  });

  return result;
}

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Loads pole standard master data (stepped pole diameters/combinations/
// thicknesses, taper pole type labels and heights) from /api/master/pole-standards.
export function usePoleStandardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const runFetch = useCallback(() => {
    getPoleStandardData()
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    runFetch();
  }, [runFetch]);

  const refetch = useCallback(() => {
    clearPoleStandardCache();
    setLoading(true);
    setError(null);
    runFetch();
  }, [runFetch]);

  const straightEntry = useMemo(
    () => data?.find((item) => item.type === "straight"),
    [data],
  );
  const taperEntries = useMemo(
    () =>
      data?.filter(
        (item) => item.type === "taper" || item.type === "tapered"
      ) || [],
    [data],
  );

  const { steppedPoleOptions, combinationGroups, combinations, tplMap } = useMemo(
    () => deriveStraightOptions(straightEntry),
    [straightEntry],
  );
  const poleStandardOptions = useMemo(
    () => deriveTaperOptions(taperEntries),
    [taperEntries],
  );
  const heightOptionsByStandard = useMemo(
    () => deriveHeightOptions(taperEntries),
    [taperEntries],
  );

  return {
    data,
    loading,
    error,
    refetch,
    steppedPoleOptions,
    combinationGroups,
    combinations,
    tplMap,
    poleStandardOptions,
    heightOptionsByStandard,
  };
}
