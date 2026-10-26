import { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { findRequestOfCase } from "../data/requestStore";
import { getUser } from "../../../utils/auth";

export const ReadOnlyContext = createContext({
  isReadOnly: false,
  owner: null,
  caseNo: null,
  requestNo: null,
});

export const useReadOnly = () => useContext(ReadOnlyContext);

export function useCaseReadOnly(overrideDraftId) {
  const { draftId: paramDraftId } = useParams();
  const draftId = overrideDraftId || paramDraftId;

  return useMemo(() => {
    const isSessionReadOnly = sessionStorage.getItem("case_read_only") === "true";
    const draftCase = draftId ? findRequestOfCase(draftId) : null;
    const owner = draftCase?.case?.owner || null;
    const caseNo = draftCase?.case?.no || null;
    const request = draftCase?.request || null;
    const user = getUser();
    const userName = user?.name || user?.username || "";
    const isOwner = Boolean(
      (owner && userName && owner.toLowerCase() === userName.toLowerCase()) ||
      (user?.username && owner && owner.toLowerCase() === user.username.toLowerCase())
    );

    const caseStatus = draftCase?.case?.status;
    const isLockedStatus =
      caseStatus === "Ready for check" ||
      caseStatus === "ready_check" ||
      caseStatus === "Checked" ||
      caseStatus === "Ready to submit" ||
      caseStatus === "ready_submit" ||
      caseStatus === "Submitted" ||
      caseStatus === "submitted" ||
      caseStatus === "Cleared" ||
      caseStatus === "cleared";

    const isReadOnly = Boolean(
      isSessionReadOnly || isLockedStatus || (owner && !isOwner)
    );

    return {
      isReadOnly,
      isLockedByStatus: isLockedStatus,
      owner: owner || "another member",
      caseNo,
      request,
      draftCase,
    };
  }, [draftId]);
}
