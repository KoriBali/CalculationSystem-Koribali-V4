import { useState } from "react";
import {
  ArrowLeft,
  LayoutDashboard,
  TowerControl,
  DoorOpen,
  Layers,
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

  return (
    <div className="sticky top-16 sm:top-16 z-30 w-full rounded-t-xl sm:rounded-t-2xl bg-white">
      {/* ── Top bar ── */}
      <div className="rounded-t-xl sm:rounded-t-2xl bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] shadow-lg px-3 py-3 sm:px-4 sm:py-4 md:px-6 2xl:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 max-w-[70%] sm:max-w-none text-white px-3 py-2 sm:px-4 rounded-lg hp:rounded-md text-xs sm:text-sm font-medium border border-white/20 hover:bg-white/10 active:bg-white/15 transition"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">Back to Project Type</span>
          </button>
        </div>
      </div>

      {/* ── Step navigation ── */}
      <div className="relative bg-white border-b border-slate-200 px-2 py-2 sm:px-4 sm:py-3 md:px-6 2xl:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex items-center justify-center gap-1 
                  sm:gap-1.5 md:gap-2 shrink-0 px-2.5 py-1.5 sm:px-3 
                  sm:py-2 md:px-5 rounded-full text-[12px] sm:text-xs md:text-sm font-medium transition-all
                ${isActive ? "bg-[#0d3b66] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {/* Wrap dengan div, hidden di mobile */}
                <div className="hidden sm:block">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`}
                  />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

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
