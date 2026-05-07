import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import { MobileSidebar, DesktopSidebar } from "./Sidebar";
import { Header } from "./Header";
import { LogoutModal } from "./LogoutModal";
import { MENU_ITEMS } from "../../constants/layoutConstants";

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
  const currentTitle =
    location.pathname.startsWith("/calculation") && formattedProjectType
      ? formattedProjectType
      : (MENU_ITEMS.find((item) => location.pathname.startsWith(item.path))
          ?.name ?? "Page Not Found");

  // Returns nav path — if projectType exists, go directly to that calculation
  const getMenuPath = (path) =>
    path === "/calculation" && projectType
      ? `/calculation/${projectType}`
      : path;

  // Load user session from localStorage on mount
  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) setUserData(JSON.parse(session));
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

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
    localStorage.removeItem("user_session");
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
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 lg:px-8 border-t border-slate-200 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} KORI BALI &bull; Pole Structure
          Calculation System
        </footer>
      </div>
    </div>
  );
}
