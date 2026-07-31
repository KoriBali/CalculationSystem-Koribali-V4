import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import { MobileSidebar, DesktopSidebar } from "./Sidebar";
import { Header } from "./Header";
import { LogoutModal } from "./LogoutModal";
import { MENU_ITEMS } from "../../constants/layoutConstants";
import { getUser, clearAuthSession } from "../../../utils/auth";
import { ScrollToTopButton } from "../ScrollToTopButton";
import { resetScrollDirection } from "../../../hooks/useScrollDirection";

// ─── HELPERS ────────────────────────────────────────────────────────────────

// Formats sessionStorage projectType into a readable title (e.g. "lighting-pole" → "Lighting Pole Type")
function formatProjectType(type) {
  if (!type) return null;
  return (
    type
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ") + " Type"
  );
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

  // Derive current page title from route + session
  const projectType = sessionStorage.getItem("projectType");
  const formattedProjectType = formatProjectType(projectType);
  const isCalculationRoot = location.pathname === "/calculation";
  let currentTitle = "Page Not Found";
  if (isCalculationRoot) {
    currentTitle = MENU_ITEMS.find((item) => item.path === "/calculation")?.name ?? "Calculation";
  } else if (location.pathname.startsWith("/calculation") && formattedProjectType) {
    if (location.pathname.includes("/drawing")) {
      currentTitle = `${formattedProjectType} - Drawing`;
    } else if (
      location.pathname.includes("/initial") ||
      location.pathname.includes("/pole") ||
      location.pathname.includes("/opening") ||
      location.pathname.includes("/baseplate") ||
      location.pathname.includes("/foundation")
    ) {
      currentTitle = `${formattedProjectType} - Calculation`;
    } else {
      currentTitle = formattedProjectType;
    }
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

  // Load user session from sessionStorage on mount
  useEffect(() => {
    const user = getUser();

    if (user) {
      setUserData(user);
    }
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

  // Clears session data and redirects to login
  const handleLogout = () => {
    clearAuthSession();
    sessionStorage.removeItem("projectType");

    navigate("/login");
  };
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Logout confirmation modal */}
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
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
