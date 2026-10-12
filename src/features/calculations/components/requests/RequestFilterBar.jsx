import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  ArrowUpDown,
} from "lucide-react";
import RequestFilterDropdown from "./RequestFilterDropdown";
import RequestDateFilter from "./RequestDateFilter";

// One filter bar for every request list (Request page, Project Database).
// Each page passes only the filters that make sense for its scope:
//   search         { value, onChange, placeholder, hint }  quick search over
//                  all fields; `hint` (tooltip) lists which ones
//   quick          [{ key, prefix, options, value, onChange }] — always visible
//   advanced       [{ key, type: "text", label, placeholder, value, onChange }
//                 | { key, type: "select", label, options, value, onChange }
//                 | { key, type: "date", label, value, onChange }]  From / To
//                  — in the collapsible "More filters" panel, in reading
//                  order; `hidden` skips one
//   advancedCount  how many advanced filters are active (shown on the button)
//   isFiltered     anything set at all → show "Reset filters"
//   onReset        clears search + every filter
//   resultCount    rows matching, shown above the table next to…
//   sort           { options, value, onChange } — ordering isn't a filter, so
//                  it sits with the result count rather than in the filters

const textInputClass =
  "h-10 w-full min-w-0 px-3 rounded-lg hp:rounded-md border text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]";

function renderField(f) {
  if (f.type === "date") {
    return <RequestDateFilter value={f.value} onChange={f.onChange} />;
  }
  if (f.type === "text") {
    return (
      <input
        id={`filter-${f.key}`}
        type="text"
        value={f.value}
        placeholder={f.placeholder}
        onChange={(e) => f.onChange(e.target.value)}
        className={`${textInputClass} ${
          f.value.trim()
            ? "border-[#0d3b66]/30 bg-[#0d3b66]/5"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      />
    );
  }
  return (
    <RequestFilterDropdown
      options={f.options}
      selected={f.value}
      onChange={f.onChange}
      fullWidth
    />
  );
}

export default function RequestFilterBar({
  search,
  quick = [],
  advanced = [],
  advancedCount = 0,
  isFiltered = false,
  onReset,
  resultCount,
  legend,
  sort,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const visibleAdvanced = advanced.filter((f) => !f.hidden);
  const advancedHighlighted = showAdvanced || advancedCount > 0;

  return (
    // relative z-20: open menus must overlay the table below, including its
    // sticky (z-10) No./Project cells.
    <div className="relative z-20 bg-white px-6 hp:px-4 pt-4 rounded-t-2xl hp:rounded-t-xl border border-b-0 border-slate-200">
      {/* Row 1: quick search, quick filters, panel toggle, reset */}
      <div className="flex flex-wrap items-center gap-3">
        {search && (
          <div className="relative w-full lg:w-auto lg:flex-1 lg:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={search.placeholder}
              title={search.hint}
              aria-label={search.hint}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 rounded-lg hp:rounded-md text-sm text-slate-700 placeholder:text-slate-400 outline-none hover:border-slate-300 focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc] transition-all"
            />
          </div>
        )}

        {quick.map((f) => (
          <RequestFilterDropdown
            key={f.key}
            prefix={f.prefix}
            options={f.options}
            selected={f.value}
            onChange={f.onChange}
          />
        ))}

        {advanced.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
            className={`w-full sm:w-auto h-10 flex items-center justify-center gap-2 px-3 rounded-lg hp:rounded-md border text-sm whitespace-nowrap transition-all outline-none focus-visible:ring-1 focus-visible:ring-[#3399cc] ${
              advancedHighlighted
                ? "border-[#0d3b66]/30 bg-[#0d3b66]/5 text-[#0d3b66]"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <SlidersHorizontal
              className={`w-4 h-4 ${advancedHighlighted ? "text-[#0d3b66]" : "text-slate-400"}`}
            />
            More filters{advancedCount > 0 && ` (${advancedCount})`}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""} ${advancedHighlighted ? "text-[#0d3b66]/60" : "text-slate-400"}`}
            />
          </button>
        )}

        {isFiltered && onReset && (
          // Ghost button: red like the forms' Reset, but no border, so it
          // doesn't carry the same weight as the filter controls beside it.
          <button
            type="button"
            onClick={onReset}
            className="h-10 shrink-0 inline-flex items-center gap-2 px-3 rounded-lg hp:rounded-md text-red-500 text-sm font-medium whitespace-nowrap hover:bg-red-50 hover:text-red-600 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-red-300"
          >
            <RotateCcw className="w-4 h-4" />
            Reset filters
          </button>
        )}
      </div>

      {/* Advanced panel, closed by default */}
      <AnimatePresence initial={false}>
        {showAdvanced && visibleAdvanced.length > 0 && (
          // Fade + slide only. Animating height needs overflow:hidden, which
          // cut off dropdown menus opened inside the panel.
          // relative z-10: the clip-path below makes its own stacking
          // context, so without this the sort row after it paints over
          // menus opened in the panel.
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {/* One column grid for every row, so the "|" hairlines line up
                across rows like table columns. A date range spans two
                columns.
                  < sm   1 column
                  sm     2 columns
                  lg     4 columns: 4 · 4 · the two date ranges
                  3xl+   6 columns (1640px): 6 · then type, office, 2 dates
                Hairlines: every cell has a left border and px-3; the grid
                sits 12px further left (-mx-3) and the wrapper clips anything
                left of its own edge, which hides the first column's border
                at every breakpoint. Only the left side is clipped, so
                dropdown menus inside still overflow freely. */}
            <div className="mt-4 pt-4 border-t border-slate-100 [clip-path:inset(-200vh_-200vw_-200vh_0)]">
              <div className="-mx-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6 items-start gap-y-4">
                {visibleAdvanced.map((f) => (
                  <div
                    key={f.key}
                    className={`min-w-0 self-stretch px-3 border-l border-slate-200 ${
                      f.type === "date" ? "sm:col-span-2" : ""
                    }`}
                  >
                    <label
                      htmlFor={`filter-${f.key}`}
                      className="block mb-1.5 text-xs font-medium text-slate-600"
                    >
                      {f.label}
                    </label>
                    {renderField(f)}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result count + sort, directly above the table */}
      <div className="mt-4 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700 tabular-nums">
              {resultCount}
            </span>{" "}
            {resultCount === 1 ? "request" : "requests"}
          </p>
          {legend}
        </div>
        {sort && (
          <RequestFilterDropdown
            icon={ArrowUpDown}
            options={sort.options}
            selected={sort.value}
            onChange={sort.onChange}
            split={false}
          />
        )}
      </div>
    </div>
  );
}
