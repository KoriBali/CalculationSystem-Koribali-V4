import { useState, useEffect } from "react";

export function useProjectStorage(projectType, key, defaultValue) {
  const storageKey = `${projectType}_${key}`;

  const [state, setState] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  return [state, setState];
}
