import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut } from "lucide-react";

// Profile button + dropdown menu — handles open/close and outside click
export function ProfileDropdown({ userData, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
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
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border
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
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 py-2 z-50 overflow-hidden"
          >
            {/* User info header */}
            <div className="px-4 pb-3 pt-2 border-b border-slate-100 mb-1">
              <div className="flex items-center gap-3">
                {/* Avatar with online indicator */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-[#0d3b66] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {userData.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
                    {userData.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="flex flex-col">
              {/* Account settings */}
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors group">
                <Settings size={15} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span className="text-[13px] font-medium tracking-wide">
                  Account Settings
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors group border-t border-slate-50 mt-1"
              >
                <LogOut size={15} className="text-red-400 group-hover:text-red-600 transition-colors" />
                <span className="text-[13px] font-medium tracking-wide">
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
