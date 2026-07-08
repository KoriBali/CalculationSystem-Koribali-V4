import { useEffect, useState } from "react";
import { useParams, Outlet, Navigate } from "react-router-dom";
import { handleSessionTransition } from "../utils/coreLogic";

export default function DraftSessionGuard() {
  const { type, draftId } = useParams();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Process the transition (auto-saving previous if any, and loading this one)
    handleSessionTransition(type, draftId);
    setIsReady(true);
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
    return <Navigate to={`/calculation/${type}`} replace />;
  }

  return <Outlet />;
}
