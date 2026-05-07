import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Calculator, FileText, ChevronLeft, X } from "lucide-react";
import { MENU_ITEMS, SPRING_TRANSITION } from "../../constants/layoutConstants";

// Reusable nav item => used in both mobile and desktop sidebar
function NavItem({ item, path, isActive, isCollapsed, layoutId, dotLayoutId }) {
  return (
    <NavLink
      to={path}
      className={`relative flex items-center rounded-lg h-11 transition-colors duration-300
        ${isCollapsed ? "justify-center px-0" : "justify-between px-3"}
        ${isActive ? "text-white" : "text-white/60 hover:text-white"}`}
    >
      {/* Active background highlight */}
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] rounded-lg z-0"
          transition={SPRING_TRANSITION}
        />
      )}

      <div
        className={`flex items-center relative z-10 ${isCollapsed ? "" : "gap-3"}`}
      >
        <item.icon size={20} className="shrink-0" />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-semibold text-[14px] whitespace-nowrap"
          >
            {item.name}
          </motion.span>
        )}
      </div>

      {/* Active indicator dot with pulse animation */}
      {isActive && !isCollapsed && (
        <div className="relative flex items-center justify-center w-3 h-3 z-10">
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-white rounded-full"
          />
          <motion.div
            layoutId={dotLayoutId}
            className="w-1.5 h-1.5 bg-white rounded-full relative z-10 shadow-[0_0_5px_rgba(255,255,255,0.5)]"
            transition={SPRING_TRANSITION}
          />
        </div>
      )}
    </NavLink>
  );
}

// Logo section => shared between mobile and desktop
function SidebarLogo({ isCollapsed, onClose }) {
  return (
    <div
      className={`flex items-center border-b border-white/10 h-16 md:h-20
      ${isCollapsed ? "justify-center px-0" : "px-5 gap-3"}`}
    >
      <div className="w-9 md:w-10 h-9 md:h-10 bg-white rounded-lg flex items-center justify-center shrink-0 p-1">
        <img
          src="/images/koribali-logo.webp"
          alt="KORI BALI logo"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-black tracking-tight uppercase text-base md:text-lg whitespace-nowrap"
        >
          KORI BALI
        </motion.span>
      )}
      {/* Close button => mobile only */}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto p-2 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}

// ─── MOBILE SIDEBAR ──────────────────────────────────────────────────────────
export function MobileSidebar({ isOpen, onClose, getMenuPath }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />

          {/* Slide-in sidebar */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={SPRING_TRANSITION}
            className="fixed top-0 left-0 bottom-0 w-[260px] bg-[#0d3b66] text-white z-[101] flex flex-col shadow-2xl"
          >
            <SidebarLogo isCollapsed={false} onClose={onClose} />

            <nav className="flex-1 p-3 space-y-1 mt-4">
              {MENU_ITEMS.map((item) => {
                const path = getMenuPath(item.path);
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon === "Calculator" ? Calculator : FileText;

                return (
                  <NavItem
                    key={item.path}
                    item={{ ...item, icon: Icon }}
                    path={path}
                    isActive={isActive}
                    isCollapsed={false}
                    layoutId="activeNavMobile"
                    dotLayoutId="activeDotMobile"
                  />
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── DESKTOP SIDEBAR ─────────────────────────────────────────────────────────
export function DesktopSidebar({ isCollapsed, onToggleCollapse, getMenuPath }) {
  const location = useLocation();

  return (
    <motion.div
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={SPRING_TRANSITION}
      className="sticky top-0 h-screen bg-[#0d3b66] text-white flex flex-col shadow-xl z-50 shrink-0"
    >
      <SidebarLogo isCollapsed={isCollapsed} />

      <nav className="flex-1 p-3 space-y-2 mt-4">
        {MENU_ITEMS.map((item) => {
          const path = getMenuPath(item.path);
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon === "Calculator" ? Calculator : FileText;

          return (
            <NavItem
              key={item.path}
              item={{ ...item, icon: Icon }}
              path={path}
              isActive={isActive}
              isCollapsed={isCollapsed}
              layoutId="activeNavDesktop"
              dotLayoutId="activeDotDesktop"
            />
          );
        })}
      </nav>

      {/* Collapse toggle button */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center justify-center h-12 border-t border-white/10 hover:bg-white/5 text-white/40 hover:text-white transition-colors"
      >
        <ChevronLeft
          size={18}
          className={`transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""}`}
        />
      </button>
    </motion.div>
  );
}
