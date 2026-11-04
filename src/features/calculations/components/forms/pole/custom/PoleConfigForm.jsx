import { AdaptiveGroundPositionInput } from "../common/AdaptiveGroundPositionInput";

const inputStyle = (hasError, disabled) =>
  `w-full pl-3 md:pl-4 pr-9 py-2 lg:py-2.5 rounded-lg hp:rounded-md text-xs md:text-sm outline-none transition-all border
  ${
    disabled
      ? "bg-gray-100 border-gray-200 text-gray-400"
      : hasError
        ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
        : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

export function PoleConfigForm({ poleConfig, onUpdate, errors }) {
  const { lowestHeight, groundPosition, overdesignFactor } = poleConfig;

  return (
    <div className="bg-white border border-gray-200 p-5 hp:p-4 rounded-lg sm:rounded-xl shadow-sm">
      <div className="grid grid-cols-1 gap-6">
        {/* ── Ground Position & Lowest Height ── */}
        <AdaptiveGroundPositionInput
          value={lowestHeight ?? ""}
          groundPosition={groundPosition ?? "onGL"}
          onChange={({ lowestHeight: nextH, groundPosition: nextPos }) => {
            onUpdate({ lowestHeight: nextH, groundPosition: nextPos });
          }}
          error={errors.lowestHeight}
          label="Lowest Height"
          required={true}
        />

        {/* ── Overdesign Factor ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-start p-4 sm:p-5 bg-slate-50/50 border border-slate-200 rounded-xl hp:rounded-lg gap-4 sm:gap-8 xl:gap-16">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-slate-700">
              Overdesign Factor <span className="text-red-500 ml-1 font-semibold">*</span>
            </label>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
              Safety margin multiplier applied to the structural calculation
            </p>
          </div>
          <div className="relative w-full sm:w-[180px] xl:w-[200px]">
            <input
              id="overdesignFactor"
              type="number"
              min={0}
              value={overdesignFactor}
              onChange={(e) => onUpdate({ overdesignFactor: e.target.value })}
              onWheel={(e) => e.target.blur()}
              className={inputStyle(errors.overdesignFactor, false)}
            />
            {errors.overdesignFactor && (
              <p className="absolute text-[10px] text-red-500 mt-0.5">
                *{errors.overdesignFactor}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
