// src/app/routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Import Shared/Layout
import Layout from "../shared/components/layout/Layout";
import ProtectedRoute from "../shared/auth/ProtectedRoute";
import ScrollToTop from "../shared/components/ScrollToTop"; // Typo 'Scrool' diperbaiki

// Import Pages (Sesuaikan path folder barumu)
import Login from "../pages/LoginPage";
import Entry from "../pages/EntryPage";
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

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/entry" element={<Entry />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="calculation">
              <Route index element={<Calculation />} />

              <Route path=":type" element={<TypeGuard />}>
                <Route index element={<CalculationTypeSetup />} />
                <Route path="pole" element={<PoleStructurePage />} />
                <Route path="opening" element={<OpeningPage />} />
                <Route path="baseplate" element={<BaseplatePage />} />
                <Route path="foundation" element={<FoundationPage />} />
              </Route>
            </Route>

            <Route path="report" element={<Report />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/entry" />} />
      </Routes>
    </>
  );
}
