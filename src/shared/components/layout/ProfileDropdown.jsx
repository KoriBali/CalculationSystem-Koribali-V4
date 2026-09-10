import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

// Profile button + dropdown menu
export function ProfileDropdown({ userData, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = userData?.name || "Guest User";
  const displayEmail = userData?.email || "";

  const formatRole = (role) => {
    if (!role) return "";

    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const displayRole = formatRole(userData?.role);

  const initial = displayName.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* ─────────────────────────────────────────────
          PROFILE BUTTON
      ───────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3399cc]/40"
      >
        <span
          className="
            hidden sm:block
            text-[13px] sm:text-sm lg:text-[15px]
            leading-[1.4]
            font-semibold
            tracking-normal
            text-slate-800
            whitespace-nowrap
          "
        >
          {userData?.name || "Guest User"}
        </span>

        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${isOpen
            ? "bg-[#0d3b66] text-white border-[#0d3b66]"
            : "bg-slate-100 text-[#0d3b66] border-slate-200 group-hover:bg-[#0d3b66] group-hover:text-white group-hover:border-[#0d3b66]"
            }`}
        >
          <User size={16} />
        </div>
      </button>

      {/* ─────────────────────────────────────────────
          DROPDOWN MENU
      ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 6,
              scale: 0.98,
            }}
            transition={{
              duration: 0.15,
            }}
            role="menu"
            className="
              absolute
              right-0
              mt-2
              w-60
              bg-white
              rounded-xl
              border border-slate-200
              shadow-[0_10px_35px_rgba(15,23,42,0.12)]
              py-2
              z-50
              overflow-hidden
            "
          >
            {/* ─── USER INFO ─────────────────────── */}
            <div className="px-4 pt-2 pb-3 border-b border-slate-100 mb-1">
              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="
                      w-10 h-10
                      rounded-full
                      bg-[#0d3b66]
                      flex items-center justify-center
                      text-white
                      text-sm
                      font-semibold
                      shadow-sm
                    "
                  >
                    {initial}
                  </div>

                  {/* Online indicator */}
                  <div
                    className="
                      absolute
                      -bottom-0.5
                      -right-0.5
                      w-3 h-3
                      bg-emerald-500
                      border-2 border-white
                      rounded-full
                    "
                  />
                </div>

                {/* User details */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className="
                      truncate
                      text-[13px] md:text-sm
                      font-semibold
                      text-slate-800
                      leading-tight
                    "
                  >
                    {displayName}
                  </span>

                  {displayRole && (
                    <span
                      className="
                        mt-0.5
                        truncate
                        text-[11px] md:text-xs
                        font-medium
                        text-slate-500
                      "
                    >
                      {displayRole}
                    </span>
                  )}

                  {displayEmail && (
                    <span
                      className="
                        mt-1
                        truncate
                        text-[11px]
                        text-slate-400
                      "
                    >
                      {displayEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ─── MENU ITEMS ────────────────────── */}
            <div className="flex flex-col">

              {/* Account Settings */}
              <button
                type="button"
                role="menuitem"
                className="
                  w-full
                  flex items-center
                  gap-3
                  px-4 py-2.5
                  text-left
                  text-slate-600
                  hover:bg-slate-50
                  hover:text-slate-900
                  transition-colors
                  group
                "
              >
                <Settings
                  size={15}
                  className="
                    shrink-0
                    text-slate-400
                    group-hover:text-slate-600
                    transition-colors
                  "
                />

                <span className="text-[13px] font-medium">
                  Account Settings
                </span>
              </button>

              {/* Logout */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onLogout?.();
                }}
                className="
                  w-full
                  flex items-center
                  gap-3
                  px-4 py-2.5
                  mt-1
                  border-t border-slate-100
                  text-left
                  text-red-600
                  hover:bg-red-50
                  transition-colors
                  group
                "
              >
                <LogOut
                  size={15}
                  className="
                    shrink-0
                    text-red-400
                    group-hover:text-red-600
                    transition-colors
                  "
                />

                <span className="text-[13px] font-medium">
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