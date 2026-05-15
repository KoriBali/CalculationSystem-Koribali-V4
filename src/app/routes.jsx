// src/app/routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Import Shared/Layout
import Layout from "../shared/components/layout/Layout";
import ProtectedRoute from "../routes/ProtectedRoute";
import ScrollToTop from "../shared/components/ScroolTop";

// Import Pages (Sesuaikan path folder barumu)
import LoginPage from "../pages/LoginPage";
import ProjectSelectPage from "../features/calculations/pages/ProjectSelect";
import CalculationSetupPage from "../features/calculations/pages/CalcSetup";
import ReportPage from "../features/report/pages/ReportPage";
import NotFoundPage from "../pages/NotFoundPage";

// Detail Input Steps
import PoleFormPage from "../features/calculations/pages/steps/PoleStep";
import OpeningFormPage from "../features/calculations/pages/steps/OpeningStep";
import BaseplateFormPage from "../features/calculations/pages/steps/BaseplateStep";
import FoundationFormPage from "../features/calculations/pages/steps/FoundationStep";

// Guards
import TypeGuard from "../features/calculations/guards/TypeGuard";
import SessionGuard from "../features/calculations/guards/SessionGuard";

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED AREA */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Base Calculation Path */}
            <Route path="calculation">
              <Route index element={<ProjectSelectPage />} />

              {/* Dynamic Path with Multi-Guards */}
              <Route path=":type" element={<TypeGuard />}>
                <Route element={<SessionGuard />}>
                  <Route index element={<CalculationSetupPage />} />
                  <Route path="pole" element={<PoleFormPage />} />
                  <Route path="opening" element={<OpeningFormPage />} />
                  <Route path="baseplate" element={<BaseplateFormPage />} />
                  <Route path="foundation" element={<FoundationFormPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="report" element={<ReportPage />} />
          </Route>
        </Route>

        {/* Global Redirects */}
        <Route path="/" element={<Navigate to="/calculation" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
