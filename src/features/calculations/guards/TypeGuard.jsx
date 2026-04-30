import { useParams, Outlet } from "react-router-dom";
import { PROJECT_TYPES } from "../constants/projectTypes";
import NotFoundPage from "../../pages/404";

export default function TypeGuard() {
  const { type } = useParams();

  const allowedTypes = new Set(PROJECT_TYPES.map((item) => item.id));

  if (!allowedTypes.has(type)) {
    return <NotFoundPage />;
  }

  return <Outlet />;
}
