import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell } from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";

// Top header bar => shows current page title, notifications, and profile
export function Header({
  isMobile,
  currentTitle,
  userData,
  onOpenMobileSidebar,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 lg:px-8 justify-between">
      <div className="flex items-center gap-2">
        {/*mobile only */}
        {isMobile && (
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Animated page title => transitions on route change */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentTitle}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-[14px] tracking-wide font-bold text-slate-800 uppercase md:text-base md:tracking-wider"
          >
            {currentTitle}
          </motion.h1>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell => placeholder for future feature */}
        <button className="p-2 text-slate-400 hover:text-[#0d3b66] transition-all">
          <Bell size={18} />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Profile dropdown */}
        <ProfileDropdown userData={userData} onLogout={onLogout} />
      </div>
    </header>
  );
}
