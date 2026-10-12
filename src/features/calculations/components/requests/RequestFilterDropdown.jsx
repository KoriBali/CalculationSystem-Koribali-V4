import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Filter / sort dropdown for the request lists. The first option is the
// neutral one ("All" / default order); picking anything else tints the
// trigger navy, so applied filters are visible without opening them.
// `prefix` renders inline ("Line: All") so the trigger needs no separate
// label; `icon` is optional. `split` separates the first option in the menu.
// `tintWhenApplied={false}` turns the navy tint off for pickers that are part
// of another filter (month / year), where "not the first option" means
// nothing.

function Option({ opt, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(opt.key)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
        isActive
          ? "bg-[#0d3b66]/5 text-[#0d3b66] font-medium"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {isActive ? (
        <Check className="w-4 h-4 text-[#3399cc] shrink-0" />
      ) : (
        <span className="w-4 shrink-0" />
      )}
      {opt.label}
    </button>
  );
}

export default function RequestFilterDropdown({
  icon: Icon,
  prefix,
  options,
  selected,
  onChange,
  split = true,
  fullWidth = false,
  tintWhenApplied = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    options.find((opt) => opt.key === selected) || options[0];
  const isApplied = selectedOption.key !== options[0].key;
  const tinted = tintWhenApplied && isApplied && !isOpen;

  const handleSelect = (key) => {
    onChange(key);
    setIsOpen(false);
  };

  return (
    // Sized to its label (never truncated); `fullWidth` stretches it to
    // fill a grid cell, as in the More filters panel.
    <div
      className={`relative shrink-0 ${fullWidth ? "w-full" : "w-full sm:w-auto"}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className={`w-full h-10 flex items-center gap-2 px-3 rounded-lg hp:rounded-md border text-sm whitespace-nowrap transition-all outline-none focus-visible:ring-1 focus-visible:ring-[#3399cc] ${
          isOpen
            ? "border-[#3399cc] ring-1 ring-[#3399cc] bg-white text-slate-700"
            : tinted
              ? "border-[#0d3b66]/30 bg-[#0d3b66]/5 text-[#0d3b66]"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
        }`}
      >
        {Icon && (
          <Icon
            className={`w-4 h-4 shrink-0 ${tinted ? "text-[#0d3b66]" : "text-slate-400"}`}
          />
        )}
        <span className="flex-1 text-left">
          {prefix && (
            <span className={tinted ? "text-[#0d3b66]/70" : "text-slate-500"}>
              {prefix}:{" "}
            </span>
          )}
          {selectedOption.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${tinted ? "text-[#0d3b66]/60" : "text-slate-400"}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-1.5 min-w-full left-0 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden whitespace-nowrap"
          >
            {split && (
              <div className="py-1 border-b border-slate-100">
                <Option
                  opt={options[0]}
                  isActive={options[0].key === selected}
                  onSelect={handleSelect}
                />
              </div>
            )}
            <div className="py-1 max-h-[280px] overflow-y-auto scrollbar-soft">
              {(split ? options.slice(1) : options).map((opt) => (
                <Option
                  key={opt.key}
                  opt={opt}
                  isActive={opt.key === selected}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
