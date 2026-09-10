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
  TowerControl as TowerControlIcon,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { DraftActionModal } from "../modals/DraftActionModal";
import { ToastModal } from "../modals/ToastModal";
import { BaseplateIcon } from "../../../../assets/icon";
import { clearCalculationSession } from "../../utils";
import {
  saveWorkingSessionToDraft,
  clearActiveDraftId,
  hasDraftChanged,
} from "../../utils/coreLogic";
import { useScrollDirection } from "../../../../hooks/useScrollDirection";

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export function HeaderCalculationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, draftId } = useParams();

  const [showDraftModal, setShowDraftModal] = useState(false);
  const [toast, setToast] = useState(null);

  const scrollRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

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
  const isProjectComplete = () => {
    if (!config) return false;

    const hasArrayData = (key) => {
      const val = sessionStorage.getItem(`${type}_${key}`);

      if (!val || val === "null") {
        return false;
      }

      try {
        const arr = JSON.parse(val);
        return Array.isArray(arr) && arr.length > 0;
      } catch {
        return false;
      }
    };

    const isValueSet = (key) => {
      const val = sessionStorage.getItem(`${type}_${key}`);

      return val !== null && val !== "null";
    };

    const hasPole = config.pole ? hasArrayData("results") : true;

    const hasOpening = config.opening ? isValueSet("calculatedOp") : true;

    const hasBaseplate = config.baseplate
      ? isValueSet("calculatedBaseplate")
      : true;

    const hasFoundation = config.foundation
      ? isValueSet("calculatedFoundation")
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
    try {
      const val = sessionStorage.getItem(`${type}_results`);
      if (!val || val === "null") return false;
      const arr = JSON.parse(val);
      return Array.isArray(arr) && arr.length > 0;
    } catch {
      return false;
    }
  })();
  const isOpeningStepCompleted = config?.opening
    ? sessionStorage.getItem(`${type}_calculatedOp`) !== null &&
      sessionStorage.getItem(`${type}_calculatedOp`) !== "null"
    : false;
  const isBaseplateStepCompleted = config?.baseplate
    ? sessionStorage.getItem(`${type}_calculatedBaseplate`) !== null &&
      sessionStorage.getItem(`${type}_calculatedBaseplate`) !== "null"
    : false;
  const isFoundationStepCompleted = config?.foundation
    ? sessionStorage.getItem(`${type}_calculatedFoundation`) !== null &&
      sessionStorage.getItem(`${type}_calculatedFoundation`) !== "null"
    : false;

  // ─── CALCULATION NAVIGATION ──────────────────────────────────────────────
  const navItems = [
    {
      label: "Calculation Setup",
      path: `/calculation/${type}/${draftId}/initial`,
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
            disabledMessage: "Complete Calculation Setup first",
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
              : "Complete Calculation Setup first",
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
      path: `/calculation/${type}/${draftId}/drawing/general`,
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

  // ─── STICKY HEADER ───────────────────────────────────────────────────────
  const scrollDirection = useScrollDirection();
  const isHidden = scrollDirection === "down";

  // ─── TAB RENDER HELPER ───────────────────────────────────────────────────
  const renderTabs = () =>
    currentNavItems.map((item, index) => {
      const isActive = location.pathname === item.path;
      const isDisabled = item.disabled;
      const Icon = item.icon; // always original icon, no Lock

      return (
        <div key={item.path} className="flex items-center">
          <button
            type="button"
            data-active={isActive}
            title={isDisabled ? item.disabledMessage : undefined}
            onClick={() => !isDisabled && navigate(item.path)}
            disabled={isDisabled}
            className={`flex flex-row items-center justify-center gap-1.5 shrink-0
              px-3 py-2 md:px-4
              rounded-lg
              text-xs md:text-sm
              font-medium transition-all duration-200 border
              ${isManyTabs ? "w-auto" : "min-w-0"}
              ${
                isDisabled
                  ? "bg-slate-50 text-slate-400 border-dashed border-slate-300"
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
    <div
      className={`relative z-10 sm:sticky sm:top-16 sm:z-30 w-[calc(100%+2px)] -mx-[1px] bg-[#f8fafc] transition-transform duration-300 ease-in-out ${
        isHidden ? "sm:-translate-y-16" : "sm:translate-y-0"
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

          {/* DESKTOP: CALCULATION / DRAWING MODE SWITCH */}
          <div className="hidden sm:flex flex-[2] md:flex-[3] flex-col items-center justify-center">
            {workflow.projectMode === "both" && !isProjectIdentityPage ? (
              <div className="flex bg-white/10 p-1 rounded-lg gap-2 border border-white/20 items-center">
                {/* CALCULATION */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/calculation/${type}/${draftId}/initial`)
                  }
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    !isDrawingPage
                      ? "bg-white text-[#0d3b66] shadow-sm"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Calculation
                </button>

                <div className="flex items-center justify-center text-white/50 px-0.5">
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isDrawingPage ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* DRAWING */}
                <button
                  type="button"
                  onClick={() => {
                    if (!isProjectComplete()) {
                      setToast({
                        message:
                          "Please complete all calculations before proceeding to drawing.",
                        type: "error",
                      });
                    } else {
                      navigate(`/calculation/${type}/${draftId}/drawing`);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isDrawingPage
                      ? "bg-white text-[#0d3b66] shadow-sm"
                      : "text-white hover:bg-white/10"
                  } ${
                    !isProjectComplete() && !isDrawingPage ? "opacity-80" : ""
                  }`}
                >
                  {!isProjectComplete() && !isDrawingPage && (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  Drawing
                </button>
              </div>
            ) : null}
          </div>

          {/* SAVE DRAFT */}
          <div className="flex-1 flex justify-end relative">
            <button
              type="button"
              onClick={handleQuickSave}
              className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white rounded-lg hp:rounded-md text-xs sm:text-sm font-medium transition"
            >
              <Save className="w-4 h-4 shrink-0" />

              <span className="hidden sm:inline">Save Draft</span>

              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>

        {/* MOBILE: CALCULATION / DRAWING SWITCH */}
        {workflow.projectMode === "both" && !isProjectIdentityPage && (
          <div className="flex sm:hidden bg-white/10 p-1 rounded-lg gap-1 border border-white/20 w-full items-center">
            {/* CALCULATION */}
            <button
              type="button"
              onClick={() =>
                navigate(`/calculation/${type}/${draftId}/initial`)
              }
              className={`flex-1 flex justify-center items-center gap-2 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                !isDrawingPage
                  ? "bg-white text-[#0d3b66] shadow-sm"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Calculation
            </button>

            <div className="flex items-center justify-center text-white/50 shrink-0">
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isDrawingPage ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* DRAWING */}
            <button
              type="button"
              onClick={() => {
                if (!isProjectComplete()) {
                  setToast({
                    message:
                      "Please complete all calculations before proceeding to drawing.",
                    type: "error",
                  });
                } else {
                  navigate(`/calculation/${type}/${draftId}/drawing`);
                }
              }}
              className={`flex-1 flex justify-center items-center gap-2 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                isDrawingPage
                  ? "bg-white text-[#0d3b66] shadow-sm"
                  : "text-white hover:bg-white/10"
              } ${!isProjectComplete() && !isDrawingPage ? "opacity-80" : ""}`}
            >
              {!isProjectComplete() && !isDrawingPage && (
                <Lock className="w-3 h-3" />
              )}
              Drawing
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
                const isActive = location.pathname === item.path;
                const isDisabled = item.disabled;
                const Icon = isDisabled ? Lock : item.icon;

                return (
                  <div key={item.path} className="flex items-center">
                    <button
                      type="button"
                      data-active={isActive}
                      onClick={() => !isDisabled && navigate(item.path)}
                      disabled={isDisabled}
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

      {/* ─── MODALS ─────────────────────────────────────────────────────────── */}

      <DraftActionModal
        open={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        onSave={handleSaveAndLeave}
        onDiscard={handleDiscard}
      />

      <ToastModal toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
