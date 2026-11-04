import React from "react";
import { getRowsForStep } from "../../../utils/reportFormatters";

/**
 * Terima nilai apa adanya dari backend tanpa pembulatan.
 */
const formatRawVal = (val, fallback = "") => {
  if (val === undefined || val === null || val === "") return fallback;
  return String(val);
};

/**
 * Format 1 angka di belakang desimal (misal: 1521.0, 137.3, 221.4)
 */
const toFixed1 = (val, fallback = "") => {
  if (val === undefined || val === null || val === "") return fallback;
  const n = Number(val);
  return Number.isNaN(n) ? String(val) : n.toFixed(1);
};

/**
 * Format 3 angka di belakang desimal khusus untuk 受風面積 (misal: 1.62 -> 1.620, 0.1 -> 0.100)
 */
const toFixed3 = (val, fallback = "") => {
  if (val === undefined || val === null || val === "") return fallback;
  const n = Number(val);
  return Number.isNaN(n) ? String(val) : n.toFixed(3);
};

export const createBlocks = (
  results = [],
  resultsDo = [],
  poleConfig = {},
  officialReport = null,
) => {
  const blocks = [];
  let sectionCounter = 0;

  // ── 1. JIKA TERSEDIA OFFICIAL REPORT DARI BACKEND (/runs/{runId}/report) ──
  const sections = officialReport?.sections;
  const foundation = officialReport?.foundation;

  if (sections && Array.isArray(sections) && sections.length > 0) {
    sections.forEach((s, index) => {
      const suffix = index + 1;
      const rows = s.rows || [];

      // c1 = (Consideration of pillars) & 荷重計算 (Load calculation)
      blocks.push({
        id: `c1-${suffix}`,
        node: (
          <section className="pt-[20px]">
            <h2 className="page1-title">
              <span className="page1-number">{3 + sectionCounter++}.</span>
              <span className="page1-text tracking-[0.1em] jp">
                {s.poleName || `Pole-${suffix}`}:
              </span>
              <span className="page1-text ml-[18px] jp">φ</span>
              <span className="page1-text">
                {formatRawVal(s.diameterMm)}
              </span>
              <span className="page1-text px-[2px] text-[10.5pt]">×</span>
              <span className="page1-text">
                t{formatRawVal(s.thicknessMm)}
              </span>
              <span className="page1-text ml-[20px]">{s.materialName || ""}</span>
              <span className="page1-text ml-[20px]">
                Z = {formatRawVal(s.sectionModulusCm3)} cm<sup>3</sup>
              </span>
            </h2>

            <div className="flex flex-col">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">1).</span>
                <span className="page1-text tracking-[0.1em] jp">荷重計算</span>
              </div>

              <div className="ml-[25px]">
                <table className="tables-pages">
                  <thead>
                    <tr className="tracking-[0.1em] jp">
                      <th className="col-num" rowSpan={2}></th>
                      <th rowSpan={2}>名 称</th>
                      <th className="col-left" colSpan={1}>
                        単位重量
                      </th>
                      <th className="col-left" rowSpan={2}>
                        個数
                      </th>
                      <th className="col-left" rowSpan={1}>
                        固定荷重
                      </th>
                      <th className="col-gap"></th>
                      <th className="col-right" colSpan={1}>
                        受風面積
                      </th>
                      <th className="col-right" colSpan={1}>
                        風力係数
                      </th>
                      <th className="col-right" colSpan={1}>
                        単位風荷重
                      </th>
                      <th className="col-right" colSpan={1}>
                        個数
                      </th>
                      <th className="col-right" colSpan={1}>
                        風荷重
                      </th>
                    </tr>

                    <tr>
                      <th className="col-left">W(N)</th>
                      <th className="col-left">(N)</th>
                      <th className="col-gap"></th>
                      <th className="col-right">
                        (m<sup>2</sup>)
                      </th>
                      <th className="col-right">C</th>
                      <th className="col-right">P(N)</th>
                      <th className="tracking-[0.1em] jp">(受風物)</th>
                      <th className="col-right">(N)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, i) => {
                      const unitWeightVal =
                        row.unitWeightN ??
                        (row.fixLoadN != null && row.quantity
                          ? Number(row.fixLoadN) / Number(row.quantity)
                          : "");

                      const areaVal =
                        row.projectedAreaM2 ??
                        row.projectedAreaPerUnitM2 ??
                        "";

                      const unitWindLoadVal =
                        row.windLoadPerUnitN ??
                        (row.windLoadN != null && row.quantity
                          ? Number(row.windLoadN) / Number(row.quantity)
                          : "");

                      return (
                        <tr key={i}>
                          <td className="col-num">{i + 1}</td>
                          <td className="col-1 tracking-[0.1em] jp">
                            {row.name ?? ""}
                          </td>
                          <td className="col-left">
                            {toFixed1(unitWeightVal)}
                          </td>
                          <td className="col-left">
                            {formatRawVal(row.quantity)}
                          </td>
                          <td className="col-left">
                            {toFixed1(row.fixLoadN)}
                          </td>
                          <td className="col-gap"></td>
                          <td className="col-right">
                            {toFixed3(areaVal)}
                          </td>
                          <td className="col-right">
                            {toFixed1(row.windCoefficient)}
                          </td>
                          <td className="col-right">
                            {toFixed1(unitWindLoadVal)}
                          </td>
                          <td className="col-right">
                            {formatRawVal(row.windQuantity ?? row.quantity)}
                          </td>
                          <td className="col-right">
                            {toFixed1(row.windLoadN)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td className="col-num"></td>
                      <td className="col-1-tf"></td>
                      <td colSpan={2} className="tfoot-title col-left">
                        <span className="tracking-[0.1em] jp">鉛直力 </span>N
                        {suffix}=
                      </td>
                      <td className="tfoot-value col-left">
                        {toFixed1(s.verticalLoadN)}
                      </td>
                      <td className="col-gap"></td>
                      <td colSpan={4} className="tfoot-title col-right">
                        <span className="tracking-[0.1em] jp">水平力 </span>
                        Pmax{suffix}=
                      </td>
                      <td colSpan={1} className="tfoot-value col-right">
                        {toFixed1(s.horizontalLoadN)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </section>
        ),
      });

      // c2 = 風時曲げモーメント (Bending Moment due to Wind)
      blocks.push({
        id: `c2-${suffix}`,
        node: (
          <section className="pt-[20px]">
            <div className="flex flex-col">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">2).</span>
                <span className="page1-text tracking-[0.1em] jp">
                  風時曲げモーメント
                </span>
              </div>
              <div className="flex justify-start ml-[44px]">
                <span className="mr-[8px]">Mp{suffix} =</span>
                <span>{toFixed1(s.bendingMomentNm)} N・m</span>
              </div>
            </div>
          </section>
        ),
      });

      // c3 = 曲げ応力度 (Bending Stress)
      const calcStress = toFixed1(s.calculatedStressNMm2);
      const allowStress =
        s.allowableStressNMm2 != null
          ? String(Math.round(Number(s.allowableStressNMm2)))
          : officialReport?.allowableStressNMm2 != null
            ? String(Math.round(Number(officialReport.allowableStressNMm2)))
            : "";
      const utilRatio = formatRawVal(s.utilizationRatio);
      const isOk =
        s.status === "ok" ||
        (s.utilizationRatio != null && Number(s.utilizationRatio) <= 1.0);

      blocks.push({
        id: `c3-${suffix}`,
        node: (
          <section className="pt-[20px]">
            <div className="flex flex-col">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">3).</span>
                <span className="page1-text tracking-[0.1em] jp">曲げ応力度</span>
              </div>

              <div className="flex justify-start ml-[44px]">
                <span className="mr-[8px] tracking-[0.1em]">cσb =</span>
                <span className="mr-[8px]">Mp{suffix}/Z =</span>
                <span>
                  {calcStress} N/mm<sup>2</sup>
                </span>
              </div>

              <div className="ml-[68px] leading-none inline-block">
                <div className="inline-block">
                  <div className="flex items-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <div className="border-b border-black pb-[3px] tracking-[0.1em] px-1.5">
                        cσb
                      </div>
                      <div className="mt-[3px] tracking-[0.05em]">sfb</div>
                    </div>
                    <div className="mx-2">=</div>
                    <div className="flex flex-col items-center">
                      <div className="border-b border-black pb-[3px] px-1.5">
                        {calcStress}
                      </div>
                      <div className="mt-[3px]">{allowStress}</div>
                    </div>
                    <div className="mx-2">=</div>
                    <div className="flex items-center">
                      <span>{utilRatio}</span>
                      <span className="mx-3.5">&lt;</span>
                      <span className="pr-4">
                        {utilRatio ? `1.0・・・${isOk ? "O.K" : "N.G"}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-black mt-[3px] w-full"></div>
                </div>
              </div>
            </div>
          </section>
        ),
      });
    });

    // c4 = 基礎部に加わる応力 (Stress applied to the foundation)
    const fVert =
      foundation?.verticalLoadN ??
      sections[sections.length - 1]?.verticalLoadN;
    const fHoriz =
      foundation?.horizontalLoadN ??
      sections[sections.length - 1]?.horizontalLoadN;
    const fMoment =
      foundation?.bendingMomentNm ??
      sections[sections.length - 1]?.bendingMomentNm;

    blocks.push({
      id: "c4",
      node: (
        <section className="pt-[20px]">
          <h2 className="page1-title">
            <span className="page1-number">{3 + sectionCounter++}.</span>
            <span className="page1-text tracking-[0.1em] jp">
              基礎部に加わる応力
            </span>
          </h2>

          <div className="flex justify-start ml-[22px]">
            <div className="flex flex-col mb-0 mr-8">
              <div className="page1-text tracking-[0.1em] jp">・鉛直力</div>
              <div className="page1-text tracking-[0.1em] jp">・水平力</div>
              <div className="page1-text tracking-[0.1em] jp">
                ・曲げモーメント
              </div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">N</div>
              <div className="page1-text">P</div>
              <div className="page1-text">M</div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
            </div>
            <div className="flex flex-col mb-0">
              <div className="page1-text">{toFixed1(fVert)} N</div>
              <div className="page1-text">{toFixed1(fHoriz)} N</div>
              <div className="page1-text">{toFixed1(fMoment)} N・m</div>
            </div>
          </div>
        </section>
      ),
    });

    return blocks;
  }

  // ── 2. FALLBACK KALAU DATA RESMI BELUM TERSEDIA ──
  // Pure data input/kalkulasi tanpa nilai dummy palsu (tanpa 149.6, 185.9, 709.8, 1596.0, dll.)
  results?.forEach((r, index) => {
    const rows = getRowsForStep(index, results, resultsDo, poleConfig);
    const suffix = index + 1;

    // c1 = (Consideration of pillars) & 荷重計算 (Load calculation)
    blocks.push({
      id: `c1-${suffix}`,
      node: (
        <section className="pt-[20px]">
          <h2 className="page1-title">
            <span className="page1-number">{3 + sectionCounter++}.</span>
            <span className="page1-text tracking-[0.1em] jp">
              {r?.name ?? ""}:
            </span>
            <span className="page1-text ml-[18px] jp">φ</span>
            <span className="page1-text">
              {formatRawVal(r?.lowerDiameter)}
            </span>
            <span className="page1-text px-[2px] text-[10.5pt]">×</span>
            <span className="page1-text">
              t{formatRawVal(r?.lowerThickness)}
            </span>
            <span className="page1-text ml-[20px]">{r?.material ?? ""}</span>
            <span className="page1-text ml-[20px]">
              Z = {formatRawVal(r?.sectionModulus)} cm<sup>3</sup>
            </span>
          </h2>

          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">1).</span>
              <span className="page1-text tracking-[0.1em] jp">荷重計算</span>
            </div>

            <div className="ml-[25px]">
              <table className="tables-pages">
                <thead>
                  <tr className="tracking-[0.1em] jp">
                    <th className="col-num" rowSpan={2}></th>
                    <th rowSpan={2}>名 称</th>
                    <th className="col-left" colSpan={1}>
                      単位重量
                    </th>
                    <th className="col-left" rowSpan={2}>
                      個数
                    </th>
                    <th className="col-left" rowSpan={1}>
                      固定荷重
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right" colSpan={1}>
                      受風面積
                    </th>
                    <th className="col-right" colSpan={1}>
                      風力係数
                    </th>
                    <th className="col-right" colSpan={1}>
                      単位風荷重
                    </th>
                    <th className="col-right" colSpan={1}>
                      個数
                    </th>
                    <th className="col-right" colSpan={1}>
                      風荷重
                    </th>
                  </tr>

                  <tr>
                    <th className="col-left">W(N)</th>
                    <th className="col-left">(N)</th>
                    <th className="col-gap"></th>
                    <th className="col-right">
                      (m<sup>2</sup>)
                    </th>
                    <th className="col-right">C</th>
                    <th className="col-right">P(N)</th>
                    <th className="tracking-[0.1em] jp">(受風物)</th>
                    <th className="col-right">(N)</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="col-num">{i + 1}</td>

                      {row.type === "do" && (
                        <>
                          <td className="col-1 tracking-[0.1em] jp">
                            {row.data.name ?? ""}
                          </td>
                          <td className="col-left">
                            {formatRawVal(row.data.unitWeight ?? row.data.fixLoad)}
                          </td>
                          <td className="col-left">
                            {formatRawVal(row.data.quantity)}
                          </td>
                          <td className="col-left">
                            {formatRawVal(row.data.fixLoad)}
                          </td>
                          <td className="col-gap"></td>
                          <td className="col-right">
                            {formatRawVal(row.data.frontArea)}
                          </td>
                          <td className="col-right">
                            {formatRawVal(row.data.cf)}
                          </td>
                          <td className="col-right">
                            {formatRawVal(row.data.windLoadPerUnit ?? row.data.windLoadAreaFront)}
                          </td>
                          <td className="col-right">
                            {formatRawVal(row.data.quantity)}
                          </td>
                          <td className="col-right">
                            {formatRawVal(row.data.windLoad ?? row.data.windLoadAreaFront)}
                          </td>
                        </>
                      )}

                      {row.type === "pole" && (
                        <>
                          <td className="col-1 tracking-[0.1em] jp">
                            {row.data.name ?? ""}
                          </td>
                          <td className="col-left">
                            {formatRawVal(row.data.unitWeight ?? row.data.fixLoad)}
                          </td>
                          <td className="col-left">
                            {formatRawVal(row.data.quantity)}
                          </td>
                          <td className="col-left">
                            {formatRawVal(row.data.fixLoad)}
                          </td>
                          <td className="col-gap"></td>
                          <td className="col-right">
                            {formatRawVal(row.data.frontArea)}
                          </td>
                          <td className="col-right">
                            {formatRawVal(row.data.cf)}
                          </td>
                          <td className="col-right">
                            {formatRawVal(row.data.windLoadPerUnit ?? row.data.windLoad)}
                          </td>
                          <td className="col-right">
                            {formatRawVal(row.data.quantity)}
                          </td>
                          <td className="col-right">
                            {formatRawVal(row.data.windLoad)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr>
                    <td className="col-num"></td>
                    <td className="col-1-tf"></td>
                    <td colSpan={2} className="tfoot-title col-left">
                      <span className="tracking-[0.1em] jp">鉛直力 </span>N
                      {index + 1}=
                    </td>
                    <td className="tfoot-value col-left">
                      {formatRawVal(r?.verticalLoadN ?? r?.totalVerticalLoad)}
                    </td>
                    <td className="col-gap"></td>
                    <td colSpan={4} className="tfoot-title col-right">
                      <span className="tracking-[0.1em] jp">水平力 </span>
                      Pmax{index + 1}=
                    </td>
                    <td colSpan={1} className="tfoot-value col-right">
                      {formatRawVal(r?.horizontalLoadN ?? r?.totalHorizontalLoad)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      ),
    });

    // c2 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c2-${suffix}`,
      node: (
        <section className="pt-[20px]">
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">2).</span>
              <span className="page1-text tracking-[0.1em] jp">
                風時曲げモーメント
              </span>
            </div>

            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mp{index + 1} =</span>
              <span>{formatRawVal(r?.bendingMomentNm ?? r?.bendingMoment)} N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c3 = 曲げ応力度 (Bending Stress)
    const calcStress = formatRawVal(r?.calculatedStressNMm2 ?? r?.bendingStress);
    const allowStress = formatRawVal(r?.allowableStressNMm2 ?? r?.allowableStress);
    const utilRatio = formatRawVal(r?.utilizationRatio ?? r?.safetyRatio);
    const isOk =
      r?.status === "ok" ||
      (r?.utilizationRatio != null && Number(r.utilizationRatio) <= 1.0) ||
      (r?.safetyRatio != null && Number(r.safetyRatio) <= 1.0);

    blocks.push({
      id: `c3-${suffix}`,
      node: (
        <section className="pt-[20px]">
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">3).</span>
              <span className="page1-text tracking-[0.1em] jp">曲げ応力度</span>
            </div>

            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px] tracking-[0.1em]">cσb =</span>
              <span className="mr-[8px]">Mp{index + 1}/Z =</span>
              <span>
                {calcStress} N/mm<sup>2</sup>
              </span>
            </div>

            <div className="ml-[68px] leading-none inline-block">
              <div className="inline-block">
                <div className="flex items-center whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.1em] px-1.5">
                      cσb
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">sfb</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] px-1.5">
                      {calcStress}
                    </div>
                    <div className="mt-[3px]">{allowStress}</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex items-center">
                    <span>{utilRatio}</span>
                    <span className="mx-3.5">&lt;</span>
                    <span className="pr-4">
                      {utilRatio ? `1.0・・・${isOk ? "O.K" : "N.G"}` : ""}
                    </span>
                  </div>
                </div>
                <div className="border-t border-black mt-[3px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });
  });

  // c4 = 基礎部に加わる応力 (Stress applied to the foundation)
  const lastSection = results?.[results.length - 1];
  const fVert = formatRawVal(foundation?.verticalLoadN ?? lastSection?.verticalLoadN);
  const fHoriz = formatRawVal(foundation?.horizontalLoadN ?? lastSection?.horizontalLoadN);
  const fMoment = formatRawVal(foundation?.bendingMomentNm ?? lastSection?.bendingMomentNm);

  if (results && results.length > 0) {
    blocks.push({
      id: "c4",
      node: (
        <section className="pt-[20px]">
          <h2 className="page1-title">
            <span className="page1-number">{3 + sectionCounter++}.</span>
            <span className="page1-text tracking-[0.1em] jp">
              基礎部に加わる応力
            </span>
          </h2>

          <div className="flex justify-start ml-[22px]">
            <div className="flex flex-col mb-0 mr-8">
              <div className="page1-text tracking-[0.1em] jp">・鉛直力</div>
              <div className="page1-text tracking-[0.1em] jp">・水平力</div>
              <div className="page1-text tracking-[0.1em] jp">
                ・曲げモーメント
              </div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">N</div>
              <div className="page1-text">P</div>
              <div className="page1-text">M</div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
            </div>
            <div className="flex flex-col mb-0">
              <div className="page1-text">{fVert} N</div>
              <div className="page1-text">{fHoriz} N</div>
              <div className="page1-text">{fMoment} N・m</div>
            </div>
          </div>
        </section>
      ),
    });
  }

  return blocks;
};
