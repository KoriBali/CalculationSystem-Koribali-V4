import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut } from "lucide-react";

// Profile button + dropdown menu — handles open/close and outside click
export function ProfileDropdown({ userData, onLogout }) {
  const [isOpen, setIsOpen] = useRef(false); // use state instead
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 group cursor-pointer"
      >
        <p className="text-[12px] font-semibold text-slate-800 hidden sm:block">
          {userData.name}
        </p>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border
          ${
            isOpen
              ? "bg-[#0d3b66] text-white border-[#0d3b66]"
              : "bg-slate-100 text-[#0d3b66] border-slate-200 group-hover:bg-[#0d3b66] group-hover:text-white"
          }`}
        >
          <User size={16} />
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-64 hp:w-56 hp:mt-2 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-4 px-2 hp:py-3 hp:px-1.5 z-50 overflow-hidden"
          >
            {/* User info header */}
            <div className="px-4 pb-4 mb-2 border-b border-slate-50 hp:px-3 hp:pb-3">
              <div className="flex items-center gap-3 hp:gap-2">
                {/* Avatar with online indicator */}
                <div className="relative group">
                  <div className="w-11 h-11 hp:w-9 hp:h-9 rounded-xl bg-gradient-to-br from-[#0d3b66] to-[#1a5a92] flex items-center justify-center text-white font-black text-base hp:text-sm shadow-lg shadow-blue-900/20">
                    {userData.name.charAt(0)}
                  </div>
                  {/* Online status dot */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 hp:w-3 hp:h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>

                <div className="flex flex-col min-w-0">
                  <p className="text-sm hp:text-[13px] font-semibold text-slate-800 leading-none truncate">
                    {userData.name}
                  </p>
                  <p className="text-[10px] hp:text-[9px] text-slate-400 font-bold mt-1.5 hp:mt-1 truncate">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="space-y-1 hp:space-y-2 hp:px-2">
              {/* Account settings */}
              <button className="w-full flex items-center gap-3 hp:gap-2 px-3 py-2.5 hp:px-2.5 hp:py-1.5 text-slate-600 bg-blue-50 hover:bg-blue-100 rounded-xl hp:rounded-lg transition-all group">
                <div className="w-8 h-8 hp:w-7 hp:h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#0d3b66] group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                  <Settings size={14} />
                </div>
                <span className="text-[12px] hp:text-[11px] font-semibold tracking-wide truncate">
                  Account Settings
                </span>
              </button>

              {/* Logout — closes dropdown then opens confirm modal */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 hp:gap-2 px-3 py-2.5 hp:px-2.5 hp:py-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl hp:rounded-lg transition-all group"
              >
                <div className="w-8 h-8 hp:w-7 hp:h-7 rounded-lg bg-slate-50 flex items-center justify-center text-red-400 group-hover:text-red-500 group-hover:bg-white border border-transparent group-hover:border-red-100 transition-all">
                  <LogOut size={14} />
                </div>
                <span className="text-[12px] hp:text-[11px] font-semibold tracking-wide truncate">
                  Logout Session
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
