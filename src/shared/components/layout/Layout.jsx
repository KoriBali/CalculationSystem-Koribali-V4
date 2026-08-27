import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import { MobileSidebar, DesktopSidebar } from "./Sidebar";
import { Header } from "./Header";
import { LogoutModal } from "./LogoutModal";
import { MENU_ITEMS } from "../../constants/layoutConstants";
import { getUser, setUser, isAuthenticated, clearAuthSession } from "../../../utils/auth";
import { logoutUser, getMe } from "../../../services/authService";
import { ScrollToTopButton } from "../ScrollToTopButton";
import { resetScrollDirection } from "../../../hooks/useScrollDirection";
import { getMasterData } from "../../../features/calculations/services/masterDataService";

// ─── HELPERS ────────────────────────────────────────────────────────────────

function formatProjectType(type) {
  if (!type) return null;
  return type.split("-").join(" ");
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState({ name: "User", email: "" });

  // Derive current page title from route + session
  const projectType = sessionStorage.getItem("projectType");
  const formattedProjectType = formatProjectType(projectType);
  const isCalculationRoot = location.pathname === "/calculation";
  
  let currentTitle;
  if (isCalculationRoot) {
    currentTitle = MENU_ITEMS.find((item) => item.path === "/calculation")?.name ?? "Calculation";
  } else if (location.pathname.startsWith("/calculation") && formattedProjectType) {
    let stage = "";
    if (location.pathname.includes("/drawing")) {
      stage = "Drawing";
    } else if (
      location.pathname.includes("/initial") ||
      location.pathname.includes("/pole") ||
      location.pathname.includes("/opening") ||
      location.pathname.includes("/baseplate") ||
      location.pathname.includes("/foundation")
    ) {
      stage = "Calculation";
    } else if (
      location.pathname.includes("/report") || 
      location.pathname.includes("/result")
    ) {
      stage = "Report Preview";
    } else {
      // Check if we're on the drafts list page (/calculation/:type) vs inside a draft
      const pathParts = location.pathname.replace(/\/$/, "").split("/");
      // /calculation/:type has 3 parts: ["", "calculation", ":type"]
      const isDraftsList = pathParts.length === 3;
      stage = isDraftsList ? "Drafts" : "Project Setup";
    }
    currentTitle = { global: formattedProjectType, stage };
  } else {
    currentTitle = MENU_ITEMS.find((item) => location.pathname.startsWith(item.path))?.name ?? "Page Not Found";
  }

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
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // ignore — server-side session will simply expire on its own
    } finally {
      clearAuthSession();
      sessionStorage.removeItem("projectType");
      navigate("/login");
    }
  };
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Logout confirmation modal */}
      <LogoutModal
        open={showLogoutModal}
        loading={isLoggingOut}
        onClose={() => {
          if (!isLoggingOut) setShowLogoutModal(false);
        }}
        onConfirm={handleLogout}
      />

      {/* Mobile sidebar — slide-in overlay */}
      {isMobile && (
        <MobileSidebar
          isOpen={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          getMenuPath={getMenuPath}
        />
      )}

      {/* Desktop sidebar — sticky, collapsible */}
      {!isMobile && (
        <DesktopSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          getMenuPath={getMenuPath}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <Header
          isMobile={isMobile}
          currentTitle={currentTitle}
          userData={userData}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onLogout={() => {
            setShowLogoutModal(true);
          }}
        />

        {/* Page content */}
        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>

      </div>
      
      <ScrollToTopButton />
    </div>
  );
}
