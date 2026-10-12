import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Table footer: rows-per-page + range on the left, page buttons on the
// right. Same look as the User Management pagination.

function PageSizeDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className={`h-8 min-w-[64px] flex items-center justify-between gap-1.5 pl-3 pr-2 rounded-lg hp:rounded-md border text-sm bg-white text-slate-700 transition-all outline-none ${
          isOpen
            ? "border-[#3399cc] ring-1 ring-[#3399cc]"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        {value}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-1.5 left-0 z-30 min-w-full bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden py-1"
          >
            {options.map((opt) => {
              const isActive = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#0d3b66]/5 text-[#0d3b66] font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {isActive ? (
                    <Check className="w-3.5 h-3.5 text-[#3399cc] shrink-0" />
                  ) : (
                    <span className="w-3.5 shrink-0" />
                  )}
                  {opt}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const navButton =
  "flex items-center justify-center w-8 h-8 rounded-lg hp:rounded-md border border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all";

export default function RequestPagination({
  page,
  pageSize,
  pageSizeOptions,
  total,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 hp:px-4 py-3.5 border-t border-slate-200 bg-slate-50/60">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <label className="flex items-center gap-2 whitespace-nowrap">
          Rows per page
          <PageSizeDropdown
            options={pageSizeOptions}
            value={pageSize}
            onChange={onPageSizeChange}
          />
        </label>
        <span className="tabular-nums whitespace-nowrap">
          Showing {rangeStart} to {rangeEnd} of {total}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={navButton}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex items-center justify-center min-w-8 h-8 px-2 rounded-lg hp:rounded-md text-sm tabular-nums transition-all ${
              p === page
                ? "bg-[#0d3b66] text-white font-semibold shadow-sm"
                : "border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={navButton}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
