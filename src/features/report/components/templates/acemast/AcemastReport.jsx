import React from "react";
import AcemastReportContent from "./AcemastReportContent";
import "../../../styles/report.css";

export default function AcemastReport({
  cover,
  condition,
  poleConfig,
  results,
  resultsDo,
  resultsOhw,
}) {
  return (
    <>
      {/* Render actual A4 pages using paginated data */}
      <AcemastReportContent
        cover={cover}
        condition={condition}
        results={results}
        resultsOhw={resultsOhw}
        resultsDo={resultsDo}
        poleConfig={poleConfig}
      />
    </>
  );
}
