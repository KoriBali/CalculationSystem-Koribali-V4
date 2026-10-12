import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, ArrowRight, CornerDownLeft } from "lucide-react";
import RequestStatusChip from "./RequestStatusChip";
import { REQUEST_STATUSES, REQUEST_TABS } from "../../utils/requestStatus";

// "Status guide" button + popover: how a request moves through the
// statuses, and what each one means and which tab it lands in.

const label = (key) => REQUEST_STATUSES.find((s) => s.key === key).label;
const tabLabel = (key) => REQUEST_TABS.find((t) => t.key === key).label;

// Main path, left to right.
const FLOW = ["in_progress", "ready_check", "ready_submit", "submitted", "cleared"];

// Ways a request comes back to you, or leaves the flow.
const BRANCHES = [
  { key: "internal_correction", from: "ready_check", why: "the checker finds issues" },
  { key: "returned", from: "submitted", why: "Japan sends feedback" },
  { key: "cancel", from: null, why: "the request is cancelled" },
];

// Meanings listed in the order of the flow above, then the branches.
const GUIDE_ORDER = [...FLOW, ...BRANCHES.map((b) => b.key)].map((k) =>
  REQUEST_STATUSES.find((s) => s.key === k),
);

const Chip = ({ k }) => <RequestStatusChip statusKey={k} label={label(k)} />;

const SectionTitle = ({ children }) => (
  <p className="mb-2.5 text-xs font-semibold text-slate-700">{children}</p>
);

export default function RequestStatusGuide() {
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
              {/* Flow */}
              <section>
                <SectionTitle>How a request moves</SectionTitle>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                  {FLOW.map((k, i) => (
                    <span key={k} className="inline-flex items-center gap-1.5">
                      {i > 0 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      )}
                      <Chip k={k} />
                    </span>
                  ))}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {BRANCHES.map((b) => (
                    <li key={b.key} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <Chip k={b.key} />
                      <span>
                        from{" "}
                        <span className="font-semibold text-slate-800">
                          {b.from ? label(b.from) : "any status"}
                        </span>
                        , when {b.why}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Meanings */}
              <section>
                <SectionTitle>What each status means</SectionTitle>
                <dl className="divide-y divide-slate-100 rounded-lg border border-slate-100">
                  {GUIDE_ORDER.map((s) => (
                    <div
                      key={s.key}
                      className="grid grid-cols-[150px_1fr] gap-3 px-3 py-2.5 hp:grid-cols-1 hp:gap-1.5"
                    >
                      <dt>
                        <Chip k={s.key} />
                      </dt>
                      <dd className="text-xs leading-relaxed font-medium text-slate-700">
                        {s.hint}
                        <span className="block mt-0.5 font-normal text-slate-500">
                          Tab: {s.tabs.map(tabLabel).join(" / ")}
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
