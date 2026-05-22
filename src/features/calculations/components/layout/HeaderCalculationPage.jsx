import { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  LayoutDashboard,
  TowerControl,
  DoorOpen,
  Layers,
  ChevronDown,
  Check,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { ConfirmSaveDraftModal } from "../modals/ConfirmSaveDraftModal";
import { ConfirmResetAllModal } from "../modals/ConfirmResetAllModal";
import { BaseplateIcon } from "../../../../assets/icon";
import { clearCalculationSession } from "../../utils";

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export function HeaderCalculationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();

  const [showDraftModal, setShowDraftModal] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [showMobileTabs, setShowMobileTabs] = useState(false);

  const raw = sessionStorage.getItem(`${type}_calculation_config`);
  const config = raw ? JSON.parse(raw) : null;

  const navItems = [
    {
      label: "Initial",
      path: `/calculation/${type}`,
      icon: LayoutDashboard,
    },
    ...(config?.pole
      ? [
          {
            label: "Pole",
            path: `/calculation/${type}/pole`,
            icon: TowerControl,
          },
        ]
      : []),
    ...(config?.opening
      ? [
          {
            label: "Opening",
            path: `/calculation/${type}/opening`,
            icon: DoorOpen,
          },
        ]
      : []),
    ...(config?.baseplate
      ? [
          {
            label: "Baseplate",
            path: `/calculation/${type}/baseplate`,
            icon: BaseplateIcon,
          },
        ]
      : []),
    ...(config?.foundation
      ? [
          {
            label: "Foundation",
            path: `/calculation/${type}/foundation`,
            icon: Layers,
          },
        ]
      : []),
  ];

  const activeItem =
    navItems.find((item) => location.pathname === item.path) || navItems[0];

  const ActiveIcon = activeItem?.icon || LayoutDashboard;

  const handleBackClick = () => setShowDraftModal(true);

  const handleSaveDraft = () => {
    sessionStorage.removeItem("projectType");
    navigate("/calculation");
  };

  const handleDiscard = () => {
    clearCalculationSession(type);
    navigate("/calculation");
  };

  const handleResetAll = () => {
    clearCalculationSession(type);
    navigate("/calculation");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowMobileTabs(false);
  };

  return (
    <div
      className="
        sticky top-16 sm:top-16 z-30
        w-full
        rounded-t-xl sm:rounded-t-2xl
        bg-white
      "
    >
      {/* ── Top bar ── */}
      <div
        className="
          rounded-t-xl sm:rounded-t-2xl
          bg-gradient-to-r from-[#0d3b66] to-[#1a5a92]
          shadow-lg
          px-3 py-3
          sm:px-4 sm:py-4
          md:px-6
          2xl:px-8
        "
      >
        <div
          className="
            flex items-center justify-between
            gap-2 sm:gap-3
            w-full
          "
        >
          {/* Back */}
          <button
            type="button"
            onClick={handleBackClick}
            className="
              flex items-center justify-center
              gap-1.5 sm:gap-2
              min-w-0
              max-w-[70%] sm:max-w-none
              text-white
              px-3 py-2
              sm:px-4
              rounded-md
              text-xs sm:text-sm
              font-medium
              border border-white/20
              hover:bg-white/10
              active:bg-white/15
              transition
            "
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />

            <span className="block sm:hidden truncate">Back</span>

            <span className="hidden sm:block truncate">
              Back to Project Type
            </span>
          </button>
        </div>
      </div>

      {/* ── Step navigation wrapper ── */}
      <div
        className="
          relative
          bg-white
          border-b border-slate-200
          px-3 py-2.5
          sm:px-4 sm:py-3
          md:px-6
          2xl:px-8
        "
      >
        {/* ── Mobile tab selector ── */}
        <div className="block sm:hidden">
          <button
            type="button"
            onClick={() => setShowMobileTabs((prev) => !prev)}
            className="flex items-center justify-between w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0d3b66] to-[#0d3b66] text-white shadow-sm">
                <ActiveIcon className="w-4 h-4" />
              </div>

              {/* Label + subtitle */}
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                  {activeItem?.label}
                </p>
              </div>
            </div>

            {/* Chevron */}
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-md transition-all ${showMobileTabs ? "bg-slate-100 rotate-180" : "bg-slate-50"}`}
            >
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
          </button>

          {showMobileTabs && (
            <div
              className="
                absolute left-3 right-3 top-[calc(100%-4px)]
                z-40
                rounded-xl
                border border-slate-200
                bg-white
                shadow-xl
                overflow-hidden
              "
            >
              <div className="max-h-[65vh] overflow-y-auto p-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleNavigate(item.path)}
                      className={`
                        flex items-center justify-between
                        w-full
                        gap-3
                        rounded-lg
                        px-3 py-3
                        text-left
                        transition
                        ${
                          isActive
                            ? "bg-[#0d3b66] text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`
                            w-4 h-4 shrink-0
                            ${isActive ? "text-white" : "text-slate-500"}
                          `}
                        />

                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                      </div>

                      {isActive && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Tablet / Desktop tab navigation ── */}
        <div
          className="
            hidden sm:flex
            items-center
            gap-2 md:gap-3
            overflow-x-auto
            overflow-y-hidden
            whitespace-nowrap
            scroll-smooth
            pb-1

            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={`
                  flex items-center justify-center
                  gap-1.5 md:gap-2
                  shrink-0
                  px-3 py-2
                  md:px-5
                  rounded-full
                  text-xs md:text-sm
                  font-medium
                  transition-all
                  ${
                    isActive
                      ? "bg-[#0d3b66] text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }
                `}
              >
                <Icon
                  className={`
                    w-4 h-4 shrink-0
                    ${isActive ? "text-white" : "text-slate-500"}
                  `}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile dropdown backdrop */}
      {showMobileTabs && (
        <button
          type="button"
          aria-label="Close mobile tabs"
          onClick={() => setShowMobileTabs(false)}
          className="
            fixed inset-0 z-20
            bg-transparent
            sm:hidden
          "
        />
      )}

      <ConfirmSaveDraftModal
        open={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        onSaveDraft={handleSaveDraft}
        onDiscard={handleDiscard}
      />

      <ConfirmResetAllModal
        open={confirmResetAll}
        onClose={() => setConfirmResetAll(false)}
        onReset={handleResetAll}
      />
    </div>
  );
}
