import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
  FileEdit,
  AlertCircle,
  Calculator,
  Database,
} from "lucide-react";
import { EmptyReport } from "../../../../assets/icon";
import { ConfirmSaveDatabaseModal } from "../../../calculations/components/modals/ConfirmSaveDatabaseModal";
import { activeDraftRequestPath } from "../../../calculations/utils/requestCases";
import { SchematicEditorModal } from "../../../calculations/components/schematic/SchematicEditorModal";
import {
  useSchematicBridge,
  DEFAULT_SCHEMATIC_URL,
} from "../../../calculations/hooks/useSchematicBridge";
import { getStandardPoleSchematicParameters } from "../../../calculations/utils/standardPoleSchematicMapper";
import { getDummyReportPayload } from "../../utils/dummyReportPayload";
import {
  getDraftData,
  deserializeWorkingSession,
  saveWorkingSessionToDraft,
} from "../../../calculations/utils/coreLogic";
import { CoverFormModal } from "../../../calculations/components/modals/CoverFormModal";

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export function ReportView() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const projectType =
    params.type || sessionStorage.getItem("projectType") || "lighting-project";
  const draftId =
    params.draftId || sessionStorage.getItem(`${projectType}_active_draft_id`);

  // If opened via /requests/:type/:draftId/report, ensure draft data is restored to session
  useEffect(() => {
    if (params.type && params.draftId) {
      sessionStorage.setItem("projectType", params.type);
      sessionStorage.setItem(`${params.type}_active_draft_id`, params.draftId);
      const draftData = getDraftData(params.type, params.draftId);
      if (draftData) {
        deserializeWorkingSession(params.type, draftData);
      }
    }
  }, [params.type, params.draftId]);

  // ── Load report data ──
  // Prioritize route state (fresh navigation), fallback to sessionStorage snapshot (reload),
  // fallback to draft data snapshot, fallback to dummy simulation payload if no draftId specified.
  const storedSnapshot = useMemo(() => {
    try {
      let snap = location.state || null;
      if (!snap) {
        const sessionSnap = sessionStorage.getItem(`${projectType}_reportSnapshot`);
        if (sessionSnap) snap = JSON.parse(sessionSnap);
      }
      if (!snap && draftId) {
        const draftData = getDraftData(projectType, draftId);
        if (draftData?.reportSnapshot) {
          snap =
            typeof draftData.reportSnapshot === "string"
              ? JSON.parse(draftData.reportSnapshot)
              : draftData.reportSnapshot;
        }
      }
      return snap;
    } catch {
      return location.state || null;
    }
  }, [location.state, projectType, draftId]);

  const reportData = useMemo(() => {
    let storedPole = null;
    try {
      storedPole = JSON.parse(
        sessionStorage.getItem(`${projectType}_taperPoleStandard`) || "null",
      );
    } catch {
      storedPole = null;
    }

    if (storedSnapshot && storedSnapshot.results?.length > 0) {
      // Check if user selected or changed the pole standard in the form
      const isPoleChanged = Boolean(
        storedPole?.poleType &&
          (
            storedSnapshot?.condition?.standardPoleType !== storedPole.poleType ||
            storedSnapshot?.taperPoleStandard?.poleType !== storedPole.poleType ||
            storedSnapshot?.taperPoleStandard?.groundPosition !== storedPole.groundPosition ||
            String(storedSnapshot?.taperPoleStandard?.height || "") !== String(storedPole?.height || "")
          )
      );

      const hasOldDummyCover = storedSnapshot.cover?.calculationNumber === "KB-2026-001";
      if (isPoleChanged || hasOldDummyCover) {
        const fresh = getDummyReportPayload(projectType, storedPole);
        sessionStorage.setItem(`${projectType}_reportSnapshot`, JSON.stringify(fresh));
        return fresh;
      }
      return storedSnapshot;
    }

    // If looking at a specific draft that hasn't calculated yet, return null (trigger empty state)
    if (draftId) {
      return null;
    }

    const fresh = getDummyReportPayload(projectType, storedPole);
    sessionStorage.setItem(`${projectType}_reportSnapshot`, JSON.stringify(fresh));
    return fresh;
  }, [storedSnapshot, projectType, draftId]);

  const isSimulation = Boolean(reportData?.isSimulation);

  const num = (v, fallback = 0) => {
    if (v === undefined || v === null || v === "") return fallback;
    const n = Number(v);
    return isNaN(n) ? fallback : n;
  };

  // ── Normalize results to ensure all numeric fields are numbers ──
  const results = useMemo(() => {
    return (reportData?.results || []).map((r, idx) => {
      if (!r) return {};
      return {
        ...r,
        lowerDiameter: num(r.lowerDiameter, 165),
        upperDiameter: num(r.upperDiameter, 75),
        lowerThickness: num(r.lowerThickness, 4),
        upperThickness: num(r.upperThickness, 4),
        sectionModulus: num(r.sectionModulus, 30),
        sectionArea: num(r.sectionArea, 15),
        crossSectionArea: num(r.crossSectionArea || r.sectionArea, 15),
        momentInertia: num(r.momentInertia, 100),
        radiusGyration: num(r.radiusGyration, 3.5),
        fixLoad: num(r.fixLoad, 50),
        zHeight: num(r.zHeight, 10000),
        heightSection: num(r.heightSection, 1000),
        fb: num(r.fb, 120),
        stb: num(r.stb, 100),
        sts: num(r.sts, 85),
        stc: num(r.stc, 75),
        bendingMoment: num(r.bendingMoment, 1200 * (idx + 1)),
        shearStress: num(r.shearStress, 15),
        bendingStress: num(r.bendingStress, 55),
        combinedStress: num(r.combinedStress, 60),
        safetyRatio: num(r.safetyRatio, 0.65),
      };
    });
  }, [reportData]);

  const resultsDo = useMemo(() => {
    return (reportData?.resultsDo || []).map((d) => {
      if (!d) return {};
      return {
        ...d,
        weight: num(d.weight, 14),
        fixLoad: num(d.fixLoad || d.weight, 14),
        frontArea: num(d.frontArea, 0.1),
        sideArea: num(d.sideArea, 0.1),
        cf: num(d.cf, 1.1),
        windLoadAreaFront: num(d.windLoadAreaFront, 60),
        windLoadAreaSide: num(d.windLoadAreaSide, 40),
        zHeight: num(d.zHeight, 10000),
      };
    });
  }, [reportData]);
  const resultsOhw = reportData?.resultsOhw || [];
  const resultsArm = reportData?.resultsArm || [];
  const [editedCover, setEditedCover] = useState(null);
  const [showEditCoverModal, setShowEditCoverModal] = useState(false);

  const cover = useMemo(() => {
    return editedCover || reportData?.cover || {};
  }, [editedCover, reportData]);

  const condition = reportData?.condition || {};
  const poleConfig = reportData?.poleConfig || {};

  // Optional sections — only present in payload if their flag was enabled in condition
  const calculatedOp = reportData?.calculatedOp || null;
  const calculatedBaseplate = reportData?.calculatedBaseplate || null;
  const calculatedFoundation = reportData?.calculatedFoundation || null;

  // ── UI state ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [hasReport, setHasReport] = useState(true);

  // ── Handlers ──

  const handleSaveCover = (updatedCover) => {
    setEditedCover(updatedCover);
    sessionStorage.setItem(`${projectType}_cover`, JSON.stringify(updatedCover));

    try {
      const snap = JSON.parse(
        sessionStorage.getItem(`${projectType}_reportSnapshot`) || "{}"
      );
      const updatedSnap = { ...snap, ...(reportData || {}), cover: updatedCover };
      sessionStorage.setItem(
        `${projectType}_reportSnapshot`,
        JSON.stringify(updatedSnap)
      );
    } catch (e) {
      console.error("Failed to update snapshot with cover:", e);
    }

    if (draftId) {
      saveWorkingSessionToDraft(projectType, draftId);
    }
    setShowEditCoverModal(false);
  };

  const onBackCalculation = () => {
    if (projectType && draftId) {
      navigate(`/requests/${projectType}/${draftId}/initial`);
      return;
    }
    const backPath = activeDraftRequestPath(projectType);
    if (backPath && backPath !== "/requests") {
      navigate(backPath);
      return;
    }
    navigate("/requests");
  };

  const onBackRequest = () => {
    const backPath = activeDraftRequestPath(projectType);
    if (backPath && backPath !== "/requests") {
      navigate(backPath);
      return;
    }
    navigate(`/requests/${projectType}`);
  };

  // Rename PDF filename via document.title (common browser workaround)
  const handlePrint = () => {
    const oldTitle = document.title;
    document.title = cover?.calculationNumber || cover?.reportNumber || "Calculation Report";
    window.print();
    document.title = oldTitle;
  };

  const handleDelete = () => {
    setHasReport(false);
    setShowDeleteConfirm(false);
    clearCalculationSession(projectType);
    navigate("/requests");
  };

  const handleConfirmSaveDb = () => {
    // Database save logic will go here
    showToast("Project successfully saved to database!", "success");
    setShowDbModal(false);
    // Back to the case's request — read before the session is cleared.
    const backPath = activeDraftRequestPath(projectType);
    setTimeout(() => {
      clearCalculationSession(projectType);
      clearActiveDraftId(projectType);
      navigate(backPath);
    }, 2500);
  };

  // ── Schematic setup (Standard Pole IA, IS, LA, LS, TA, TS) ──
  const taperPoleStandard = useMemo(() => {
    if (reportData?.taperPoleStandard) return reportData.taperPoleStandard;
    try {
      return (
        JSON.parse(
          sessionStorage.getItem(`${projectType}_taperPoleStandard`) || "null",
        ) || {}
      );
    } catch {
      return {};
    }
  }, [reportData, projectType]);

  const schematicParams = useMemo(() => {
    return getStandardPoleSchematicParameters({ taperPoleStandard, condition });
  }, [taperPoleStandard, condition]);

  const iframeRef = useRef(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const {
    isReady,
    isGenerating,
    schematicData,
    finalSvg,
    sendParameters,
    resetToDefault,
    openEditor,
  } = useSchematicBridge({
    iframeRef,
    schematicUrl: DEFAULT_SCHEMATIC_URL,
    projectType,
    onApplied: () => {
      setIsEditorOpen(false);
    },
  });

  const lastRequestedStandardIdRef = useRef("");
  useEffect(() => {
    if (!schematicParams || !isReady) return;
    if (
      schematicData?.generatedSvg &&
      schematicData?.standardId === schematicParams.standardId
    ) {
      return;
    }
    const isStandardChanged = Boolean(
      schematicData?.standardId &&
      schematicData.standardId !== schematicParams.standardId
    );
    if (lastRequestedStandardIdRef.current === schematicParams.standardId) return;
    lastRequestedStandardIdRef.current = schematicParams.standardId;

    sendParameters(schematicParams.payload, {
      standardId: schematicParams.standardId,
      replaceManualEdit: isStandardChanged,
    });
  }, [isReady, schematicParams, schematicData, sendParameters]);

  const handleEditSchematic = useCallback(() => {
    setIsEditorOpen(true);
    openEditor();
  }, [openEditor]);

  const handleRegenerateSchematic = useCallback(() => {
    if (schematicParams) {
      resetToDefault(schematicParams.payload, {
        standardId: schematicParams.standardId,
      });
    }
  }, [resetToDefault, schematicParams]);

  const isMatchingSchematic =
    schematicData?.standardId &&
    schematicParams?.standardId &&
    schematicData.standardId === schematicParams.standardId;

  const reportSchematicSvg =
    (isMatchingSchematic ? finalSvg : null) ||
    finalSvg ||
    reportData?.schematicSvg;

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
      schematicSvg: reportSchematicSvg,
      isSchematicEdited: Boolean(schematicData?.editedSvg),
      isSchematicGenerating: isGenerating,
      onEditSchematic: handleEditSchematic,
      onRegenerateSchematic: handleRegenerateSchematic,
    };

    switch (projectType) {
      case "lighting-project":
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

      case "disaster-prevention-project":
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

      case "signboard-project":
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

      case "multi-purpose-project":
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
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <EmptyReport width={160} height={120} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-slate-700 mb-3">
              No report generated yet
            </h1>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              Complete a calculation and fill in the cover details
              <br />
              to generate your first report.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={onBackCalculation}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white rounded-lg shadow-sm hover:brightness-110 transition-all duration-200 font-medium text-base focus:outline-none focus:ring-2 focus:ring-[#3399cc]/50"
              >
                <Calculator className="w-5 h-5" />
                Go to Calculation
              </button>
            </div>
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
            {/* Back Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onBackRequest}
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors hp:px-3 hp:py-1.5 cursor-pointer"
                title="Back to Request Detail"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hp:hidden">Request Detail</span>
              </button>

              {draftId && (
                <button
                  onClick={onBackCalculation}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-white text-[#0d3b66] border border-[#0d3b66] rounded-lg hover:bg-blue-50 transition-colors hp:px-3 hp:py-1.5 cursor-pointer"
                  title="Back to Calculation Form"
                >
                  <Calculator className="w-4 h-4" />
                  <span className="hp:hidden">Calculation</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 hp:gap-2">
              {/* Delete button hidden as requested */}
              {false && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete Report"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors hp:px-3 hp:py-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hp:hidden">Delete Report</span>
                </button>
              )}

              {/* Edit Cover Information Button */}
              <button
                onClick={() => setShowEditCoverModal(true)}
                title="Edit Report Cover Information"
                className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white text-[#0d3b66] border border-[#0d3b66] rounded-lg hover:bg-blue-50 transition-all shadow-sm hp:px-3 hp:py-2 cursor-pointer font-medium"
              >
                <FileEdit className="w-4 h-4 text-[#0d3b66]" />
                <span className="hp:hidden">Edit Cover Information</span>
              </button>

              {/* Save to Database — hidden for now, re-enable when ready */}
              {false && (
                <button
                  onClick={() => setShowDbModal(true)}
                  title="Save to Database"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm bg-white text-[#3399cc] border border-[#3399cc] rounded-lg hover:bg-blue-50 transition-all shadow-sm hp:px-3 hp:py-2"
                >
                  <Database className="w-4 h-4" />
                  <span className="hp:hidden">Save to Database</span>
                </button>
              )}

              <button
                onClick={handlePrint}
                title="Export PDF"
                className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white rounded-lg hover:brightness-110 transition-all shadow-sm hp:px-3 hp:py-2 cursor-pointer"
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

      <ConfirmSaveDatabaseModal
        open={showDbModal}
        onClose={() => setShowDbModal(false)}
        onConfirm={handleConfirmSaveDb}
      />

      {/* Schematic SVG-Edit Modal (Iframe always mounted & ready) */}
      <SchematicEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        iframeRef={iframeRef}
        schematicUrl={DEFAULT_SCHEMATIC_URL}
        onOpenEditor={openEditor}
        onReset={handleRegenerateSchematic}
        isEdited={Boolean(schematicData?.editedSvg)}
      />

      {/* Cover Form Modal for editing report cover information */}
      <CoverFormModal
        open={showEditCoverModal}
        onClose={() => setShowEditCoverModal(false)}
        projectType={projectType}
        onConfirm={handleSaveCover}
        isEditMode={true}
      />
    </div>
  );
}
