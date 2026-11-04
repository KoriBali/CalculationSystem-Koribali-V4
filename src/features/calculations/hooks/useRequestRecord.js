import { useState } from "react";

import { getRequest, updateRequest, saveRequest } from "../data/requestStore";

// A stored request plus a way to change it: `update(change)` saves
// change(request) and re-renders with the result.
export function useRequestRecord(id) {
  const [request, setRequest] = useState(() => getRequest(id));
  const update = (change) => {
    const updated = updateRequest(id, change);
    if (updated) {
      setRequest(updated);
    } else if (typeof change === "function") {
      setRequest((prev) => {
        const next = change(prev || {});
        if (id && next) saveRequest({ ...next, id });
        return next;
      });
    } else if (change) {
      saveRequest({ ...change, id });
      setRequest(change);
    }
  };
  return [request, update, setRequest];
}
