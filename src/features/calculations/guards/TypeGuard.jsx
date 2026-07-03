import { useParams, Outlet, Navigate } from "react-router-dom";
import { PROJECT_TYPES } from "../constants/projectTypes";

export default function TypeGuard() {
  const { type } = useParams();

  const allowedTypes = new Set(PROJECT_TYPES.map((item) => item.id));

  if (!allowedTypes.has(type)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}
