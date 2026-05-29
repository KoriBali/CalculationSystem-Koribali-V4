const onGlImg = "/images/on-gl.svg";
const upperGlImg = "/images/upper-gl.svg";
const underGlImg = "/images/under-gl.svg";
const onGlhImg = "/images/on-GL(h).svg";
const upperGlhImg = "/images/upper-GL(h).svg";
const underGlhImg = "/images/under-GL(h).svg";

const GROUND_OPTIONS = [
  { id: "onGL", label: "On GL", img: onGlImg, imgH: onGlhImg },
  { id: "upperGL", label: "Upper GL", img: upperGlImg, imgH: upperGlhImg },
  { id: "underGL", label: "Under GL", img: underGlImg, imgH: underGlhImg },
];

const inputStyle = (hasError, disabled) =>
  `w-full pl-3 md:pl-4 pr-10 py-2 lg:py-2.5 rounded-lg hp:rounded-md text-xs md:text-sm outline-none transition-all border
  ${
    disabled
      ? "bg-gray-100 border-gray-200 text-gray-400"
      : hasError
        ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
        : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }`;

export function PoleConfigForm({ poleConfig, onUpdate, errors }) {
  const { lowestHeight, groundPosition, overdesignFactor } = poleConfig;

  const handleModeChange = (mode) => {
    if (mode === groundPosition) return;
    onUpdate({
      groundPosition: mode,
      lowestHeight: mode === "onGL" ? "0" : "",
    });
  };

  return (
    <div className="bg-white border border-gray-200 p-5 hp:p-4 rounded-lg sm:rounded-xl shadow-sm">
      <div className="grid grid-cols-1 gap-6">
        {/* ── Ground Position Cards ── */}
        <div className="grid grid-cols-1 gap-4 hp:gap-2">
          <h4 className="block text-xs sm:text-sm text-gray-700">
            Select Ground Position
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {GROUND_OPTIONS.map((opt) => {
              const isActive = groundPosition === opt.id;
              const isOnGL = opt.id === "onGL";
              const disabled = isOnGL || !isActive;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleModeChange(opt.id)}
                  className={`flex flex-col gap-4 rounded-xl hp:rounded-lg border-2 p-4 cursor-pointer transition-all
                  ${
                    isActive
                      ? "border-[#3399cc] bg-[#f0f8ff]"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {/* Label */}
                  <p
                    className={`text-xs md:text-sm font-semibold ${isActive ? "text-[#0d3b66]" : "text-gray-400"}`}
                  >
                    {opt.label}
                  </p>

                  {/* Diagram */}
                  <div className="flex flex-col 2xl:flex-row 2xl:items-end 2xl:justify-center gap-4 h-auto 2xl:h-52">
                    {/* Gambar A dibawah ukuran 2xl */}
                    <img
                      src={opt.imgH}
                      alt={opt.label}
                      className={`2xl:hidden h-40 md:h-48 w-full object-contain transition-all ${!isActive ? "opacity-40" : ""}`}
                    />

                    {/* Lowest Height input */}
                    <div className="mb-2 w-full 2xl:w-auto">
                      <label
                        className={`block text-xs md:text-sm mb-2 md:mb-2 ${isActive ? "text-gray-700" : "text-gray-300"}`}
                      >
                        <span className="2xl:hidden"> Lowest Height (h)</span>
                        <span className="hidden 2xl:inline">
                          {" "}
                          Lowest Height
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={isOnGL ? "0" : isActive ? lowestHeight : ""}
                          readOnly={!isActive}
                          placeholder={
                            isActive && !isOnGL ? "Input height" : "—"
                          }
                          onMouseDown={() => {
                            if (!isActive) {
                              onUpdate({
                                groundPosition: opt.id,
                                lowestHeight: opt.id === "onGL" ? "0" : "",
                              });
                            }
                          }}
                          onChange={(e) =>
                            !disabled &&
                            onUpdate({ lowestHeight: e.target.value })
                          }
                          onWheel={(e) => e.target.blur()}
                          className={`${inputStyle(errors.lowestHeight, disabled)}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
                          mm
                        </span>
                      </div>
                      {isActive && errors.lowestHeight && (
                        <p className="text-[10px] text-red-500 mt-1">
                          *{errors.lowestHeight}
                        </p>
                      )}
                    </div>
                    {/* Gambar B jika ukuran layar 2xl */}
                    <img
                      src={opt.img}
                      alt={opt.label}
                      className={`hidden 2xl:block 2xl:h-full 2xl:w-auto object-contain transition-all ${!isActive ? "opacity-40" : ""}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Overdesign Factor ── */}
        <div className="relative">
          <label className="block text-xs md:text-sm text-gray-700 mb-1 md:mb-2">
            Overdesign Factor
          </label>
          <input
            type="number"
            min={0}
            value={overdesignFactor}
            onChange={(e) => onUpdate({ overdesignFactor: e.target.value })}
            onWheel={(e) => e.target.blur()}
            className={inputStyle(errors.overdesignFactor, false)}
          />
          {errors.overdesignFactor && (
            <p className="absolute text-[10px] text-red-500 mt-1">
              *{errors.overdesignFactor}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
