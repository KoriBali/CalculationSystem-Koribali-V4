import { useState } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

import { LEAVE_NEW_REQUEST_COPY } from "../constants/requestFormOptions";
import {
  clearNewRequestDraft,
  unfinishedNewRequest,
} from "../utils/newRequestDraft";

export const NEW_REQUEST_FORM_PATH = "/projects/new/:type";

// Leaving the New Project form inside the Projects menu (breadcrumb, logo,
// Back to Project Type) discards it, so ask first when it has entries.
// Elsewhere — or with nothing filled in — `leave` just navigates.
// Other sidebar menus don't go through here: the form is kept for when the
// user comes back.
//
//   const { leave, confirmProps } = useLeaveNewRequest();
//   <button onClick={() => leave("/projects")} />
//   <ConfirmResetAllModal {...confirmProps} />
export function useLeaveNewRequest() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Where to go once the user confirms; null while no dialog is open.
  const [target, setTarget] = useState(null);
  const onForm =
    matchPath(NEW_REQUEST_FORM_PATH, pathname) !== null ||
    matchPath("/requests/new/:type", pathname) !== null;

  const discardAndGo = (to) => {
    clearNewRequestDraft();
    navigate(to);
  };
  const leave = (to) => {
    if (!onForm) return navigate(to);
    if (unfinishedNewRequest()) return setTarget(to);
    discardAndGo(to);
  };

  return {
    leave,
    confirmProps: {
      ...LEAVE_NEW_REQUEST_COPY,
      open: target !== null,
      onClose: () => setTarget(null),
      onReset: () => discardAndGo(target),
    },
  };
}
