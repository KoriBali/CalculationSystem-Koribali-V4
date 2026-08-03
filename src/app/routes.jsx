// src/app/routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Import Shared/Layout
import Layout from "../shared/components/layout/Layout";
import ProtectedRoute from "../routes/ProtectedRoute";
import ScrollToTop from "../shared/components/ScroolTop";

// Import Pages (Sesuaikan path folder barumu)
import LoginPage from "../pages/LoginPage";
import ProjectSelectPage from "../features/calculations/pages/ProjectSelect";
import DraftsDashboardPage from "../features/calculations/pages/DraftsDashboardPage";
import ProjectIdentityPage from "../features/calculations/pages/ProjectIdentityPage";
import InitialInputPage from "../features/calculations/pages/InitialInputPage";
import DrawingGeneralPage from "../features/calculations/pages/drawing/DrawingGeneralPage";
import DrawingPolePage from "../features/calculations/pages/drawing/DrawingPolePage";
import DrawingOpeningPage from "../features/calculations/pages/drawing/DrawingOpeningPage";
import DrawingCouplingPage from "../features/calculations/pages/drawing/DrawingCouplingPage";
import DrawingSurfacePage from "../features/calculations/pages/drawing/DrawingSurfacePage";
import ReportPage from "../features/report/pages/ReportPage";
import ProjectDatabasePage from "../features/database/pages/ProjectDatabasePage";
import NotFoundPage from "../pages/NotFoundPage";

// Detail Input Steps
import PoleFormPage from "../features/calculations/pages/steps/PoleStep";
import OpeningFormPage from "../features/calculations/pages/steps/OpeningStep";
import BaseplateFormPage from "../features/calculations/pages/steps/BaseplateStep";
import FoundationFormPage from "../features/calculations/pages/steps/FoundationStep";

// Guards
import TypeGuard from "../features/calculations/guards/TypeGuard";
import SessionGuard from "../features/calculations/guards/SessionGuard";
import DraftSessionGuard from "../features/calculations/guards/DraftSessionGuard";

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
                  <Route index element={<DraftsDashboardPage />} />
                  <Route path=":draftId" element={<DraftSessionGuard />}>
                    <Route index element={<ProjectIdentityPage />} />
                    <Route path="initial" element={<InitialInputPage />} />
                    <Route path="drawing" element={<Navigate to="general" replace />} />
                    <Route path="drawing/general" element={<DrawingGeneralPage />} />
                    <Route path="drawing/pole" element={<DrawingPolePage />} />
                    <Route path="drawing/opening" element={<DrawingOpeningPage />} />
                    <Route path="drawing/coupling" element={<DrawingCouplingPage />} />
                    <Route path="drawing/surface" element={<DrawingSurfacePage />} />
                    <Route path="pole" element={<PoleFormPage />} />
                    <Route path="opening" element={<OpeningFormPage />} />
                    <Route path="baseplate" element={<BaseplateFormPage />} />
                    <Route path="foundation" element={<FoundationFormPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>

            <Route path="report" element={<ReportPage />} />
            <Route path="database" element={<ProjectDatabasePage />} />
          </Route>

          {/* Global Redirects & 404 (Protected) */}
          <Route path="/" element={<Navigate to="/calculation" replace />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
