import { useState, useEffect, useRef, useCallback } from "react";

export function useProjectStorage(projectType, key, defaultValue) {
  const storageKey = `${projectType}_${key}`;

  const [state, setState] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return defaultValue;
    try {
      const parsed = JSON.parse(saved);
      if (
        typeof defaultValue === "object" &&
        defaultValue !== null &&
        typeof parsed === "string" &&
        "type" in defaultValue
      ) {
        return { ...defaultValue, type: parsed };
      }
      return parsed;
    } catch (err) {
      if (
        typeof defaultValue === "object" &&
        defaultValue !== null &&
        "type" in defaultValue
      ) {
        return { ...defaultValue, type: saved };
      }
      console.warn(`[useProjectStorage] Failed to parse ${storageKey}:`, err);
      return defaultValue;
    }
  });

  // Tracks the latest value so functional updates can be resolved (and
  // persisted) at call time rather than during the next render.
  const latestRef = useRef(state);

  useEffect(() => {
    latestRef.current = state;
    sessionStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  // Persist synchronously, not only in the effect above: code that writes a
  // value and then immediately signals others to re-read sessionStorage
  // (e.g. isCalculated* + notifyCalculationProgressChanged(), which
  // HeaderCalculationPage uses to lock/unlock tabs) would otherwise have
  // them read the old value, since the effect runs only after the render.
  const setAndPersist = useCallback(
    (valueOrUpdater) => {
      const next =
        typeof valueOrUpdater === "function"
          ? valueOrUpdater(latestRef.current)
          : valueOrUpdater;
      latestRef.current = next;
      sessionStorage.setItem(storageKey, JSON.stringify(next));
      setState(next);
    },
    [storageKey],
  );

  return [state, setAndPersist];
}
