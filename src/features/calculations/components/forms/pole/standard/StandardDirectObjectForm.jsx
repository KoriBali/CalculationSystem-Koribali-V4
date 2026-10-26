import PropTypes from "prop-types";
import { RotateCcw } from "lucide-react";
import { useMasterData } from "../../../../hooks/useMasterData";
import { FormSelect } from "../../../../../../shared/components/FormSelect";

// Helper styles
const inputStyle = (hasError, readOnly) =>
  `w-full py-2 lg:py-2.5 rounded-lg hp:rounded-md outline-none transition-all text-xs md:text-sm border
  ${
    hasError
      ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  }
  ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`;

const ErrorStyle = ({ show, text }) =>
  show ? (
    <div className="absolute left-0 -bottom-4 md:-bottom-5 flex items-center gap-1 text-[9px] md:text-[11px] text-red-500">
      <span>*{text}</span>
    </div>
  ) : null;

ErrorStyle.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string,
};

// Helper to determine if current object values differ from default spec
const isObjectModified = (current, defaultObj) => {
  if (!current || !defaultObj) return false;

  const isDifferent = (a, b, isNumeric = false) => {
    if (isNumeric) {
      const numA = a === "" || a === null || a === undefined ? NaN : Number(a);
      const numB = b === "" || b === null || b === undefined ? NaN : Number(b);
      if (isNaN(numA) && isNaN(numB)) return false;
      if (isNaN(numA) || isNaN(numB)) return true;
      return numA !== numB;
    }
    return String(a ?? "").trim() !== String(b ?? "").trim();
  };

  if (isDifferent(current.name, defaultObj.name)) return true;
  if (isDifferent(current.type, defaultObj.type)) return true;
  if (isDifferent(current.frontArea, defaultObj.frontArea, true)) return true;
  if (isDifferent(current.sideArea, defaultObj.sideArea, true)) return true;
  if (isDifferent(current.weight, defaultObj.weight, true)) return true;
  if (isDifferent(current.zHeight, defaultObj.zHeight, true)) return true;
  if (isDifferent(current.nnC, defaultObj.nnC, true)) return true;
  if (isDifferent(current.quantity, defaultObj.quantity, true)) return true;
  if (isDifferent(current.fixAngle, defaultObj.fixAngle, true)) return true;

  return false;
};

