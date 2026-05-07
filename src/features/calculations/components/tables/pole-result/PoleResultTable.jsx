import { FileSpreadsheet } from "lucide-react";

export function PoleResultTable({ resultPole }) {
  return (
    <div className="mx-6 my-6 mb-16 space-y-6 hp:mx-2 hp:mt-4 hp:mb-8 ">
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-5 py-4 shadow-sm hp:px-4 hp:py-3">
        <div className="flex items-center gap-3 hp:gap-2">
          <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg hp:p-1.5">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm leading-tight hp:text-xs">
              Pole Specifications
            </h3>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-50 text-[#0d3b66] text-xs hp:text-[10px]">
              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                POLE
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                Description
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                Pole Type
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Dia Upper</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Dia Lower</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Thick Upper</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Thick Lower</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Length</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Height (z)</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold whitespace-nowrap hp:font-medium">
                  Center Point
                </div>
                <div className="text-[13px] pt-[4px] text-gray-500 whitespace-nowrap hp:text-[10px]">
                  CP (mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                Material
              </th>
            </tr>
          </thead>

          <tbody>
            {resultPole.map((r, i) => (
              <tr
                key={i}
                className="hover:bg-[#3399cc]/10 transition-colors text-xs hp:text-[10px]"
              >
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.pole}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.description}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.type}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.type === "Straight" ? r.lowerDiameter : r.upperDiameter}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.lowerDiameter}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.type === "Straight" ? r.lowerThickness : r.upperThickness}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.lowerThickness}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.length}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.height}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.centerPoint}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.material}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-50 text-[#0d3b66] text-xs hp:text-[10px]">
              <th
                className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium"
                colSpan={4}
              >
                Allowable (Stress)
              </th>

              <th
                className="px-3 py-2 border border-gray-300 text-center leading-tight"
                rowSpan={2}
              >
                <div className="font-semibold hp:font-medium">Section Area</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (cm<sup>2</sup>)
                </div>
              </th>

              <th
                className="px-3 py-2 border border-gray-300 text-center leading-tight"
                rowSpan={2}
              >
                <div className="font-semibold hp:font-medium">
                  Section Modulus
                </div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (cm<sup>3</sup>)
                </div>
              </th>

              <th
                className="px-3 py-2 border border-gray-300 text-center leading-tight"
                rowSpan={2}
              >
                <div className="font-semibold hp:font-medium">
                  Moment Inertia
                </div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (cm<sup>4</sup>)
                </div>
              </th>

              <th
                className="px-3 py-2 border border-gray-300 text-center leading-tight"
                rowSpan={2}
              >
                <div className="font-semibold hp:font-medium">Ip</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (cm<sup>4</sup>)
                </div>
              </th>

              <th
                className="px-3 py-2 border border-gray-300 text-center leading-tight"
                rowSpan={2}
              >
                <div className="font-semibold hp:font-medium">
                  Radius Gyration
                </div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (cm)
                </div>
              </th>

              <th
                className="px-3 py-2 border border-gray-300 text-center leading-tight"
                rowSpan={2}
              >
                <div className="font-semibold hp:font-medium">Taper Ratio</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (mm)
                </div>
              </th>

              <th
                className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium"
                rowSpan={2}
              >
                Type of taper
              </th>

              <th
                className="px-3 py-2 border border-gray-300 text-center leading-tight"
                rowSpan={2}
              >
                <div className="font-semibold whitespace-nowrap hp:font-medium">
                  HeightSection
                </div>
                <div className="text-[13px] pt-[4px] text-gray-500 whitespace-nowrap hp:text-[10px]">
                  (mm)
                </div>
              </th>
            </tr>

            <tr className="bg-blue-50 text-[#0d3b66] text-xs hp:text-[10px]">
              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                fb
              </th>
              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                stb
              </th>
              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                sts
              </th>
              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                stc
              </th>
            </tr>
          </thead>

          <tbody>
            {resultPole.map((r, i) => (
              <tr
                key={i}
                className="hover:bg-[#3399cc]/10 transition-colors text-xs hp:text-[10px]"
              >
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.fb}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.stb}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.sts}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.stc}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.sectionArea.toFixed(2)}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.sectionModulus.toFixed(2)}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.momentInertia.toFixed(2)}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.ip}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.radiusGyration.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.type === "Straight" ? "" : r.taperRatio}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center text-[12px] hp:px-3 hp:py-2 hp:text-[10px]">
                  {r.type === "Straight" ? "" : r.typeofTaper}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.heightSection}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
