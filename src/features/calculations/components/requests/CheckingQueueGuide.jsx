import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars -- used as <motion.*> in JSX
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, ArrowRight, CornerDownLeft } from "lucide-react";
import RequestStatusChip from "./RequestStatusChip";

// "Status guide" button + popover for the Checking Queue:
// How checking moves, what each tab means, and what each status means.

const FLOW = [
  { key: "ready_check", label: "Ready for check" },
  { key: "in_progress", label: "Under check" },
  { key: "ready_submit", label: "Ready to submit" },
];

const BRANCHES = [
  {
    key: "internal_correction",
    label: "Internal correction",
    from: "Under check",
    why: "the checker finds issues",
  },
];

const QUEUE_TABS = [
  {
    key: "ready",
    label: "Ready to Check",
    style: "bg-amber-50 text-amber-700 ring-amber-200",
    hint: "Open pool. Projects with at least one case ready for review and not yet claimed.",
    rule: "Leaves this tab when all cases are claimed or moved to correction.",
  },
  {
    key: "mine",
    label: "My Checks",
    style: "bg-sky-50 text-sky-700 ring-sky-200",
    hint: "Your active checks. Projects where you are actively reviewing one or more cases.",
    rule: "Automatically leaves this tab once your assigned cases are verified.",
  },
  {
    key: "correction",
    label: "Needs Correction",
    style: "bg-rose-50 text-rose-700 ring-rose-200",
    hint: "Team revisions. Projects with cases returned to drafters for fixes.",
    rule: "Moves back to Ready for check once the drafter resubmits.",
  },
  {
    key: "all",
    label: "All Queue",
    style: "bg-slate-100 text-slate-700 ring-slate-200",
    hint: "Total overview. Shows all active checking tasks across the department.",
    rule: "Exits the checking queue completely once all cases are Ready to submit.",
  },
];

const STATUS_MEANINGS = [
  {
    key: "ready_check",
    label: "Ready for check",
    hint: "Calculations and drawings are completed by the drafter. Ready to be claimed from the open pool.",
    tab: "Ready to Check / All Queue",
  },
  {
    key: "in_progress",
    label: "Under check",
    hint: "Claimed by a checker and actively being reviewed.",
    tab: "My Checks / All Queue",
  },
  {
    key: "internal_correction",
    label: "Internal correction",
    hint: "The checker found issues. The drafter must fix them and resubmit for checking.",
    tab: "Needs Correction / All Queue",
  },
  {
    key: "ready_submit",
    label: "Ready to submit",
    hint: "Checked and approved. Exits the checking queue once all cases are completed.",
    tab: "Ready to Submit (Request list)",
  },
];

const SectionTitle = ({ children }) => (
  <p className="mb-2.5 text-xs font-semibold text-slate-700">{children}</p>
);

export default function CheckingQueueGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label="Status guide"
        title="Status guide"
        className={`inline-flex items-center gap-1.5 pb-3 pt-1 text-sm whitespace-nowrap transition-colors outline-none focus-visible:underline ${
          isOpen ? "text-[#0d3b66]" : "text-slate-500 hover:text-[#0d3b66]"
        }`}
      >
        <Info className="w-4 h-4" />
        {/* Icon only on phones so the tabs keep their room. */}
        <span className="hidden sm:inline">Status guide</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Status guide"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 z-40 w-[560px] max-w-[calc(100vw-2rem)] max-h-[75vh] overflow-y-auto scrollbar-soft bg-white rounded-xl border border-slate-200 shadow-xl"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Status guide</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close status guide"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-5">
              {/* How checking moves */}
              <section>
                <SectionTitle>How checking moves</SectionTitle>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                  {FLOW.map((s, i) => (
                    <span key={s.key} className="inline-flex items-center gap-1.5">
                      {i > 0 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      )}
                      <RequestStatusChip statusKey={s.key} label={s.label} />
                    </span>
                  ))}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {BRANCHES.map((b) => (
                    <li
                      key={b.key}
                      className="flex items-center gap-2 text-xs font-medium text-slate-600"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <RequestStatusChip statusKey={b.key} label={b.label} />
                      <span>
                        from{" "}
                        <span className="font-semibold text-slate-800">
                          {b.from}
                        </span>
                        , when {b.why}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* What each tab means */}
              <section>
                <SectionTitle>What each tab means</SectionTitle>
                <dl className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                  {QUEUE_TABS.map((tab) => (
                    <div
                      key={tab.key}
                      className="grid grid-cols-[150px_1fr] gap-3 px-3 py-2.5 hp:grid-cols-1 hp:gap-1.5"
                    >
                      <dt>
                        <span
                          className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${tab.style}`}
                        >
                          {tab.label}
                        </span>
                      </dt>
                      <dd className="text-xs leading-relaxed font-medium text-slate-700">
                        {tab.hint}
                        <span className="block mt-0.5 font-normal text-slate-500">
                          Lifecycle: {tab.rule}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* What each status means */}
              <section>
                <SectionTitle>What each status means</SectionTitle>
                <dl className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                  {STATUS_MEANINGS.map((s) => (
                    <div
                      key={s.key}
                      className="grid grid-cols-[150px_1fr] gap-3 px-3 py-2.5 hp:grid-cols-1 hp:gap-1.5"
                    >
                      <dt>
                        <RequestStatusChip statusKey={s.key} label={s.label} />
                      </dt>
                      <dd className="text-xs leading-relaxed font-medium text-slate-700">
                        {s.hint}
                        <span className="block mt-0.5 font-normal text-slate-500">
                          Tab: {s.tab}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
