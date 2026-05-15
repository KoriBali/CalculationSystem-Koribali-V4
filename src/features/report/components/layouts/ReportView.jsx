import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LightingPoleReport from "../templates/lighting-pole/LightingPoleReport";
import AcemastReport from "../templates/acemast/AcemastReport";
import SignboardReport from "../templates/signboard/SignboardReport";
import MultipleReport from "../templates/multiple/MultipleReport";

import { clearCalculationSession } from "../../../calculations/utils";
import {
  ArrowLeft,
  Download,
  Trash2,
  FileText,
  AlertCircle,
  Calculator,
} from "lucide-react";

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export function ReportView() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectType = sessionStorage.getItem("projectType");

  // ── Load report data ──
  // Prioritize route state (fresh navigation), fallback to sessionStorage snapshot (reload)
  const reportData =
    location.state ||
    JSON.parse(
      sessionStorage.getItem(`${projectType}_reportSnapshot`) || "null",
    );

  // ── Destructure all fields from merged reportPayload ──
  // results, resultsDo, resultsOhw, resultsArm already contain merged input + BE calculation
  const results = reportData?.results || [];
  const resultsDo = reportData?.resultsDo || [];
  const resultsOhw = reportData?.resultsOhw || [];
  const resultsArm = reportData?.resultsArm || [];
  const cover = reportData?.cover || {};
  const condition = reportData?.condition || {};
  const poleConfig = reportData?.poleConfig || {};

  // Optional sections — only present in payload if their flag was enabled in condition
  const calculatedOp = reportData?.calculatedOp || null;
  const calculatedBaseplate = reportData?.calculatedBaseplate || null;
  const calculatedFoundation = reportData?.calculatedFoundation || null;

  // ── UI state ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasReport, setHasReport] = useState(
    sessionStorage.getItem(`${projectType}_hasReport`) === "true",
  );

  // ── Handlers ──

  const onBackCalculation = () => {
    navigate(projectType ? `/calculation/${projectType}` : "/calculation");
  };

  // Rename PDF filename via document.title (common browser workaround)
  const handlePrint = () => {
    const oldTitle = document.title;
    document.title = cover?.calculationNumber || "Calculation Report";
    window.print();
    document.title = oldTitle;
  };

  const handleDelete = () => {
    setHasReport(false);
    setShowDeleteConfirm(false);
    clearCalculationSession(projectType);
    navigate("/calculation");
  };

  // ── Render report by project type ──
  // Each template receives only the props it needs.
  // Optional sections (calculatedOp, etc.) are passed through — templates
  // check condition flags internally to decide whether to render those sections.
  const renderReport = () => {
    const commonProps = {
      cover,
      condition,
      poleConfig,
      results,
      resultsDo,
      resultsOhw,
      resultsArm,
    };

    switch (projectType) {
      case "lighting-pole":
        return (
          <div id="report-a4">
            <LightingPoleReport
              {...commonProps}
              calculatedOp={calculatedOp}
              calculatedBaseplate={calculatedBaseplate}
              calculatedFoundation={calculatedFoundation}
            />
          </div>
        );

      case "acemast":
        return (
          <div id="report-a4">
            <AcemastReport
              {...commonProps}
              calculatedOp={calculatedOp}
              calculatedBaseplate={calculatedBaseplate}
              calculatedFoundation={calculatedFoundation}
            />
          </div>
        );

      case "signboard":
        return (
          <div id="report-a4">
            <SignboardReport
              {...commonProps}
              calculatedOp={calculatedOp}
              calculatedBaseplate={calculatedBaseplate}
              calculatedFoundation={calculatedFoundation}
            />
          </div>
        );

      case "multiple":
        return (
          <div id="report-a4">
            <MultipleReport
              {...commonProps}
              calculatedOp={calculatedOp}
              calculatedBaseplate={calculatedBaseplate}
              calculatedFoundation={calculatedFoundation}
            />
          </div>
        );

      default:
        return <div />;
    }
  };

  // ── Empty state ──
  if (!hasReport || results.length === 0 || !projectType || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-250">
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-100 text-blue-800 p-6 rounded-2xl shadow-sm border border-blue-100">
                <FileText className="w-11 h-11" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
              No Reports
            </h1>
            <h2 className="text-xl text-slate-600 mb-4 font-semibold">
              No calculation reports available
            </h2>
            <p className="text-base text-slate-500 mb-10 lg:mb-12 leading-relaxed max-w-md mx-auto">
              You haven't generated any reports yet. Start by creating pole
              sections and running calculations to generate your first report.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={onBackCalculation}
                className="flex items-center gap-2 px-8 py-3 bg-blue-800 text-white rounded-lg shadow-sm hover:bg-blue-900 hover:shadow-md transition-all duration-200 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <Calculator className="w-5 h-5" />
                Go to Calculation
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Start your first calculation to generate reports
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Report view ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar — hidden on print */}
      <div className="bg-white print:hidden sticky top-[64px] z-30 shadow-sm border-b border-[#0d3b66]">
        <div className="mx-auto px-6 py-4 hp:px-4 hp:py-2.5">
          <div className="flex items-center justify-between">
            {/* Back */}
            <button
              onClick={onBackCalculation}
              className="flex items-center gap-2 px-5 py-2.5 text-sm bg-white text-[#0d3b66] border border-[#0d3b66] rounded-lg hover:bg-blue-50 transition-colors hp:px-3 hp:py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hp:hidden">Back to Calculator</span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-3 hp:gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete Report"
                className="flex items-center gap-2 px-5 py-2.5 text-sm bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors hp:px-3 hp:py-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hp:hidden">Delete Report</span>
              </button>

              <button
                onClick={handlePrint}
                title="Export PDF"
                className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white rounded-lg hover:brightness-110 transition-all shadow-sm hp:px-3 hp:py-2"
              >
                <Download className="w-4 h-4" />
                <span className="hp:hidden">Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-xs bg-white border border-gray-200 rounded-xl shadow-xl p-4 sm:max-w-md sm:p-8 sm:rounded-2xl">
            <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-red-100 rounded-full">
              <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
            </div>

            <h2 className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
              Delete Report?
            </h2>
            <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
              This will delete all inputs and results. This action cannot be
              undone. Continue?
            </p>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report content */}
      <div className="max-w-7xl mx-auto px-6 py-8 hp:mx-0 hp:px-0 hp:flex hp:justify-center hp:max-w-[100vh] hp:overflow-hidden">
        {renderReport()}
      </div>
    </div>
  );
}
