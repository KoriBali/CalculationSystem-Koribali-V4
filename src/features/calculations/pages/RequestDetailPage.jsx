// Request Detail — where a request lands after the New Request form, and
// where its work is organised: the request at a glance, who works on it,
// its cases (each opens a calculation or drawing draft) and its files.
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, SearchX } from "lucide-react";

import { useState, useRef } from "react";
import InitialAssignment from "../components/requests/InitialAssignment";
import { RequestCases } from "../components/requests/detail/RequestCases";
import { RequestFiles } from "../components/requests/detail/RequestFiles";
import { RequestSummary } from "../components/requests/detail/RequestSummary";
import { DesignConditionsSection } from "../components/requests/detail/DesignConditionsSection";
import { ToastModal } from "../components/modals/ToastModal";
import {
  SectionCard,
  SectionTitle,
} from "../components/requests/form/FormPrimitives";
import { projectTypeLabel } from "../constants/projectTypes";
import {
  COVER_TYPE_OPTIONS,
  REQUEST_TYPE_OPTIONS,
} from "../constants/requestFormOptions";
import { REQUEST_HEADLINE, requestNoOf } from "../constants/requestSummary";
import { MOCK_WORKERS } from "../data/requestFormMocks";
import { fileRecord, forgetFileBlob } from "../data/requestStore";
import { useRequestRecord } from "../hooks/useRequestRecord";
import { createCase } from "../utils/requestCases";
import { deserializeWorkingSession } from "../utils/coreLogic";
import { getUser } from "../../../utils/auth";
import { Check, X } from "lucide-react";

const BACK_BUTTON =
  "self-start flex shrink-0 items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap text-white px-3 py-2 sm:px-4 rounded-lg hp:rounded-md text-xs sm:text-sm font-medium border border-white/20 hover:bg-white/10 active:bg-white/15 transition";

const labelOf = (options, value, key = "value") =>
  options.find((o) => o[key] === value)?.label;

function Chip({ children }) {
  return (
    <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-white/10 ring-1 ring-inset ring-white/15 text-[11px] sm:text-xs font-medium text-white/90">
      {children}
    </span>
  );
}

function NotFound({ onBack }) {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-2 py-16 flex flex-col items-center text-center">
      <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400">
        <SearchX className="w-6 h-6" />
      </div>
      <p className="mt-4 text-base font-semibold text-slate-800">
        Request not found
      </p>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        It may have been created in another browser tab. Requests are only kept
        in this tab until the requests API is connected.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-5 h-9 px-4 rounded-lg text-sm font-medium bg-[#0d3b66] text-white hover:bg-[#0b3157]"
      >
        Back to Requests
      </button>
    </div>
  );
}

