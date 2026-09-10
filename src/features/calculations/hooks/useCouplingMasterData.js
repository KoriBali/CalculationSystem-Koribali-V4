import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCouplingMasterData,
  clearCouplingMasterCache,
} from "../services/couplingMasterService";
import {
  buildFieldOptions,
  buildCaseSchema,
  buildCaseList,
} from "../config/couplingCaseSchema";
import { buildEoHelpers } from "../utils/resolveExternalObjects";

// Loads coupling master data (/api/master/coupling, cached in sessionStorage)
// and exposes it as the exact shapes the coupling form expects:
//   fieldOptions → { position: [{value,label}], size: [...], type: [...] } | null
//   caseSchema   → { [caseNumber]: { hasDualCp, cp1, cp2 } } | null
//   caseList     → [{ id, caseNumber, title, image, detailImage }]
//   eo           → EO helpers { regions, options, resolve, visibleOptions, isForced } | null
//
// The backend is the single source of truth — there is no hardcoded fallback.
// Until the request resolves, fieldOptions/caseSchema are null and caseList is
// empty; consumers show a loading / error state driven by `loading` / `error`.
export function useCouplingMasterData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const runFetch = useCallback(() => {
    getCouplingMasterData()
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    runFetch();
  }, [runFetch]);

  const refetch = useCallback(() => {
    clearCouplingMasterCache();
    setLoading(true);
    setError(null);
    runFetch();
  }, [runFetch]);

  const fieldOptions = useMemo(
    () => (data ? buildFieldOptions(data) : null),
    [data],
  );
  const caseSchema = useMemo(
    () => (data ? buildCaseSchema(data) : null),
    [data],
  );
  const caseList = useMemo(() => (data ? buildCaseList(data) : []), [data]);
  const eo = useMemo(() => (data ? buildEoHelpers(data) : null), [data]);

  return {
    data,
    loading,
    error,
    refetch,
    fieldOptions,
    caseSchema,
    caseList,
    eo,
  };
}
