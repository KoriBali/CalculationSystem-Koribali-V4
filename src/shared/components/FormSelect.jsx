import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Same visual language as the compact filter/form dropdowns already used on
// the User Management page — a portal-rendered menu positioned against the
// trigger button, animated open/close — packaged here so any form can reuse
// it instead of a native <select>.
//
// `allowCustom` adds a trailing "Other…" row to the menu; picking it swaps
// the trigger for a free-text input so the user can type a value that isn't
// in `options`. The field still behaves as one value/onChange pair from the
// caller's point of view — it doesn't need to know custom mode exists.
export function FormSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select...",
  hasError = false,
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  allowCustom = false,
  customPlaceholder = "Enter a value",
}) {
  // Loading implies disabled — the trigger can't be opened until options
  // (usually master data) arrive.
  const isDisabled = disabled || loading;
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const customInputRef = useRef(null);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value),
  );

  // Custom mode = value is set but doesn't match any known option. Computed
  // once as the initial state (covers restoring a previously-saved custom
  // value on mount) rather than synced via effect on every value change —
  // toggling back to picker mode is explicit (the back arrow / "Other…"
  // below), so nothing else needs to re-derive this after mount.
  const [isCustomMode, setIsCustomMode] = useState(
    () => allowCustom && !!value && !selectedOption,
  );

  useEffect(() => {
    if (isCustomMode) customInputRef.current?.focus();
  }, [isCustomMode]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = 220;
    const openBelow = spaceBelow >= menuHeight || spaceBelow >= spaceAbove;
    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(openBelow
        ? { top: rect.bottom + 4 }
        : { bottom: window.innerHeight - rect.top + 4 }),
    });
  }, []);

  const handleOpen = () => {
    if (isDisabled) return;
    updatePosition();
    setIsOpen((v) => !v);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on the PAGE scrolling (so the menu doesn't drift away from its
  // trigger) or on resize — but not on scrolling the menu's own option
  // list, which also dispatches a "scroll" event that a window-level
  // capture listener would otherwise see and close the menu on.
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setIsOpen(false);
    };
    const handleResize = () => setIsOpen(false);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  if (isCustomMode) {
    return (
      <div className="relative w-full flex items-center gap-2">
        <input
          ref={customInputRef}
          id={id}
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={customPlaceholder}
          className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg outline-none transition-all text-xs md:text-sm border ${
            hasError
              ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
              : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
          }`}
        />
        <button
          type="button"
          title="Choose from list instead"
          onClick={() => {
            setIsCustomMode(false);
            onChange("");
          }}
          className="shrink-0 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-md md:rounded-lg border border-gray-300 text-gray-400 hover:border-[#3399cc] hover:text-[#3399cc] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={isDisabled}
        onClick={handleOpen}
        className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-md md:rounded-lg outline-none transition-all text-xs md:text-sm border text-left flex justify-between items-center ${
          isDisabled ? "bg-gray-50 cursor-not-allowed" : ""
        } ${
          hasError
            ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
            : isOpen
              ? "border-[#3399cc] bg-white ring-1 ring-[#3399cc]"
              : "border-gray-300 bg-white hover:border-[#3399cc]"
        } ${!selectedOption ? "text-slate-400" : "text-slate-900"}`}
      >
        <span className="truncate">
          {loading ? loadingText : selectedOption ? selectedOption.label : placeholder}
        </span>
        {loading ? (
          <Loader2 className="w-4 h-4 shrink-0 animate-spin text-gray-400" />
        ) : (
          <ChevronDown
            className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""} text-gray-400`}
          />
        )}
      </button>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              style={dropdownStyle}
              className="bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden"
            >
              <div className="max-h-[220px] overflow-y-auto divide-y divide-gray-200">
                {options.map((opt) => {
                  const isActive = String(value) === String(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                    >
                      <span
                        className={`text-xs md:text-sm truncate ${isActive ? "text-[#0d3b66] font-bold" : "text-slate-700 font-medium group-hover:text-slate-900"}`}
                      >
                        {opt.label}
                      </span>
                      {isActive && (
                        <Check className="w-4 h-4 shrink-0 text-[#0d3b66]" />
                      )}
                    </button>
                  );
                })}

                {allowCustom && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMode(true);
                      onChange("");
                      setIsOpen(false);
                    }}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs md:text-sm italic text-slate-500">
                      Other…
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
