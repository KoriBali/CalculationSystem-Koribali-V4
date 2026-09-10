import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import { MobileSidebar, DesktopSidebar } from "./Sidebar";
import { Header } from "./Header";
import { LogoutModal } from "./LogoutModal";
import { DraftActionModal } from "../../../features/calculations/components/modals/DraftActionModal";
import { MENU_ITEMS } from "../../constants/layoutConstants";
import { getUser, setUser, isAuthenticated, clearAuthSession } from "../../../utils/auth";
import { logoutUser, getMe } from "../../../services/authService";
import { ScrollToTopButton } from "../ScrollToTopButton";
import { ErrorBoundary } from "../ErrorBoundary";
import { resetScrollDirection } from "../../../hooks/useScrollDirection";
import { getMasterData } from "../../../features/calculations/services/masterDataService";
import { getCouplingMasterData } from "../../../features/calculations/services/couplingMasterService";
import {
  saveWorkingSessionToDraft,
  clearActiveDraftId,
  clearCalculationSession,
  hasDraftChanged,
} from "../../../features/calculations/utils/coreLogic";
import { projectTypeLabel } from "../../../features/calculations/constants/projectTypes";

// ─── HELPERS ────────────────────────────────────────────────────────────────

function formatProjectType(type) {
  if (!type) return null;
  return projectTypeLabel(type);
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Modal + user state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState({ name: "User", email: "" });
  // Set to { ptype, draftId, target } while the "save this draft?" prompt is open.
  const [draftPrompt, setDraftPrompt] = useState(null);

  // Derive current page title from route + session
  const projectType = sessionStorage.getItem("projectType");
  const formattedProjectType = formatProjectType(projectType);
  const isCalculationRoot = location.pathname === "/calculation";
  
  let currentTitle;
  if (isCalculationRoot) {
    currentTitle = MENU_ITEMS.find((item) => item.path === "/calculation")?.name ?? "Calculation";
  } else if (location.pathname.startsWith("/calculation") && formattedProjectType) {
    const pathParts = location.pathname.replace(/\/$/, "").split("/");
    // /calculation/:type => 3 parts, /calculation/:type/:draftId => 4 parts
    const isDraftsList = pathParts.length === 3;
    const isDraftRoot = pathParts.length === 4 && !pathParts[3]?.match(/^(initial|pole|opening|baseplate|foundation|drawing|report|result)/);

    let substage = null;
    if (location.pathname.includes("/drawing")) {
      const drawingSegments = {
        general: "General",
        pole: "Pole",
        opening: "Opening",
        baseplate: "Baseplate",
        foundation: "Foundation",
        coupling: "Coupling",
        surface: "Surface",
      };
      const drawingMatch = Object.keys(drawingSegments).find((k) =>
        location.pathname.includes(`/drawing/${k}`)
      );
      substage = drawingMatch ? `Drawing · ${drawingSegments[drawingMatch]}` : "Drawing";
    } else if (location.pathname.includes("/initial")) {
      substage = "Calculation Setup";
    } else if (location.pathname.includes("/pole")) {
      substage = "Pole";
    } else if (location.pathname.includes("/opening")) {
      substage = "Opening";
    } else if (location.pathname.includes("/baseplate")) {
      substage = "Baseplate";
    } else if (location.pathname.includes("/foundation")) {
      substage = "Foundation";
    } else if (location.pathname.includes("/report") || location.pathname.includes("/result")) {
      substage = "Report";
    }

    if (isDraftsList) {
      currentTitle = { global: formattedProjectType, stage: "Drafts", substage: null };
    } else {
      currentTitle = { global: formattedProjectType, stage: "Project Setup", substage };
    }
  } else {
    currentTitle = MENU_ITEMS.find((item) => location.pathname.startsWith(item.path))?.name ?? "Page Not Found";
  }

  // Navigate out of the calculation area (from the logo or the header
  // breadcrumb). If we're inside a draft with unsaved changes, ask first via
  // DraftActionModal (Save / Don't Save / Cancel); otherwise leave straight
  // away, clearing the working session behind us.
  const leaveCalculation = (target) => {
    const parts = location.pathname.split("/").filter(Boolean);
    // /calculation/:type/:draftId[/...] → parts[1] = type, parts[2] = draftId
    const inDraft = parts[0] === "calculation" && !!parts[1] && !!parts[2];

    if (inDraft) {
      const ptype = parts[1];
      const draftId = parts[2];
      if (hasDraftChanged(ptype, draftId)) {
        setDraftPrompt({ ptype, draftId, target });
        return;
      }
      // No unsaved changes — tidy up the working session and go.
      try {
        clearCalculationSession(ptype);
        clearActiveDraftId(ptype);
      } catch {
        // Best-effort — never block navigation on cleanup failure.
      }
    }
    navigate(target);
  };

  // Resolves the "save this draft?" prompt. `action` is "save" | "discard" |
  // "cancel". In every non-cancel case the working session is cleared and the
  // active draft id removed *before* navigating, so DraftsDashboardPage's own
  // handleSessionTransition() doesn't re-save what the user just discarded.
  const resolveDraftPrompt = (action) => {
    const prompt = draftPrompt;
    setDraftPrompt(null);
    if (!prompt || action === "cancel") return;
    try {
      if (action === "save") {
        saveWorkingSessionToDraft(prompt.ptype, prompt.draftId);
      }
      clearCalculationSession(prompt.ptype);
      clearActiveDraftId(prompt.ptype);
    } catch {
      // Best-effort — never trap the user on a save failure.
    }
    navigate(prompt.target);
  };

  // Logo → default page (project type selection).
  const handleLogoClick = () => leaveCalculation("/calculation");

  // Header breadcrumb → that project's Drafts list.
  const handleProjectCrumbClick = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const ptype =
      parts[0] === "calculation" && parts[1] ? parts[1] : projectType;
    leaveCalculation(ptype ? `/calculation/${ptype}` : "/calculation");
  };

  // Header breadcrumb → Project Setup page of the current draft.
  const handleSetupCrumbClick = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "calculation" && parts[1] && parts[2]) {
      navigate(`/calculation/${parts[1]}/${parts[2]}`);
    }
  };

  // Returns nav path — if projectType exists, go directly to that calculation or its active draft
  const getMenuPath = (path) => {
    if (path === "/calculation" && projectType) {
      const activeDraftId = sessionStorage.getItem(`${projectType}_active_draft_id`);
      return activeDraftId
        ? `/calculation/${projectType}/${activeDraftId}`
        : `/calculation/${projectType}`;
    }
    return path;
  };

  // Load user session on mount. sessionStorage is scoped to a single tab —
  // opening a new tab loses the cached profile even though the refresh
  // token cookie (and therefore the session) is still valid. When that
  // happens, re-fetch the profile from /me instead of showing a bare
  // "User" placeholder.
  useEffect(() => {
    const cachedUser = getUser();

    if (cachedUser) {
      setUserData(cachedUser);
      return;
    }

    if (isAuthenticated()) {
      getMe()
        .then((user) => {
          setUser(user);
          setUserData(user);
        })
        .catch(() => {
          // Refresh token turned out to be invalid too — the axios
          // interceptor already clears the session and redirects to
          // /login on this failure, nothing more to do here.
        });
    }
  }, []);

  // Prefetch master data (materials, region codes, ...) as soon as any
  // authenticated page mounts, instead of waiting for a calculation form to
  // ask for it. getMasterData() already caches in sessionStorage and dedupes
  // concurrent callers, so this just moves the ~3s gateway round-trip earlier
  // — by the time a form needs it, it's likely already sitting in cache.
  useEffect(() => {
    getMasterData().catch(() => {
      // Ignore here — useMasterData() surfaces the error to whichever form
      // actually needs the data and lets the user retry from there.
    });
    // Coupling master data lives deep in the drawing flow — prefetch it now so
    // it's cached well before the user reaches the coupling page.
    getCouplingMasterData().catch(() => {});
  }, []);

  // Close mobile sidebar and reset scroll position on route change
  useEffect(() => {
    setIsMobileOpen(false);
    resetScrollDirection();
    // Use timeout to ensure DOM has updated before scrolling
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      resetScrollDirection();
    }, 10);
  }, [location.pathname]);

  // Sync isMobile state with window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Invalidates the session server-side, clears local session data, and
  // redirects to login. Local session is cleared even if the API call
  // fails, so a flaky network never traps the user in a logged-in state.
  const handleLogout = () => {
    // Clear local session immediately and navigate — don't wait for the
    // server-side invalidation call so the UI feels instant regardless of
    // API latency. The refresh token expires on its own if the call fails.
    clearAuthSession();
    sessionStorage.removeItem("projectType");
    navigate("/login");

    // Fire-and-forget: invalidate token server-side in background.
    logoutUser().catch(() => {});
  };
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Logout confirmation modal */}
      <LogoutModal
        open={showLogoutModal}
        loading={false}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      {/* "Save this draft?" prompt — shown when leaving a draft with unsaved
          changes via the logo or the header breadcrumb. */}
      <DraftActionModal
        open={!!draftPrompt}
        onClose={() => resolveDraftPrompt("cancel")}
        onSave={() => resolveDraftPrompt("save")}
        onDiscard={() => resolveDraftPrompt("discard")}
      />

      {/* Mobile sidebar — slide-in overlay */}
      {isMobile && (
        <MobileSidebar
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          onLogoClick={handleLogoClick}
          getMenuPath={getMenuPath}
          userRole={userData?.role}
        />
      )}

      {/* Desktop sidebar — sticky, collapsible */}
      {!isMobile && (
        <DesktopSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onLogoClick={handleLogoClick}
          getMenuPath={getMenuPath}
          userRole={userData?.role}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <Header
          isMobile={isMobile}
          currentTitle={currentTitle}
          userData={userData}
          onRootCrumbClick={handleLogoClick}
          onProjectCrumbClick={handleProjectCrumbClick}
          onSetupCrumbClick={handleSetupCrumbClick}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onLogout={() => {
            setShowLogoutModal(true);
          }}
        />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <ErrorBoundary resetKey={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>

      </div>
      
      <ScrollToTopButton />
    </div>
  );
}
