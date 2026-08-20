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

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Loads pole standard master data (stepped pole diameters/combinations/
// thicknesses, taper pole type labels) from /api/master/pole-standards.
// Height options per taper standard are intentionally NOT derived here yet —
// see useMasterData.js history / conversation for why.
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
  };
}
