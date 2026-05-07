import React from "react";
import { getRowsForStep } from "../../../utils/report-handlers/textFormatter";

export const createBlocks = (
  results = [],
  resultsDo = [],
  structuralDesign = {},
) => {
  const blocks = [];
  let sectionCounter = 0;

  results?.forEach((r, index) => {
    const rows = getRowsForStep(index, results, resultsDo, structuralDesign);

    const suffix = index + 1; // biar id unik: c1-1, c1-2, dst

    //  c1 = (Consideration of pillars) and 荷重計算 (Load calculation)
    blocks.push({
      id: `c1-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Main-section: (Consideration of pillars) + material specifications */}
          <h2 className="page1-title">
            <span className="page1-number">{3 + sectionCounter++}.</span>
            <span className="page1-text tracking-[0.1em] jp">
              {r?.description ?? ""}:
            </span>
            <span className="page1-text ml-[18px] jp">φ</span>
            <span className="page1-text">{r?.diaLower?.toFixed(1) ?? ""}</span>
            <span className="page1-text px-[2px] text-[10.5pt]">×</span>
            <span className="page1-text">
              t{r?.thickLower?.toFixed(1) ?? ""}
            </span>
            <span className="page1-text ml-[20px]">{r?.material ?? ""}</span>
            <span className="page1-text ml-[20px]">
              Z = {r?.SecMdl?.toFixed(2) ?? ""} cm<sup>3</sup>
            </span>
          </h2>

          <div className="flex flex-col">
            {/* Sub-section: 1) 荷重計算 (Load calculation) */}
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">1).</span>
              <span className="page1-text tracking-[0.1em] jp">荷重計算</span>
            </div>

            <div className="ml-[25px]">
              {/*
              Load table:
              - Dead load (固定荷重)
              - Wind load (風荷重)
              - Used to find:
              N = vertical force
              Pmax = maximum horizontal force
            */}
              <table className="tables-pages">
                <thead>
                  {/* Header Line 1 */}
                  <tr className="tracking-[0.1em] jp">
                    <th className="col-num" rowspan={2}></th>
                    <th rowspan={2}>名 称</th>
                    <th className="col-left" colspan={1}>
                      単位重量
                    </th>
                    <th className="col-left" rowspan={2}>
                      個数
                    </th>
                    <th className="col-left" rowspan={1}>
                      固定荷重
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right" colspan={1}>
                      受風面積
                    </th>
                    <th className="col-right" colspan={1}>
                      風力係数
                    </th>
                    <th className="col-right" colspan={1}>
                      単位風荷重
                    </th>
                    <th className="col-right" colspan={1}>
                      個数
                    </th>
                    <th className="col-right" colspan={1}>
                      風荷重
                    </th>
                  </tr>

                  {/* Header line 2 (unit) */}
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
                            {row.data.nameDo ?? ""}
                          </td>
                          <td className="col-left">
                            {row.data.flDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-left">{row.data.qtyDo ?? ""}</td>
                          <td className="col-left">
                            {row.data.flDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-gap"></td>
                          <td className="col-right">
                            {row.data.frontAreaDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-right">
                            {row.data.cfDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-right">
                            {row.data.wlafDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-right">{row.data.qtyDo ?? ""}</td>
                          <td className="col-right">
                            {row.data.wlafDo?.toFixed(1) ?? ""}
                          </td>
                        </>
                      )}

                      {row.type === "pole" && (
                        <>
                          <td className="col-1 tracking-[0.1em] jp">
                            {row.data.description ?? ""}
                          </td>
                          <td className="col-left">149.6</td>
                          <td className="col-left">{row.data.qty ?? ""}</td>
                          <td className="col-left">149.6</td>
                          <td className="col-gap"></td>
                          <td className="col-right">0.203</td>
                          <td className="col-right">0.7</td>
                          <td className="col-right">310.0</td>
                          <td className="col-right">{row.data.qty ?? ""}</td>
                          <td className="col-right">310.0</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>

                {/* Total N(vertical force) dan Pmax(horizontal force) */}
                <tfoot>
                  <tr>
                    <td className="col-num"></td>
                    <td className="col-1-tf"></td>
                    <td colspan={2} className="tfoot-title col-left">
                      <span className="tracking-[0.1em] jp">鉛直力 </span>N
                      {index + 1}=
                    </td>
                    <td className="tfoot-value col-left">185.9</td>
                    <td className="col-gap"></td>
                    <td colspan={4} className="tfoot-title col-right">
                      <span className="tracking-[0.1em] jp">水平力 </span>
                      Pmax{index + 1}=
                    </td>
                    <td colspan={1} className="tfoot-value col-right">
                      453.9
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
          {/* Sub-section: 2) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">2).</span>
              <span className="page1-text tracking-[0.1em] jp">
                風時曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mp{index + 1} =</span>
              <span className="mr-[8px]">P1・(H4-H3)+P2・H2/2 =</span>
              <span>709.8 N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c3 = 曲げ応力度 (Bending Stress)
    blocks.push({
      id: `c3-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 3) 曲げ応力度 (Bending Stress) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">3).</span>
              <span className="page1-text tracking-[0.1em] jp">曲げ応力度</span>
            </div>

            {/* Bending stress calculation */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px] tracking-[0.1em]">cσb =</span>
              <span className="mr-[8px]">Mp{index + 1}/Z =</span>
              <span>
                39.7 N/mm<sup>2</sup>
              </span>
            </div>

            {/* Checking the ratio to allowable stress */}
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
                      39.7
                    </div>
                    <div className="mt-[3px]">235</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex items-center">
                    <span>0.169</span>
                    <span className="mx-3.5">&lt;</span>
                    <span className="pr-4">1.0・・・O.K</span>
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
  blocks.push({
    id: "c4",
    node: (
      <section className="pt-[20px]">
        {/* Main-section: 基礎部に加わる応力 (Stress applied to the foundation) */}
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
            <div className="page1-text">353.1 N</div>
            <div className="page1-text">1596.0 N</div>
            <div className="page1-text">1596.0 N・m</div>
          </div>
        </div>
      </section>
    ),
  });

  return blocks;
};
