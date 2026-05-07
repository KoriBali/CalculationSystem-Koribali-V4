import { FileSpreadsheet } from "lucide-react";

export function DirectObjectResultTable({ resultsDo }) {
  return (
    <div className="mx-6 my-6 mb-16 space-y-6 hp:mx-2 hp:mt-4 hp:mb-8">
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-5 py-4 shadow-sm hp:px-4 hp:py-3">
        <div className="flex items-center gap-3 hp:gap-2">
          <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg hp:p-1.5">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm leading-tight hp:text-xs">
              Direct Object Calculation
            </h3>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-50 text-[#0d3b66] text-xs hp:text-[10px]">
              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                DO
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                Description
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Massa</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (kg)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Fixed Load</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (N)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Front Area</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (m<sup>2</sup>)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Side Area</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (m<sup>2</sup>)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Cf</div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Height (Z)</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">
                  Wind Load Area Front
                </div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (N)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold  hp:font-medium">
                  Wind Load Area Side
                </div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (N)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold  hp:font-medium">
                  Seismic Load
                </div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (N)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold  hp:font-medium">Quantity</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {resultsDo.map((r, i) => (
              <tr
                key={i}
                className="hover:bg-[#3399cc]/10 transition-colors text-xs hp:text-[10px]"
              >
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.doNum}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.name}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.weight.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.fixLoad.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.frontArea.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.sideArea.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.cf.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.zHeight.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.windLoadAreaFront.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.windLoadAreaSide.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.seismicLoad.toFixed(2)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
