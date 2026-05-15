import { FileSpreadsheet } from "lucide-react";

export function ArmObjectResultTable({ arm, armIndex }) {
  return (
    <div
      key={armIndex}
      className="mx-6 my-6 mb-16 space-y-6 hp:mx-2 hp:mt-4 hp:mb-8"
    >
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-5 py-4 shadow-sm hp:px-4 hp:py-3">
        <div className="flex items-center gap-3 hp:gap-2">
          <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg hp:p-1.5">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm leading-tight hp:text-xs">
              Arm Object Calculation : {arm.armNum}
            </h3>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-50 text-[#0d3b66] text-xs hp:text-[10px]">
              <th className="px-3 py-2 border border-gray-300 text-center font-semibold hp:font-medium">
                AO
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
                <div className="font-semibold hp:font-medium">FL</div>
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
                <div className="font-semibold hp:font-medium">H-distance</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Fix Angle</div>
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
                <div className="font-semibold hp:font-medium">
                  Wind Load Area Side
                </div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (N)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Seismic Load</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (N)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">M-Fix</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (N･mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">M-Wind</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (N･mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">M-Seis</div>
                <div className="text-[13px] pt-[4px] text-gray-500 hp:text-[10px]">
                  (N･mm)
                </div>
              </th>

              <th className="px-3 py-2 border border-gray-300 text-center leading-tight">
                <div className="font-semibold hp:font-medium">Quantity</div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="hover:bg-[#3399cc]/10 transition-colors text-xs hp:text-[10px]">
              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                AO0
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.name}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.massa.toFixed(1)}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.fixLoad}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.frontArea}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.sideArea}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.nnC}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.zHeight}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.hDistance}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.fixAngle}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.windLoadAreaFront}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.windLoadAreaSide}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.seismicLoad}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.momentFix}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.momentWind}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.momentSeismic}
              </td>

              <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                {arm.quantity}
              </td>
            </tr>

            {arm.armObjects?.map((r, i) => (
              <tr
                key={i}
                className="hover:bg-[#3399cc]/10 transition-colors text-xs hp:text-[10px]"
              >
                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  AO {i + 1}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.name}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.weight.toFixed(1)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.fixLoad.toFixed(1)}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.frontArea}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.sideArea}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.cf}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.zHeight}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.hDistance}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.fixAngle}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.windLoadAreaFront}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.windLoadAreaSide}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.seismicLoad}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.momentFix}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.momentWind}
                </td>

                <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                  {r.momentSeismic}
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
