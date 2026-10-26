// Request Detail — where a request lands after the New Request form, and
// where its work is organised: the request at a glance, who works on it,
// its cases (each opens a calculation or drawing draft) and its files.
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, SearchX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import InitialAssignment from "../components/requests/InitialAssignment";
import { RequestCases } from "../components/requests/detail/RequestCases";
import { RequestFiles } from "../components/requests/detail/RequestFiles";
import { RequestSummary } from "../components/requests/detail/RequestSummary";
import { DesignConditionsSection } from "../components/requests/detail/DesignConditionsSection";
import { DrawingConditionsSection } from "../components/requests/detail/DrawingConditionsSection";
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
import {
  deleteCalculationCase,
  deleteDrawingCase,
  getRequestById,
  defineCalculationConditions,
  updateCalculationConditions,
  defineDrawingConditions,
  updateDrawingConditions,
} from "../services/requestService";
import { deserializeWorkingSession } from "../utils/coreLogic";
import { getUser, isGuestUser } from "../../../utils/auth";
import {
  resolveDesignStandardId,
  resolveDesignStandardCode,
  resolveRegionId,
  resolveRegionCode,
  canonicalDrawingType,
  mapDrawingType,
  isUuid,
} from "../utils/requestPayloadMapper";
import {
  getMasterDesignStandards,
  getMasterRegions,
} from "../services/masterDataService";
import {
  STANDARD_OPENING_TYPE,
  STANDARD_BOX_TYPE,
  STANDARD_BASEPLATE_TYPE,
  STANDARD_FOUR_RIB_TYPE,
} from "../constants/standardPoleDefaults";

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
        Back to Projects
      </button>
    </div>
  );
}

