import { FileSpreadsheet, CheckCircle2 } from "lucide-react";

// Component to display baseplate calculation results in a table format
export function BaseplateResultTable({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-12">
      {/* Top header section with title */}
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-4 md:px-6 py-3 md:py-5">
        <div className="flex items-center justify-between gap-3">
          {/* Left side: icon + title */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-white/10 backdrop-blur-sm p-1.5 md:p-2 rounded-lg">
              <CheckCircle2 className="w-5 md:w-6 h-5 md:h-6 text-white" />
            </div>

            <div>
              <h2 className="text-white mb-0.5 text-xs md:text-sm font-semibold">
                Calculation Results
              </h2>

              {/* Hidden on small screens */}
              <p className="text-white/70 text-xs font-medium hidden md:block">
                Comprehensive structural analysis output
              </p>
            </div>
          </div>

          {/* Right side (reserved for future actions) */}
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="mx-2 md:mx-6 mb-6 mt-4 md:mt-6 space-y-6">
        {/* Section header for table */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-4 md:px-5 py-3 md:py-4 shadow-sm">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-white/15 backdrop-blur-sm p-1.5 md:p-2 rounded-lg">
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>

            <div>
              <h3 className="text-white font-semibold text-xs md:text-sm leading-tight">
                Baseplate Evaluation
              </h3>
            </div>
          </div>
        </div>

        {/* Table container with horizontal scroll */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            {/* Table header */}
            <thead>
              <tr className="bg-blue-50 text-[#0d3b66] text-[10px] md:text-sm">
                <th className="px-3 py-3 border border-gray-300 text-center font-medium md:font-semibold">
                  No
                </th>
                <th className="px-3 py-3 border border-gray-300 text-center font-medium md:font-semibold">
                  Description
                </th>
                <th className="px-3 py-3 border border-gray-300 text-center font-medium md:font-semibold">
                  Safety Factor
                </th>
                <th className="px-3 py-3 border border-gray-300 text-center font-medium md:font-semibold">
                  Result
                </th>
              </tr>
            </thead>

            {/* Table body */}
            <tbody>
              <tr className="bg-blue-50 text-[#0d3b66] text-[10px] md:text-sm">
                {/* Row number */}
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 text-gray-700 text-center">
                  1
                </td>

                {/* Baseplate type description */}
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 text-gray-700 text-center">
                  Anchor Bolt
                </td>

                {/* Safety factor value */}
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 text-gray-700 text-center">
                  {data?.safetyFactor}
                </td>

                {/* Evaluation result based on safety limit */}
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 text-gray-700 text-center">
                  {data?.safetyFactor < data?.limit
                    ? "< 1.0・・・O.K"
                    : "> 1.0・・・N.G"}
                </td>
              </tr>
              <tr className="bg-blue-50 text-[#0d3b66] text-[10px] md:text-sm">
                {/* Row number */}
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 text-gray-700 text-center">
                  2
                </td>

                {/* Baseplate type description */}
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 text-gray-700 text-center">
                  {data?.type === "4rib" && "4 Rib Type Baseplate"}
                  {data?.type === "8rib" && "8 Rib Type Baseplate"}
                </td>

                {/* Safety factor value */}
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 text-gray-700 text-center">
                  {data?.safetyFactor}
                </td>

                {/* Evaluation result based on safety limit */}
                <td className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 text-gray-700 text-center">
                  {data?.safetyFactor < data?.limit
                    ? "< 1.0・・・O.K"
                    : "> 1.0・・・N.G"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
