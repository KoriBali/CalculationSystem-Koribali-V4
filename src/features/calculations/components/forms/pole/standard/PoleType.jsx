// ==== CONSTANTS ====
// Available pole type options
const POLE_TYPE_OPTIONS = [
  { id: "taper", label: "Taper Pole" },
  { id: "straight", label: "Straight Pole" },
];

// === HELPERS ===

// Reusable section title with left accent bar
const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-sm font-medium hp:text-xs hp:gap-1">
    <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
    {children}
  </h3>
);

// === COMPONENT ===
export function PoleTypeSelector({ poleTypeStandard, onUpdate }) {
  return (
    <div className="mb-6 px-4 md:px-6">
      <SectionTitle>Select Pole Type</SectionTitle>

      <div className="border border-slate-200 rounded-xl hp:rounded-lg p-4 md:p-6 bg-white shadow-sm">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {POLE_TYPE_OPTIONS.map((option) => {
            const isActive = poleTypeStandard.type === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onUpdate({ type: option.id })}
                className={`rounded-lg hp:rounded-md border px-4 py-2 lg:py-2.5 text-xs md:text-sm font-medium transition-all
                  ${
                    isActive
                      ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
