import { useCallback, useEffect, useMemo, useState } from "react";
import { getMasterData, clearMasterDataCache } from "../services/masterDataService";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// {id, name, isActive}[] -> [{value: name, label: name}], active items only
const toNameOptions = (list) =>
  (list || [])
    .filter((item) => item.isActive)
    .map((item) => ({ value: item.name, label: item.name }));

// {id, name, isActive}[] -> [{value: lowercase name, label: name}], active only
// Lowercased because form logic compares against lowercase strings
// (e.g. armObject.type === "directional").
const toLowerCaseNameOptions = (list) =>
  (list || [])
    .filter((item) => item.isActive)
    .map((item) => ({ value: item.name.toLowerCase(), label: item.name }));

// {id, code, label, isActive}[] -> [{value: code, label}], active items only
const toCodeOptions = (list) =>
  (list || [])
    .filter((item) => item.isActive)
    .map((item) => ({ value: item.code, label: item.label }));

// {id, code, label, isActive}[] -> [{value, label}] combined as "label (code)",
// matching the existing hardcoded "Koito (LEV-1761A22)" style string.
const toCompanyOptions = (list) =>
  (list || [])
    .filter((item) => item.isActive)
    .map((item) => {
      const combined = `${item.label} (${item.code})`;
      return { value: combined, label: combined };
    });

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Loads shared master data (materials, object types, region codes, lighting
// company codes, ...) from the bootstrap endpoint/sessionStorage cache and
// exposes it as ready-to-use {value, label} option lists for dropdowns.
// Safe to call from multiple components — the underlying service dedupes
// the actual network request.
export function useMasterData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Runs the fetch without touching loading/error synchronously — every
  // state update here happens inside the promise callbacks, after the
  // effect (or the refetch handler) has already returned.
  const runFetch = useCallback(() => {
    getMasterData()
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        // Keep any previously loaded data on screen — only surface the error.
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    runFetch();
  }, [runFetch]);

  const refetch = useCallback(() => {
    clearMasterDataCache();
    setLoading(true);
    setError(null);
    runFetch();
  }, [runFetch]);

  const materialOptions = useMemo(() => toNameOptions(data?.materials), [data]);
  const objectTypeOptions = useMemo(
    () => toLowerCaseNameOptions(data?.objectTypes),
    [data],
  );
  const regionOptions = useMemo(() => toCodeOptions(data?.regionCodes), [data]);
  const departmentOptions = useMemo(
    () => toCodeOptions(data?.departmentCodes),
    [data],
  );
  const authorOptions = useMemo(() => toCodeOptions(data?.authorCodes), [data]);
  const lightingCompanyOptions = useMemo(
    () => toCompanyOptions(data?.lightingCompanyCodes),
    [data],
  );

  return {
    data,
    loading,
    error,
    refetch,
    materialOptions,
    objectTypeOptions,
    regionOptions,
    departmentOptions,
    authorOptions,
    lightingCompanyOptions,
  };
}
