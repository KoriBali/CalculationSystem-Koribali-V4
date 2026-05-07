import React, { useRef, useMemo, useState, useLayoutEffect } from "react";
import { createBlocks } from "./SignboardBlock";
import { paginateA4Signboard } from "../../../hooks/useReportPagination";
import SignboardReportContent from "./SignboardReportContent";
import "../../../styles/report.css";

export default function SignboardReport({
  cover,
  condition,
  structuralDesign,
  results,
  resultsDo,
  resultsOhw,
}) {
  // 1. blocks memo
  const blocks = useMemo(
    () => createBlocks(results, resultsDo, structuralDesign),
    [results, resultsDo, structuralDesign],
  );

  // 2. ref untuk measurement
  const measureRef = useRef(null);

  // 3. pages = null dulu (belum render final)
  const [pages, setPages] = useState(null);

  // 4. HITUNG PAGINATION SEKALI, SEBELUM PAINT
  useLayoutEffect(() => {
    if (!measureRef.current) return;

    // Tunggu font siap agar pengukuran offsetHeight akurat
    document.fonts.ready.then(() => {
      const paginatedPages = paginateA4Signboard({
        blocks,
        measureRef,
      });
      setPages(paginatedPages);
    });
  }, [blocks]);

  // 5. Fase 1 - measurement only
  if (!pages) {
    return (
      <div ref={measureRef} className="measure-container-sb">
        {blocks.map((b) => (
          <div key={b.id} data-id={b.id} className="measure-block">
            {b.node}
          </div>
        ))}
      </div>
    );
  }

  // 6. Fase 2 - final render
  return (
    <SignboardReportContent
      cover={cover}
      condition={condition}
      results={results}
      pages={pages}
    />
  );
}
