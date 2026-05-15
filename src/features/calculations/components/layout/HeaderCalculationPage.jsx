import { useState, useMemo } from "react";
import {
  ArrowLeft,
  RotateCcw,
  LayoutDashboard,
  TowerControl,
  DoorOpen,
  Layers,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { ConfirmSaveDraftModal } from "../modals/ConfirmSaveDraftModal";
import { ConfirmResetAllModal } from "../modals/ConfirmResetAllModal";
import { BaseplateIcon } from "../../../../assets/icons/icon";
import { clearCalculationSession } from "../../utils";

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export function HeaderCalculationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();

  // UI state
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  // Read calculation config from sessionStorage — determines which nav items to show
  const config = useMemo(() => {
    const raw = sessionStorage.getItem(`${type}_calculation_config`);
    return raw ? JSON.parse(raw) : null;
  }, [type]);

  // Build nav items — optional steps only shown if enabled in config
  const navItems = [
    { label: "Initial", path: `/calculation/${type}`, icon: LayoutDashboard },
    { label: "Pole", path: `/calculation/${type}/pole`, icon: TowerControl },
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

  // Opens the save draft modal when user tries to leave
  const handleBackClick = () => setShowDraftModal(true);

  // Save draft — clears project selection and goes back to project list
  const handleSaveDraft = () => {
    sessionStorage.removeItem("projectType");
    navigate("/calculation");
  };

  // Discard — clears all session data and goes back to project list
  const handleDiscard = () => {
    clearCalculationSession(type);
    navigate("/calculation");
  };

  // Reset all — clears all session data and goes back to project list
  const handleResetAll = () => {
    clearCalculationSession(type);
    navigate("/calculation");
  };

  return (
    <div className="sticky top-[64px] z-30">
      {/* ── Top bar: back button + reset all ── */}
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] shadow-lg px-6 py-[16px]">
        <div className="flex items-center justify-between">
          {/* Back — opens save draft confirmation */}
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium border border-white/20 hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project Type
          </button>

          {/* Reset All — opens reset confirmation */}
          <button
            onClick={() => setConfirmResetAll(true)}
            className="flex items-center gap-2 bg-gray-200 text-[#0d3b66] px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hp:hidden">Reset All</span>
            <span className="hidden hp:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ── Step navigation bar ── */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-[#0d3b66] text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`}
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Save draft modal — shown when user clicks Back ── */}
      <ConfirmSaveDraftModal
        open={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        onSaveDraft={handleSaveDraft} // keeps session, goes back
        onDiscard={handleDiscard} // clears session, goes back
      />

      {/* ── Reset all modal — shown when user clicks Reset All ── */}
      <ConfirmResetAllModal
        open={confirmResetAll}
        onClose={() => setConfirmResetAll(false)}
        onReset={handleResetAll}
      />
    </div>
  );
}