export default function RequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [request, update] = useRequestRecord(requestId);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastModal, setToastModal] = useState(null);
  const designConditionsRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleBeforeAddCase = () => {
    if (designConditionsRef.current) {
      const { isValid, firstMsg } =
        designConditionsRef.current.triggerValidation();
      if (!isValid) {
        if (firstMsg) {
          setToastModal({ message: firstMsg });
        }
        const section = document.getElementById("design-conditions-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return false;
      }
    } else if (!request.designConditions?.isSaved) {
      setToastModal({ message: "Design Standard is required" });
      const section = document.getElementById("design-conditions-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
    return true;
  };

  if (!request) return <NotFound onBack={() => navigate("/requests")} />;

  const headline = REQUEST_HEADLINE[request.coverType];
  const requestNo = requestNoOf(request);
  const me = getUser()?.name || "Rani Putri";

  // Add Case handler
  const handleAddCase = (workType, details = {}) => {
    let createdId = null;
    update((r) => {
      const newCase = createCase(r, workType, {
        ...details,
        owner: details.owner || me,
        createdBy: me,
      });
      createdId = newCase.id;
      return {
        ...r,
        cases: [...(r.cases || []), newCase],
      };
    });
    return createdId;
  };

  // Update Case handler
  const handleUpdateCase = (caseId, updates) => {
    update((r) => ({
      ...r,
      cases: (r.cases || []).map((c) =>
        c.id === caseId
          ? {
              ...c,
              ...updates,
              lastEdited: updates.lastEdited || new Date().toISOString(),
              lastEditedBy: updates.lastEditedBy || me,
            }
          : c,
      ),
    }));
  };

  // Delete Case handler
  const handleDeleteCase = (caseId) => {
    update((r) => ({
      ...r,
      cases: (r.cases || []).filter((c) => c.id !== caseId),
    }));
  };

  // Open Case draft
  const handleOpenCase = (c) => {
    if (!request.designConditions?.isSaved) {
      setToastMessage("Please configure and save Design Conditions before opening a calculation case.");
      return;
    }
    sessionStorage.setItem("projectType", request.projectType);
    const isOwner = c.owner === me;
    if (isOwner) {
      sessionStorage.removeItem("case_read_only");
    } else {
      sessionStorage.setItem("case_read_only", "true");
    }

    // Ensure draft data in sessionStorage contains designConditions and poleType
    const draftKey = `${request.projectType}_draft_data_${c.id}`;
    const rawDraft = sessionStorage.getItem(draftKey);
    let draftObj = null;
    if (rawDraft) {
      try {
        draftObj = JSON.parse(rawDraft);
      } catch {
        draftObj = null;
      }
    }
    const designConditions = request.designConditions || {};
    const poleKind = c.poleKind || (request.projectType === "lighting-project" ? "standard" : "custom");
    const isStandard = poleKind === "standard";

    if (!draftObj) {
      const initialCondition = {
        designStandard: designConditions.standard || "jil",
        designWindSpeed: designConditions.windSpeed || "60",
        designAirDensity: designConditions.airDensity || "1.23",
        poleType: poleKind,
        openingEnabled: isStandard ? true : false,
        baseplateEnabled: isStandard ? true : false,
        foundationEnabled: false,
      };
      const initialDrawingGeneral = {
        drawingType: c.drawingType || (c.workType === "drawing" ? "Approval" : ""),
        drawingNumber: "",
        partNumber: "",
        openingDirection: "",
        lightingCompanyName: "",
        poleType: isStandard ? "Standard Pole" : "Custom Pole",
        additionalComponents: {
          opening: isStandard ? true : false,
          baseplate: isStandard ? true : false,
          foundation: false,
        },
        useCoupling: null,
      };
      sessionStorage.setItem(
        draftKey,
        JSON.stringify({
          workflow: JSON.stringify({
            projectMode: c.workType === "drawing" ? "drawing" : "calculation",
            withReport: false,
          }),
          projectIdentity: JSON.stringify({
            projectName: request.fields?.projectName || "",
            subject: request.fields?.subject || "",
          }),
          condition: JSON.stringify(initialCondition),
          drawing_general: JSON.stringify(initialDrawingGeneral),
        }),
      );
    } else {
      try {
        const curCond = draftObj.condition ? JSON.parse(draftObj.condition) : {};
        curCond.designStandard = curCond.designStandard || designConditions.standard || "jil";
        curCond.designWindSpeed = curCond.designWindSpeed || designConditions.windSpeed || "60";
        curCond.designAirDensity = curCond.designAirDensity || designConditions.airDensity || "1.23";
        curCond.poleType = curCond.poleType || poleKind;
        if (curCond.poleType === "standard") {
          curCond.openingEnabled = true;
          curCond.baseplateEnabled = true;
        }
        draftObj.condition = JSON.stringify(curCond);
        sessionStorage.setItem(draftKey, JSON.stringify(draftObj));
      } catch {
        // ignore
      }
    }

    const targetPath =
      c.workType === "drawing"
        ? `/requests/${request.projectType}/${c.id}/drawing/drawing-setup`
        : `/requests/${request.projectType}/${c.id}/initial`;
    navigate(targetPath);
  };

  const handleViewCaseReport = (c) => {
    sessionStorage.setItem("projectType", request.projectType);
    sessionStorage.setItem(`${request.projectType}_active_draft_id`, c.id);
    const draftKey = `${request.projectType}_draft_data_${c.id}`;
    const rawDraft = sessionStorage.getItem(draftKey);
    if (rawDraft) {
      try {
        const draftObj = JSON.parse(rawDraft);
        deserializeWorkingSession(request.projectType, draftObj);
      } catch (err) {
        console.error("Failed to deserialize draft for report:", err);
      }
    }
    navigate(`/requests/${request.projectType}/${c.id}/report`);
  };

  // Save Design Conditions handler
  const handleSaveDesignConditions = (conditions) => {
    update((r) => ({
      ...r,
      designConditions: {
        ...conditions,
        isSaved: true,
      },
      fields: {
        ...(r.fields || {}),
        standard: conditions.standard,
        airDensity: conditions.airDensity,
        windSpeed: conditions.windSpeed,
      },
    }));
  };

  const uploadFiles = (tabKey, files) =>
    update((r) => ({
      ...r,
      files: {
        ...r.files,
        [tabKey]: [
          ...(r.files[tabKey] ?? []),
          ...files.map((f) => fileRecord(f, me)),
        ],
      },
    }));

  const removeFile = (tabKey, file) => {
    forgetFileBlob(file.id);
    update((r) => ({
      ...r,
      files: {
        ...r.files,
        [tabKey]: r.files[tabKey].filter((f) => f.id !== file.id),
      },
    }));
  };

  const hasCalc = Boolean(request.workTypes?.calc);

  const chips = [
    request.coverType !== "yp" && labelOf(COVER_TYPE_OPTIONS, request.coverType, "id"),
    projectTypeLabel(request.projectType),
    [
      request.workTypes?.calc && "Calculation",
      request.workTypes?.drawing && "Drawing",
    ]
      .filter(Boolean)
      .join(" & "),
    labelOf(REQUEST_TYPE_OPTIONS, request.fields?.requestType),
  ].filter(Boolean);

  return (
    <div className="flex flex-col h-full min-h-screen relative">
      <Helmet>
        <title>{requestNo || "Request"} - KORI BALI</title>
      </Helmet>

      {/* ── Toast notification banner (Temporarily hidden as requested) ── */}
      {/* {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )} */}

      <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50">
        {/* ── Header: same blue card and width as the New Request form ── */}
        <div className="w-full max-w-[1440px] mx-auto px-2">
          <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] shadow-sm px-3 py-3 sm:px-4 sm:py-4 md:px-6 2xl:px-8 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => navigate("/requests")}
              className={BACK_BUTTON}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              Back to Requests
            </button>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-white/60">Request No.</p>
              <h1 className="mt-0.5 text-lg sm:text-xl lg:text-2xl font-semibold text-white break-words">
                {requestNo || "—"}
              </h1>
              {request.fields?.[headline.title] && (
                <p className="mt-1 text-sm sm:text-base text-white/80 break-words">
                  {request.fields[headline.title]}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <Chip key={chip}>{chip}</Chip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1440px] mx-auto pt-6 pb-24 sm:pb-8 px-2 space-y-4 md:space-y-6">
          {/* ── Section: Request Summary ── */}
          <div>
            <SectionTitle>Request Summary</SectionTitle>
            <SectionCard>
              <RequestSummary
                request={request}
                onEdit={() => navigate(`/requests/edit/${request.id}`)}
              />
            </SectionCard>
          </div>

          {/* ── Section 1: Design Conditions (Only if calculation is on) ── */}
          {hasCalc && (
            <div id="design-conditions-section">
              <SectionTitle>
                Design Conditions for Calculation Cases
              </SectionTitle>
              <SectionCard>
                <DesignConditionsSection
                  ref={designConditionsRef}
                  request={request}
                  onSave={handleSaveDesignConditions}
                  onToast={showToast}
                  onShowToastModal={(msg) => setToastModal({ message: msg })}
                />
              </SectionCard>
            </div>
          )}

          {/* ── Section: Assignment ── */}
          <div>
            <SectionTitle>Assignment</SectionTitle>
            <SectionCard>
              <InitialAssignment
                members={request.members || []}
                onChange={(members) => {
                  update((r) => ({ ...r, members }));
                  showToast("Assignment updated successfully.");
                }}
                workers={MOCK_WORKERS}
              />
            </SectionCard>
          </div>

          {/* ── Section 2: Cases ── */}
          <div>
            <SectionTitle>Cases</SectionTitle>
            <SectionCard>
              <RequestCases
                request={request}
                onAddCase={handleAddCase}
                onUpdateCase={handleUpdateCase}
                onDeleteCase={handleDeleteCase}
                onOpenCase={handleOpenCase}
                onViewReport={handleViewCaseReport}
                onToast={showToast}
                onBeforeAddCase={handleBeforeAddCase}
              />
            </SectionCard>
          </div>

          {/* ── Section: Files ── */}
          <div>
            <SectionTitle>Files</SectionTitle>
            <SectionCard>
              <RequestFiles
                files={request.files || {}}
                onUpload={uploadFiles}
                onRemove={removeFile}
              />
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Toast Modal (Warning Alert Popup like in Gambar 2) */}
      <ToastModal toast={toastModal} onClose={() => setToastModal(null)} />
    </div>
  );
}