export default function RequestDetailPage() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [request, update] = useRequestRecord(requestId);
  const [toastModal, setToastModal] = useState(null);
  const [isEditingConditions, setIsEditingConditions] = useState(false);
  const designConditionsRef = useRef(null);
  const [isEditingDrawingConditions, setIsEditingDrawingConditions] = useState(false);
  const drawingConditionsRef = useRef(null);

  const showToast = () => {};

  const handleBeforeAddCase = (targetWorkType) => {
    if (targetWorkType === "drawing") {
      const isDrawingUnsaved =
        !request.drawingConditions?.isSaved ||
        isEditingDrawingConditions ||
        drawingConditionsRef.current?.isEditing;

      if (isDrawingUnsaved) {
        const msg =
          (drawingConditionsRef.current &&
            drawingConditionsRef.current.triggerValidation()?.firstMsg) ||
          "Please save Design Conditions for Drawing Cases first before adding drawing cases.";
        setToastModal({
          title: "Drawing Conditions Required",
          message: msg,
          type: "warning",
        });
        const section = document.getElementById("drawing-conditions-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return false;
      }
    } else {
      const isUnsaved =
        !request.designConditions?.isSaved ||
        isEditingConditions ||
        designConditionsRef.current?.isEditing;

      if (isUnsaved) {
        const msg =
          (designConditionsRef.current &&
            designConditionsRef.current.triggerValidation()?.firstMsg) ||
          "Please save Design Conditions for Calculation Cases first before adding calculation cases.";
        setToastModal({
          title: "Design Conditions Required",
          message: msg,
          type: "warning",
        });
        const section = document.getElementById("design-conditions-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return false;
      }
    }
    return true;
  };

  if (!request) return <NotFound onBack={() => navigate("/projects")} />;

  const headline = REQUEST_HEADLINE[request.coverType];
  const currentUser = getUser() || {};
  const currentUserName = currentUser.name || currentUser.username || "";
  const me = currentUserName || "Bintarjo Agus Priyadi";
  const userRole = (currentUser.role || "").toLowerCase();

  // Admin Department check (admin, superadmin, admin_department, admin_departement)
  const isAdminDepartment =
    userRole === "admin" ||
    userRole === "superadmin" ||
    userRole === "admin_department" ||
    userRole === "admin_departement";

  // Creator check: user who created the project
  const creatorName =
    (request.members || []).find((m) => m.isCreator)?.name ||
    request.createdBy ||
    request.createdByName ||
    request.fields?.createdBy ||
    "";

  const isCreator =
    Boolean(creatorName) &&
    Boolean(currentUserName) &&
    (creatorName.toLowerCase() === currentUserName.toLowerCase() ||
      creatorName.toLowerCase() === (currentUser.username || "").toLowerCase());

  // Only project creator or department admin can edit the project
  const canEditProject = isCreator || isAdminDepartment;

  // Member check: user assigned to the project members list
  const isAssignedMember =
    Boolean(currentUserName) &&
    (request.members || []).some(
      (m) =>
        (m.name && m.name.toLowerCase() === currentUserName.toLowerCase()) ||
        (currentUser.username && m.name && m.name.toLowerCase() === currentUser.username.toLowerCase()) ||
        (currentUser.id && m.id === currentUser.id),
    );

  // Can contribute: creator, admin department, or assigned member
  const canContribute = isCreator || isAdminDepartment || isAssignedMember;

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

  // Helper to ensure changing between standard and custom starts with completely fresh/empty inputs
  const resetDraftForPoleKindSwitch = (draftObj, newPoleKind, projectType) => {
    if (!draftObj) return;
    const isCustom = newPoleKind === "custom";

    // Common keys to clear when switching pole types
    delete draftObj.results;
    delete draftObj.reportSnapshot;
    delete draftObj.hasReport;
    delete draftObj.calculatedOp;
    delete draftObj.calculatedBaseplate;
    delete draftObj.calculatedFoundation;
    delete draftObj.directObjects;
    delete draftObj.overheadWires;
    delete draftObj.arms;
    delete draftObj.armObjects;
    sessionStorage.removeItem(`${projectType}_standardTaperPoleKey`);

    const curCond = draftObj.condition ? JSON.parse(draftObj.condition) : {};
    curCond.poleType = newPoleKind;

    if (isCustom) {
      // Switched from standard to custom: wipe all standard specifications
      delete draftObj.poleStandard;
      delete draftObj.taperPoleStandard;
      delete draftObj.straightPoleStandard;
      delete draftObj.openingType;
      delete draftObj.boxType;
      delete draftObj.baseplateType;
      delete draftObj.fourRibType;
      curCond.openingEnabled = false;
      curCond.baseplateEnabled = false;
      curCond.foundationEnabled = false;
    } else {
      // Switched from custom to standard: wipe all custom pole specifications and re-init standard templates
      delete draftObj.poles;
      delete draftObj.poleConfig;
      curCond.openingEnabled = true;
      curCond.baseplateEnabled = true;
      curCond.foundationEnabled = false;
      draftObj.openingType = JSON.stringify(STANDARD_OPENING_TYPE);
      draftObj.boxType = JSON.stringify(STANDARD_BOX_TYPE);
      draftObj.baseplateType = JSON.stringify(STANDARD_BASEPLATE_TYPE);
      draftObj.fourRibType = JSON.stringify(STANDARD_FOUR_RIB_TYPE);
    }

    if (draftObj.drawing_general) {
      try {
        const dg = JSON.parse(draftObj.drawing_general);
        dg.poleType = isCustom ? "Custom Pole" : "Standard Pole";
        dg.additionalComponents = {
          opening: !isCustom,
          baseplate: !isCustom,
          foundation: false,
        };
        draftObj.drawing_general = JSON.stringify(dg);
      } catch {}
    }

    draftObj.condition = JSON.stringify(curCond);
    draftObj.calculation_config = JSON.stringify({
      pole: true,
      opening: !!curCond.openingEnabled,
      baseplate: !!curCond.baseplateEnabled,
      foundation: !!curCond.foundationEnabled,
    });
  };

  // Update Case handler
  const handleUpdateCase = (caseId, updates) => {
    const existingCase = (request.cases || []).find((c) => c.id === caseId);
    const poleKindChanged = Boolean(
      updates.poleKind && existingCase && existingCase.poleKind !== updates.poleKind,
    );

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

    // If poleKind or title is updated, sync directly into existing draft payload in sessionStorage
    if (updates.poleKind || updates.title || updates.caseLabel || updates.case_label) {
      try {
        const draftKey = `${request.projectType}_draft_data_${caseId}`;
        const rawDraft = sessionStorage.getItem(draftKey);
        if (rawDraft) {
          const draftObj = JSON.parse(rawDraft);
          if (poleKindChanged) {
            resetDraftForPoleKindSwitch(draftObj, updates.poleKind, request.projectType);
          } else if (updates.poleKind) {
            const curCond = draftObj.condition ? JSON.parse(draftObj.condition) : {};
            curCond.poleType = updates.poleKind;
            draftObj.condition = JSON.stringify(curCond);
            draftObj.calculation_config = JSON.stringify({
              pole: true,
              opening: !!curCond.openingEnabled,
              baseplate: !!curCond.baseplateEnabled,
              foundation: !!curCond.foundationEnabled,
            });
          }
          sessionStorage.setItem(draftKey, JSON.stringify(draftObj));

          // If this case is currently the active working session, also sync the active session
          const activeDraftId = sessionStorage.getItem(`${request.projectType}_active_draft_id`);
          if (activeDraftId === caseId) {
            deserializeWorkingSession(request.projectType, draftObj);
          }
        }
      } catch (err) {
        console.error("Failed to sync case updates to draft storage:", err);
      }
    }
  };

  // Delete Case handler
  const handleDeleteCase = async (caseId) => {
    const targetCase = (request.cases || []).find((c) => c.id === caseId);

    update((r) => ({
      ...r,
      cases: (r.cases || []).filter((c) => c.id !== caseId),
    }));

    try {
      if (targetCase?.workType === "drawing") {
        await deleteDrawingCase(request.id, caseId);
      } else {
        await deleteCalculationCase(request.id, caseId);
      }
    } catch (err) {
      console.debug("[handleDeleteCase] Gateway delete call skipped/failed:", err?.message);
    }
  };

  // Open Case draft
  const handleOpenCase = (c) => {
    if (c.workType === "drawing") {
      const isDrawingUnsaved =
        !request.drawingConditions?.isSaved ||
        isEditingDrawingConditions ||
        drawingConditionsRef.current?.isEditing;

      if (isDrawingUnsaved) {
        setToastModal({
          title: "Drawing Conditions Required",
          message:
            "Please save Design Conditions for Drawing Cases first before opening drawing cases.",
          type: "warning",
        });
        const section = document.getElementById("drawing-conditions-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    } else {
      const isUnsaved =
        !request.designConditions?.isSaved ||
        isEditingConditions ||
        designConditionsRef.current?.isEditing;

      if (isUnsaved) {
        setToastModal({
          title: "Design Conditions Required",
          message:
            "Please save Design Conditions first before opening calculation cases.",
          type: "warning",
        });
        const section = document.getElementById("design-conditions-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }
    sessionStorage.setItem("projectType", request.projectType);
    const isOwner = Boolean(
      (c.owner && me && c.owner.toLowerCase() === me.toLowerCase()) ||
      (currentUser?.username && c.owner && c.owner.toLowerCase() === currentUser.username.toLowerCase())
    );
    const isLockedStatus =
      c.status === "Ready for check" ||
      c.status === "ready_check" ||
      c.status === "Checked" ||
      c.status === "Ready to submit" ||
      c.status === "ready_submit" ||
      c.status === "Submitted" ||
      c.status === "submitted" ||
      c.status === "Cleared" ||
      c.status === "cleared";

    if (isOwner && !isLockedStatus) {
      sessionStorage.removeItem("case_read_only");
      if (c.status === "Not started" || !c.status) {
        handleUpdateCase(c.id, {
          status: "In progress",
          lastEdited: new Date().toISOString(),
          lastEditedBy: me,
        });
      }
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

    let activeDraft = draftObj;
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
        drawingType:
          request.drawingConditions?.drawingType ||
          c.drawingType ||
          (c.workType === "drawing" ? "Approval" : ""),
        region: request.drawingConditions?.region || "east_japan",
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
      const draftPayload = {
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
        drawing_coupling_location: JSON.stringify(request.drawingConditions?.region || "east_japan"),
      };
      if (isStandard) {
        draftPayload.openingType = JSON.stringify(STANDARD_OPENING_TYPE);
        draftPayload.boxType = JSON.stringify(STANDARD_BOX_TYPE);
        draftPayload.baseplateType = JSON.stringify(STANDARD_BASEPLATE_TYPE);
        draftPayload.fourRibType = JSON.stringify(STANDARD_FOUR_RIB_TYPE);
      }
      sessionStorage.setItem(draftKey, JSON.stringify(draftPayload));
      activeDraft = draftPayload;
    } else {
      try {
        const curCond = draftObj.condition ? JSON.parse(draftObj.condition) : {};
        curCond.designStandard = curCond.designStandard || designConditions.standard || "jil";
        curCond.designWindSpeed = curCond.designWindSpeed || designConditions.windSpeed || "60";
        curCond.designAirDensity = curCond.designAirDensity || designConditions.airDensity || "1.23";
        const prevPoleType = curCond.poleType;
        if (prevPoleType && prevPoleType !== poleKind) {
          resetDraftForPoleKindSwitch(draftObj, poleKind, request.projectType);
        } else {
          curCond.poleType = poleKind;
          if (curCond.poleType === "standard") {
            curCond.openingEnabled = true;
            curCond.baseplateEnabled = true;
            if (!draftObj.openingType) {
              draftObj.openingType = JSON.stringify(STANDARD_OPENING_TYPE);
            }
            if (!draftObj.boxType) {
              draftObj.boxType = JSON.stringify(STANDARD_BOX_TYPE);
            }
            if (!draftObj.baseplateType) {
              draftObj.baseplateType = JSON.stringify(STANDARD_BASEPLATE_TYPE);
            }
            if (!draftObj.fourRibType) {
              draftObj.fourRibType = JSON.stringify(STANDARD_FOUR_RIB_TYPE);
            }
          }
          if (draftObj.drawing_general) {
            try {
              const dg = JSON.parse(draftObj.drawing_general);
              dg.poleType = isStandard ? "Standard Pole" : "Custom Pole";
              if (request.drawingConditions?.drawingType) {
                dg.drawingType = request.drawingConditions.drawingType;
              } else if (!dg.drawingType && c.drawingType) {
                dg.drawingType = c.drawingType;
              }
              if (request.drawingConditions?.region) {
                dg.region = request.drawingConditions.region;
                draftObj.drawing_coupling_location = JSON.stringify(request.drawingConditions.region);
              }
              draftObj.drawing_general = JSON.stringify(dg);
            } catch {}
          }
          draftObj.condition = JSON.stringify(curCond);
          draftObj.calculation_config = JSON.stringify({
            pole: true,
            opening: !!curCond.openingEnabled,
            baseplate: !!curCond.baseplateEnabled,
            foundation: !!curCond.foundationEnabled,
          });
        }

        // Cleanse incomplete reports: if calculation steps haven't all finished or cover report info is missing
        const hasPole = Boolean(draftObj.results);
        const hasOp = !curCond.openingEnabled || Boolean(draftObj.calculatedOp);
        const hasBp = !curCond.baseplateEnabled || Boolean(draftObj.calculatedBaseplate);
        const hasFd = !curCond.foundationEnabled || Boolean(draftObj.calculatedFoundation);
        let rawCover = null;
        try {
          rawCover = draftObj.cover
            ? typeof draftObj.cover === "string"
              ? JSON.parse(draftObj.cover)
              : draftObj.cover
            : null;
        } catch {
          rawCover = null;
        }
        const hasCoverInfo = Boolean(
          rawCover &&
            (rawCover.reportNumber?.trim() || rawCover.calculationNumber?.trim()) &&
            rawCover.author?.trim() &&
            (rawCover.responsibleDepartment?.trim() || rawCover.region?.trim())
        );

        if (!hasPole || !hasOp || !hasBp || !hasFd || !hasCoverInfo) {
          delete draftObj.reportSnapshot;
          delete draftObj.hasReport;
        }

        draftObj.condition = JSON.stringify(curCond);
        sessionStorage.setItem(draftKey, JSON.stringify(draftObj));
        activeDraft = draftObj;
      } catch {
        // ignore
      }
    }

    deserializeWorkingSession(request.projectType, activeDraft);
    sessionStorage.setItem(`${request.projectType}_active_draft_id`, c.id);

    const targetPath =
      c.workType === "drawing"
        ? `/projects/${request.projectType}/${c.id}/drawing/drawing-setup`
        : `/projects/${request.projectType}/${c.id}/initial`;
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
    navigate(`/projects/${request.projectType}/${c.id}/report`);
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getMasterDesignStandards().catch(() => []),
      getMasterRegions().catch(() => []),
    ]).then(([standards, regions]) => {
      if (!isMounted) return;

      if (!isGuestUser() && isUuid(requestId)) {
        getRequestById(requestId)
          .then((serverData) => {
            if (serverData && isMounted) {
              update((r) => {
                const serverCalcCond =
                  serverData.calculationConditions ||
                  serverData.conditions ||
                  null;
                const serverDrawingCond =
                  serverData.drawingConditions ||
                  null;

                const rawStandard =
                  serverCalcCond?.designStandardId ||
                  serverCalcCond?.standard ||
                  serverData.fields?.standard ||
                  r?.designConditions?.standard;
                const resolvedStandard =
                  resolveDesignStandardCode(rawStandard, standards) || "jil";

                const rawDrawingType =
                  serverDrawingCond?.drawingType ||
                  serverData.fields?.drawingType ||
                  r?.drawingConditions?.drawingType;
                const resolvedDrawingType =
                  canonicalDrawingType(rawDrawingType) || "APD (Approval Drawing)";

                const rawRegion =
                  serverDrawingCond?.regionId ||
                  serverDrawingCond?.region ||
                  serverData.fields?.region ||
                  r?.drawingConditions?.region;
                const resolvedRegion =
                  resolveRegionCode(rawRegion, regions) || "east_japan";

                return {
                  ...r,
                  ...serverData,
                  // Keep the original Cover Information in fields intact as immutable reference
                  fields: {
                    ...(serverData.fields || {}),
                    ...(r?.fields || {}),
                  },
                  designConditions: serverCalcCond
                    ? {
                        standard: resolvedStandard,
                        windSpeed:
                          serverCalcCond.windSpeed != null
                            ? String(serverCalcCond.windSpeed)
                            : r?.designConditions?.windSpeed || "60",
                        airDensity:
                          serverCalcCond.airDensity != null
                            ? String(serverCalcCond.airDensity)
                            : r?.designConditions?.airDensity || "1.23",
                        isSaved: true,
                        isSavedOnServer: true,
                      }
                    : r?.designConditions,
                  drawingConditions: serverDrawingCond
                    ? {
                        drawingType: resolvedDrawingType,
                        region: resolvedRegion,
                        isSaved: true,
                        isSavedOnServer: true,
                      }
                    : r?.drawingConditions,
                };
              });
            }
          })
          .catch((err) => {
            console.warn("[RequestDetailPage] getRequestById fallback to local store:", err);
          });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  // Save Design Conditions handler
  const handleSaveDesignConditions = async (conditions) => {
    update((r) => ({
      ...r,
      isNewProject: false,
      designConditions: {
        ...conditions,
        isSaved: true,
      },
      // r.fields is intentionally NOT overwritten to preserve the original Cover Information reference
    }));

    if (!isGuestUser() && isUuid(requestId)) {
      try {
        const payload = {
          designStandardId: resolveDesignStandardId(conditions.standard),
          windSpeed: conditions.windSpeed ? Number(conditions.windSpeed) : null,
          airDensity: Number(conditions.airDensity),
        };

        if (request?.designConditions?.isSavedOnServer) {
          await updateCalculationConditions(requestId, payload);
        } else {
          try {
            await defineCalculationConditions(requestId, payload);
          } catch (err) {
            if (
              err.response?.status === 400 ||
              err.response?.status === 409 ||
              err.response?.status === 422
            ) {
              await updateCalculationConditions(requestId, payload);
            } else {
              throw err;
            }
          }
        }

        update((r) => ({
          ...r,
          designConditions: {
            ...(r.designConditions || {}),
            isSavedOnServer: true,
          },
        }));
      } catch (err) {
        console.error("Failed to save calculation conditions to API:", err);
      }
    }
  };

  // Save Drawing Conditions handler
  const handleSaveDrawingConditions = async (conditions) => {
    update((r) => ({
      ...r,
      isNewProject: false,
      drawingConditions: {
        ...conditions,
        isSaved: true,
      },
      // r.fields is intentionally NOT overwritten to preserve the original Cover Information reference
    }));

    if (!isGuestUser() && isUuid(requestId)) {
      try {
        const payload = {
          regionId: resolveRegionId(conditions.region),
          drawingType: mapDrawingType(conditions.drawingType) || "approval",
        };

        if (request?.drawingConditions?.isSavedOnServer) {
          await updateDrawingConditions(requestId, payload);
        } else {
          try {
            await defineDrawingConditions(requestId, payload);
          } catch (err) {
            if (
              err.response?.status === 400 ||
              err.response?.status === 409 ||
              err.response?.status === 422
            ) {
              await updateDrawingConditions(requestId, payload);
            } else {
              throw err;
            }
          }
        }

        update((r) => ({
          ...r,
          drawingConditions: {
            ...(r.drawingConditions || {}),
            isSavedOnServer: true,
          },
        }));
      } catch (err) {
        console.error("Failed to save drawing conditions to API:", err);
      }
    }
  };

  const uploadFiles = (tabKey, files, meta = {}) =>
    update((r) => ({
      ...r,
      files: {
        ...r.files,
        [tabKey]: [
          ...(r.files[tabKey] ?? []),
          ...files.map((f) => fileRecord(f, me, meta)),
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
  const hasDrawing = Boolean(request.workTypes?.drawing);
  const requestNo = requestNoOf(request);

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
        <title>{requestNo || "Project"} - KORI BALI</title>
      </Helmet>



      <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50">
        {/* ── Header: same blue card and width as the New Request form ── */}
        <div className="w-full max-w-[1440px] mx-auto px-2">
          <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] shadow-sm px-3 py-3 sm:px-4 sm:py-4 md:px-6 2xl:px-8 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className={BACK_BUTTON}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              Back to Projects
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
                onEdit={canEditProject ? () => navigate(`/projects/edit/${request.id}`) : null}
              />
            </SectionCard>
          </div>

          {/* ── Section 1: Design Conditions for Calculation Cases ── */}
          {hasCalc && (
            <div id="design-conditions-section">
              <SectionTitle>
                Design Conditions for Calculation Cases
              </SectionTitle>
              <SectionCard>
                <DesignConditionsSection
                  ref={designConditionsRef}
                  request={request}
                  canEdit={canContribute}
                  onSave={handleSaveDesignConditions}
                  onToast={showToast}
                  onShowToastModal={(msg) => setToastModal({ message: msg })}
                  onEditModeChange={setIsEditingConditions}
                />
              </SectionCard>
            </div>
          )}

          {/* ── Section 2: Design Conditions for Drawing Cases ── */}
          {hasDrawing && (
            <div id="drawing-conditions-section">
              <SectionTitle>
                Design Conditions for Drawing Cases
              </SectionTitle>
              <SectionCard>
                <DrawingConditionsSection
                  ref={drawingConditionsRef}
                  request={request}
                  canEdit={canContribute}
                  onSave={handleSaveDrawingConditions}
                  onToast={showToast}
                  onShowToastModal={(msg) => setToastModal({ message: msg })}
                  onEditModeChange={setIsEditingDrawingConditions}
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
                canManageMembers={canEditProject}
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
                canContribute={canContribute}
                onAddCase={handleAddCase}
                onUpdateCase={handleUpdateCase}
                onDeleteCase={handleDeleteCase}
                onOpenCase={handleOpenCase}
                onViewReport={handleViewCaseReport}
                onToast={showToast}
                onShowToastModal={(msg) => setToastModal({ message: msg })}
                onBeforeAddCase={handleBeforeAddCase}
              />
            </SectionCard>
          </div>

          {/* ── Section: References Related to This Project ── */}
          <div>
            <SectionTitle>
              References Related to This Project
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-normal text-slate-500 bg-slate-100 border border-slate-200 ml-2">
                Under Development
              </span>
            </SectionTitle>
            <SectionCard>
              <RequestFiles
                files={request.files || {}}
                cases={request.cases || []}
                request={request}
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
