import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FileText,
  UploadCloud,
  Check,
  CheckCircle,
  Circle,
  ChevronRight,
  ArrowLeft,
  X,
  Info,
  Sparkles,
  Loader2,
  RotateCcw,
} from "lucide-react";

import { PROJECT_TYPES } from "../constants/projectTypes";
import { FormSelect } from "../../../shared/components/FormSelect";
import { DateInput } from "../../../shared/components/DateInput";
import { ConfirmResetAllModal } from "../components/modals/ConfirmResetAllModal";
import { designStandardOptions } from "../constants/designStandards";
import { DRAWING_TYPE_OPTIONS } from "../constants/drawingTypeOptions";
import {
  CAD_FORMAT_OPTIONS,
  CALC_TYPE_OPTIONS,
  CLASSIFICATION_OPTIONS,
  COMPETITOR_OPTIONS,
  COVER_TYPE_OPTIONS,
  DELIVER_TYPE_OPTIONS,
  DESIGN_ORIGIN_OPTIONS,
  DRAFTING_OPTIONS,
  PAPER_FRAME_OPTIONS,
  PAPER_SIZE_OPTIONS,
  PLATING_OPTIONS,
  PLATING_PROVISO_OPTIONS,
  REQUEST_TYPE_OPTIONS,
  RESET_COPY,
  SCHEDULE_FLEX_OPTIONS,
  SCOPE_OPTIONS,
  coverConfirmCopy,
} from "../constants/requestFormOptions";
import {
  MOCK_COVER_EXTRACT,
  MOCK_EXTRACT_DELAY_MS,
  lookupDocumentHistory,
} from "../data/requestFormMocks";
import {
  DESIGN_REF_KEYS,
  DOCUMENT_NO_PREFIX_RE,
  documentNoProblem,
  NO_WORK_TYPES,
  REQUIRED_KEYS,
  YP_EMPTY,
  YS_EMPTY,
  YS_OPTIONAL_KEYS,
  creatorMember,
  disciplineValue,
  formatCoverValue,
  formatFileSize,
  getHistoryStatus,
  isKeyRelevant,
  parseDocumentNo,
  workTypesFrom,
} from "../utils/requestForm";
import {
  DISABLED_INPUT,
  inputStyle,
} from "../components/requests/form/formStyles";
import {
  Label,
  NotFoundHint,
  RequiredHint,
  SectionCard,
  SectionTitle,
  SubGroupTitle,
  UnitInput,
} from "../components/requests/form/FormPrimitives";
import { BtnGroup, CheckGroup } from "../components/requests/form/OptionGroups";
import { DisciplineCards } from "../components/requests/form/DisciplineCards";
import { ReferenceNote } from "../components/requests/form/ReferenceNote";
import { RequestNoBreakdown } from "../components/requests/form/RequestNoBreakdown";
import { RequestHistoryPanel } from "../components/requests/form/RequestHistoryPanel";
import { RequestNoteSection } from "../components/requests/form/RequestNoteSection";
import { useLeaveNewRequest } from "../hooks/useLeaveNewRequest";
import {
  createRequest,
  updateRequest,
  getRequest,
  fileRecord,
} from "../data/requestStore";
import { REQUEST_HEADLINE, requestNoOf } from "../constants/requestSummary";
import {
  clearNewRequestDraft,
  loadNewRequestDraft,
  saveNewRequestDraft,
} from "../utils/newRequestDraft";

// "Design Conditions" (design standard, wind speed, air density) is hidden
// for now; flip back to true to show it on both YP and YS.
const SHOW_DESIGN_CONDITIONS = false;

// "Required:" chips in the blue header — hidden for now; flip back to true
// to show them.
const SHOW_REQUIREMENT_CHIPS = false;

// YP Submission (提出先): Destination 1 › 2 › 3, as on the cover.
const SUBMISSION_CHAIN = [
  { key: "submitTo1", placeholder: "e.g. Sales dept." },
  { key: "submitTo2", placeholder: "e.g. Engineering dept." },
  { key: "submitTo3", placeholder: "e.g. Client" },
];

