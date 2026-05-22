import { FileSpreadsheet } from "lucide-react";
import { getRows } from "../../../utils/formatResultTableRows";

export function SummaryResultTable({ resultPole }) {
  return (
    <div className="mx-6 my-6 space-y-16 hp:mx-2 hp:mt-4 hp:mb-8">
      {resultPole.map((_, poleIndex) => {
        const rows = getRows(poleIndex, resultPole);
        return (
          <div key={poleIndex}>
            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-5 py-4 shadow-sm hp:px-4 hp:py-3">
              <div className="flex items-center gap-3 hp:gap-2">
                <div className="bg-white/15 backdrop-blur-sm p-2 rounded-lg hp:p-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight hp:text-xs">
                    Pole {poleIndex + 1} Evaluation
                  </h3>
                </div>
              </div>
            </div>

            <div className="flex items-center mt-6 mb-4">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <h4 className="mx-4 px-3 py-1.5 text-xs font-semibold text-[#0d3b66] bg-[#0d3b66]/10 rounded-md whitespace-nowrap">
                Direct Wind Condition A
              </h4>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50 text-[#0d3b66] text-sm hp:text-[10px]">
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      No
                    </th>
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      Description
                    </th>
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      Safety Factor
                    </th>
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      Result
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-[#3399cc]/10 transition-colors text-sm hp:text-[10px]"
                    >
                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        {i + 1}
                      </td>

                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        {row.description}
                      </td>

                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        0.9
                      </td>

                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        &lt; 1.0・・・O.K
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center mt-6 mb-4">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <h4 className="mx-4 px-3 py-1.5 text-xs font-semibold text-[#0d3b66] bg-[#0d3b66]/10 rounded-md whitespace-nowrap">
                Direct Wind Condition B
              </h4>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50 text-[#0d3b66] text-sm hp:text-[10px]">
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      No
                    </th>
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      Description
                    </th>
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      Safety Factor
                    </th>
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      Result
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-[#3399cc]/10 transition-colors text-sm hp:text-[10px]"
                    >
                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        {i + 1}
                      </td>

                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        {row.description}
                      </td>

                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        0.9
                      </td>

                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        &lt; 1.0・・・O.K
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center mt-6 mb-4">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <h4 className="mx-4 px-3 py-1.5 text-xs font-semibold text-[#0d3b66] bg-[#0d3b66]/10 rounded-md whitespace-nowrap">
                Oblique Wind Condition
              </h4>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50 text-[#0d3b66] text-sm hp:text-[10px]">
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      No
                    </th>
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      Description
                    </th>
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      Safety Factor
                    </th>
                    <th className="px-3 py-3 border border-gray-300 text-center font-semibold hp:font-medium">
                      Result
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-[#3399cc]/10 transition-colors text-sm hp:text-[10px]"
                    >
                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        {i + 1}
                      </td>

                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        {row.description}
                      </td>

                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        0.9
                      </td>

                      <td className="px-4 py-3 border border-gray-300 text-gray-700 text-center hp:px-3 hp:py-2">
                        &lt; 1.0・・・O.K
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
