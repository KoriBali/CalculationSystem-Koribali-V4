import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPoleStandardData,
  clearPoleStandardCache,
} from "../services/poleStandardService";

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

function deriveTaperOptions(taperEntries) {
  return taperEntries.map((entry) => ({
    id: extractShortCode(entry.name),
    label: entry.name,
  }));
}

// The API returns a flat list of heights per taper standard with no ground
// position field — e.g. Type-I (IS): [8, 10, 12, 8.3, 10.3, 12.3]. Ground
// position isn't master data (it's a local UI concept), but the pairing IS
// derivable: every standard we've seen follows underGL = onGL + 0.3.
// id is String(height) — specStandardPole.json's taper.*.underGL keys were
// renamed to match this exact format (e.g. "8U" -> "8.3").
function deriveHeightOptions(taperEntries) {
  const result = {};

  taperEntries.forEach((entry) => {
    const shortCode = extractShortCode(entry.name);
    const heights = entry.poleStandardHeights.map((h) => h.height);
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
      // Heights with no +0.3/-0.3 counterpart are skipped — we can't tell
      // which ground position they belong to, and a wrong guess here would
      // silently break the specStandardPole.json lookup.
    });

    const toOption = (h) => ({ id: String(h), label: `${h.toFixed(1)} m` });

    result[shortCode] = {
      onGL: onGL.sort((a, b) => a - b).map(toOption),
      underGL: underGL.sort((a, b) => a - b).map(toOption),
    };
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
    () => data?.filter((item) => item.type === "taper") || [],
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
