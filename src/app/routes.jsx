// src/app/routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Import Shared/Layout
import Layout from "../shared/components/layout/Layout";
import ProtectedRoute from "../routes/ProtectedRoute";
import ScrollToTop from "../shared/components/ScrollToTop";

// Import Pages (Sesuaikan path folder barumu)
import Login from "../pages/LoginPage";
import Calculation from "../features/calculations/pages/Calculation";
import CalculationTypeSetup from "../features/calculations/pages/CalculationType";
import Report from "../features/report/pages/ReportPage";
import NotFoundPage from "../pages/404";

// Detail Input Steps
import PoleStructurePage from "../features/calculations/pages/steps/PoleStep";
import OpeningPage from "../features/calculations/pages/steps/OpeningStep";
import BaseplatePage from "../features/calculations/pages/steps/BaseplateStep";
import FoundationPage from "../features/calculations/pages/steps/FoundationStep";

// Guards
import TypeGuard from "../features/calculations/guards/TypeGuard";
import SessionGuard from "../features/calculations/guards/SessionGuard";

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED AREA */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Base Calculation Path */}
            <Route path="calculation">
              <Route index element={<Calculation />} />

              {/* Dynamic Path with Multi-Guards */}
              <Route path=":type" element={<TypeGuard />}>
                <Route element={<SessionGuard />}>
                  <Route index element={<CalculationTypeSetup />} />
                  <Route path="pole" element={<PoleStructurePage />} />
                  <Route path="opening" element={<OpeningPage />} />
                  <Route path="baseplate" element={<BaseplatePage />} />
                  <Route path="foundation" element={<FoundationPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="report" element={<Report />} />
          </Route>
        </Route>

        {/* Global Redirects */}
        <Route path="/" element={<Navigate to="/calculation" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
