import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { statusHint } from "../../utils/requestStatus";

// Status chip used in the table and the Status guide. With `withHint`, a
// short explanation appears on hover / keyboard focus. The tooltip is
// rendered into <body> with fixed positioning so the table's horizontal
// scroll container can't clip it.

const STATUS_STYLE = {
  internal_correction: "bg-red-50 text-red-700 ring-red-200",
  returned: "bg-amber-50 text-amber-700 ring-amber-200",
  in_progress: "bg-white text-slate-600 ring-slate-300",
  ready_check: "bg-sky-50 text-sky-700 ring-sky-200",
  ready_submit: "bg-violet-50 text-violet-700 ring-violet-200",
  submitted: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  cleared: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-slate-100 text-slate-500 ring-slate-200",
};

const TOOLTIP_WIDTH = 260;

export default function RequestStatusChip({ statusKey, label, withHint = false }) {
  const ref = useRef(null);
  const [tip, setTip] = useState(null); // { top, left } while visible
  const hint = withHint ? statusHint(statusKey) : "";

  const show = () => {
    if (!hint || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Centred above the chip, kept inside the viewport horizontally.
    const left = Math.min(
      Math.max(8, rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2),
      window.innerWidth - TOOLTIP_WIDTH - 8,
    );
    setTip({ top: rect.top - 8, left });
  };
  const hide = () => setTip(null);

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={hint ? 0 : undefined}
        aria-label={hint ? `${label}: ${hint}` : undefined}
        className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset outline-none focus-visible:ring-2 focus-visible:ring-[#3399cc] ${
          hint ? "cursor-help" : ""
        } ${STATUS_STYLE[statusKey] ?? ""}`}
      >
        {label}
      </span>

      {tip &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: tip.top,
              left: tip.left,
              width: TOOLTIP_WIDTH,
              transform: "translateY(-100%)",
            }}
            className="z-[100] pointer-events-none rounded-lg bg-slate-900 px-3 py-2 text-xs leading-relaxed text-white shadow-lg"
          >
            <span className="block font-semibold mb-0.5">{label}</span>
            {hint}
          </div>,
          document.body,
        )}
    </>
  );
}