export function StandardDirectObjectForm({
  directObjects = [],
  defaultObjects = [],
  onUpdate,
  errors = {},
  taperPoleStandard = {},
  readOnly = false,
  onResetDefault,
}) {
  const {
    objectTypeOptions,
    loading: objectTypesLoading,
    error: objectTypesError,
  } = useMasterData();

  const fallbackTypeOptions = [
    { value: "omni", label: "Omni" },
    { value: "directional", label: "Directional" },
  ];

  const availableTypeOptions =
    objectTypeOptions && objectTypeOptions.length > 0
      ? objectTypeOptions
      : fallbackTypeOptions;

  const isPoleSelected =
    Boolean(taperPoleStandard?.poleType) && Boolean(taperPoleStandard?.height);

  return (
    <div className="rounded-b-2xl shadow-sm border border-gray-200 overflow-hidden bg-white hp:rounded-b-xl">
      {/* ── Section Header ── */}
      <div className="px-6 pt-6 pb-3 hp:px-4 hp:pt-4 hp:pb-2 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[#0d3b66] flex items-center gap-2 text-xs md:text-sm font-medium hp:text-xs hp:gap-1">
            <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
            <span className="font-semibold">Object Specifications</span>
            <span className="hp:hidden text-slate-500 font-normal">
              with detailed specifications
            </span>
          </h3>
        </div>
      </div>

      {/* ── Content ── */}
      {!isPoleSelected ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <p className="text-xs md:text-sm font-medium text-slate-500">
            No pole standard selected yet
          </p>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-md">
            Please select a pole standard type and height in the Pole
            Configuration section above to display object specifications.
          </p>
        </div>
      ) : directObjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <p className="text-xs md:text-sm font-medium text-slate-500">
            No objects for standard pole &ldquo;{taperPoleStandard.poleType}
            &rdquo;
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            The selected standard pole specification has no objects defined. You
            may configure Overhead Wires in the next section.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {directObjects.map((directObject, index) => {
            const doError = errors[directObject.idDo] || {};
            const defaultObj =
              defaultObjects.find((d) => d.idDo === directObject.idDo) ||
              defaultObjects[index];
            const isModified = isObjectModified(directObject, defaultObj);

            const poleTypeUpper = String(taperPoleStandard?.poleType || "")
              .trim()
              .toUpperCase();
            const isArmPoleType = ["LS", "LA", "TA", "TS"].some((t) =>
              poleTypeUpper.startsWith(t)
            );
            const isArmObject =
              isArmPoleType ||
              directObject.sourceType === "arm" ||
              directObject.armIndex !== undefined ||
              Boolean(
                directObject.sourceLabel &&
                  (directObject.sourceLabel.includes("アーム") ||
                    directObject.sourceLabel.toLowerCase().includes("arm"))
              );
            const distanceLabel = isArmObject ? "H-Distance" : "Height";

            return (
              <div
                key={directObject.idDo || index}
                className="p-6 hp:p-4 bg-white"
              >
                {/* Object Item Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 hp:pb-3 hp:mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#0d3b66] text-white font-semibold text-xs md:text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#0d3b66] hp:text-xs">
                        {directObject.sourceLabel || "Object"}
                        {directObject.name ? ` : ${directObject.name}` : ""}
                      </h4>
                      <p className="text-xs text-gray-500 hp:text-[11px]">
                        Standard pole specification (adjustable)
                      </p>
                    </div>
                  </div>

                  {!readOnly && onResetDefault && isModified && (
                    <button
                      type="button"
                      onClick={() => onResetDefault(directObject.idDo)}
                      title="Reset to default specification"
                      className="group inline-flex items-center gap-1.5 text-xs md:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 group-hover:rotate-[-45deg] transition-transform" />
                      <span>Reset to default spec</span>
                    </button>
                  )}
                </div>

                {/* FORM INPUT WRAPPER */}
                <div
                  className="
                    grid grid-cols-5 gap-x-3 gap-y-6
                    xl:flex xl:flex-row xl:flex-nowrap xl:items-start xl:gap-x-2 2xl:gap-x-3
                    hp:grid hp:grid-cols-2 hp:gap-3 hp:gap-y-6
                  "
                >
                  {/* Object Name */}
                  <div className="relative col-span-2 xl:flex-[2] min-w-0 hp:w-full hp:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                      Object Name <span className="text-red-500 ml-1 font-semibold">*</span>
                    </label>
                    <input
                      id={`do-${directObject.idDo}-name`}
                      type="text"
                      value={directObject.name ?? ""}
                      disabled={readOnly}
                      onChange={(e) =>
                        onUpdate(directObject.idDo, { name: e.target.value })
                      }
                      placeholder="e.g., 感知器"
                      className={`${inputStyle(doError.name, readOnly)} px-3 2xl:px-4`}
                    />
                    <ErrorStyle
                      show={Boolean(doError.name)}
                      text={doError.name}
                    />
                  </div>

                  {/* Type */}
                  <div className="relative xl:w-[130px] xl:flex-none min-w-0 hp:w-full">
                    <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                      Type <span className="text-red-500 ml-1 font-semibold">*</span>
                    </label>
                    <FormSelect
                      id={`do-${directObject.idDo}-type`}
                      value={directObject.type || "omni"}
                      onChange={(val) =>
                        onUpdate(directObject.idDo, { type: val })
                      }
                      options={availableTypeOptions}
                      loading={objectTypesLoading}
                      disabled={
                        readOnly ||
                        Boolean(
                          objectTypesError && objectTypeOptions.length === 0,
                        )
                      }
                      hasError={Boolean(doError.type)}
                      placeholder="Select Type"
                    />
                    <ErrorStyle
                      show={Boolean(doError.type)}
                      text={doError.type}
                    />
                  </div>

                  {/* Front Area */}
                  <div className="relative xl:flex-1 min-w-0 hp:w-full">
                    <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                      Front Area <span className="text-red-500 ml-1 font-semibold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id={`do-${directObject.idDo}-frontArea`}
                        type="number"
                        min={0}
                        step="any"
                        value={directObject.frontArea ?? ""}
                        disabled={readOnly}
                        onChange={(e) =>
                          onUpdate(directObject.idDo, {
                            frontArea: e.target.value,
                          })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={`${inputStyle(doError.frontArea, readOnly)} pl-3 2xl:pl-4 pr-7`}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                        m<sup>2</sup>
                      </span>
                    </div>
                    <ErrorStyle
                      show={Boolean(doError.frontArea)}
                      text={doError.frontArea}
                    />
                  </div>

                  {/* Side Area */}
                  {directObject.type === "directional" && (
                    <div className="relative xl:flex-1 min-w-0 hp:w-full">
                      <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                        Side Area <span className="text-red-500 ml-1 font-semibold">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id={`do-${directObject.idDo}-sideArea`}
                          type="number"
                          min={0}
                          step="any"
                          value={directObject.sideArea ?? "0.1"}
                          disabled={readOnly}
                          onChange={(e) =>
                            onUpdate(directObject.idDo, {
                              sideArea: e.target.value,
                            })
                          }
                          onWheel={(e) => e.target.blur()}
                          className={`${inputStyle(doError.sideArea, readOnly)} pl-3 2xl:pl-4 pr-7`}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                          m<sup>2</sup>
                        </span>
                      </div>
                      <ErrorStyle
                        show={Boolean(doError.sideArea)}
                        text={doError.sideArea}
                      />
                    </div>
                  )}

                  {/* Weight */}
                  <div className="relative xl:flex-1 min-w-0 hp:w-full">
                    <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                      Weight <span className="text-red-500 ml-1 font-semibold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id={`do-${directObject.idDo}-weight`}
                        type="number"
                        min={0}
                        step="any"
                        value={directObject.weight ?? ""}
                        disabled={readOnly}
                        onChange={(e) =>
                          onUpdate(directObject.idDo, {
                            weight: e.target.value,
                          })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={`${inputStyle(doError.weight, readOnly)} pl-3 2xl:pl-4 pr-6`}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                        kg
                      </span>
                    </div>
                    <ErrorStyle
                      show={Boolean(doError.weight)}
                      text={doError.weight}
                    />
                  </div>

                  {/* Height or H-Distance */}
                  <div className="relative xl:flex-1 min-w-0 hp:w-full">
                    <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                      {distanceLabel} <span className="text-red-500 ml-1 font-semibold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id={`do-${directObject.idDo}-zHeight`}
                        type="number"
                        min={0}
                        step="any"
                        value={directObject.zHeight ?? ""}
                        disabled={readOnly}
                        onChange={(e) =>
                          onUpdate(directObject.idDo, {
                            zHeight: e.target.value,
                          })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={`${inputStyle(doError.zHeight, readOnly)} pl-3 2xl:pl-4 pr-8`}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                        mm
                      </span>
                    </div>
                    <ErrorStyle
                      show={Boolean(doError.zHeight)}
                      text={doError.zHeight}
                    />
                  </div>

                  {/* nnC */}
                  <div className="relative xl:flex-[0.8] min-w-0 hp:w-full">
                    <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                      nnC <span className="text-red-500 ml-1 font-semibold">*</span>
                    </label>
                    <input
                      id={`do-${directObject.idDo}-nnC`}
                      type="number"
                      min={0}
                      step="any"
                      value={directObject.nnC ?? ""}
                      disabled={readOnly}
                      onChange={(e) =>
                        onUpdate(directObject.idDo, { nnC: e.target.value })
                      }
                      onWheel={(e) => e.target.blur()}
                      className={`${inputStyle(doError.nnC, readOnly)} px-3 2xl:px-4`}
                    />
                    <ErrorStyle
                      show={Boolean(doError.nnC)}
                      text={doError.nnC}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="relative xl:flex-[0.8] min-w-0 hp:w-full">
                    <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                      Quantity <span className="text-red-500 ml-1 font-semibold">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id={`do-${directObject.idDo}-quantity`}
                        type="number"
                        min={1}
                        step={1}
                        value={directObject.quantity ?? 1}
                        disabled={readOnly}
                        onChange={(e) =>
                          onUpdate(directObject.idDo, {
                            quantity: e.target.value,
                          })
                        }
                        onWheel={(e) => e.target.blur()}
                        className={`${inputStyle(doError.quantity, readOnly)} pl-3 2xl:pl-4 pr-8`}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                        pcs
                      </span>
                    </div>
                    <ErrorStyle
                      show={Boolean(doError.quantity)}
                      text={doError.quantity}
                    />
                  </div>

                  {/* Fix Angle */}
                  {directObject.type === "directional" && (
                    <div className="relative xl:flex-1 min-w-0 hp:w-full">
                      <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
                        Fix Angle <span className="text-red-500 ml-1 font-semibold">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id={`do-${directObject.idDo}-fixAngle`}
                          type="number"
                          step="any"
                          value={directObject.fixAngle ?? "0"}
                          disabled={readOnly}
                          onChange={(e) =>
                            onUpdate(directObject.idDo, {
                              fixAngle: e.target.value,
                            })
                          }
                          onWheel={(e) => e.target.blur()}
                          className={`${inputStyle(doError.fixAngle, readOnly)} pl-3 2xl:pl-4 pr-8`}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
                          deg
                        </span>
                      </div>
                      <ErrorStyle
                        show={Boolean(doError.fixAngle)}
                        text={doError.fixAngle}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

StandardDirectObjectForm.propTypes = {
  directObjects: PropTypes.arrayOf(PropTypes.object),
  defaultObjects: PropTypes.arrayOf(PropTypes.object),
  onUpdate: PropTypes.func.isRequired,
  errors: PropTypes.object,
  taperPoleStandard: PropTypes.object,
  readOnly: PropTypes.bool,
  onResetDefault: PropTypes.func,
};
