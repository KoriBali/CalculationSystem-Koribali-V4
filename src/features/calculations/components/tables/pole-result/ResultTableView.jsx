import React, { useState } from "react";
import PropTypes from "prop-types";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";

import { PoleResultTable } from "./PoleResultTable";
import { DirectObjectResultTable } from "./DirectObjectResultTable";
import { OverheadWireResultTable } from "./OverheadWireResultTable";
import { ArmResultTable } from "./ArmResultTable";
import { ArmObjectResultTable } from "./ArmObjectResultTable";
import { SummaryResultTable } from "./SummaryResultTable";

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export function ResultsTableView({
  results,
  resultsDo,
  resultsOhw,
  resultsArm,
}) {
  // Page index for each section — reserved for future pagination
  const [page] = useState(0);
  const [pageDo] = useState(0);
  const [pageOhw] = useState(0);
  const [pageArm] = useState(0);

  // Current item for each section — used as existence guard before rendering tables
  const currentPole = results[page];
  const currentDo = resultsDo[pageDo];
  const currentOhw = resultsOhw[pageOhw];
  const currentArm = resultsArm[pageArm];

  const hasResults = results.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-12">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[#0d3b66] to-[#0d3b66] px-6 py-5 hp:px-4 hp:py-3">
        <div className="flex items-center gap-3 hp:gap-2">
          <div className="bg-white/10 backdrop-blur-sm p-2 hp:p-1.5 rounded-lg">
            <CheckCircle2 className="w-6 h-6 hp:w-5 hp:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white text-sm hp:text-xs font-semibold mb-0.5">
              Calculation Results
            </h2>
            <p className="text-white/70 text-xs font-medium hp:hidden">
              Comprehensive structural analysis output
            </p>
          </div>
        </div>
      </div>

      {/* ── Pole Result Table ── */}
      {currentPole && <PoleResultTable results={results} />}

      {/* ── Direct Object Result Table ── */}
      {currentDo && <DirectObjectResultTable resultsDo={resultsDo} />}

      {/* ── Overhead Wire Result Table ── */}
      {currentOhw && <OverheadWireResultTable resultsOhw={resultsOhw} />}

      {/* ── Arm Result Table ── */}
      {currentArm && <ArmResultTable resultsArm={resultsArm} />}

      {/* ── Arm Object Result Tables — one per arm ── */}
      {resultsArm?.map((arm, armIndex) => (
        <ArmObjectResultTable
          key={arm.armNum ?? armIndex}
          arm={arm}
          armIndex={armIndex}
        />
      ))}

      {/* ── Divider ── */}
      {hasResults && <div className="border-t border-gray-200 my-8" />}

      {/* ── Summary Table ── */}
      {hasResults && <SummaryResultTable results={results} />}

      {/* ── Empty State ── */}
      {!hasResults && (
        <div className="p-16 text-center">
          <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">
            No calculation results yet. Please input pole data and click
            Calculate.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── PROP TYPES ──────────────────────────────────────────────────────────────
// Dokumentasi tipe data dan satuan variabel teknik yang diperlukan
// untuk merender tabel hasil analisis struktur.

ResultsTable.propTypes = {
  // ── Pole (Step Pole) ──
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      upperDiameter: PropTypes.number,
      lowerDiameter: PropTypes.number,
      upperThickness: PropTypes.number,
      lowerThickness: PropTypes.number,
      length: PropTypes.number,
      zHeight: PropTypes.number,
      centerPoint: PropTypes.number,
      fb: PropTypes.number,
      stb: PropTypes.number,
      sts: PropTypes.number,
      stc: PropTypes.number,
      sectionArea: PropTypes.number,
      sectionModulus: PropTypes.number,
      momentInertia: PropTypes.number,
      radiusGyration: PropTypes.number,
      taperRatio: PropTypes.number,
      material: PropTypes.string,
      ip: PropTypes.number,
      heightSection: PropTypes.number,
      typeofTaper: PropTypes.string,
    }),
  ).isRequired,

  // ── Direct Object ──
  resultsDo: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      frontArea: PropTypes.number,
      sideArea: PropTypes.number,
      weight: PropTypes.number,
      zHeight: PropTypes.number,
      nnC: PropTypes.number,
      quantity: PropTypes.number,
      fixAngle: PropTypes.number,
      fixLoad: PropTypes.number,
      cf: PropTypes.number,
      windLoadAreaFront: PropTypes.number,
      windLoadAreaSide: PropTypes.number,
      seismicLoad: PropTypes.number,
    }),
  ).isRequired,

  // ── Overhead Wire ──
  resultsOhw: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      weight: PropTypes.number,
      diameter: PropTypes.number,
      zHeight: PropTypes.number,
      span: PropTypes.number,
      saggingRatio: PropTypes.number,
      nnC: PropTypes.number,
      fixAngle: PropTypes.number,
      verticalAngle: PropTypes.number,
      fixLoadKg: PropTypes.number,
      fixLoadN: PropTypes.number,
      Area: PropTypes.number,
      cf: PropTypes.number,
      windLoad: PropTypes.number,
      seismicLoad: PropTypes.number,
      pwFix: PropTypes.number,
      pwStraight: PropTypes.number,
      pwOblique: PropTypes.number,
      tensionFix: PropTypes.number,
      tensionStraight: PropTypes.number,
      tensionOblique: PropTypes.number,
      cosVerticalAngle: PropTypes.number,
    }),
  ).isRequired,

  // ── Arm ──
  resultsArm: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      material: PropTypes.string,
      diameter: PropTypes.number,
      thickness: PropTypes.number,
      length: PropTypes.number,
      expLength: PropTypes.number,
      zHeight: PropTypes.number,
      hDistance: PropTypes.number,
      fixAngle: PropTypes.number,
      nnC: PropTypes.number,
      quantity: PropTypes.number,
      fb: PropTypes.number,
      sfb: PropTypes.number,
      sfs: PropTypes.number,
      sfc: PropTypes.number,
      sectionArea: PropTypes.number,
      sectionModulus: PropTypes.number,
      momentInertia: PropTypes.number,
      ip: PropTypes.number,
      radiusGyration: PropTypes.number,
      massaM: PropTypes.number,
      massa: PropTypes.number,
      fixLoadM: PropTypes.number,
      fixLoad: PropTypes.number,
      frontArea: PropTypes.number,
      sideArea: PropTypes.number,
      frontAreaMM: PropTypes.number,
      sideAreaMM: PropTypes.number,
      windLoadAreaFront: PropTypes.number,
      seismicLoad: PropTypes.number,
      windLoadAreaSide: PropTypes.number,
      momentFix: PropTypes.number,
      momentWind: PropTypes.number,
      momentSeismic: PropTypes.number,

      // ── Arm Object (nested) ──
      armObjects: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          type: PropTypes.string,
          frontArea: PropTypes.number,
          sideArea: PropTypes.number,
          weight: PropTypes.number,
          hDistance: PropTypes.number,
          zHeight: PropTypes.number,
          fixAngle: PropTypes.number,
          nnC: PropTypes.number,
          quantity: PropTypes.number,
          fixLoad: PropTypes.number,
          cf: PropTypes.number,
          windLoadAreaFront: PropTypes.number,
          windLoadAreaSide: PropTypes.number,
          seismicLoad: PropTypes.number,
          momentFix: PropTypes.number,
          momentWind: PropTypes.number,
          momentSeismic: PropTypes.number,
        }),
      ),
    }),
  ),
};
