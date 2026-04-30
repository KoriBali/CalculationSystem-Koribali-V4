// guards/SessionGuard.jsx
import { useParams, Outlet, Navigate } from "react-router-dom";

// Memastikan type di URL sesuai dengan project yang dipilih user
// Mencegah user manual ganti URL ke project type lain
export default function SessionGuard() {
  const { type } = useParams();
  const savedType = sessionStorage.getItem("projectType");

  if (type !== savedType) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}
