import { useState, useEffect } from "react";

export function useProjectStorage(projectType, key, defaultValue) {
  const storageKey = `${projectType}_${key}`;

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  return [state, setState];
}
