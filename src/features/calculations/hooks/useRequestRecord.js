import { useState } from "react";

import { getRequest, updateRequest } from "../data/requestStore";

// A stored request plus a way to change it: `update(change)` saves
// change(request) and re-renders with the result. `request` is null when
// there's no request with that id (e.g. opened in another browser tab).
export function useRequestRecord(id) {
  const [request, setRequest] = useState(() => getRequest(id));
  const update = (change) => {
    const updated = updateRequest(id, change);
    if (updated) setRequest(updated);
  };
  return [request, update];
}
