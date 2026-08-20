import {
  LayoutDashboard,
  PenTool,
  Blocks,
  CheckCircle,
  Circle,
} from "lucide-react";
import { SectionTitle, SectionCard } from "./coverFieldPrimitives";

// Document Type picker — Calculation Only / Drawing Only / Calculation &
// Drawing. Backed by workflow.projectMode, independent of identity and
// report cover data.
export function WorkflowModePicker({ projectMode, onSelectMode }) {
  return (
    <div>
      <SectionTitle>Document Type</SectionTitle>
      <SectionCard>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <RadioCard
            label="Calculation Only"
            icon={<LayoutDashboard size={16} />}
            selected={projectMode === "calculation"}
            onSelect={() => onSelectMode("calculation")}
          />
          <RadioCard
            label="Drawing Only"
            icon={<PenTool size={16} />}
            selected={projectMode === "drawing"}
            onSelect={() => onSelectMode("drawing")}
          />
          <RadioCard
            label="Calculation & Drawing"
            icon={<Blocks size={16} />}
            selected={projectMode === "both"}
            onSelect={() => onSelectMode("both")}
          />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── SUB-COMPONENT ───────────────────────────────────────────────────────────

// Reusable radio card for mutually exclusive selections
function RadioCard({ label, icon, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full flex items-center justify-between px-3 xl:px-4 py-2 lg:py-3 relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer active:scale-[0.98]
        ${
          selected
            ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-50"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`p-1.5 rounded-md ${selected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
        >
          {icon}
        </div>
        {/* Label */}
        <p
          className={`text-[12px] md:text-sm font-medium ${selected ? "text-slate-900" : "text-slate-700"}`}
        >
          {label}
        </p>
      </div>

      {/* Radio Indicator */}
      <div className="shrink-0 ml-2 flex items-center">
        {selected ? (
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
        ) : (
          <Circle className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-slate-400" />
        )}
      </div>
    </button>
  );
}