export default function NewRequestFormPage() {
  const navigate = useNavigate();
  // Project type was picked on /calculation/requests/new; it arrives via the URL or from requestId.
  const { type: paramType, requestId } = useParams();
  const existingRequest = useMemo(() => {
    return requestId ? getRequest(requestId) : null;
  }, [requestId]);

  const isEditMode = Boolean(requestId && existingRequest);
  const projectType = paramType || existingRequest?.projectType || "lighting-project";
  const project = PROJECT_TYPES.find((p) => p.id === projectType) || PROJECT_TYPES[0];
  // Same Standard list as the Condition form, per project type.
  const standardOptions = designStandardOptions[projectType] || [];

  // Back to Project Type asks first when the form has entries.
  const { leave, confirmProps: leaveConfirmProps } = useLeaveNewRequest();

  // State
  // Starts as the user left it when they come back from another menu (or
  // reload); fresh otherwise. Saved again on every change, see below.
  const [initial] = useState(() => {
    if (existingRequest) {
      const cType = existingRequest.coverType || "ys";
      return {
        coverType: cType,
        coverFile: null,
        lostCover: null,
        ys:
          cType === "ys"
            ? { ...YS_EMPTY, ...(existingRequest.fields || {}) }
            : YS_EMPTY,
        yp:
          cType === "yp"
            ? { ...YP_EMPTY, ...(existingRequest.fields || {}) }
            : YP_EMPTY,
        requestNotes: {
          yp: cType === "yp" ? existingRequest.note || "" : "",
          ys: cType === "ys" ? existingRequest.note || "" : "",
        },
        autoFillStatus: "idle",
        extracted: null,
        workTypes: existingRequest.workTypes || { calc: false, drawing: false },
        showDesignRef: true,
        docNoTouched: true,
      };
    }
    return loadNewRequestDraft(projectType);
  });
  // No default: the cover type decides the whole form, so the user picks it.
  // null until then — everything below Cover Type stays hidden.
  const [coverType, setCoverType] = useState(initial.coverType);
  // Cover PDF picked for auto-fill. Extraction is simulated on the FE
  // (MOCK_COVER_EXTRACT) until the BE endpoint exists.
  const [coverFile, setCoverFile] = useState(initial.coverFile);
  // Name of a cover lost on reload (files aren't kept): asked for again.
  const [lostCover, setLostCover] = useState(initial.lostCover);
  const coverInputRef = useRef(null);
  const competitorNameRef = useRef(null);
  // "Other" boxes next to their option: focused when it's picked.
  const scopeOtherRef = useRef(null);
  const paperSizeOtherRef = useRef(null);
  const cadFormatOtherRef = useRef(null);
  // Text box of the picked Additional Wording option (Special note / Reason).
  const provisoTextRefs = useRef({});
  const [ys, setYs] = useState(initial.ys);
  // Free-text note per cover type (kept apart from the cover's fields, so
  // auto-fill or removing the cover never touches it).
  const [requestNotes, setRequestNotes] = useState(initial.requestNotes);
  // "idle" | "loading" | "done"
  const [autoFillStatus, setAutoFillStatus] = useState(initial.autoFillStatus);
  // Values the cover gave (null until auto-fill runs). A field counts as
  // auto-filled while its value still equals this — edit it and it turns
  // into a normal field; type the same value back and it's auto-filled again.
  const [extracted, setExtracted] = useState(initial.extracted);
  // "overwrite" | "replace" | "remove" while a confirm dialog is open.
  const [coverConfirm, setCoverConfirm] = useState(null);
  const extractTimer = useRef(null);

  useEffect(() => () => clearTimeout(extractTimer.current), []);
  // YP fields. Like `ys`, only hidden (not cleared) on the other cover type.
  const [yp, setYp] = useState(initial.yp);

  const [workTypes, setWorkTypes] = useState(initial.workTypes);
  // YS Design Conditions are reference-only, so they start collapsed.
  const [showDesignRef, setShowDesignRef] = useState(initial.showDesignRef);
  const [showResetModal, setShowResetModal] = useState(false);
  // Bumped on Reset to remount the form body, which also clears the inputs
  // that aren't held in state yet (most YP fields).
  const [formKey, setFormKey] = useState(0);

  // YS fields (and the cover) are only hidden on YP, not cleared, so
  // switching back doesn't throw away the user's work.
  // Set by Save when a required field is empty: from then on empty required
  // fields show in red (and clear as they're filled in).
  const [showRequiredErrors, setShowRequiredErrors] = useState(false);
  // Switching cover type shows the other form fresh, without old errors.
  const selectCoverType = (id) => {
    setCoverType(id);
    setShowRequiredErrors(false);
  };

  const setYsField = (key) => (value) =>
    setYs((prev) => ({ ...prev, [key]: value }));
  const fieldValue = (key) =>
    key === "discipline" ? disciplineValue(workTypes) : ys[key];
  const isAutoFilled = (key) =>
    extracted !== null &&
    extracted[key] != null &&
    fieldValue(key) === extracted[key];
  // Cover had no value for it and the user hasn't filled it in yet.
  const isNotFound = (key) =>
    extracted !== null &&
    key in extracted &&
    extracted[key] === null &&
    fieldValue(key) === "";
  // Red only for required fields; optional ones may stay empty.
  const isMissingRequired = (key) =>
    isNotFound(key) && !YS_OPTIONAL_KEYS.has(key);
  const ysMissing = (key) =>
    isNotFound(key) ? (
      <NotFoundHint optional={YS_OPTIONAL_KEYS.has(key)} />
    ) : null;
  // Auto-filled fields whose value no longer matches the cover.
  // Not-found fields are left out: there's no cover value to go back to.
  // A field is in play unless it belongs to a discipline that's unticked.
  const isRelevant = (k) => isKeyRelevant(k, workTypes);
  const relevantExtractKeys = extracted
    ? Object.keys(extracted).filter(isRelevant)
    : [];
  const editedKeys = relevantExtractKeys.filter(
    (k) => extracted[k] !== null && fieldValue(k) !== extracted[k],
  );
  const restoreFields = (keys) => {
    if (keys.includes("discipline")) {
      setWorkTypes(workTypesFrom(extracted.discipline));
    }
    setYs((prev) => {
      const next = { ...prev };
      keys
        .filter((k) => k !== "discipline")
        .forEach((k) => {
          next[k] = extracted[k];
        });
      return next;
    });
  };

  // "↺ Use cover value" link for a label row; shown only once the field (or any of
  // the fields, for a shared label) differs from the cover.
  const ysRestore = (...keys) => {
    const edited = keys.filter((k) => editedKeys.includes(k));
    if (edited.length === 0) return null;
    const tooltip = `Cover value: ${edited
      .map((k) => formatCoverValue(k, extracted[k]))
      .join(" · ")}`;
    return (
      <button
        type="button"
        onClick={() => restoreFields(edited)}
        title={tooltip}
        className="inline-flex items-center gap-1 shrink-0 text-xs text-blue-600 hover:text-blue-700 hover:underline"
      >
        <RotateCcw className="w-3 h-3" />
        Use cover value
      </button>
    );
  };

  // Counts cover only the fields shown for the selected disciplines.
  const totalCount = relevantExtractKeys.length;
  const missingKeys = relevantExtractKeys.filter((k) => extracted[k] === null);
  const foundCount = totalCount - missingKeys.length;
  const missingRequired = missingKeys.filter(
    (k) => !YS_OPTIONAL_KEYS.has(k),
  ).length;
  const missingOptional = missingKeys.length - missingRequired;
  const plural = (n, one, many) => (n === 1 ? one : many);

  // Shown on the collapsed Design Conditions, so the user can tell there's
  // something inside without opening it.
  const designRefKeys = DESIGN_REF_KEYS.filter(isRelevant);
  const designRefFilled = designRefKeys.filter((k) => ys[k] !== "").length;

  // Is this required field still empty (for the form on screen)? Fields
  // with their own rule are listed in EMPTY_CHECKS; the rest are empty when
  // their value is "".
  const formValues = { yp, ys }[coverType] ?? {};
  const EMPTY_CHECKS = {
    discipline: () => !workTypes.calc && !workTypes.drawing,
    documentNo: () => !parseDocumentNo(yp.documentNo).valid,
  };
  const isRequiredEmpty = (key) =>
    (EMPTY_CHECKS[key] ?? (() => formValues[key] === ""))();
  const requiredKeys = REQUIRED_KEYS[coverType] ?? [];
  const missingRequiredKeys = requiredKeys.filter(isRequiredEmpty);
  // Red once Save has been tried.
  const fieldError = (key) =>
    showRequiredErrors && requiredKeys.includes(key) && isRequiredEmpty(key);
  // "*This field is required." — not when the YS auto-fill note already says
  // it's missing.
  const requiredHint = (key) =>
    fieldError(key) && !(coverType === "ys" && isMissingRequired(key)) ? (
      <RequiredHint floating={key !== "discipline"} />
    ) : null;

  const ysInput = (key) => ({
    value: ys[key],
    onChange: (e) => setYsField(key)(e.target.value),
    "data-field": key,
    className: inputStyle(
      isMissingRequired(key) || fieldError(key),
      isAutoFilled(key),
    ),
  });

  const setYpField = (key) => (value) =>
    setYp((prev) => ({ ...prev, [key]: value }));
  const ypInput = (key) => ({
    value: yp[key],
    onChange: (e) => setYpField(key)(e.target.value),
    "data-field": key,
    className: inputStyle(fieldError(key)),
  });
  const toggleYp = (key) => setYp((prev) => ({ ...prev, [key]: !prev[key] }));
  // Yes: the name field opens and gets the cursor. No: the name is cleared.
  const selectCompetitor = (value) => {
    setYp((prev) => ({
      ...prev,
      hasCompetitor: value,
      competitorName: value === "yes" ? prev.competitorName : "",
    }));
    if (value === "yes") setTimeout(() => competitorNameRef.current?.focus());
  };
  // Option + its own text box (Other …): picking it opens the box and moves
  // the cursor there; picking anything else clears and closes it.
  const selectWithOther = (key, otherKey, ref, value) => {
    setYp((prev) => ({
      ...prev,
      [key]: value,
      [otherKey]: value === "other" ? prev[otherKey] : "",
    }));
    if (value === "other") setTimeout(() => ref.current?.focus());
  };
  const selectPaperSize = (value) =>
    selectWithOther("paperSize", "paperSizeOther", paperSizeOtherRef, value);
  const selectCadFormat = (value) =>
    selectWithOther("cadFormat", "cadFormatOther", cadFormatOtherRef, value);
  const toggleScope = (key) => {
    if (key !== "scopeOtherOn") return toggleYp(key);
    const on = !yp.scopeOtherOn;
    setYp((prev) => ({
      ...prev,
      scopeOtherOn: on,
      scopeOther: on ? prev.scopeOther : "",
    }));
    if (on) setTimeout(() => scopeOtherRef.current?.focus());
  };
  // Additional Wording: one text value, shared by the two options that
  // take text — cleared when switching, and focused when they're picked.
  // Clicking the picked option again clears it (the field is optional).
  const selectProviso = (value) => {
    const clear = yp.platingProviso === value;
    setYp((prev) => ({
      ...prev,
      platingProviso: clear ? "" : value,
      platingProvisoText: "",
    }));
    if (!clear) setTimeout(() => provisoTextRefs.current[value]?.focus());
  };
  // Frame Data only applies to a designated frame.
  const selectPaperFrame = (value) =>
    setYp((prev) => ({
      ...prev,
      paperFrame: value,
      frameData: value === "designated" ? prev.frameData : "",
    }));
  const docNo = parseDocumentNo(yp.documentNo);
  // Red once the number can't be right any more, or when the field is left
  // half-typed.
  const [docNoTouched, setDocNoTouched] = useState(initial.docNoTouched);

  // Keep the form for when the user comes back (see newRequestDraft) — only for new requests.
  useEffect(() => {
    if (isEditMode) return;
    saveNewRequestDraft(projectType, {
      coverType,
      yp,
      ys,
      requestNotes,
      workTypes,
      extracted,
      autoFillStatus,
      showDesignRef,
      docNoTouched,
      coverFile,
      lostCover,
    });
  }, [
    isEditMode,
    projectType,
    coverType,
    yp,
    ys,
    requestNotes,
    workTypes,
    extracted,
    autoFillStatus,
    showDesignRef,
    docNoTouched,
    coverFile,
    lostCover,
  ]);
  const docNoError =
    yp.documentNo !== "" &&
    !docNo.valid &&
    (docNoTouched || !DOCUMENT_NO_PREFIX_RE.test(yp.documentNo));

  // Earlier requests of this head + project number (newest first), and
  // where the typed history no. stands against them.
  const docHistory = docNo.valid
    ? lookupDocumentHistory(docNo.head, docNo.projectNo)
    : [];
  const historyStatus = docNo.valid
    ? getHistoryStatus(docNo, docHistory)
    : null;

  const resetAutoFill = () => {
    clearTimeout(extractTimer.current);
    setYs(YS_EMPTY);
    setWorkTypes(NO_WORK_TYPES);
    setExtracted(null);
    setAutoFillStatus("idle");
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setLostCover(null);
      setAutoFillStatus("idle");
    }
    // Reset so picking the same file again still fires onChange.
    e.target.value = "";
  };

  const runAutoFill = () => {
    setAutoFillStatus("loading");
    extractTimer.current = setTimeout(() => {
      // Not-found fields start empty (for option groups: nothing picked),
      // so a default like "New" can't pass for a value read from the cover.
      const extract = {
        ...MOCK_COVER_EXTRACT,
        standard: standardOptions[0]?.value ?? null,
      };
      const { discipline, ...fields } = extract;
      const filled = Object.fromEntries(
        Object.entries(fields).map(([k, v]) => [k, v ?? ""]),
      );
      setYs({ ...YS_EMPTY, ...filled });
      setWorkTypes(workTypesFrom(discipline ?? ""));
      setExtracted(extract);
      setAutoFillStatus("done");
      // Open Cover Design Conditions so the values just filled in there can
      // be reviewed, not left hidden in the collapsed section.
      setShowDesignRef(true);
    }, MOCK_EXTRACT_DELAY_MS);
  };

  // Ask first if auto-fill would overwrite something the user typed.
  const hasYsEntries =
    Object.keys(YS_EMPTY).some((k) => ys[k] !== YS_EMPTY[k]) ||
    workTypes.calc ||
    workTypes.drawing;
  const handleAutoFill = () =>
    hasYsEntries ? setCoverConfirm("overwrite") : runAutoFill();

  // Replace / remove only need a confirm once auto-fill has put data in.
  const handleReplaceCover = () =>
    autoFillStatus === "done"
      ? setCoverConfirm("replace")
      : coverInputRef.current?.click();
  const handleRemoveCover = () =>
    autoFillStatus === "done" ? setCoverConfirm("remove") : setCoverFile(null);

  const clearCover = () => {
    resetAutoFill();
    setCoverFile(null);
    setLostCover(null);
  };
  // What "Confirm" does in each cover dialog (see COVER_CONFIRM).
  const COVER_ACTIONS = {
    overwrite: runAutoFill,
    restoreAll: () => restoreFields(editedKeys),
    remove: clearCover,
    replace: () => {
      clearCover();
      // Still inside the click that confirmed, so the picker may open.
      coverInputRef.current?.click();
    },
  };
  const confirmCoverAction = () => COVER_ACTIONS[coverConfirm]?.();

  // Clears only the form on screen: YP resets the YP fields, YS the YS
  // fields plus the cover and its auto-fill. The cover type stays picked,
  // and the other cover type's fields are left as they are. Discipline and
  // the assignments are shared by both forms, so they reset too.
  const RESET_FIELDS = {
    yp: () => {
      setYp(YP_EMPTY);
      setDocNoTouched(false);
    },
    ys: () => {
      clearCover();
      setShowDesignRef(false);
    },
  };
  const handleResetForm = () => {
    RESET_FIELDS[coverType]?.();
    if (coverType) setRequestNotes((prev) => ({ ...prev, [coverType]: "" }));
    setWorkTypes(NO_WORK_TYPES);
    setShowRequiredErrors(false);
    setFormKey((k) => k + 1);
  };

  if (!project) return <Navigate to="/404" replace />;

  const hasDiscipline = workTypes.calc || workTypes.drawing;
  // Cover auto-fill only exists on YS; on YP the cards stay plain even if
  // a YS auto-fill is still held in state.
  const isYs = coverType === "ys";
  const disciplineAutoFilled = isYs && isAutoFilled("discipline");
  const disciplineMissing =
    (isYs && isMissingRequired("discipline")) || fieldError("discipline");

  // Shared by YP and YS: the last section of either form. One note per
  // cover type.
  const requestNoteSection = coverType && (
    <RequestNoteSection
      value={requestNotes[coverType]}
      onChange={(note) =>
        setRequestNotes((prev) => ({ ...prev, [coverType]: note }))
      }
    />
  );

  // Shared by YP and YS: the last identity-type Required section, ahead of
  // the optional ones whose fields follow it (Cover Design Conditions on YS,
  // Request Scope on YP).
  const disciplineSection = (
    <div>
      <SectionTitle tag="Required" required>
        Discipline
      </SectionTitle>
      <SectionCard>
        <DisciplineCards
          value={workTypes}
          onToggle={(id) =>
            setWorkTypes((prev) => ({ ...prev, [id]: !prev[id] }))
          }
          autoFilled={disciplineAutoFilled}
          hasError={disciplineMissing}
        />
        {isYs && ysMissing("discipline")}
        {requiredHint("discipline")}
        {/* Neutral hint: unticking both while switching isn't an error, so
            only a cover that didn't give the discipline turns it red. Save
            stays disabled until one is picked. */}
        <div className="mt-3 flex items-start justify-between gap-2">
          <p className="text-xs md:text-sm text-gray-500">
            Select one or both. The fields below follow your selection.
          </p>
          {isYs && ysRestore("discipline")}
        </div>
      </SectionCard>
    </div>
  );

  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  // Confirm save edit
  const handleConfirmSaveEdit = () => {
    if (!requestId) return;
    updateRequest(requestId, (r) => ({
      ...r,
      coverType,
      fields: { yp, ys }[coverType],
      workTypes,
      note: requestNotes[coverType],
    }));
    setShowSaveConfirmModal(false);
    navigate(`/requests/detail/${requestId}`);
  };

  // Save: if a required field is empty, mark them all and bring the first
  // one into view (focused when it's a text field); otherwise go on.
  const handleSubmit = () => {
    if (!coverType) return;
    if (missingRequiredKeys.length > 0) {
      setShowRequiredErrors(true);
      const first = document.querySelector(
        `[data-field="${missingRequiredKeys[0]}"]`,
      );
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (first?.tagName === "INPUT") first.focus({ preventScroll: true });
      return;
    }

    if (isEditMode) {
      setShowSaveConfirmModal(true);
      return;
    }

    // On to the new request's page (summary, assignment, cases, files).
    // The cover PDF goes with it, into Brief & References.
    const request = createRequest({
      projectType,
      coverType,
      fields: { yp, ys }[coverType],
      workTypes,
      note: requestNotes[coverType],
      members: [creatorMember()],
      files:
        isYs && coverFile
          ? { brief: [fileRecord(coverFile, creatorMember().name)] }
          : {},
      createdBy: creatorMember().name,
    });
    clearNewRequestDraft();
    navigate(`/requests/detail/${request.id}`);
  };

  const currentRequestNo = isEditMode
    ? requestNoOf(existingRequest) || existingRequest?.id
    : "";

  return (
    <div className="flex flex-col h-full min-h-screen">
      <Helmet>
        <title>
          {isEditMode ? `Edit ${currentRequestNo} - KORI BALI` : "New Request - KORI BALI"}
        </title>
      </Helmet>

      <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50">
        {/* ── TOP BAR ────────────────────────────────────────────────────── */}
        {/* Same blue header card as the calculation pages
            (HeaderCalculationPage), minus Save Draft — nothing to save until
            the request is submitted. Same max width and side padding as the
            form card below, so their edges line up on wide screens. */}
        <div className="w-full max-w-[1440px] mx-auto px-2">
          <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] shadow-sm px-3 py-3 sm:px-4 sm:py-4 md:px-6 2xl:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Back sits at the top; the footer keeps only this form's own
              actions (Reset / Save). */}
            <button
              type="button"
              onClick={() => {
                if (isEditMode) {
                  navigate(`/requests/detail/${requestId}`);
                } else {
                  leave("/requests/new");
                }
              }}
              className="self-start md:self-auto flex shrink-0 items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap text-white px-3 py-2 sm:px-4 rounded-lg hp:rounded-md text-xs sm:text-sm font-medium border border-white/20 hover:bg-white/10 active:bg-white/15 transition"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              {isEditMode ? "Back to Request Detail" : "Back to Project Type"}
            </button>

            {isEditMode && (
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-xs sm:text-sm">Editing Request:</span>
                <span className="text-white font-bold text-xs sm:text-sm bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                  {currentRequestNo}
                </span>
              </div>
            )}

            {/* Requirement chips */}
            {SHOW_REQUIREMENT_CHIPS && (
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                <span className="text-white/70">Required:</span>
                <span
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                    coverType
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}
                >
                  {coverType ? <Check className="w-3.5 h-3.5" /> : null}
                  Brand line
                </span>
                <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5" /> {project.title}
                </span>
                <span
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                    hasDiscipline
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}
                >
                  {hasDiscipline ? <Check className="w-3.5 h-3.5" /> : null}
                  Discipline
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── FORM BODY ──────────────────────────────────────────────────── */}
        <div className="w-full max-w-[1440px] mx-auto pt-6 pb-24 sm:pb-8 px-2">
          <div className="bg-white rounded-2xl hp:rounded-xl border border-gray-200 shadow-[0_2px_10px_rgba(15,23,42,0.06)] overflow-hidden">
            {/* Top accent strip */}
            <div
              aria-hidden="true"
              className="h-1.5 bg-gradient-to-r from-[#0d3b66] to-[#3399cc]"
            />

            <div key={formKey} className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* ── Cover Type ──────────────────────────────────────── */}
              <div>
                <SectionTitle tag="Required" required>
                  Cover Type
                </SectionTitle>
                <SectionCard>
                  {/* Same radio-card style as the Taper / Straight pole picker.
                      Stays 50/50 full width at every size: it switches the
                      whole form, and sits with full-width neighbours (the
                      info box, Cover Upload). */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {COVER_TYPE_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const isActive = coverType === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => selectCoverType(option.id)}
                          className={`group w-full flex items-center justify-between px-3 xl:px-4 py-2 lg:py-3 rounded-lg hp:rounded-md border text-left transition-all duration-300 cursor-pointer active:scale-[0.98]
                            ${
                              isActive
                                ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-1.5 rounded-md shrink-0 ${isActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
                            >
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <p
                                className={`text-[12px] md:text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-700"}`}
                              >
                                {option.label}
                              </p>
                              <p
                                lang="ja"
                                className="text-[10px] md:text-[11px] text-slate-500 truncate"
                              >
                                {option.docTitle}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 ml-2 flex items-center">
                            {isActive ? (
                              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                            ) : (
                              <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-slate-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {/* Grey info-box style used across this form. */}
                  <div className="mt-3 flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg hp:rounded-md px-4 py-2.5 text-xs md:text-sm text-gray-500">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                    {coverType
                      ? "The request fields below and the brand line follow the cover type you select."
                      : "Select the cover type to show the request fields."}
                  </div>
                </SectionCard>
              </div>

              {/* ── Cover Upload ────────────────────────────────────── */}
              {/* Only for auto-filling the fields below from the cover; the
                  request's reference files live on the request detail page.
                  Optional: every field can still be typed by hand.
                  YS only — auto-fill for YP covers isn't ready yet. */}
              {coverType === "ys" && (
                <div>
                  <SectionTitle tag="Optional">Cover Upload</SectionTitle>
                  <SectionCard>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleCoverChange}
                    />
                    {coverFile ? (
                      <>
                        <div className="flex flex-wrap items-center gap-3 rounded-lg hp:rounded-md border border-slate-200 bg-white px-3 xl:px-4 py-2 lg:py-3">
                          <div className="p-1.5 rounded-md shrink-0 bg-blue-100 text-blue-600">
                            <FileText size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] md:text-sm font-medium text-slate-900 truncate">
                              {coverFile.name}
                            </p>
                            <p className="text-[10px] md:text-[11px] text-slate-500">
                              {formatFileSize(coverFile.size)}
                            </p>
                          </div>
                          {/* All three share one height (h-8). Auto-fill: solid
                            navy (primary); Replace / Use cover values: same
                            style as the steps' Back button (secondary);
                            remove: ghost icon. */}
                          <div className="flex items-center gap-2 shrink-0 ml-auto">
                            {autoFillStatus === "done" ? (
                              <>
                                <span className="inline-flex items-center gap-1.5 h-8 px-1 text-xs md:text-sm font-medium text-emerald-600">
                                  <CheckCircle className="w-4 h-4" />
                                  Auto-filled
                                  {editedKeys.length > 0 && (
                                    <span className="font-normal text-slate-500">
                                      · {editedKeys.length}{" "}
                                      {editedKeys.length === 1
                                        ? "field"
                                        : "fields"}{" "}
                                      edited
                                    </span>
                                  )}
                                </span>
                                {editedKeys.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCoverConfirm("restoreAll")
                                    }
                                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg hp:rounded-md text-xs md:text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm active:scale-[0.98] transition-all"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Use cover values
                                  </button>
                                )}
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={handleAutoFill}
                                disabled={autoFillStatus === "loading"}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg hp:rounded-md border border-[#0d3b66] text-xs md:text-sm font-semibold bg-[#0d3b66] text-white hover:bg-[#0a2c4c] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait disabled:active:scale-100"
                              >
                                {autoFillStatus === "loading" ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Reading cover…
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4" />
                                    Auto-fill
                                  </>
                                )}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={handleReplaceCover}
                              disabled={autoFillStatus === "loading"}
                              className="inline-flex items-center h-8 px-3 rounded-lg hp:rounded-md text-xs md:text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm active:scale-[0.98] transition-all disabled:text-slate-300 disabled:bg-slate-50 disabled:ring-slate-200 disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveCover}
                              disabled={autoFillStatus === "loading"}
                              aria-label="Remove cover"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg hp:rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:text-slate-200 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {autoFillStatus === "done" && (
                          <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg hp:rounded-md px-4 py-2.5 text-xs md:text-sm text-[#0d3b66]">
                            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                            <span>
                              {foundCount === totalCount
                                ? `${totalCount} fields were filled in from the cover.`
                                : `${foundCount} of ${totalCount} fields were filled in from the cover.`}
                              {missingRequired > 0 &&
                                ` ${missingRequired} required ${plural(missingRequired, "field wasn't", "fields weren't")} found and ${plural(missingRequired, "is", "are")} marked in red. Please fill ${plural(missingRequired, "it", "them")} in manually.`}
                              {missingOptional > 0 &&
                                ` ${missingOptional} optional ${plural(missingOptional, "field wasn't", "fields weren't")} found and can be left empty.`}{" "}
                              Fields that still match the cover have a dashed
                              border. Please review them before saving.
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {lostCover && (
                          <div className="mb-3 flex items-start gap-2 rounded-lg hp:rounded-md border border-amber-100 bg-amber-50/60 px-4 py-2.5 text-xs md:text-sm text-amber-700">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                              Please upload the cover{" "}
                              <span className="font-medium">{lostCover}</span>{" "}
                              again: files aren't kept when the page reloads.
                              The values it filled in are kept.
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="group w-full flex items-center gap-3 rounded-lg hp:rounded-md border border-dashed border-slate-300 bg-slate-50/60 px-3 xl:px-4 py-3 lg:py-4 text-left hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
                        >
                          <div className="p-1.5 rounded-md shrink-0 bg-white text-slate-500 border border-slate-200 group-hover:text-blue-600 group-hover:border-blue-200">
                            <UploadCloud size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] md:text-sm font-medium text-slate-700">
                              Upload YS cover{" "}
                              <span className="font-normal text-slate-400">
                                (PDF)
                              </span>
                            </p>
                            <p className="mt-0.5 text-xs md:text-[13px] leading-relaxed text-slate-600">
                              Upload the cover, then use Auto-fill to fill in
                              the request details below. Review and edit them as
                              needed, or skip this step and enter them manually.
                            </p>
                          </div>
                        </button>
                      </>
                    )}
                  </SectionCard>
                </div>
              )}

              {/* ── Conditional sections ──────────────────────────── */}
              {coverType === "ys" && (
                <>
                  {/* YS: Project Identity */}
                  <div>
                    <SectionTitle tag="Required" required>
                      Project Identity
                    </SectionTitle>
                    <SectionCard>
                      {/* PJNO takes one column, Project Name the rest of the
                          row (3 columns; 4 from xl, the grid every YS
                          section shares). */}
                      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                        <div className="relative">
                          <Label action={ysRestore("projectNo")} required>
                            Project No. (PJNO)
                          </Label>
                          {/* YS PJNO is exactly 5 digits: digits only, capped at 5. */}
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={5}
                            {...ysInput("projectNo")}
                            onChange={(e) =>
                              setYsField("projectNo")(
                                e.target.value.replace(/\D/g, "").slice(0, 5),
                              )
                            }
                            placeholder="e.g. 66003 (5 digits)"
                          />
                          {ysMissing("projectNo")}
                          {requiredHint("projectNo")}
                        </div>
                        <div className="relative md:col-span-2 xl:col-span-3">
                          <Label action={ysRestore("projectName")} required>
                            Project Name
                          </Label>
                          <input
                            type="text"
                            {...ysInput("projectName")}
                            placeholder="e.g. Yokohama Bay Street Light Pole"
                          />
                          {ysMissing("projectName")}
                          {requiredHint("projectName")}
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {/* YS: Request Identity */}
                  <div>
                    <SectionTitle tag="Required" required>
                      Request Identity
                    </SectionTitle>
                    <SectionCard>
                      {/* xl: the shared 4-column grid — Mgmt No. · Request
                          No. · Company Name · Classification, then the two
                          dates and Request Type. Below xl: pairs. */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                        <div className="relative">
                          <Label
                            jp="設計依頼管理No"
                            action={ysRestore("mgmtNo")}
                            required
                          >
                            Design Request Management No.
                          </Label>
                          <input
                            type="text"
                            {...ysInput("mgmtNo")}
                            placeholder="e.g. 2609-0418"
                          />
                          {ysMissing("mgmtNo")}
                          {requiredHint("mgmtNo")}
                        </div>
                        <div className="relative">
                          <Label
                            jp="依頼No"
                            action={ysRestore("requestNo")}
                            required
                          >
                            Request No.
                          </Label>
                          <input
                            type="text"
                            {...ysInput("requestNo")}
                            placeholder="e.g. 26-1187"
                          />
                          {ysMissing("requestNo")}
                          {requiredHint("requestNo")}
                        </div>
                        <div className="relative">
                          <Label
                            jp="会社名"
                            action={ysRestore("companyName")}
                            required
                          >
                            Company Name
                          </Label>
                          <input
                            type="text"
                            {...ysInput("companyName")}
                            placeholder="e.g. Minato Lighting Co., Ltd."
                          />
                          {ysMissing("companyName")}
                          {requiredHint("companyName")}
                        </div>

                        <div data-field="classification" className="relative">
                          <Label
                            jp="分類"
                            action={ysRestore("classification")}
                            required
                          >
                            Classification
                          </Label>
                          <BtnGroup
                            options={CLASSIFICATION_OPTIONS}
                            value={ys.classification}
                            onChange={setYsField("classification")}
                            tight
                            autoFilled={isAutoFilled("classification")}
                            hasError={
                              isMissingRequired("classification") ||
                              fieldError("classification")
                            }
                          />
                          {ysMissing("classification")}
                          {requiredHint("classification")}
                        </div>
                        <div className="relative">
                          <Label
                            jp="依頼日"
                            action={ysRestore("requestDate")}
                            required
                          >
                            Request Date
                          </Label>
                          <DateInput
                            {...ysInput("requestDate")}
                            onChange={setYsField("requestDate")}
                          />
                          {ysMissing("requestDate")}
                          {requiredHint("requestDate")}
                        </div>
                        <div className="relative">
                          <Label
                            jp="要望期日"
                            action={ysRestore("requestedDate")}
                            required
                          >
                            Requested Due Date
                          </Label>
                          <DateInput
                            {...ysInput("requestedDate")}
                            onChange={setYsField("requestedDate")}
                          />
                          {ysMissing("requestedDate")}
                          {requiredHint("requestedDate")}
                        </div>
                        <div data-field="requestType" className="relative">
                          <Label
                            jp="依頼種別"
                            action={ysRestore("requestType")}
                            required
                          >
                            Request Type
                          </Label>
                          <BtnGroup
                            options={REQUEST_TYPE_OPTIONS}
                            value={ys.requestType}
                            onChange={setYsField("requestType")}
                            autoFilled={isAutoFilled("requestType")}
                            hasError={
                              isMissingRequired("requestType") ||
                              fieldError("requestType")
                            }
                          />
                          {ysMissing("requestType")}
                          {requiredHint("requestType")}
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {/* YS: Design Conditions */}
                  {SHOW_DESIGN_CONDITIONS && (
                    <div>
                      <SectionTitle hint="used for calculation">
                        Design Conditions
                      </SectionTitle>
                      <SectionCard>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 md:gap-y-8">
                          <div className="relative">
                            <Label>Design Standard</Label>
                            <FormSelect
                              options={[{ value: "JIL1003", label: "JIL1003" }]}
                              value="JIL1003"
                              onChange={() => {}}
                            />
                          </div>
                          <div className="relative">
                            <Label>Wind Speed</Label>
                            <div className="relative">
                              <input
                                type="number"
                                className={`${inputStyle(false)} pr-10`}
                                placeholder="—"
                              />
                              <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                                m/s
                              </span>
                            </div>
                          </div>
                          <div className="relative">
                            <Label>Air Density</Label>
                            <div className="relative">
                              <input
                                type="number"
                                defaultValue="1.22"
                                className={`${inputStyle(false)} pr-14`}
                              />
                              <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                                kg/m³
                              </span>
                            </div>
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                  )}

                  {disciplineSection}

                  {/* YS: Request Details — reception (受付No, 担当) and
                      delivery (納入時期, 納入数量), all optional. One row of
                      four from xl, 2 × 2 below. */}
                  <div>
                    <SectionTitle tag="Optional">Request Details</SectionTitle>
                    <SectionCard>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                        <div className="relative">
                          <Label jp="受付No" action={ysRestore("receptionNo")}>
                            Reception No.
                          </Label>
                          <input
                            type="text"
                            {...ysInput("receptionNo")}
                            placeholder="e.g. U-55310"
                          />
                          {ysMissing("receptionNo")}
                        </div>
                        <div className="relative">
                          <Label jp="担当" action={ysRestore("pic")}>
                            Person In Charge
                          </Label>
                          <input
                            type="text"
                            {...ysInput("pic")}
                            placeholder="e.g. Tanaka"
                          />
                          {ysMissing("pic")}
                        </div>
                        <div className="relative">
                          <Label
                            jp="納入時期"
                            action={ysRestore("deliveryDate")}
                          >
                            Delivery Schedule
                          </Label>
                          <input
                            type="text"
                            {...ysInput("deliveryDate")}
                            placeholder="e.g. End of year or 2026-11-30"
                          />
                          {ysMissing("deliveryDate")}
                        </div>
                        <div className="relative">
                          <Label
                            jp="納入数量"
                            action={ysRestore("deliveryQty")}
                          >
                            Delivery Quantity
                          </Label>
                          <input
                            type="text"
                            inputMode="numeric"
                            {...ysInput("deliveryQty")}
                            onChange={(e) =>
                              setYsField("deliveryQty")(
                                e.target.value.replace(/\D/g, ""),
                              )
                            }
                            placeholder="e.g. 12"
                          />
                          {ysMissing("deliveryQty")}
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {/* YS: Cover Design Conditions */}
                  {/* Reference values copied as-is from the cover; the
                      actual ones are entered again in the calculation
                      steps and may differ. Collapsed by default. */}
                  <div>
                    <SectionTitle tag="Optional | Reference only">
                      Cover Design Conditions
                    </SectionTitle>
                    <SectionCard>
                      <ReferenceNote
                        open={showDesignRef}
                        onToggle={() => setShowDesignRef((v) => !v)}
                        filled={designRefFilled}
                        total={designRefKeys.length}
                      >
                        Enter these exactly as written on the cover. They are
                        kept for reference only. The actual values are entered
                        in the calculation and drawing steps and may differ.
                      </ReferenceNote>
                      {showDesignRef && (
                        <>
                          {/* Grouped: shared fields first, then one group per
                          discipline — shown only when that discipline is
                          ticked. Each group's fields fill the full row. */}
                          <div className="pt-6 mt-6 border-t border-gray-100">
                            <SubGroupTitle>Opening</SubGroupTitle>
                            {/* xl+: one field per column of the shared 4-column grid. */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                              <div className="relative">
                                <Label
                                  jp="開口部高さ"
                                  action={ysRestore("openingHeight")}
                                >
                                  Opening Height
                                </Label>
                                <input
                                  type="number"
                                  {...ysInput("openingHeight")}
                                  placeholder="e.g. 500"
                                />
                                {ysMissing("openingHeight")}
                              </div>
                              <div className="relative">
                                <Label
                                  jp="開口部方向"
                                  action={ysRestore("openingDirection")}
                                >
                                  Opening Direction
                                </Label>
                                <input
                                  type="text"
                                  {...ysInput("openingDirection")}
                                  placeholder="e.g. Road side"
                                />
                                {ysMissing("openingDirection")}
                              </div>
                            </div>
                          </div>
                          <div className="pt-6 mt-6 border-t border-gray-100">
                            <SubGroupTitle>Foundation</SubGroupTitle>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                              <div className="relative">
                                <Label
                                  jp="基礎形状"
                                  action={ysRestore("foundation")}
                                >
                                  Foundation Shape
                                </Label>
                                <input
                                  type="text"
                                  {...ysInput("foundation")}
                                  placeholder="e.g. Square"
                                />
                                {ysMissing("foundation")}
                              </div>
                              <div className="relative">
                                <Label
                                  jp="巾（直径）"
                                  action={ysRestore("foundationWidth")}
                                >
                                  Width (Diameter)
                                </Label>
                                <input
                                  type="number"
                                  {...ysInput("foundationWidth")}
                                  placeholder="e.g. 800"
                                />
                                {ysMissing("foundationWidth")}
                              </div>
                              <div className="relative">
                                <Label
                                  jp="奥行"
                                  action={ysRestore("foundationLength")}
                                >
                                  Length
                                </Label>
                                <input
                                  type="number"
                                  {...ysInput("foundationLength")}
                                  placeholder="e.g. 800"
                                />
                                {ysMissing("foundationLength")}
                              </div>
                              <div className="relative">
                                <Label
                                  jp="深さ"
                                  action={ysRestore("foundationDepth")}
                                >
                                  Depth
                                </Label>
                                <input
                                  type="number"
                                  {...ysInput("foundationDepth")}
                                  placeholder="e.g. 1500"
                                />
                                {ysMissing("foundationDepth")}
                              </div>
                            </div>
                          </div>
                          {workTypes.calc && (
                            <div className="pt-6 mt-6 border-t border-gray-100">
                              <SubGroupTitle>
                                Calculation
                                <span className="font-normal text-gray-500">
                                  (Only for calculation requests)
                                </span>
                              </SubGroupTitle>
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                                <div className="relative">
                                  <Label
                                    jp="規格"
                                    action={ysRestore("standard")}
                                  >
                                    Standard
                                  </Label>
                                  <FormSelect
                                    value={ys.standard}
                                    onChange={setYsField("standard")}
                                    options={standardOptions}
                                    placeholder="Select Standard"
                                    autoFilled={isAutoFilled("standard")}
                                  />
                                  {ysMissing("standard")}
                                </div>
                                <div className="relative">
                                  <Label
                                    jp="風速"
                                    action={ysRestore("windSpeed")}
                                  >
                                    Wind Speed
                                  </Label>
                                  {/* Same unit-suffixed input as Design Conditions. */}
                                  <div className="relative">
                                    <input
                                      type="number"
                                      {...ysInput("windSpeed")}
                                      className={`${ysInput("windSpeed").className} pr-10`}
                                      placeholder="e.g. 60"
                                    />
                                    <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                                      m/s
                                    </span>
                                  </div>
                                  {ysMissing("windSpeed")}
                                </div>
                              </div>
                            </div>
                          )}
                          {workTypes.drawing && (
                            <div className="pt-6 mt-6 border-t border-gray-100">
                              <SubGroupTitle>
                                Drawing
                                <span className="font-normal text-gray-500">
                                  (Only for drawing requests)
                                </span>
                              </SubGroupTitle>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                                <div className="relative">
                                  <Label
                                    jp="図面種類"
                                    action={ysRestore("drawingType")}
                                  >
                                    Drawing Type
                                  </Label>
                                  <FormSelect
                                    value={ys.drawingType}
                                    onChange={setYsField("drawingType")}
                                    options={DRAWING_TYPE_OPTIONS}
                                    placeholder="Select Drawing Type"
                                    autoFilled={isAutoFilled("drawingType")}
                                  />
                                  {ysMissing("drawingType")}
                                </div>
                                <div className="relative">
                                  <Label
                                    jp="表面処理"
                                    action={ysRestore("surfaceTreatment")}
                                  >
                                    Surface Treatment
                                  </Label>
                                  <input
                                    type="text"
                                    {...ysInput("surfaceTreatment")}
                                    placeholder="e.g. HDZ55"
                                  />
                                  {ysMissing("surfaceTreatment")}
                                </div>
                                <div className="relative">
                                  <Label
                                    jp="塗装種類"
                                    action={ysRestore("coatingType")}
                                  >
                                    Coating Type
                                  </Label>
                                  <input
                                    type="text"
                                    {...ysInput("coatingType")}
                                    placeholder="e.g. Polyurethane resin"
                                  />
                                  {ysMissing("coatingType")}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </SectionCard>
                  </div>

                  {requestNoteSection}
                </>
              )}

              {coverType === "yp" && (
                <>
                  {/* YP: Request Identity */}
                  {/* One section for everything about this request (it used
                      to be split into Project / Request Identity, but the
                      only project fact is the PJNO inside the Request No.):
                      Request No. + Requesting Department with the number's
                      breakdown and the project's Request History first,
                      then the rest in the cover's order; the technical
                      team's fields (完了情報 on the cover) come last. */}
                  <div>
                    <SectionTitle tag="Required" required>
                      Request Identity
                    </SectionTitle>
                    <SectionCard>
                      {/* Department · Document No., then the Document No.'s
                          breakdown: below them up to lg, beside them (columns
                          3–4) from xl so the row is full and the parts sit
                          right next to the number they're split from.
                          items-end: the breakdown lines up with the inputs'
                          bottom edge. */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-end gap-x-6 gap-y-6 md:gap-y-8">
                        <div className="relative">
                          <Label jp="依頼部署" required>
                            Requesting Department
                          </Label>
                          <input
                            type="text"
                            {...ypInput("department")}
                            placeholder="e.g. YS-名古屋"
                          />
                          {requiredHint("department")}
                        </div>
                        <div className="relative">
                          {/* "Request No." on screen; still `documentNo` /
                              BE `document_no` underneath. */}
                          <Label jp="図番" required>
                            Request No.
                          </Label>
                          {/* Typed whole, as on the cover; the parts are
                              split from it in the row below. */}
                          <input
                            type="text"
                            {...ypInput("documentNo")}
                            onChange={(e) =>
                              setYpField("documentNo")(
                                e.target.value.toUpperCase().replace(/\s/g, ""),
                              )
                            }
                            onFocus={() => setDocNoTouched(false)}
                            onBlur={() => setDocNoTouched(true)}
                            className={`${inputStyle(docNoError || fieldError("documentNo"))} tracking-wide`}
                            placeholder="e.g. RPJ658053 or RPJ658053-1"
                          />
                          {/* Empty after Save: the same floating note as the
                              other required fields. */}
                          {fieldError("documentNo") && yp.documentNo === "" && (
                            <RequiredHint />
                          )}
                        </div>
                        {/* Format error: its own grid item right under the
                            Document No. input (column 2, next row), so it
                            doesn't make that cell taller and throw the row's
                            bottom-aligned inputs and breakdown out of line.
                            The negative margin cancels the grid gap. */}
                        {docNoError && (
                          <p className="sm:col-start-2 xl:row-start-2 -mt-5 md:-mt-7 text-[11px] md:text-xs text-red-500">
                            *{documentNoProblem(yp.documentNo)}, e.g. RPJ658053
                            or RPJ658053-1.
                          </p>
                        )}
                        {/* Breakdown of the Request No. Up to lg a full
                            row, 16px under the inputs (the negative margin
                            trims the grid gap) — except while the
                            "required" note sits under Request No.; from xl
                            pinned to row 1, columns 3–4. */}
                        <RequestNoBreakdown
                          docNo={docNo}
                          className={`sm:col-span-2 xl:col-start-3 xl:row-start-1 xl:mt-0 ${
                            fieldError("documentNo") && yp.documentNo === ""
                              ? ""
                              : "-mt-2 md:-mt-4"
                          }`}
                        />
                      </div>

                      {/* Requests already issued under this Head Code +
                          Project No. Each new one takes the next History
                          No., whatever its Tail Brand. */}
                      {historyStatus && (
                        <RequestHistoryPanel
                          docNo={docNo}
                          documentNo={yp.documentNo}
                          history={docHistory}
                          result={historyStatus}
                          onUseNext={setYpField("documentNo")}
                        />
                      )}

                      {/* After Request History:
                            Subject (full width)
                            Mgmt No. · Classification · Request Date ·
                              Expected Completion Date
                            Request Type (own row, under Mgmt No.)
                          xl+ — 4 equal columns, a quarter each, lined up with
                          the 4-column rows of the other sections; to fit one
                          column, Classification's buttons use tight padding.
                          Subject spans all four.
                          sm–lg — 6 columns: Subject (6); Mgmt No. ·
                          Classification and the dates 3 + 3 (50/50, so the
                          long Mgmt No. label stays on one line).
                          Mobile: one column. */}
                      <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-6 xl:grid-cols-4 items-end gap-x-6 gap-y-6 md:gap-y-8">
                        <div className="relative sm:col-span-6 xl:col-span-4">
                          <Label jp="依頼件名" required>
                            Subject
                          </Label>
                          <input
                            type="text"
                            {...ypInput("subject")}
                            placeholder="e.g. Street light pole, Route 23 Yokohama"
                          />
                          {requiredHint("subject")}
                        </div>
                        <div className="relative sm:col-span-3 xl:col-span-1">
                          <Label jp="設計依頼管理No" required>
                            Design Request Management No.
                          </Label>
                          <input
                            type="text"
                            {...ypInput("mgmtNo")}
                            placeholder="e.g. 202601-004"
                          />
                          {requiredHint("mgmtNo")}
                        </div>
                        <div
                          data-field="classification"
                          className="relative sm:col-span-3 xl:col-span-1"
                        >
                          <Label jp="分類" required>
                            Classification
                          </Label>
                          <BtnGroup
                            options={CLASSIFICATION_OPTIONS}
                            value={yp.classification}
                            onChange={setYpField("classification")}
                            tight
                            compact
                            hasError={fieldError("classification")}
                          />
                          {requiredHint("classification")}
                        </div>
                        <div className="relative sm:col-span-3 xl:col-span-1">
                          <Label jp="依頼年月日" required>
                            Request Date
                          </Label>
                          <DateInput
                            {...ypInput("requestDate")}
                            onChange={setYpField("requestDate")}
                          />
                          {requiredHint("requestDate")}
                        </div>
                        {/* 完成希望日: the requester's deadline. Named as on
                            the YP cover, but it's the same due date the
                            Request List tracks (YS: Requested Due Date). */}
                        <div className="relative sm:col-span-3 xl:col-span-1">
                          <Label jp="完成希望日" required>
                            Expected Completion Date
                          </Label>
                          <DateInput
                            {...ypInput("dueDate")}
                            onChange={setYpField("dueDate")}
                          />
                          {requiredHint("dueDate")}
                        </div>
                        <div
                          data-field="requestType"
                          className="relative sm:col-span-3 xl:col-span-1"
                        >
                          <Label jp="依頼種別" required>
                            Request Type
                          </Label>
                          <BtnGroup
                            options={REQUEST_TYPE_OPTIONS}
                            value={yp.requestType}
                            onChange={setYpField("requestType")}
                            hasError={fieldError("requestType")}
                          />
                          {requiredHint("requestType")}
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {/* Required sections first: Discipline comes before the
                      optional ones below. */}
                  {disciplineSection}

                  {/* YP: Request Scope (依頼区分) with the documents to submit (提出書類)
                      for each ticked discipline; hidden until one is ticked.
                      Option groups use content-width buttons (`fit`), left
                      aligned and side by side, wrapping on narrow screens;
                      every "Other" box sits right after its option, greyed
                      out until it's picked (like Competitor). Text fields
                      stay on the shared 4-column grid. */}
                  {hasDiscipline && (
                    <div>
                      <SectionTitle tag="Optional">
                        Request Scope{" "}
                        <span lang="ja" className="font-normal text-gray-500">
                          依頼区分
                        </span>
                      </SectionTitle>
                      <SectionCard>
                        {workTypes.calc && (
                          <div>
                            <SubGroupTitle>
                              Calculation
                              <span className="font-normal text-gray-500">
                                (Only for calculation requests)
                              </span>
                            </SubGroupTitle>
                            <div className="flex flex-wrap items-end gap-x-6 gap-y-6">
                              <div className="xl:w-[calc((100%-72px)/4)]">
                                <Label jp="構造計算">Calculation</Label>
                                <CheckGroup
                                  fit
                                  stretchXl
                                  options={CALC_TYPE_OPTIONS}
                                  values={yp}
                                  onToggle={toggleYp}
                                />
                              </div>
                              <div>
                                <Label>Scope</Label>
                                <div className="flex flex-wrap items-center gap-2">
                                  <CheckGroup
                                    fit
                                    options={SCOPE_OPTIONS}
                                    values={yp}
                                    onToggle={toggleScope}
                                  />
                                  <input
                                    ref={scopeOtherRef}
                                    type="text"
                                    {...ypInput("scopeOther")}
                                    disabled={!yp.scopeOtherOn}
                                    aria-label="Other part"
                                    placeholder={
                                      yp.scopeOtherOn
                                        ? "Other part"
                                        : "Select Other first"
                                    }
                                    className={`${inputStyle(false)} !w-full sm:!w-48 ${DISABLED_INPUT}`}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                              <div className="relative">
                                <Label jp="計算書番号">
                                  Calculation Report No.
                                </Label>
                                <input
                                  type="text"
                                  {...ypInput("calcReportNo")}
                                  placeholder="e.g. 91243"
                                />
                              </div>
                              <div className="relative">
                                <Label jp="完成部数">Finished Copies</Label>
                                <UnitInput
                                  unit="copies"
                                  inputProps={{
                                    ...ypInput("finishedCopies"),
                                    placeholder: "e.g. 2",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {workTypes.drawing && (
                          <div
                            className={
                              workTypes.calc
                                ? "pt-6 mt-6 border-t border-gray-100"
                                : undefined
                            }
                          >
                            <SubGroupTitle>
                              Drawing
                              <span className="font-normal text-gray-500">
                                (Only for drawing requests)
                              </span>
                            </SubGroupTitle>
                            <div className="flex flex-wrap items-end gap-x-6 gap-y-6">
                              <div className="xl:w-[calc((100%-72px)/4)]">
                                <Label jp="作図">Drafting</Label>
                                <CheckGroup
                                  fit
                                  stretchXl
                                  options={DRAFTING_OPTIONS}
                                  values={yp}
                                  onToggle={toggleYp}
                                />
                              </div>
                              <div>
                                <Label>Deliverables</Label>
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Order / Meeting / Approval — pick exactly one */}
                                  <BtnGroup
                                    fit
                                    options={DELIVER_TYPE_OPTIONS}
                                    value={yp.deliverType}
                                    onChange={setYpField("deliverType")}
                                    allowDeselect
                                  />
                                  {/* Divider */}
                                  <div className="w-px self-stretch bg-gray-200" />
                                  {/* CAD Data — independent toggle */}
                                  <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={yp.deliverCad}
                                    onClick={() => toggleYp("deliverCad")}
                                    className={`flex-none min-w-[80px] px-4 flex items-center justify-center gap-1.5 whitespace-nowrap py-2 lg:py-2.5 rounded-lg hp:rounded-md border text-xs md:text-sm font-medium cursor-pointer transition-colors active:scale-[0.98] ${
                                      yp.deliverCad
                                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-50"
                                        : "border-gray-300 bg-white text-gray-600 hover:border-slate-400 hover:bg-slate-50 hover:text-gray-800"
                                    }`}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={`shrink-0 flex items-center justify-center w-3.5 h-3.5 md:w-4 md:h-4 rounded-[4px] border transition-colors ${
                                        yp.deliverCad
                                          ? "bg-blue-500 border-blue-500 text-white"
                                          : "bg-white border-slate-300"
                                      }`}
                                    >
                                      {yp.deliverCad && (
                                        <Check
                                          className="w-2.5 h-2.5 md:w-3 md:h-3"
                                          strokeWidth={3}
                                        />
                                      )}
                                    </span>
                                    <span>CAD Data</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 md:mt-8 flex flex-wrap items-end gap-x-6 gap-y-6">
                              <div>
                                <Label jp="用紙サイズ指定">Paper Size</Label>
                                <div className="flex flex-wrap items-center gap-2">
                                  <BtnGroup
                                    fit
                                    options={PAPER_SIZE_OPTIONS}
                                    value={yp.paperSize}
                                    onChange={selectPaperSize}
                                    allowDeselect
                                  />
                                  <input
                                    ref={paperSizeOtherRef}
                                    type="text"
                                    {...ypInput("paperSizeOther")}
                                    disabled={yp.paperSize !== "other"}
                                    aria-label="Other paper size"
                                    placeholder={
                                      yp.paperSize === "other"
                                        ? "Other size"
                                        : "Select Other first"
                                    }
                                    className={`${inputStyle(false)} !w-full sm:!w-36 ${DISABLED_INPUT}`}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label jp="用紙枠指定">Paper Frame</Label>
                                <div className="flex flex-wrap items-center gap-2">
                                  <BtnGroup
                                    fit
                                    options={PAPER_FRAME_OPTIONS}
                                    value={yp.paperFrame}
                                    onChange={selectPaperFrame}
                                    allowDeselect
                                  />
                                </div>
                              </div>
                            </div>
                            {yp.deliverCad && (
                              <div className="mt-6 md:mt-8 flex flex-wrap items-end gap-x-6 gap-y-6">
                                <div>
                                  <Label jp="CADデータ形式">CAD Format</Label>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <BtnGroup
                                      fit
                                      options={CAD_FORMAT_OPTIONS}
                                      value={yp.cadFormat}
                                      onChange={selectCadFormat}
                                      allowDeselect
                                    />
                                    <input
                                      ref={cadFormatOtherRef}
                                      type="text"
                                      {...ypInput("cadFormatOther")}
                                      disabled={yp.cadFormat !== "other"}
                                      aria-label="Other CAD format"
                                      placeholder={
                                        yp.cadFormat === "other"
                                          ? "Other format"
                                          : "Select Other first"
                                      }
                                      className={`${inputStyle(false)} !w-full sm:!w-36 ${DISABLED_INPUT}`}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </SectionCard>
                    </div>
                  )}

                  {/* YP: Request Details */}
                  <div>
                    <SectionTitle tag="Optional">Request Details</SectionTitle>
                    <SectionCard>
                      {/* General — optional context: Design Origin ·
                          Attachments, then Department Code · Person In
                          Charge (moved here from Request Identity, as they're
                          optional). Below xl the three share one row:
                          Attachments ¼ · Department Code ¼ · PIC ½. On xl
                          all four sit on one row, sized 5.6 : 1.4 : 1.5 : 1.9
                          — Design Origin keeps room for its 4 buttons, and
                          PIC (a name) gets more than the two short fields. */}
                      <div>
                        <SubGroupTitle>General</SubGroupTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-12 xl:grid-cols-[minmax(0,5.6fr)_minmax(0,1.4fr)_minmax(0,1.5fr)_minmax(0,1.9fr)] items-end gap-x-6 gap-y-6 md:gap-y-8">
                          <div className="relative sm:col-span-12 xl:col-span-1">
                            <Label jp="設計起源">Design Origin</Label>
                            <BtnGroup
                              options={DESIGN_ORIGIN_OPTIONS}
                              mobileCols={2}
                              value={yp.designOrigin}
                              onChange={setYpField("designOrigin")}
                              tight
                              allowDeselect
                            />
                          </div>
                          {/* 本紙含め — includes the cover sheet itself */}
                          <div className="relative sm:col-span-3 xl:col-span-1">
                            <Label jp="添付書類">Attachments</Label>
                            <UnitInput
                              unit="sheets"
                              inputProps={{
                                ...ypInput("attachments"),
                                placeholder: "e.g. 10",
                                title:
                                  "Number of sheets, including this cover sheet (本紙含め)",
                              }}
                            />
                          </div>
                          <div className="relative sm:col-span-3 xl:col-span-1">
                            <Label jp="部門コード">Department Code</Label>
                            <input
                              type="text"
                              {...ypInput("deptCode")}
                              placeholder="e.g. 72"
                            />
                          </div>
                          <div className="relative sm:col-span-6 xl:col-span-1">
                            <Label jp="担当者">Person In Charge</Label>
                            <input
                              type="text"
                              {...ypInput("pic")}
                              placeholder="e.g. Tanaka"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-6 mt-6 border-t border-gray-100">
                        <SubGroupTitle>Schedule</SubGroupTitle>
                        {/* Below xl Adjustment takes 2/3, then Schedule Note
                            on its own row; on xl both share one row
                            (1 + 3 columns). */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 items-end gap-x-6 gap-y-6 md:gap-y-8">
                          <div className="relative sm:col-span-2 xl:col-span-1">
                            <Label jp="日程調整">Schedule Adjustment</Label>
                            <BtnGroup
                              options={SCHEDULE_FLEX_OPTIONS}
                              value={yp.scheduleFlex}
                              onChange={setYpField("scheduleFlex")}
                              tight
                              allowDeselect
                            />
                          </div>

                          {/* Notes run long: a row of their own, as wide as
                              Subject (3 columns on lg and xl). */}
                          <div className="relative sm:col-span-3 sm:col-start-1 xl:col-span-3 xl:col-start-auto">
                            <Label>Schedule Note</Label>
                            <input
                              type="text"
                              {...ypInput("scheduleNote")}
                              placeholder="e.g. Flexible by ±1 week"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-6 mt-6 border-t border-gray-100">
                        <SubGroupTitle>
                          Submission{" "}
                          <span lang="ja" className="font-normal text-gray-500">
                            提出先
                          </span>
                        </SubGroupTitle>
                        {/* A chain, as on the cover: Destination 1 › 2 › 3.
                            Same columns as the other groups; the arrows sit
                            in the gaps between them. */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-8">
                          {SUBMISSION_CHAIN.map(({ key, placeholder }, i) => (
                            <div key={key} className="relative">
                              <Label>Destination {i + 1}</Label>
                              <div className="relative">
                                {i > 0 && (
                                  <ChevronRight
                                    aria-hidden="true"
                                    className="hidden lg:block absolute -left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                  />
                                )}
                                <input
                                  type="text"
                                  {...ypInput(key)}
                                  placeholder={placeholder}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-6 mt-6 border-t border-gray-100">
                        <SubGroupTitle>Order</SubGroupTitle>
                        {/* xl: one row — Delivery Date as wide as Destination 1
                            (a quarter, like the 4-column grid); Types, Units
                            and the Competitor buttons each exactly as wide as
                            Attachments in General (same calc as its 1.4fr
                            track there); the competitor's name a quarter too,
                            like Delivery Date — the rest of the row stays
                            empty. */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-[calc((100%-72px)/4)_calc((100%-72px)*1.4/10.4)_calc((100%-72px)*1.4/10.4)_calc((100%-72px)*1.4/10.4)_calc((100%-72px)/4)] items-end gap-x-6 gap-y-6 md:gap-y-8">
                          <div className="relative xl:col-span-1">
                            <Label jp="納入予定日">
                              Scheduled Delivery Date
                            </Label>
                            <input
                              type="text"
                              {...ypInput("deliveryDate")}
                              placeholder="e.g. End of year or 2026-11-30"
                            />
                          </div>
                          <div className="relative xl:col-span-1">
                            <Label jp="数量等 · タイプ">Number of Types</Label>
                            <UnitInput
                              unit="types"
                              inputProps={{
                                ...ypInput("quantityTypes"),
                                placeholder: "e.g. 2",
                              }}
                            />
                          </div>
                          <div className="relative xl:col-span-1">
                            <Label jp="数量等 · 基">Number of Units</Label>
                            <UnitInput
                              unit="units"
                              inputProps={{
                                ...ypInput("quantityUnits"),
                                placeholder: "e.g. 7",
                              }}
                            />
                          </div>

                          {/* One field, like the cover's ☐無 ☐有[ ]: No / Yes,
                              then the name right beside "Yes". The name box is
                              always there (no layout jump) but only usable
                              once Yes is picked. Two columns wide; on phones
                              the name goes under the buttons. */}
                          {/* xl: a subgrid over the last two columns — the
                              buttons take the 3rd narrow column, the name
                              box the column after it (pulled 16px left so it
                              still sits 8px from "Yes"). */}
                          <div className="relative sm:col-span-2 xl:col-span-2 xl:grid xl:grid-cols-subgrid xl:items-end">
                            <div className="xl:col-span-2">
                              <Label jp="競合他社">Competitor</Label>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 xl:contents">
                              <div className="sm:w-[calc(50%-12px)] xl:w-auto shrink-0">
                                <BtnGroup
                                  options={COMPETITOR_OPTIONS}
                                  value={yp.hasCompetitor}
                                  onChange={selectCompetitor}
                                  allowDeselect
                                />
                              </div>
                              <input
                                ref={competitorNameRef}
                                type="text"
                                {...ypInput("competitorName")}
                                disabled={yp.hasCompetitor !== "yes"}
                                aria-label="Competitor name"
                                placeholder={
                                  yp.hasCompetitor === "yes"
                                    ? "Competitor name"
                                    : "Select Yes first"
                                }
                                className={`${inputStyle(false)} min-w-0 xl:-ml-4 ${DISABLED_INPUT}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {/* YP: Design Conditions */}
                  {SHOW_DESIGN_CONDITIONS && (
                    <div>
                      <SectionTitle hint="used for calculation">
                        Design Conditions
                      </SectionTitle>
                      <SectionCard>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 md:gap-y-8">
                          <div className="relative">
                            <Label>Design Standard</Label>
                            <FormSelect
                              options={[{ value: "JIL1003", label: "JIL1003" }]}
                              value="JIL1003"
                              onChange={() => {}}
                            />
                          </div>
                          <div className="relative">
                            <Label>Wind Speed</Label>
                            <div className="relative">
                              <input
                                type="number"
                                className={`${inputStyle(false)} pr-10`}
                                placeholder="e.g. 60"
                              />
                              <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                                m/s
                              </span>
                            </div>
                          </div>
                          <div className="relative">
                            <Label>Air Density</Label>
                            <div className="relative">
                              <input
                                type="number"
                                defaultValue="1.22"
                                className={`${inputStyle(false)} pr-14`}
                              />
                              <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                                kg/m³
                              </span>
                            </div>
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                  )}

                  {/* YP: Plating Specification */}
                  {/* Same style as Request Scope: content-width option
                      buttons, and every choice visible (no dropdown) — the
                      wording options are long and worth reading, as on the
                      cover's checkbox list. */}
                  <div>
                    <SectionTitle tag="Optional">
                      Plating Specification{" "}
                      <span lang="ja" className="font-normal text-gray-500">
                        メッキ仕様
                      </span>
                    </SectionTitle>
                    <SectionCard>
                      <div>
                        <Label jp="溶融亜鉛メッキ">Hot-dip Galvanizing</Label>
                        <BtnGroup
                          fit
                          options={PLATING_OPTIONS}
                          value={yp.plating}
                          onChange={setYpField("plating")}
                          allowDeselect
                        />
                      </div>
                      <div className="mt-6 md:mt-8">
                        <Label jp="以降の文言">Additional Wording</Label>
                        {/* Pick one. Circle = single choice. Special note and
                            Not stated carry their text box on the same row,
                            greyed out until that option is picked. Rows share
                            one height (50px; the in-row box is 32px tall). */}
                        <div
                          role="radiogroup"
                          className="flex flex-col gap-2 max-w-3xl"
                        >
                          {PLATING_PROVISO_OPTIONS.map((opt) => {
                            const isActive = yp.platingProviso === opt.value;
                            return (
                              <div
                                key={opt.value}
                                className={`flex flex-col gap-2 rounded-lg hp:rounded-md border px-3 xl:px-4 py-2 transition-colors ${
                                  isActive
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-50"
                                    : "border-gray-300 bg-white hover:border-slate-400 hover:bg-slate-50"
                                }`}
                              >
                                <button
                                  type="button"
                                  role="radio"
                                  aria-checked={isActive}
                                  title={opt.jp}
                                  onClick={() => selectProviso(opt.value)}
                                  className="flex items-center gap-2.5 py-0.5 text-left text-xs md:text-sm font-medium"
                                >
                                  {isActive ? (
                                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-blue-500" />
                                  ) : (
                                    <Circle className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-slate-300" />
                                  )}
                                  <span
                                    className={
                                      isActive
                                        ? "text-blue-700"
                                        : "text-gray-700"
                                    }
                                  >
                                    {opt.label}
                                    {opt.value !== "t6_jis" &&
                                      opt.value !== "t32_hdz40" && (
                                        <span
                                          lang="ja"
                                          className="ml-1.5 font-normal text-gray-500"
                                        >
                                          {opt.jp}
                                        </span>
                                      )}
                                  </span>
                                </button>
                                {opt.text && isActive && (
                                  <input
                                    ref={(el) => {
                                      provisoTextRefs.current[opt.value] = el;
                                    }}
                                    type="text"
                                    {...ypInput("platingProvisoText")}
                                    aria-label={opt.textLabel}
                                    placeholder={`${opt.textLabel}${opt.textJp ? ` (${opt.textJp})` : ""}`}
                                    className={`${inputStyle(false)} !w-full`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {requestNoteSection}
                </>
              )}

              {/* ── Footer Actions ──────────────────────────────────────── */}
              <div className="border-t border-gray-200" />
              <div className="flex flex-wrap justify-between items-center gap-3 pt-4 md:pt-0">
                <div className="flex items-center gap-2">
                  {/* Reset => clears or reverts the form */}
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 md:px-6 rounded-lg hp:rounded-md bg-white text-red-500 font-medium text-xs md:text-sm hover:bg-red-50 hover:text-red-600 transition-colors border border-red-300"
                  >
                    <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                    {isEditMode ? "Reset Changes" : "Reset"}
                  </button>

                  {/* Cancel button in edit mode */}
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => navigate(`/requests/detail/${requestId}`)}
                      className="px-5 py-2.5 md:px-6 rounded-lg hp:rounded-md bg-white text-slate-700 font-medium text-xs md:text-sm hover:bg-slate-50 transition-colors border border-slate-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Enabled once a cover type is picked; empty required
                    fields are reported on click. */}
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!coverType}
                    className={`
                    flex justify-center items-center gap-2
                    px-5 py-2.5 md:px-6
                    rounded-lg hp:rounded-md font-medium
                    text-xs md:text-sm shadow-sm transition-all
                    ${
                      coverType
                        ? "bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                  >
                    <span>{isEditMode ? "Save Changes" : "Save Request & Continue"}</span>
                    <ChevronRight className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
                  </button>
                  {showRequiredErrors && missingRequiredKeys.length > 0 && (
                    <p className="text-[11px] md:text-xs text-red-500">
                      {missingRequiredKeys.length} required{" "}
                      {missingRequiredKeys.length === 1
                        ? "field is"
                        : "fields are"}{" "}
                      still empty, marked in red above.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmResetAllModal {...leaveConfirmProps} />

      <ConfirmResetAllModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={handleResetForm}
        {...RESET_COPY[coverType ?? "yp"]}
      />

      <ConfirmResetAllModal
        open={coverConfirm !== null}
        onClose={() => setCoverConfirm(null)}
        onReset={confirmCoverAction}
        {...coverConfirmCopy(coverConfirm, editedKeys.length)}
      />

      {/* ── Edit Mode Save Confirmation Modal ── */}
      {showSaveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Save Changes?
                </h3>
                <p className="text-xs text-slate-500">
                  Confirm changes to this request
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              Apakah Anda yakin ingin menyimpan perubahan pada request ini? Data request yang telah diedit akan disimpan dan Anda akan dialihkan kembali ke halaman Request Detail.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSaveConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmSaveEdit}
                className="px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#0d3b66] hover:bg-[#0b3157] shadow-sm transition-all"
              >
                Yes, Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
