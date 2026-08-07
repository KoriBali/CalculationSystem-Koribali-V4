import { useState } from "react";
import {
  ArrowLeft,
  LayoutDashboard,
  TowerControl,
  DoorOpen,
  Layers,
  Save,
  ChevronDown,
  ChevronRight,
  FileEdit,
  Link,
  PaintBucket,
  Lock,
  TowerControl as TowerControlIcon,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { DraftActionModal } from "../modals/DraftActionModal";
import { ConfirmResetAllModal } from "../modals/ConfirmResetAllModal";
import { ToastModal } from "../modals/ToastModal";
import { BaseplateIcon } from "../../../../assets/icon";
import { clearCalculationSession, hasCalculationData } from "../../utils";
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
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [toast, setToast] = useState(null);

  const rawWorkflow = sessionStorage.getItem(`${type}_workflow`);
  const workflow = rawWorkflow ? JSON.parse(rawWorkflow) : {};
  const isDrawingOnlyMode = workflow.projectMode === "drawing";

  const raw = sessionStorage.getItem(`${type}_calculation_config`);
  const config = raw ? JSON.parse(raw) : null;

  const isProjectComplete = () => {
    if (!config) return false;

    const hasArrayData = (key) => {
      const val = sessionStorage.getItem(`${type}_${key}`);
      if (!val || val === "null") return false;
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
    const hasBaseplate = config.baseplate ? isValueSet("calculatedBaseplate") : true;
    const hasFoundation = config.foundation ? isValueSet("calculatedFoundation") : true;

    return hasPole && hasOpening && hasBaseplate && hasFoundation;
  };

  const rawCondition = sessionStorage.getItem(`${type}_condition`);
  const condition = rawCondition ? JSON.parse(rawCondition) : null;
  const isInvalidCustomBoth = workflow.projectMode === "both" && condition?.poleType === "custom";

  const navItems = [
    {
      label: "Initial",
      path: `/calculation/${type}/${draftId}/initial`,
      icon: LayoutDashboard,
    },
    ...(config?.pole && !isInvalidCustomBoth
      ? [
          {
            label: "Pole",
            path: `/calculation/${type}/${draftId}/pole`,
            icon: TowerControl,
          },
        ]
      : []),
    ...(config?.opening && !isInvalidCustomBoth
      ? [
          {
            label: "Opening",
            path: `/calculation/${type}/${draftId}/opening`,
            icon: DoorOpen,
          },
        ]
      : []),
    ...(config?.baseplate && !isInvalidCustomBoth
      ? [
          {
            label: "Baseplate",
            path: `/calculation/${type}/${draftId}/baseplate`,
            icon: BaseplateIcon,
          },
        ]
      : []),
    ...(config?.foundation && !isInvalidCustomBoth
      ? [
          {
            label: "Foundation",
            path: `/calculation/${type}/${draftId}/foundation`,
            icon: Layers,
          },
        ]
      : []),
  ];

  const isProjectIdentityPage =
    location.pathname === `/calculation/${type}/${draftId}` ||
    location.pathname === `/calculation/${type}/${draftId}/`;
  const isDrawingPage = location.pathname.includes(
    `/calculation/${type}/${draftId}/drawing`,
  );
  
  const isDrawingCompleted = sessionStorage.getItem(`${type}_drawing_completed`) === "true";
  const isPoleCompletedRaw = sessionStorage.getItem(`${type}_drawing_pole_completed`) === "true";
  const requirePole = workflow.projectMode === "drawing";
  const isPoleCompleted = !requirePole || isPoleCompletedRaw;
  
  // Only show coupling tab if the user explicitly clicked Save & Continue with coupling enabled
  const isCouplingUsed = sessionStorage.getItem(`${type}_drawing_coupling_confirmed`) === "true";
  const isCouplingCompleted = sessionStorage.getItem(`${type}_drawing_coupling_completed`) === "true";

  const rawGeneral = sessionStorage.getItem(`${type}_drawing_general`);
  const general = rawGeneral ? JSON.parse(rawGeneral) : null;
  const isOpeningEnabled = general?.additionalComponents?.opening === true;
  const isOpeningCompleted = sessionStorage.getItem(`${type}_drawing_opening_completed`) === "true";
  
  const isBaseplateEnabled = general?.additionalComponents?.baseplate === true;
  const isBaseplateCompleted = sessionStorage.getItem(`${type}_drawing_baseplate_completed`) === "true";

  // In "both" mode, drawing opening/baseplate tabs don't exist — treat them as completed
  const isDrawingOpeningRequired = requirePole && isOpeningEnabled;
  const isDrawingBaseplateRequired = requirePole && isBaseplateEnabled;

  const drawingNavItems = [
    {
      label: "General",
      path: `/calculation/${type}/${draftId}/drawing/general`,
      icon: FileEdit,
      disabled: false,
    },
    ...(isDrawingCompleted && requirePole
      ? [
          {
            label: "Pole",
            path: `/calculation/${type}/${draftId}/drawing/pole`,
            icon: TowerControlIcon,
            disabled: false,
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
          },
        ]
      : []),
    ...(isDrawingCompleted && requirePole && isBaseplateEnabled
      ? [
          {
            label: "Baseplate",
            path: `/calculation/${type}/${draftId}/drawing/baseplate`,
            icon: BaseplateIcon,
            disabled: !isPoleCompleted || (isOpeningEnabled && !isOpeningCompleted),
          },
        ]
      : []),
    ...(isDrawingCompleted && isCouplingUsed
      ? [
          {
            label: "Coupling",
            path: `/calculation/${type}/${draftId}/drawing/coupling`,
            icon: Link,
            disabled: !isPoleCompleted
              || (isDrawingOpeningRequired && !isOpeningCompleted)
              || (isDrawingBaseplateRequired && !isBaseplateCompleted),
          },
        ]
      : []),
    ...(isDrawingCompleted
      ? [
          {
            label: "Surface",
            path: `/calculation/${type}/${draftId}/drawing/surface`,
            icon: PaintBucket,
            disabled: !isPoleCompleted
              || (isDrawingOpeningRequired && !isOpeningCompleted)
              || (isDrawingBaseplateRequired && !isBaseplateCompleted)
              || (isCouplingUsed && !isCouplingCompleted),
          },
        ]
      : []),
  ];

  const currentNavItems = isDrawingPage ? drawingNavItems : navItems;

  const handleBackClick = () => {
    if (isProjectIdentityPage) {
      // Check if draft actually changed before showing modal
      if (!hasDraftChanged(type, draftId)) {
        handleDiscard(); // Just discard and go back
      } else {
        setShowDraftModal(true);
      }
    } else {
      // If we are on any other calculation step, go back to Project Identity without a draft modal
      navigate(`/calculation/${type}/${draftId}`);
    }
  };
  const handleSaveAndLeave = () => {
    saveWorkingSessionToDraft(type, draftId);
    setToast({ message: "Draft successfully saved!", type: "success" });
    setShowDraftModal(false);
    
    setTimeout(() => {
      clearCalculationSession(type);
      clearActiveDraftId(type);
      navigate(`/calculation/${type}`);
    }, 2500);
  };
  const handleQuickSave = () => {
    saveWorkingSessionToDraft(type, draftId);
    setToast({ message: "Draft successfully saved!", type: "success" });
  };

  const handleDiscard = () => {
    clearCalculationSession(type);
    clearActiveDraftId(type);
    navigate(`/calculation/${type}`);
  };
  const handleResetAll = () => {
    clearCalculationSession(type);
    navigate(`/calculation/${type}/${draftId}`); // Just stay and reset
  };

  const scrollDirection = useScrollDirection();
  const isHidden = scrollDirection === "down";

  return (
    <div
      className={`relative z-10 sm:sticky sm:top-16 sm:z-30 w-[calc(100%+2px)] -mx-[1px] bg-[#f8fafc] transition-transform duration-300 ease-in-out ${isHidden ? "sm:-translate-y-16" : "sm:translate-y-0"}`}
    >
      {/* ── Top bar ── */}
      <div className="rounded-t-xl sm:rounded-t-2xl bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] shadow-lg px-3 py-3 sm:px-4 sm:py-4 md:px-6 2xl:px-8 flex flex-col gap-3 sm:gap-0">
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 max-w-[70%] sm:max-w-none text-white px-3 py-2 sm:px-4 rounded-lg hp:rounded-md text-xs sm:text-sm font-medium border border-white/20 hover:bg-white/10 active:bg-white/15 transition"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {isProjectIdentityPage
                ? "Back to Drafts"
                : "Back to Project Setup"}
            </span>
          </button>
          
          {/* Desktop Nav */}
          {workflow.projectMode === "both" && !isProjectIdentityPage && (
            <div className="hidden sm:flex bg-white/10 p-1 rounded-lg gap-2 border border-white/20 items-center">
              <button
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
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isDrawingPage ? "rotate-180" : ""}`} />
              </div>

              <button
                onClick={() => {
                  if (!isProjectComplete()) {
                    setToast({ message: "Please complete all calculations before proceeding to drawing.", type: "error" });
                  } else {
                    navigate(`/calculation/${type}/${draftId}/drawing`);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  isDrawingPage
                    ? "bg-white text-[#0d3b66] shadow-sm"
                    : "text-white hover:bg-white/10"
                } ${!isProjectComplete() && !isDrawingPage ? "opacity-80" : ""}`}
              >
                {!isProjectComplete() && !isDrawingPage && <Lock className="w-3.5 h-3.5" />}
                Drawing
              </button>
            </div>
          )}

          <div className="relative">
            <button
              onClick={handleQuickSave}
              className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white rounded-lg hp:rounded-md text-xs sm:text-sm font-medium transition"
            >
              <Save className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Save Draft</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {workflow.projectMode === "both" && !isProjectIdentityPage && (
          <div className="flex sm:hidden bg-white/10 p-1 rounded-lg gap-1 border border-white/20 w-full mt-1 items-center">
            <button
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
              <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isDrawingPage ? "rotate-180" : ""}`} />
            </div>

            <button
              onClick={() => {
                if (!isProjectComplete()) {
                  setToast({ message: "Please complete all calculations before proceeding to drawing.", type: "error" });
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
              {!isProjectComplete() && !isDrawingPage && <Lock className="w-3 h-3" />}
              Drawing
            </button>
          </div>
        )}
      </div>

      {/* ── Step navigation (Bottom Bar on Mobile, Sticky on Desktop) ── */}
      {!isProjectIdentityPage && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-1.5 [@media(max-width:639px)_and_(max-height:600px)]:hidden sm:static sm:pb-2 sm:border-t-0 sm:border-b sm:px-4 sm:py-3 md:px-6 2xl:px-8 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] sm:shadow-none">
          <div className="flex items-center justify-around sm:justify-start gap-1 sm:gap-2 md:gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {currentNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => !item.disabled && navigate(item.path)}
                  disabled={item.disabled}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 
                    sm:gap-1.5 md:gap-2 shrink-0 px-1 py-1 sm:px-3 
                    sm:py-2 md:px-5 rounded-lg sm:rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition-all flex-1 sm:flex-none
                  ${
                    item.disabled
                      ? "text-slate-300 sm:bg-slate-50 sm:text-slate-400 cursor-not-allowed opacity-60"
                      : isActive
                        ? "text-[#0d3b66] sm:bg-[#0d3b66] sm:text-white sm:shadow-md cursor-default"
                        : "text-slate-500 sm:bg-slate-100 sm:text-slate-600 sm:hover:bg-slate-200 cursor-pointer"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-4 sm:h-4 shrink-0 transition-colors ${
                      item.disabled
                        ? "text-slate-300 sm:text-slate-400"
                        : isActive
                          ? "text-[#0d3b66] sm:text-white"
                          : "text-slate-400 sm:text-slate-500"
                    }`}
                  />
                  <span className="truncate w-full text-center">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <DraftActionModal
        open={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        onSave={handleSaveAndLeave}
        onDiscard={handleDiscard}
      />

      <ConfirmResetAllModal
        open={confirmResetAll}
        onClose={() => setConfirmResetAll(false)}
        onReset={handleResetAll}
      />

      <ToastModal toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
