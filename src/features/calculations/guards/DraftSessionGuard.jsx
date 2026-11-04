import { useEffect, useState } from "react";
import { useParams, Outlet, Navigate } from "react-router-dom";
import { handleSessionTransitionAsync } from "../utils/coreLogic";
import { ReadOnlyContext, useCaseReadOnly } from "../contexts/ReadOnlyContext";

export default function DraftSessionGuard() {
  const { type, draftId } = useParams();
  const [isReady, setIsReady] = useState(false);
  const readOnlyState = useCaseReadOnly(draftId);

  useEffect(() => {
    let isCancelled = false;
    async function initSession() {
      try {
        await handleSessionTransitionAsync(type, draftId);
      } catch (err) {
        console.warn("[DraftSessionGuard] Transition error:", err);
      } finally {
        if (!isCancelled) setIsReady(true);
      }
    }
    initSession();
    return () => {
      isCancelled = true;
    };
  }, [type, draftId]);

  if (!isReady) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Ensure draftId is present
  if (!draftId) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <ReadOnlyContext.Provider value={readOnlyState}>
      <div className={readOnlyState.isReadOnly ? "case-read-only-guard" : ""}>
        <Outlet />
      </div>
    </ReadOnlyContext.Provider>
  );
}

