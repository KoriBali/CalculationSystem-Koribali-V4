import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  LayoutDashboard,
  TowerControl,
  DoorOpen,
  Layers,
  Save,
  ChevronRight,
  ChevronLeft,
  FileEdit,
  Link,
  PaintBucket,
  Lock,
  Check,
  TowerControl as TowerControlIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { DraftActionModal } from "../modals/DraftActionModal";
import { ToastModal } from "../modals/ToastModal";
import { LockedDrawingModal } from "../modals/LockedDrawingModal";
import { SmartPreserveModal } from "../modals/SmartPreserveModal";
import { BaseplateIcon } from "../../../../assets/icon";
import { clearCalculationSession } from "../../utils";
import {
  saveWorkingSessionToDraft,
  clearActiveDraftId,
  hasDraftChanged,
  checkSmartPreserveWarning,
  saveCalculationSnapshot,
  clearSmartPreserveWarning,
} from "../../utils/coreLogic";
import { CALCULATION_PROGRESS_EVENT } from "../../utils/calculationProgressEvent";
import { useCollapsibleStickyHeader } from "../../../../hooks/useCollapsibleStickyHeader";

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export function HeaderCalculationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, draftId } = useParams();

  const [showDraftModal, setShowDraftModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showSmartPreserveModal, setShowSmartPreserveModal] = useState(false);

  const scrollRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  // Once scrolled, the sticky header can be folded into a slim pill on the
  // left (like the sidebar) so it stops covering the form. Flow height never
  // changes — the full header just becomes transparent/click-through — so
  // toggling doesn't shift the content under the user.
  const { canCollapse, isCollapsed, toggleCollapsed } =
    useCollapsibleStickyHeader();

  // The button that was clicked disappears (goes inert) on toggle, which
  // would drop keyboard focus onto <body>. Hand focus to its counterpart
  // instead: Minimize → Expand, Expand → Minimize.
  const expandButtonRef = useRef(null);
  const minimizeButtonRef = useRef(null);
  const focusAfterToggleRef = useRef(false);

  const handleToggleCollapsed = () => {
    focusAfterToggleRef.current = true;
    toggleCollapsed();
  };

  useEffect(() => {
    if (!focusAfterToggleRef.current) return;
    focusAfterToggleRef.current = false;
    const target = isCollapsed ? expandButtonRef : minimizeButtonRef;
    target.current?.focus({ preventScroll: true });
  }, [isCollapsed]);

  // ─── LIVE TAB-LOCK STATE ─────────────────────────────────────────────────
  // isPoleStepCompleted/isOpeningStepCompleted/etc. below read sessionStorage
  // directly in the render body — accurate for whatever *this* render sees,
  // but nothing about that read is reactive. A calculation hook (e.g.
  // usePoleCalculation) writes the fresh "isCalculated" flag the instant
  // Calculate succeeds, yet this component — a separately mounted instance —
  // has no way to know that happened, since React only re-renders on its own
  // state/props/context changes. Without this, a tab stayed locked-looking
  // until *something else* this component does depend on changed, i.e. only
  // once the user also clicked Next and the route changed (useLocation()
  // below). Subscribing to this event and bumping a counter re-renders as
  // soon as Calculate succeeds, no navigation required.
  const [, forceTabLockRerender] = useState(0);
  useEffect(() => {
    const handleProgressChange = () => forceTabLockRerender((n) => n + 1);
    window.addEventListener(CALCULATION_PROGRESS_EVENT, handleProgressChange);
    return () =>
      window.removeEventListener(
        CALCULATION_PROGRESS_EVENT,
        handleProgressChange,
      );
  }, []);

  // ─── TAB SCROLL ──────────────────────────────────────────────────────────
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    handleScroll();

    // Auto-scroll to active tab so it's not hidden
    if (scrollRef.current) {
      const activeTab = scrollRef.current.querySelector('[data-active="true"]');

      if (activeTab) {
        const container = scrollRef.current;
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();

        // Check if tab is fully visible,
        // accounting for scroll button area
        const leftPadding = showLeftScroll ? 40 : 0;
        const rightPadding = showRightScroll ? 40 : 0;

        const isFullyVisible =
          tabRect.left >= containerRect.left + leftPadding &&
          tabRect.right <= containerRect.right - rightPadding;

        if (!isFullyVisible) {
          const targetScroll =
            container.scrollLeft +
            (tabRect.left - containerRect.left) -
            containerRect.width / 2 +
            tabRect.width / 2;

          container.scrollTo({
            left: targetScroll,
            behavior: "smooth",
          });
        }
      }
    }

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, [location.pathname]);

  const scrollTabs = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;

      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ─── WORKFLOW ────────────────────────────────────────────────────────────
  const rawWorkflow = sessionStorage.getItem(`${type}_workflow`);
  const workflow = rawWorkflow ? JSON.parse(rawWorkflow) : {};

  // ─── CALCULATION CONFIG ──────────────────────────────────────────────────
  const raw = sessionStorage.getItem(`${type}_calculation_config`);
  const config = raw ? JSON.parse(raw) : null;

  // ─── CHECK CALCULATION COMPLETION ────────────────────────────────────────
  // Gates entry to the Drawing phase. Driven by the same "isCalculated*"
  // flags each step's own Calculate/Next button and tab-lock use (see
  // isPoleStepCompleted etc. below) — not by whether result data merely
  // exists in sessionStorage. A step's result data can outlive its
  // isCalculated flag (e.g. it's edited afterward, or a condition change
  // invalidates it) while staying on screen as a stale reference, so
  // checking data presence alone would let a user reach Drawing with
  // out-of-date calculations. Checking the flag keeps this in sync with
  // "has this step actually been calculated against its current inputs".
  const isProjectComplete = () => {
    if (!config) return false;

    const isFlagSet = (key) => sessionStorage.getItem(`${type}_${key}`) === "true";

    const hasPole = config.pole ? isFlagSet("isCalculatedPole") : true;

    const hasOpening = config.opening ? isFlagSet("isCalculatedOp") : true;

    const hasBaseplate = config.baseplate
      ? isFlagSet("isCalculatedBp")
      : true;

    const hasFoundation = config.foundation
      ? isFlagSet("isCalculatedFd")
      : true;

    return hasPole && hasOpening && hasBaseplate && hasFoundation;
  };

  // ─── CONDITION ───────────────────────────────────────────────────────────
  const rawCondition = sessionStorage.getItem(`${type}_condition`);
  const condition = rawCondition ? JSON.parse(rawCondition) : null;

  const isInvalidCustomBoth =
    workflow.projectMode === "both" && condition?.poleType === "custom";

  // ─── STEP COMPLETION ─────────────────────────────────────────────────────
  const isConditionCompleted = !!condition?.designStandard;
  const isPoleStepCompleted = (() => {
    if (!config?.pole) return false;
    return sessionStorage.getItem(`${type}_isCalculatedPole`) === "true";
  })();
  const isOpeningStepCompleted = config?.opening
    ? sessionStorage.getItem(`${type}_isCalculatedOp`) === "true"
    : false;
  const isBaseplateStepCompleted = config?.baseplate
    ? sessionStorage.getItem(`${type}_isCalculatedBp`) === "true"
    : false;
  const isFoundationStepCompleted = config?.foundation
    ? sessionStorage.getItem(`${type}_isCalculatedFd`) === "true"
    : false;

  // ─── CALCULATION NAVIGATION ──────────────────────────────────────────────
  const navItems = [
    {
      label: "Calculation Condition",
      path: `/calculation/${type}/${draftId}/calculation-condition`,
      icon: LayoutDashboard,
      completed: isConditionCompleted,
      disabled: false,
      disabledMessage: null,
    },

    ...(config?.pole && !isInvalidCustomBoth
      ? [
          {
            label: "Pole",
            path: `/calculation/${type}/${draftId}/pole`,
            icon: TowerControl,
            completed: isPoleStepCompleted,
            disabled: !isConditionCompleted,
            disabledMessage: "Complete Calculation Condition first",
          },
        ]
      : []),

    ...(config?.opening && !isInvalidCustomBoth
      ? [
          {
            label: "Opening",
            path: `/calculation/${type}/${draftId}/opening`,
            icon: DoorOpen,
            completed: isOpeningStepCompleted,
            disabled: config?.pole
              ? !isPoleStepCompleted
              : !isConditionCompleted,
            disabledMessage: config?.pole
              ? 'Click "Calculate Result" in Pole first'
              : "Complete Calculation Condition first",
          },
        ]
      : []),

    ...(config?.baseplate && !isInvalidCustomBoth
      ? [
          {
            label: "Baseplate",
            path: `/calculation/${type}/${draftId}/baseplate`,
            icon: BaseplateIcon,
            completed: isBaseplateStepCompleted,
            disabled:
              (config?.pole && !isPoleStepCompleted) ||
              (config?.opening && !isOpeningStepCompleted),
            disabledMessage:
              config?.pole && !isPoleStepCompleted
                ? 'Click "Calculate Result" in Pole first'
                : 'Click "Calculate Result" in Opening first',
          },
        ]
      : []),

    ...(config?.foundation && !isInvalidCustomBoth
      ? [
          {
            label: "Foundation",
            path: `/calculation/${type}/${draftId}/foundation`,
            icon: Layers,
            completed: isFoundationStepCompleted,
            disabled:
              (config?.pole && !isPoleStepCompleted) ||
              (config?.opening && !isOpeningStepCompleted) ||
              (config?.baseplate && !isBaseplateStepCompleted),
            disabledMessage:
              config?.pole && !isPoleStepCompleted
                ? 'Click "Calculate Result" in Pole first'
                : config?.opening && !isOpeningStepCompleted
                  ? 'Click "Calculate Result" in Opening first'
                  : 'Click "Calculate Result" in Baseplate first',
          },
        ]
      : []),
  ];

  // ─── CURRENT PAGE ────────────────────────────────────────────────────────
  const isProjectIdentityPage =
    location.pathname === `/calculation/${type}/${draftId}` ||
    location.pathname === `/calculation/${type}/${draftId}/`;

  const isDrawingPage = location.pathname.includes(
    `/calculation/${type}/${draftId}/drawing`,
  );

  // ─── DRAWING COMPLETION ──────────────────────────────────────────────────
  const isDrawingCompleted =
    sessionStorage.getItem(`${type}_drawing_completed`) === "true";

  const isPoleCompletedRaw =
    sessionStorage.getItem(`${type}_drawing_pole_completed`) === "true";

  const requirePole = workflow.projectMode === "drawing";

  const isPoleCompleted = !requirePole || isPoleCompletedRaw;

  // Only show coupling tab if the user explicitly
  // clicked Save & Continue with coupling enabled
  const isCouplingUsed =
    sessionStorage.getItem(`${type}_drawing_coupling_confirmed`) === "true";

  const isCouplingCompleted =
    sessionStorage.getItem(`${type}_drawing_coupling_completed`) === "true";

  // ─── DRAWING GENERAL CONFIG ──────────────────────────────────────────────
  const rawGeneral = sessionStorage.getItem(`${type}_drawing_general`);

  const general = rawGeneral ? JSON.parse(rawGeneral) : null;

  const isOpeningEnabled = general?.additionalComponents?.opening === true;

  const isOpeningCompleted =
    sessionStorage.getItem(`${type}_drawing_opening_completed`) === "true";

  const isBaseplateEnabled = general?.additionalComponents?.baseplate === true;

  const isBaseplateCompleted =
    sessionStorage.getItem(`${type}_drawing_baseplate_completed`) === "true";

  const isFoundationEnabled =
    general?.additionalComponents?.foundation === true;

  const isFoundationCompleted =
    sessionStorage.getItem(`${type}_drawing_foundation_completed`) === "true";

  // In "both" mode, drawing opening/baseplate tabs don't exist
  // so treat them as completed/not required
  const isDrawingOpeningRequired = requirePole && isOpeningEnabled;

  const isDrawingBaseplateRequired = requirePole && isBaseplateEnabled;

  const isDrawingFoundationRequired = requirePole && isFoundationEnabled;

  const isDrawingSetupCompleted = isDrawingCompleted;

  // ─── DRAWING NAVIGATION ──────────────────────────────────────────────
  const drawingNavItems = [
    {
      label: "Drawing Setup",
      path: `/calculation/${type}/${draftId}/drawing/drawing-setup`,
      icon: FileEdit,
      disabled: false,
      completed: isDrawingSetupCompleted,
    },

    ...(isDrawingCompleted && requirePole
      ? [
          {
            label: "Pole",
            path: `/calculation/${type}/${draftId}/drawing/pole`,
            icon: TowerControlIcon,
            disabled: false,
            completed: isPoleCompleted,
            disabledMessage: null,
          },
        ]
      : []),

    ...(isDrawingCompleted && requirePole && isOpeningEnabled
      ? [
          {
            label: "Opening",
            path: `/calculation/${type}/${draftId}/drawing/opening`,
            icon: DoorOpen,
            disabled: !isPoleCompleted,
            completed: isOpeningCompleted,
            disabledMessage: 'Click "Save & Continue" in Pole first',
          },
        ]
      : []),

    ...(isDrawingCompleted && requirePole && isBaseplateEnabled
      ? [
          {
            label: "Baseplate",
            path: `/calculation/${type}/${draftId}/drawing/baseplate`,
            icon: BaseplateIcon,
            disabled:
              !isPoleCompleted || (isOpeningEnabled && !isOpeningCompleted),
            completed: isBaseplateCompleted,
            disabledMessage: !isPoleCompleted
              ? 'Click "Save & Continue" in Pole first'
              : 'Click "Save & Continue" in Opening first',
          },
        ]
      : []),

    ...(isDrawingCompleted && requirePole && isFoundationEnabled
      ? [
          {
            label: "Foundation",
            path: `/calculation/${type}/${draftId}/drawing/foundation`,
            icon: Layers,
            disabled:
              !isPoleCompleted ||
              (isOpeningEnabled && !isOpeningCompleted) ||
              (isBaseplateEnabled && !isBaseplateCompleted),
            completed: isFoundationCompleted,
            disabledMessage: !isPoleCompleted
              ? 'Click "Save & Continue" in Pole first'
              : isOpeningEnabled && !isOpeningCompleted
                ? 'Click "Save & Continue" in Opening first'
                : 'Click "Save & Continue" in Baseplate first',
          },
        ]
      : []),

    ...(isDrawingCompleted && isCouplingUsed
      ? [
          {
            label: "Coupling",
            path: `/calculation/${type}/${draftId}/drawing/coupling`,
            icon: Link,
            disabled:
              !isPoleCompleted ||
              (isDrawingOpeningRequired && !isOpeningCompleted) ||
              (isDrawingBaseplateRequired && !isBaseplateCompleted) ||
              (isDrawingFoundationRequired && !isFoundationCompleted),
            disabledMessage: "Complete all previous steps first",
          },
        ]
      : []),

    ...(isDrawingCompleted
      ? [
          {
            label: "Surface",
            path: `/calculation/${type}/${draftId}/drawing/surface`,
            icon: PaintBucket,
            disabled:
              !isPoleCompleted ||
              (isDrawingOpeningRequired && !isOpeningCompleted) ||
              (isDrawingBaseplateRequired && !isBaseplateCompleted) ||
              (isDrawingFoundationRequired && !isFoundationCompleted) ||
              (isCouplingUsed && !isCouplingCompleted),
            disabledMessage: "Complete all previous steps first",
          },
        ]
      : []),
  ];

  // ─── CURRENT NAVIGATION ──────────────────────────────────────────────────
  const currentNavItems = isDrawingPage ? drawingNavItems : navItems;

  const totalTabs = currentNavItems.length;
  const isManyTabs = totalTabs > 5;

  // ─── BACK ────────────────────────────────────────────────────────────────
  const handleBackClick = () => {
    if (isProjectIdentityPage) {
      // Check if draft actually changed before showing modal
      if (!hasDraftChanged(type, draftId)) {
        handleDiscard();
      } else {
        setShowDraftModal(true);
      }
    } else {
      // Other calculation step:
      // return to Project Setup
      navigate(`/calculation/${type}/${draftId}`);
    }
  };

  // ─── SAVE AND LEAVE ──────────────────────────────────────────────────────
  const handleSaveAndLeave = () => {
    saveWorkingSessionToDraft(type, draftId);

    setToast({
      message: "Draft successfully saved!",
      type: "success",
    });

    setShowDraftModal(false);

    setTimeout(() => {
      clearCalculationSession(type);
      clearActiveDraftId(type);

      navigate(`/calculation/${type}`);
    }, 2500);
  };

  // ─── QUICK SAVE ──────────────────────────────────────────────────────────
  const handleQuickSave = () => {
    saveWorkingSessionToDraft(type, draftId);

    setToast({
      message: "Draft successfully saved!",
      type: "success",
    });
  };

  // ─── DISCARD ─────────────────────────────────────────────────────────────
  const handleDiscard = () => {
    clearCalculationSession(type);
    clearActiveDraftId(type);

    navigate(`/calculation/${type}`);
  };

  // ─── TAB RENDER HELPER ───────────────────────────────────────────────────
  const renderTabs = () =>
    currentNavItems.map((item, index) => {
      const normalizePath = (p) => p.replace(/\/$/, "");
      const isActive = normalizePath(location.pathname) === normalizePath(item.path);
      const isDisabled = item.disabled;
      const Icon = item.icon; // always original icon, no Lock

      return (
        <div key={item.path} className="flex items-center">
          <button
            type="button"
            data-active={isActive}
            aria-disabled={isDisabled}
            title={isDisabled ? item.disabledMessage : undefined}
            onClick={() => {
              // Not a native `disabled` button on purpose: a disabled button
              // never fires onClick at all, so the only way a locked tab
              // could explain itself was the `title` tooltip above — which
              // needs a mouse hover and never appears on touch. Handling
              // the click ourselves means tapping a locked tab on mobile
              // (or clicking one on desktop without hovering first) also
              // surfaces why, via the same toast used elsewhere in this file.
              if (isDisabled) {
                setToast({ message: item.disabledMessage, type: "error" });
              } else {
                navigate(item.path);
              }
            }}
            className={`flex flex-row items-center justify-center gap-1.5 shrink-0
              px-3 py-2 md:px-4
              rounded-lg
              text-xs md:text-sm
              font-medium transition-all duration-200 border
              ${isManyTabs ? "w-auto" : "min-w-0"}
              ${
                isDisabled
                  ? "bg-slate-50 text-slate-400 border-dashed border-slate-300 cursor-not-allowed"
                  : isActive
                    ? "bg-[#0d3b66] text-white border-[#0d3b66] shadow-sm cursor-default"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
              }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                isDisabled
                  ? "text-slate-400"
                  : isActive
                    ? "text-white"
                    : "text-slate-500"
              }`}
            />
            <span className="whitespace-nowrap">{item.label}</span>
          </button>

          {index < currentNavItems.length - 1 && (
            <div className="flex items-center justify-center mx-2 shrink-0">
              <ChevronRight
                className={`w-4 h-4 ${item.completed ? "text-[#0d3b66]" : "text-slate-300"}`}
              />
            </div>
          )}
        </div>
      );
    });

  return (
    <>
    <div
      className={`relative z-10 sm:sticky sm:top-16 sm:z-30 w-[calc(100%+2px)] -mx-[1px] transition-colors duration-300 motion-reduce:transition-none ${
        isCollapsed ? "bg-transparent pointer-events-none" : "bg-[#f8fafc]"
      }`}
    >
      {/* ─── COLLAPSED PILL ─────────────────────────────────────────────────
          Aligned with the Back button's position in the full header, so the
          header visibly folds into the spot it collapses toward. */}
      <div
        aria-hidden={!isCollapsed}
        inert={!isCollapsed || undefined}
        className={`hidden lg:flex absolute z-10 top-2.5 left-2.5 md:left-[18px] 2xl:left-[26px] w-[68px] flex-col items-center gap-2 px-1.5 py-3 rounded-xl bg-gradient-to-b from-[#0d3b66] to-[#1a5a92] text-white shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-in-out motion-reduce:transition-none ${
          isCollapsed
            ? "opacity-100 translate-x-0 pointer-events-auto delay-100"
            : "opacity-0 -translate-x-2 pointer-events-none"
        }`}
      >
        {/* Just Expand + Save, stacked vertically so the pill stays small.
            No step name here — the app Header's breadcrumb right above
            already shows the current step. */}
        <button
          ref={expandButtonRef}
          type="button"
          onClick={handleToggleCollapsed}
          title="Expand header"
          aria-label="Expand header"
          className="flex items-center justify-center w-[38px] h-[38px] shrink-0 rounded-lg border border-white/20 hover:bg-white/10 active:bg-white/15 transition"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>

        <div className="w-8 h-px bg-white/20 my-1" />

        <button
          type="button"
          onClick={handleQuickSave}
          title="Save Draft"
          aria-label="Save Draft"
          className="flex items-center justify-center w-[38px] h-[38px] shrink-0 rounded-lg hover:bg-white/10 active:bg-white/15 transition"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>

      {/* ─── FULL HEADER ────────────────────────────────────────────────────
          Collapsing wipes it toward the left with clip-path (no text
          squashing, no layout shift). The negative insets leave room for
          the card's shadow when expanded. lg+ only: below that nothing
          collapses, and clip-path would also clip the fixed mobile tab bar. */}
      <div
        aria-hidden={isCollapsed}
        inert={isCollapsed || undefined}
        className={`transition-[clip-path,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
          isCollapsed
            ? "lg:[clip-path:inset(-12px_100%_-12px_-12px)] lg:opacity-0"
            : "lg:[clip-path:inset(-12px_-12px_-12px_-12px)] opacity-100"
        }`}
      >
      {/* ─── BLUE HEADER CARD ─────────────────────────────────────────────── */}
      <div
        className={`rounded-xl bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] shadow-sm px-3 py-3 sm:px-4 sm:py-4 md:px-6 2xl:px-8 flex flex-col gap-3 sm:gap-4 ${!isProjectIdentityPage ? "sm:rounded-t-2xl sm:rounded-b-none" : "sm:rounded-2xl"}`}
      >
        {/* TOP ROW: Back / Mode Switch / Save */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
          {/* BACK BUTTON */}
          <div className="flex-1 flex justify-start">
            <button
              type="button"
              onClick={handleBackClick}
              className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 max-w-full text-white px-3 py-2 sm:px-4 rounded-lg hp:rounded-md text-xs sm:text-sm font-medium border border-white/20 hover:bg-white/10 active:bg-white/15 transition"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />

              <span className="truncate">
                {isProjectIdentityPage
                  ? "Back to Drafts"
                  : "Back to Project Setup"}
              </span>
            </button>
          </div>

          {/* DESKTOP: PHASE STEPPER */}
          <div className="hidden sm:flex flex-[2] md:flex-[3] flex-col items-center justify-center">
            {workflow.projectMode === "both" && !isProjectIdentityPage ? (
              <div className="flex items-center w-full max-w-[300px] xl:max-w-[340px] 2xl:max-w-[400px] px-2">
                {/* Phase 1: Calculation — a pill-shaped button (not a bare
                    div) so hover/focus affordances read as "clickable" the
                    way a real button does: background highlight on hover,
                    a focus ring for keyboard users, and native disabled
                    styling when there's nothing to click back to. */}
                <button
                  type="button"
                  disabled={!isDrawingPage}
                  title={isDrawingPage ? "Back to Calculation" : undefined}
                  onClick={() => {
                    if (config?.foundation) navigate(`/calculation/${type}/${draftId}/foundation`);
                    else if (config?.baseplate) navigate(`/calculation/${type}/${draftId}/baseplate`);
                    else if (config?.opening) navigate(`/calculation/${type}/${draftId}/opening`);
                    else if (config?.pole) navigate(`/calculation/${type}/${draftId}/pole`);
                    else navigate(`/calculation/${type}/${draftId}/calculation-condition`);
                  }}
                  className={`group flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                    ${!isDrawingPage
                      ? "bg-white/15 ring-1 ring-inset ring-white/30 cursor-default"
                      : "cursor-pointer hover:bg-white/10 active:bg-white/15"}`}
                >
                  <span className={`flex items-center justify-center w-7 h-7 shrink-0 rounded-full text-xs font-bold shadow-sm ring-2 transition-all duration-200
                    ${!isDrawingPage
                      ? "bg-white text-[#0d3b66] ring-white"
                      : "bg-transparent text-white ring-white/50 group-hover:bg-white group-hover:text-[#0d3b66] group-hover:ring-white"}`}>
                    {isDrawingPage ? <Check className="w-3.5 h-3.5" /> : "1"}
                  </span>
                  <span className={`text-xs sm:text-sm font-medium transition-colors
                    ${!isDrawingPage ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                    Calculation
                  </span>
                </button>

                {/* Connector Line — dashed "route" track (always visible,
                    even before reaching Drawing) with a solid fill overlay
                    that grows over it, so the dashes read as "path ahead"
                    and the solid segment as "path already taken". */}
                <div className="flex-1 min-w-[20px] h-0 relative mx-2">
                  <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-white/40" />
                  <div className={`absolute inset-x-0 top-0 border-t-2 border-white transition-all duration-500 ease-out overflow-hidden
                    ${isDrawingPage ? "w-full" : "w-0"}`} />
                </div>

                {/* Phase 2: Drawing */}
                <button
                  type="button"
                  title={
                    !isProjectComplete()
                      ? "Complete all Calculation steps first"
                      : isDrawingPage
                        ? undefined
                        : "Go to Drawing"
                  }
                  onClick={() => {
                    if (!isProjectComplete()) {
                      setShowLockedModal(true);
                    } else if (!isDrawingPage) {
                      // Check Smart Preserve
                      if (checkSmartPreserveWarning(type)) {
                        setShowSmartPreserveModal(true);
                      } else {
                        saveCalculationSnapshot(type);
                        sessionStorage.setItem(`${type}_drawing_started`, "true");
                        navigate(`/calculation/${type}/${draftId}/drawing/drawing-setup`);
                      }
                    }
                  }}
                  className={`group flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                    ${isDrawingPage
                      ? "bg-white/15 ring-1 ring-inset ring-white/30 cursor-default"
                      : isProjectComplete()
                        ? "cursor-pointer hover:bg-white/10 active:bg-white/15"
                        : "cursor-not-allowed"}`}
                >
                  <span className={`flex items-center justify-center w-7 h-7 shrink-0 rounded-full text-xs font-bold shadow-sm ring-2 transition-all duration-200
                    ${isDrawingPage
                      ? "bg-white text-[#0d3b66] ring-white"
                      : isProjectComplete()
                        ? "bg-transparent text-white/90 ring-white/50 group-hover:bg-white group-hover:text-[#0d3b66] group-hover:ring-white"
                        : "bg-transparent text-white/40 ring-white/20"}`}>
                    {isProjectComplete() || isDrawingPage ? "2" : <Lock className="w-3.5 h-3.5" />}
                  </span>
                  <span className={`text-xs sm:text-sm font-medium transition-colors
                    ${isDrawingPage ? "text-white" : isProjectComplete() ? "text-white/70 group-hover:text-white" : "text-white/40"}`}>
                    Drawing
                  </span>
                </button>
              </div>
            ) : null}
          </div>

          {/* SAVE DRAFT + MINIMIZE */}
          <div className="flex-1 flex items-center justify-end gap-2 relative">
            <button
              type="button"
              onClick={handleQuickSave}
              className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 shrink-0 whitespace-nowrap bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white rounded-lg hp:rounded-md text-xs sm:text-sm font-medium transition"
            >
              <Save className="w-4 h-4 shrink-0" />

              <span className="hidden sm:inline">Save Draft</span>

              <span className="sm:hidden">Save</span>
            </button>

            {/* Minimize — only offered once the header is stuck over the
                content (appears together with the scroll-to-top button).
                Kept on the right, away from Back, where window "minimize"
                controls usually live, and labelled so it can't be mistaken
                for navigation. */}
            {canCollapse && (
              <>
                <div className="hidden lg:block w-px h-6 bg-white/20" />
                <button
                  ref={minimizeButtonRef}
                  type="button"
                  onClick={handleToggleCollapsed}
                  title="Minimize header"
                  aria-label="Minimize header"
                  className="hidden lg:flex items-center justify-center gap-2 px-3 py-2 shrink-0 whitespace-nowrap text-white/80 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-lg text-sm font-medium transition"
                >
                  <PanelLeftClose className="w-4 h-4 shrink-0" />
                  <span>Minimize</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* MOBILE: PHASE STEPPER — same button/pill/checkmark treatment as
            the desktop version above, scaled down for a compact touch bar. */}
        {workflow.projectMode === "both" && !isProjectIdentityPage && (
          <div className="flex sm:hidden w-full items-center justify-center px-4 pt-2">
            {/* Phase 1 */}
            <button
              type="button"
              disabled={!isDrawingPage}
              onClick={() => {
                if (config?.foundation) navigate(`/calculation/${type}/${draftId}/foundation`);
                else if (config?.baseplate) navigate(`/calculation/${type}/${draftId}/baseplate`);
                else if (config?.opening) navigate(`/calculation/${type}/${draftId}/opening`);
                else if (config?.pole) navigate(`/calculation/${type}/${draftId}/pole`);
                else navigate(`/calculation/${type}/${draftId}/calculation-condition`);
              }}
              className={`flex flex-col items-center gap-0.5 flex-1 py-1 rounded-lg transition-all duration-200
                ${!isDrawingPage ? "bg-white/15 ring-1 ring-inset ring-white/30" : "active:bg-white/10"}`}
            >
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shadow-sm ring-2 transition-colors
                ${!isDrawingPage ? "bg-white text-[#0d3b66] ring-white" : "bg-transparent text-white ring-white/50"}`}>
                {isDrawingPage ? <Check className="w-3 h-3" /> : "1"}
              </span>
              <span className={`text-[9px] font-medium transition-colors
                ${!isDrawingPage ? "text-white" : "text-white/70"}`}>
                Calc
              </span>
            </button>

            {/* Line — same dashed-track + solid-fill treatment as desktop */}
            <div className="flex-[2] min-w-[16px] h-0 relative mx-2">
              <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-white/40" />
              <div className={`absolute inset-x-0 top-0 border-t-2 border-white transition-all duration-500 overflow-hidden
                ${isDrawingPage ? "w-full" : "w-0"}`} />
            </div>

            {/* Phase 2 */}
            <button
              type="button"
              onClick={() => {
                if (!isProjectComplete()) {
                  setShowLockedModal(true);
                } else if (!isDrawingPage) {
                  if (checkSmartPreserveWarning(type)) {
                    setShowSmartPreserveModal(true);
                  } else {
                    saveCalculationSnapshot(type);
                    sessionStorage.setItem(`${type}_drawing_started`, "true");
                    navigate(`/calculation/${type}/${draftId}/drawing/drawing-setup`);
                  }
                }
              }}
              className={`flex flex-col items-center gap-0.5 flex-1 py-1 rounded-lg transition-all duration-200
                ${isDrawingPage
                  ? "bg-white/15 ring-1 ring-inset ring-white/30"
                  : isProjectComplete() ? "active:bg-white/10" : "cursor-not-allowed"}`}
            >
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shadow-sm ring-2 transition-colors
                ${isDrawingPage ? "bg-white text-[#0d3b66] ring-white"
                  : isProjectComplete() ? "bg-transparent text-white/80 ring-white/50"
                  : "bg-transparent text-white/40 ring-white/20"}`}>
                {isProjectComplete() || isDrawingPage ? "2" : <Lock className="w-2.5 h-2.5" />}
              </span>
              <span className={`text-[9px] font-medium transition-colors
                ${isDrawingPage ? "text-white" : isProjectComplete() ? "text-white/60" : "text-white/40"}`}>
                Draw
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ─── STEP NAVIGATION — DESKTOP (separate section, no gap) ─────────── */}
      {!isProjectIdentityPage && (
        <div className="hidden sm:block bg-white border border-slate-200 border-t-0 rounded-b-2xl sm:px-4 sm:py-2 md:px-6 2xl:px-8 shadow-sm">
          <div className="relative flex items-center w-full overflow-hidden">
            {/* SCROLL LEFT */}
            <div
              className={`absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-white via-white to-transparent pr-6 pl-1 transition-opacity duration-300 pointer-events-none ${
                showLeftScroll ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={() => scrollTabs("left")}
                className="pointer-events-auto flex items-center justify-center w-7 h-7 shrink-0 bg-white border border-slate-200 shadow-sm rounded-full text-slate-500 hover:text-[#0d3b66] hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* TAB LIST */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex items-center justify-start w-full overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1.5"
            >
              {renderTabs()}
            </div>

            {/* SCROLL RIGHT */}
            <div
              className={`absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-white via-white to-transparent pl-6 pr-1 transition-opacity duration-300 pointer-events-none ${
                showRightScroll ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={() => scrollTabs("right")}
                className="pointer-events-auto flex items-center justify-center w-7 h-7 shrink-0 bg-white border border-slate-200 shadow-sm rounded-full text-slate-500 hover:text-[#0d3b66] hover:bg-slate-50 transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP NAVIGATION — MOBILE (fixed bottom bar) ────────────────── */}
      {!isProjectIdentityPage && (
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-slate-200 px-3 py-1.5 [@media(max-width:639px)_and_(max-height:600px)]:hidden shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)]">
          <div className="relative flex items-center w-full overflow-hidden">
            {/* SCROLL LEFT */}
            <div
              className={`absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-white via-white to-transparent pr-6 pl-1 transition-opacity duration-300 pointer-events-none ${
                showLeftScroll ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={() => scrollTabs("left")}
                className="pointer-events-auto flex items-center justify-center w-6 h-6 shrink-0 bg-white border border-slate-200 shadow-sm rounded-full text-slate-500 hover:text-[#0d3b66] hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>

            {/* TAB LIST (mobile layout: icon on top, label below) */}
            <div className="flex items-center justify-start w-full overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
              {currentNavItems.map((item, index) => {
                const normalizePath = (p) => p.replace(/\/$/, "");
                const isActive = normalizePath(location.pathname) === normalizePath(item.path);
                const isDisabled = item.disabled;
                const Icon = isDisabled ? Lock : item.icon;

                return (
                  <div key={item.path} className="flex items-center">
                    <button
                      type="button"
                      data-active={isActive}
                      aria-disabled={isDisabled}
                      onClick={() => {
                        // Same reasoning as the desktop tabs above: this used
                        // to be a native `disabled` button with no `title`
                        // at all, so a locked tab here gave zero explanation
                        // on tap. Now a tap surfaces the reason via toast.
                        if (isDisabled) {
                          setToast({ message: item.disabledMessage, type: "error" });
                        } else {
                          navigate(item.path);
                        }
                      }}
                      className={`flex flex-col items-center justify-center gap-0.5
                        flex-none min-w-[15%]
                        px-2 py-1.5
                        rounded-lg
                        text-[10px]
                        font-medium transition-all duration-200 border
                        ${
                          isDisabled
                            ? "bg-transparent text-slate-400 border-dashed border-slate-300 cursor-not-allowed"
                            : isActive
                              ? "bg-[#0d3b66] text-white border-[#0d3b66] shadow-sm cursor-default"
                              : "bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200 cursor-pointer"
                        }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${isDisabled ? "text-slate-400" : isActive ? "text-white" : "text-slate-500"}`}
                      />
                      <span className="whitespace-nowrap text-center">
                        {item.label}
                      </span>
                    </button>

                    {index < currentNavItems.length - 1 && (
                      <div className="flex items-center justify-center mx-1 shrink-0">
                        <ChevronRight
                          className={`w-3.5 h-3.5 ${item.completed ? "text-[#0d3b66]" : "text-slate-300"}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* SCROLL RIGHT */}
            <div
              className={`absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-white via-white to-transparent pl-6 pr-1 transition-opacity duration-300 pointer-events-none ${
                showRightScroll ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={() => scrollTabs("right")}
                className="pointer-events-auto flex items-center justify-center w-6 h-6 shrink-0 bg-white border border-slate-200 shadow-sm rounded-full text-slate-500 hover:text-[#0d3b66] hover:bg-slate-50 transition-all"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

    </div>

      {/* ─── MODALS ──────────────────────────────────────────────────────────
          Rendered OUTSIDE the sticky/z-30 wrapper above on purpose: that
          wrapper sets `position + z-index`, which creates its own stacking
          context. Any modal rendered inside it — even with z-[100]/z-[200] —
          only wins against siblings *inside that same context*; the outer
          app Header (Layout.jsx, sticky z-40) sits in a different, higher
          context and would render on top of it regardless of the modal's
          own z-index. Keeping the modals as siblings of the wrapper (not
          descendants) lets their z-index compare directly against Header. */}

      <DraftActionModal
        open={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        onSave={handleSaveAndLeave}
        onDiscard={handleDiscard}
      />

      <ToastModal toast={toast} onClose={() => setToast(null)} />

      <LockedDrawingModal
        open={showLockedModal}
        onClose={() => setShowLockedModal(false)}
      />

      <SmartPreserveModal
        open={showSmartPreserveModal}
        onClose={() => setShowSmartPreserveModal(false)}
      />
    </>
  );
}
