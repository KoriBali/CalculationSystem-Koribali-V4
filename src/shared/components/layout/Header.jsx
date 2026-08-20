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
        {/* mobile only */}
        {isMobile && (
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 bg-slate-100 text-[#0d3b66] hover:bg-slate-200 rounded-lg"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Animated page title => transitions on route change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={typeof currentTitle === 'string' ? currentTitle : `${currentTitle.global}-${currentTitle.stage}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-center"
          >
            {typeof currentTitle === 'string' ? (
              <h1 className="text-[14px] tracking-wide font-bold text-slate-800 uppercase md:text-base md:tracking-wider">
                {currentTitle}
              </h1>
            ) : (
              <>
                <h2 className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">
                  {currentTitle.global}
                </h2>
                <h1 className="text-[14px] md:text-base font-bold text-[#0d3b66] tracking-wide leading-tight">
                  {currentTitle.stage}
                </h1>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center">
        {/* Profile dropdown */}
        <ProfileDropdown userData={userData} onLogout={onLogout} />
      </div>
    </header>
  );
}
