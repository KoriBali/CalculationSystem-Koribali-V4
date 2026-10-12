import { ChevronDown, Info } from "lucide-react";

// Grey info box on a collapsible section, with the Show / Hide toggle on the
// right. While collapsed it also says how many fields are filled, so the
// user can tell there's something inside without opening it.
export function ReferenceNote({ open, onToggle, filled, total, children }) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2 bg-gray-50 border border-gray-200 rounded-lg hp:rounded-md px-4 py-2.5 text-xs md:text-sm text-gray-500">
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
        <span>
          {children}
          {!open && (
            <span className="text-slate-600">
              {" "}
              {filled} of {total} filled.
            </span>
          )}
        </span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 h-8 px-3 shrink-0 ml-auto rounded-lg hp:rounded-md text-xs md:text-sm font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm active:scale-[0.98] transition-all"
      >
        {open ? "Hide fields" : "Show fields"}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
