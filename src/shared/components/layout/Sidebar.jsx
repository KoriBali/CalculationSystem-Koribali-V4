import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Calculator, FileText, ChevronLeft, X, Database } from "lucide-react";
import { MENU_ITEMS, SPRING_TRANSITION } from "../../constants/layoutConstants";

// Reusable nav item => used in both mobile and desktop sidebar
function NavItem({ item, path, isActive, isCollapsed, layoutId }) {
  return (
    <NavLink
      to={path}
      className={`group relative flex items-center rounded-lg h-11 transition-all duration-300
        ${isCollapsed ? "justify-center px-0" : "justify-between px-3"}
        ${isActive ? "text-white bg-white/10 shadow-sm" : "text-white/60 hover:text-white hover:bg-white/5"}`}
    >
      {/* Active background highlight layer (optional for framer motion layoutId) */}
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 bg-white/10 rounded-lg z-0"
          transition={SPRING_TRANSITION}
        />
      )}

      {/* Active left pill indicator */}
      {isActive && (
        <motion.div
          layoutId={`${layoutId}-pill`}
          className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-md z-10"
          transition={SPRING_TRANSITION}
        />
      )}

      <div
        className={`flex items-center relative z-10 ${isCollapsed ? "" : "gap-3"} transition-transform duration-300 ${!isActive && !isCollapsed ? "group-hover:translate-x-1" : ""}`}
      >
        <item.icon size={20} className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-white/60 group-hover:text-white"}`} />
        {!isCollapsed && (
          <span className="font-semibold text-[14px] whitespace-nowrap">
            {item.name}
          </span>
        )}
      </div>
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
      <div className="w-9 h-9 bg-white/95 rounded-xl flex items-center justify-center shrink-0 p-1 shadow-sm ring-1 ring-white/20">
        <img
          src="/images/koribali-logo.webp"
          alt="KORI BALI logo"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-black tracking-tight uppercase text-[17px] whitespace-nowrap text-white drop-shadow-md"
        >
          KORIBALI
        </motion.span>
      )}
      {/* Close button => mobile only */}
      {onClose && (
        <button
          onClick={onClose}
          className={`${isCollapsed ? "" : "ml-auto"} p-2 text-white/70 hover:text-white transition-colors`}
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
            className="fixed top-0 left-0 bottom-0 w-[260px] bg-gradient-to-b from-[#0d3b66] to-[#0a2c4c] text-white z-[101] flex flex-col shadow-2xl border-r border-[#08223d]"
          >
            <SidebarLogo isCollapsed={false} onClose={onClose} />

            <nav className="flex-1 p-3 space-y-1 mt-2">
              <div className="px-3 mb-2 mt-2">
                <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
                  Main Menu
                </p>
              </div>
              {MENU_ITEMS.map((item) => {
                const path = getMenuPath(item.path);
                const isActive = location.pathname.startsWith(item.path);
                
                const IconMap = {
                  Calculator,
                  FileText,
                  Database
                };
                const Icon = IconMap[item.icon] || FileText;

                return (
                  <NavItem
                    key={item.path}
                    item={{ ...item, icon: Icon }}
                    path={path}
                    isActive={isActive}
                    isCollapsed={false}
                    layoutId="activeNavMobile"
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
      className="sticky top-0 h-screen bg-gradient-to-b from-[#0d3b66] to-[#0a2c4c] border-r border-[#08223d] text-white flex flex-col shadow-xl z-50 shrink-0"
    >
      <SidebarLogo isCollapsed={isCollapsed} />

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {!isCollapsed && (
          <div className="px-3 mb-2 mt-2">
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
              Main Menu
            </p>
          </div>
        )}
        {MENU_ITEMS.map((item) => {
          const path = getMenuPath(item.path);
          const isActive = location.pathname.startsWith(item.path);
          
          const IconMap = {
            Calculator,
            FileText,
            Database
          };
          const Icon = IconMap[item.icon] || FileText;

          return (
            <NavItem
              key={item.path}
              item={{ ...item, icon: Icon }}
              path={path}
              isActive={isActive}
              isCollapsed={isCollapsed}
              layoutId="activeNavDesktop"
            />
          );
        })}
      </nav>

      {/* Collapse toggle button */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center justify-center h-12 border-t border-white/10 hover:bg-white/10 text-white/50 hover:text-white transition-colors group"
      >
        <ChevronLeft
          size={18}
          className={`transition-transform duration-500 group-hover:scale-110 ${isCollapsed ? "rotate-180" : ""}`}
        />
      </button>
    </motion.div>
  );
}
