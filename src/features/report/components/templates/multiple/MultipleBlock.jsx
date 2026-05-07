import React from "react";
import { getRowsForStepPlusArm } from "../../../utils/report-handlers/textFormatter";

export const createBlocks = (
  results = [],
  resultsDo = [],
  structuralDesign = {},
) => {
  const blocks = [];
  let sectionCounter = 0;

  results?.forEach((r, index) => {
    const rows = getRowsForStepPlusArm(
      index,
      results,
      resultsDo,
      structuralDesign,
    );

    const suffix = index + 1; // biar id unik: c1-1, c1-2, dst

    //  c1 = (Consideration of pillars) and 荷重計算 (Load calculation) (A)
    blocks.push({
      id: `c1-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Main-section: (Consideration of pillars) + material specifications */}
          <h2 className="page1-title">
            <span className="page1-number">{4 + sectionCounter++}.</span>
            <span className="page1-text tracking-[0.05em] jp">
              柱の検討【直風時A】
            </span>
            <span className="page1-text ml-[18px] jp">φ</span>
            <span className="page1-text">{r?.diaLower?.toFixed(1) ?? ""}</span>
            <span className="page1-text px-[2px] text-[10.5pt]">×</span>
            <span className="page1-text">
              t{r?.thickLower?.toFixed(1) ?? ""}
            </span>
            <span className="page1-text ml-1.5">
              <span className="jp">(</span>
              {r?.material ?? ""}
              <span className="jp">)</span>
            </span>
            <span className="page1-text ml-1.5">
              Z = {r?.SecMdl?.toFixed(2) ?? ""} cm<sup>3</sup>
            </span>
          </h2>

          <div className="flex flex-col">
            {/* Sub-section: 1) 荷重計算 (Load calculation) */}
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                1<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">荷重計算</span>
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
                  <tr className="tracking-[0.05em]">
                    <th className="col-num" rowspan={2}></th>
                    <th className="jp" rowspan={2}>
                      名 称
                    </th>
                    <th className="col-left jp" colspan={1}>
                      単位重量
                    </th>
                    <th className="col-left jp" rowspan={2}>
                      個 数
                    </th>
                    <th className="col-left jp" rowspan={1}>
                      重 量
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right jp" colspan={1}>
                      受風圧面積
                    </th>
                    <th className="col-right jp" colspan={1}>
                      風力係数
                    </th>
                    <th className="col-right jp" colspan={1}>
                      単位風荷重
                    </th>
                    <th className="col-right jp" colspan={1}>
                      個 数
                    </th>
                    <th className="col-right" colspan={1}>
                      <span className="jp">風荷重 (</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  {/* Header line 2 (unit) */}
                  <tr>
                    <th className="col-left">
                      W<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-left">
                      {" "}
                      <span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right">
                      <span className="jp">(</span>m<sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                    <th className="col-right">C</th>
                    <th className="col-right">
                      P<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="tracking-[0.05em] jp">(受風物)</th>
                    <th className="col-right">
                      X-
                      <span className="jp">軸</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="col-num">{String.fromCharCode(65 + i)}</td>

                      {row.type === "do" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
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

                      {row.type === "arm" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.name}
                          </td>
                          <td className="col-left">{row.data.weight}</td>
                          <td className="col-left">{row.data.qty}</td>
                          <td className="col-left">{row.data.weight}</td>
                          <td className="col-gap"></td>
                          <td className="col-right">{row.data.frontArea}</td>
                          <td className="col-right">{row.data.cf}</td>
                          <td className="col-right">{row.data.wlaf}</td>
                          <td className="col-right">{row.data.qty}</td>
                          <td className="col-right">{row.data.wlaf}</td>
                        </>
                      )}

                      {row.type === "pole" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.description ?? ""}
                          </td>
                          <td className="col-left">1102.1</td>
                          <td className="col-left">{row.data.qty ?? ""}</td>
                          <td className="col-left">1102.1</td>
                          <td className="col-gap"></td>
                          <td className="col-right">1.050</td>
                          <td className="col-right">0.7</td>
                          <td className="col-right">1627.3</td>
                          <td className="col-right">{row.data.qty ?? ""}</td>
                          <td className="col-right">1627.3</td>
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
                      <span className="tracking-[0.05em] jp">鉛直力 </span>N'=
                    </td>
                    <td className="tfoot-value col-left">1660.3</td>
                    <td className="col-gap"></td>
                    <td colspan={4} className="tfoot-title col-right">
                      <span className="tracking-[0.05em] jp">水平力 </span>
                      Pmax'=
                    </td>
                    <td colspan={1} className="tfoot-value col-right">
                      3177.0
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      ),
    });

    // c2 = 固定時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c2-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 2) 固定時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                2<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                固定時曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mwx</div>
                <div>Mwy</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>127.0 N・m</div>
                <div>127.0 N・m</div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c3 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c3-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 3) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                3<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                風時曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mpx</div>
                <div>Mpy</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>
                  PA・H1<span className="mx-0.5">+</span>PB・H2
                  <span className="mx-0.5">+</span>PC・H2
                  <span className="mx-0.5">+</span>PD・H1'
                  <span className="mx-1">=</span>12975.1 N・m
                </div>
                <div>0.0 N・m</div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c4 = 固定時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c4-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 4) 固定時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                4<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                合成曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mx</div>
                <div>My</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>
                  Mwx<span className="mx-0.5">+</span>Mpx
                </div>
                <div>
                  Mwy<span className="mx-0.5">+</span>Mpy
                </div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>13102.1 N・m</div>
                <div>127.0 N・m</div>
              </div>
            </div>
            <div className="flex justify-start ml-[44px] gap-1">
              <div>Mmax</div>
              <div>=</div>
              <div>
                <span className="jp">(</span>Mx<sup>2</sup>
                <span className="mx-0.5">+</span>My<sup>2</sup>
                <span className="jp">)</span>
                <sup>0.5</sup>
              </div>
              <div>=</div>
              <div>13102.7 N・m</div>
            </div>
          </div>
        </section>
      ),
    });

    // c5 = ねじりモーメント
    blocks.push({
      id: `c5-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 5) ねじりモーメント */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                5<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                ねじりモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div>Mtp</div>
              <div>=</div>
              <div>451.0 N・m</div>
            </div>
          </div>
        </section>
      ),
    });

    // c6 = 曲げ応力度
    blocks.push({
      id: `c6-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 6) 曲げ応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                6<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                曲げ応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="ml-[44px]">
              <div className="inline-block">
                <div className="flex justify-start whitespace-nowrap pr-4">
                  <span className="tracking-[0.05em]">cσb =</span>
                  <span className="mx-1 tracking-[0.05em]">
                    Mmax/Z
                    <span className="ml-1">=</span>
                  </span>
                  <span>142.4</span>
                  <span className="ml-1">
                    N/mm<sup>2</sup>
                  </span>
                  <span className="mx-2">&lt;</span>
                  <span>sfb・・・O.K</span>
                </div>
                <div className="border-t border-black mt-[1px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c7 = ねじり剪断応力度
    blocks.push({
      id: `c7-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 7) ねじり剪断応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                7<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                ねじり剪断応力度
              </span>
              <span className="ml-[44px]">
                Ip:<span className="jp ml-[4px]">極断面二次モーメント(</span>cm
                <sup>4</sup>
                <span className="jp">)</span>
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div>τ</div>
              <div>=</div>
              <div>
                Mtp・<span className="jp">φ</span>/Ip・2
              </div>
              <div>=</div>
              <div>
                2.5 N/mm<sup>2</sup>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c8 = 最大ねじり剪断応力度
    blocks.push({
      id: `c8-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 8) 最大ねじり剪断応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                8<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                最大ねじり剪断応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="ml-[44px]">
              <div className="inline-block">
                <div className="flex justify-start whitespace-nowrap pr-4">
                  <span className="tracking-[0.05em]">τmax =</span>
                  <span className="mx-1 tracking-[0.05em]">
                    <span className="jp">(</span>
                    cσb<sup>2</sup>
                    <span className="mx-0.5">+</span>
                    4・τ<sup>2</sup>
                    <span className="jp">)</span>
                    <sup>0.5</sup>/2
                    <span className="ml-1">=</span>
                  </span>
                  <span>71.2</span>
                  <span className="ml-1">
                    N/mm<sup>2</sup>
                  </span>
                  <span className="mx-2">&lt;</span>
                  <span>sfs・・・O.K</span>
                </div>
                <div className="border-t border-black mt-[1px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c9 = 最大合成応力度
    blocks.push({
      id: `c9-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 9) 最大合成応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                9<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                最大合成応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="ml-[44px]">
              <div className="inline-block">
                <div className="flex justify-start whitespace-nowrap pr-4">
                  <span className="tracking-[0.05em]">σmax =</span>
                  <span className="mx-1 tracking-[0.05em]">
                    cσb/2
                    <span className="mx-0.5">+</span>
                    τmax
                    <span className="ml-1">=</span>
                  </span>
                  <span>142.4</span>
                  <span className="ml-1">
                    N/mm<sup>2</sup>
                  </span>
                  <span className="mx-2">&lt;</span>
                  <span>sfb・・・O.K</span>
                </div>
                <div className="border-t border-black mt-[1px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    //  c10 = (Consideration of pillars) and 荷重計算 (Load calculation) (B)
    blocks.push({
      id: `c10-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Main-section: (Consideration of pillars) + material specifications */}
          <h2 className="page1-title">
            <span className="page1-number">{4 + sectionCounter++}.</span>
            <span className="page1-text tracking-[0.05em] jp">
              柱の検討【直風時B】
            </span>
            <span className="page1-text ml-[18px] jp">φ</span>
            <span className="page1-text">{r?.diaLower?.toFixed(1) ?? ""}</span>
            <span className="page1-text px-[2px] text-[10.5pt]">×</span>
            <span className="page1-text">
              t{r?.thickLower?.toFixed(1) ?? ""}
            </span>
            <span className="page1-text ml-1.5">
              <span className="jp">(</span>
              {r?.material ?? ""}
              <span className="jp">)</span>
            </span>
            <span className="page1-text ml-1.5">
              Z = {r?.SecMdl?.toFixed(2) ?? ""} cm<sup>3</sup>
            </span>
          </h2>

          <div className="flex flex-col">
            {/* Sub-section: 1) 荷重計算 (Load calculation) */}
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                1<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">荷重計算</span>
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
                  <tr className="tracking-[0.05em]">
                    <th className="col-num" rowspan={2}></th>
                    <th className="jp" rowspan={2}>
                      名 称
                    </th>
                    <th className="col-left jp" colspan={1}>
                      単位重量
                    </th>
                    <th className="col-left jp" rowspan={2}>
                      個 数
                    </th>
                    <th className="col-left jp" rowspan={1}>
                      重 量
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right jp" colspan={1}>
                      受風圧面積
                    </th>
                    <th className="col-right jp" colspan={1}>
                      風力係数
                    </th>
                    <th className="col-right jp" colspan={1}>
                      単位風荷重
                    </th>
                    <th className="col-right jp" colspan={1}>
                      個 数
                    </th>
                    <th className="col-right" colspan={1}>
                      <span className="jp">風荷重 (</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  {/* Header line 2 (unit) */}
                  <tr>
                    <th className="col-left">
                      W<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-left">
                      {" "}
                      <span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right">
                      <span className="jp">(</span>m<sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                    <th className="col-right">C</th>
                    <th className="col-right">
                      P<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="tracking-[0.05em] jp">(受風物)</th>
                    <th className="col-right">
                      Y-
                      <span className="jp">軸</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="col-num">{String.fromCharCode(65 + i)}</td>

                      {row.type === "do" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
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

                      {row.type === "arm" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.name}
                          </td>
                          <td className="col-left">{row.data.weight}</td>
                          <td className="col-left">{row.data.qty}</td>
                          <td className="col-left">{row.data.weight}</td>
                          <td className="col-gap"></td>
                          <td className="col-right">{row.data.frontArea}</td>
                          <td className="col-right">{row.data.cf}</td>
                          <td className="col-right">{row.data.wlaf}</td>
                          <td className="col-right">{row.data.qty}</td>
                          <td className="col-right">{row.data.wlaf}</td>
                        </>
                      )}

                      {row.type === "pole" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.description ?? ""}
                          </td>
                          <td className="col-left">1102.1</td>
                          <td className="col-left">{row.data.qty ?? ""}</td>
                          <td className="col-left">1102.1</td>
                          <td className="col-gap"></td>
                          <td className="col-right">1.050</td>
                          <td className="col-right">0.7</td>
                          <td className="col-right">1627.3</td>
                          <td className="col-right">{row.data.qty ?? ""}</td>
                          <td className="col-right">1627.3</td>
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
                      <span className="tracking-[0.05em] jp">鉛直力 </span>N=
                    </td>
                    <td className="tfoot-value col-left">1660.3</td>
                    <td className="col-gap"></td>
                    <td colspan={4} className="tfoot-title col-right">
                      <span className="tracking-[0.05em] jp">水平力 </span>
                      Pmax=
                    </td>
                    <td colspan={1} className="tfoot-value col-right">
                      3177.0
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      ),
    });

    // c11 = 固定時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c11-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 2) 固定時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                2<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                固定時曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mwx'</div>
                <div>Mwy'</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>127.0 N・m</div>
                <div>127.0 N・m</div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c12 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c12-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 3) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                3<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                風時曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mpx'</div>
                <div>Mpy'</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>0.0 N・m</div>
                <div>
                  PA・H1<span className="mx-0.5">+</span>PB・H2
                  <span className="mx-0.5">+</span>PC・H2
                  <span className="mx-0.5">+</span>PD・H1'
                  <span className="mx-1">=</span>12975.1 N・m
                </div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c13 = 固定時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c13-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 4) 固定時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                4<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                合成曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mx'</div>
                <div>My'</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>
                  Mwx'<span className="mx-0.5">+</span>Mpx'
                </div>
                <div>
                  Mwy'<span className="mx-0.5">+</span>Mpy'
                </div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>127.0 N・m</div>
                <div>13102.1 N・m</div>
              </div>
            </div>
            <div className="flex justify-start ml-[44px] gap-1">
              <div>Mmax'</div>
              <div>=</div>
              <div>
                <span className="jp">(</span>Mx'<sup>2</sup>
                <span className="mx-0.5">+</span>My'<sup>2</sup>
                <span className="jp">)</span>
                <sup>0.5</sup>
              </div>
              <div>=</div>
              <div>13102.7 N・m</div>
            </div>
          </div>
        </section>
      ),
    });

    // c14 = ねじりモーメント
    blocks.push({
      id: `c14-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 5) ねじりモーメント */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                5<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                ねじりモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div>Mtp'</div>
              <div>=</div>
              <div>451.0 N・m</div>
            </div>
          </div>
        </section>
      ),
    });

    // c15 = 曲げ応力度
    blocks.push({
      id: `c15-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 6) 曲げ応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                6<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                曲げ応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="ml-[44px]">
              <div className="inline-block">
                <div className="flex justify-start whitespace-nowrap pr-4">
                  <span className="tracking-[0.05em]">cσb =</span>
                  <span className="mx-1 tracking-[0.05em]">
                    Mmax'/Z
                    <span className="ml-1">=</span>
                  </span>
                  <span>142.4</span>
                  <span className="ml-1">
                    N/mm<sup>2</sup>
                  </span>
                  <span className="mx-2">&lt;</span>
                  <span>sfb・・・O.K</span>
                </div>
                <div className="border-t border-black mt-[1px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c16 = ねじり剪断応力度
    blocks.push({
      id: `c16-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 7) ねじり剪断応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                7<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                ねじり剪断応力度
              </span>
              <span className="ml-[44px]">
                Ip:<span className="jp ml-[4px]">極断面二次モーメント(</span>cm
                <sup>4</sup>
                <span className="jp">)</span>
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div>τ</div>
              <div>=</div>
              <div>
                Mtp'・<span className="jp">φ</span>/Ip・2
              </div>
              <div>=</div>
              <div>
                2.5 N/mm<sup>2</sup>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c17 = 最大ねじり剪断応力度
    blocks.push({
      id: `c17-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 8) 最大ねじり剪断応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                8<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                最大ねじり剪断応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="ml-[44px]">
              <div className="inline-block">
                <div className="flex justify-start whitespace-nowrap pr-4">
                  <span className="tracking-[0.05em]">τmax =</span>
                  <span className="mx-1 tracking-[0.05em]">
                    <span className="jp">(</span>
                    cσb<sup>2</sup>
                    <span className="mx-0.5">+</span>
                    4・τ<sup>2</sup>
                    <span className="jp">)</span>
                    <sup>0.5</sup>/2
                    <span className="ml-1">=</span>
                  </span>
                  <span>71.2</span>
                  <span className="ml-1">
                    N/mm<sup>2</sup>
                  </span>
                  <span className="mx-2">&lt;</span>
                  <span>sfs・・・O.K</span>
                </div>
                <div className="border-t border-black mt-[1px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c18 = 最大合成応力度
    blocks.push({
      id: `c18-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 9) 最大合成応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                9<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                最大合成応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="ml-[44px]">
              <div className="inline-block">
                <div className="flex justify-start whitespace-nowrap pr-4">
                  <span className="tracking-[0.05em]">σmax =</span>
                  <span className="mx-1 tracking-[0.05em]">
                    cσb/2
                    <span className="mx-0.5">+</span>
                    τmax
                    <span className="ml-1">=</span>
                  </span>
                  <span>142.4</span>
                  <span className="ml-1">
                    N/mm<sup>2</sup>
                  </span>
                  <span className="mx-2">&lt;</span>
                  <span>sfb・・・O.K</span>
                </div>
                <div className="border-t border-black mt-[1px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    //  c19 = (Consideration of pillars) and 荷重計算 (Load calculation) 【斜風時】
    blocks.push({
      id: `c19-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Main-section: (Consideration of pillars) + material specifications */}
          <h2 className="page1-title">
            <span className="page1-number">{4 + sectionCounter++}.</span>
            <span className="page1-text tracking-[0.05em] jp">
              柱の検討【斜風時】
            </span>
            <span className="page1-text ml-[18px] jp">φ</span>
            <span className="page1-text">{r?.diaLower?.toFixed(1) ?? ""}</span>
            <span className="page1-text px-[2px] text-[10.5pt]">×</span>
            <span className="page1-text">
              t{r?.thickLower?.toFixed(1) ?? ""}
            </span>
            <span className="page1-text ml-1.5">
              <span className="jp">(</span>
              {r?.material ?? ""}
              <span className="jp">)</span>
            </span>
            <span className="page1-text ml-1.5">
              Z = {r?.SecMdl?.toFixed(2) ?? ""} cm<sup>3</sup>
            </span>
          </h2>

          <div className="flex flex-col">
            {/* Sub-section: 1) 荷重計算 (Load calculation) */}
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                1<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">荷重計算</span>
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
              <table className="tables-pages multiple">
                <thead>
                  {/* Header Line 1 */}
                  <tr className="tracking-[0.05em]">
                    <th className="col-num" rowspan={2}></th>
                    <th className="jp" rowspan={2}>
                      名 称
                    </th>
                    <th className="col-left jp" colspan={1}>
                      単位重量
                    </th>
                    <th className="col-left jp" rowspan={2}>
                      個 数
                    </th>
                    <th className="col-left jp" rowspan={1}>
                      重 量
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right jp" colspan={1}>
                      受風圧面積
                    </th>
                    <th className="col-right jp" colspan={1}>
                      単位風荷重
                    </th>
                    <th className="col-right jp" colspan={1}>
                      個 数
                    </th>
                    <th className="col-right" colspan={2}>
                      <span className="jp">風荷重 (</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  {/* Header line 2 (unit) */}
                  <tr>
                    <th className="col-left">
                      W<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-left">
                      {" "}
                      <span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right">
                      <span className="jp">(</span>m<sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                    <th className="col-right">
                      P<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="tracking-[0.05em] jp">(受風物)</th>
                    <th className="col-right">
                      X-
                      <span className="jp">軸</span>
                    </th>

                    <th className="col-right">
                      Y-
                      <span className="jp">軸</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="col-num">{String.fromCharCode(65 + i)}</td>

                      {row.type === "do" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
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
                          <td className="col-right">{row.data.qtyDo ?? ""}</td>
                          <td className="col-right">
                            {row.data.wlafDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-right">
                            {row.data.wlafDo?.toFixed(1) ?? ""}
                          </td>
                        </>
                      )}

                      {row.type === "arm" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.name}
                          </td>
                          <td className="col-left">{row.data.weight}</td>
                          <td className="col-left">{row.data.qty}</td>
                          <td className="col-left">{row.data.weight}</td>
                          <td className="col-gap"></td>
                          <td className="col-right"></td>
                          <td className="col-right">{row.data.cf}</td>
                          <td className="col-right">{row.data.qty}</td>
                          <td className="col-right">{row.data.wlaf}</td>
                          <td className="col-right">{row.data.wlaf}</td>
                        </>
                      )}

                      {row.type === "pole" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.description ?? ""}
                          </td>
                          <td className="col-left">1102.1</td>
                          <td className="col-left">{row.data.qty ?? ""}</td>
                          <td className="col-left">1102.1</td>
                          <td className="col-gap"></td>
                          <td className="col-right">1.050</td>
                          <td className="col-right">0.7</td>
                          <td className="col-right">{row.data.qty ?? ""}</td>
                          <td className="col-right">1150.7</td>
                          <td className="col-right">1150.7</td>
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
                      <span className="tracking-[0.05em] jp">鉛直力 </span>N''=
                    </td>
                    <td className="tfoot-value col-left">2055.1</td>
                    <td className="col-gap"></td>
                    <td colspan={4} className="tfoot-title col-right">
                      <span className="tracking-[0.05em] jp">水平力 </span>
                      Pmax''=
                    </td>
                    <td colspan={1} className="tfoot-value col-right">
                      2055.1
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      ),
    });

    // c20 = 固定時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c20-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 2) 固定時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                2<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                固定時曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mwx''</div>
                <div>Mwy''</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>127.0 N・m</div>
                <div>127.0 N・m</div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c21 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c21-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 3) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                3<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                風時曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mpx''</div>
                <div>Mpy''</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>8394.7 N・m</div>
                <div>8394.7 N・m</div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c22 = 固定時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c22-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 4) 固定時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                4<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                合成曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mx''</div>
                <div>My''</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>
                  Mwx''<span className="mx-0.5">+</span>Mpx''
                </div>
                <div>
                  Mwy''<span className="mx-0.5">+</span>Mpy''
                </div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>8521.7 N・m</div>
                <div>8521.7 N・m</div>
              </div>
            </div>
            <div className="flex justify-start ml-[44px] gap-1">
              <div>Mmax''</div>
              <div>=</div>
              <div>
                <span className="jp">(</span>Mx''<sup>2</sup>
                <span className="mx-0.5">+</span>My''<sup>2</sup>
                <span className="jp">)</span>
                <sup>0.5</sup>
              </div>
              <div>=</div>
              <div>12051.5 N・m</div>
            </div>
          </div>
        </section>
      ),
    });

    // c23 = ねじりモーメント
    blocks.push({
      id: `c23-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 5) ねじりモーメント */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                5<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                ねじりモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div>Mtp''</div>
              <div>=</div>
              <div>0.0 N・m</div>
            </div>
          </div>
        </section>
      ),
    });

    // c24 = 曲げ応力度
    blocks.push({
      id: `c24-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 6) 曲げ応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                6<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                曲げ応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="ml-[44px]">
              <div className="inline-block">
                <div className="flex justify-start whitespace-nowrap pr-4">
                  <span className="tracking-[0.05em]">cσb =</span>
                  <span className="mx-1 tracking-[0.05em]">
                    Mmax''/Z
                    <span className="ml-1">=</span>
                  </span>
                  <span>131.0</span>
                  <span className="ml-1">
                    N/mm<sup>2</sup>
                  </span>
                  <span className="mx-2">&lt;</span>
                  <span>sfb・・・O.K</span>
                </div>
                <div className="border-t border-black mt-[1px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c25 = ねじり剪断応力度
    blocks.push({
      id: `c25-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 7) ねじり剪断応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                7<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                ねじり剪断応力度
              </span>
              <span className="ml-[44px]">
                Ip:<span className="jp ml-[4px]">極断面二次モーメント(</span>cm
                <sup>4</sup>
                <span className="jp">)</span>
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div>τ</div>
              <div>=</div>
              <div>
                Mtp''・<span className="jp">φ</span>/Ip・2
              </div>
              <div>=</div>
              <div>
                0.0 N/mm<sup>2</sup>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c26 = 最大ねじり剪断応力度
    blocks.push({
      id: `c26-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 8) 最大ねじり剪断応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                8<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                最大ねじり剪断応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="ml-[44px]">
              <div className="inline-block">
                <div className="flex justify-start whitespace-nowrap pr-4">
                  <span className="tracking-[0.05em]">τmax =</span>
                  <span className="mx-1 tracking-[0.05em]">
                    <span className="jp">(</span>
                    cσb<sup>2</sup>
                    <span className="mx-0.5">+</span>
                    4・τ<sup>2</sup>
                    <span className="jp">)</span>
                    <sup>0.5</sup>/2
                    <span className="ml-1">=</span>
                  </span>
                  <span>65.5</span>
                  <span className="ml-1">
                    N/mm<sup>2</sup>
                  </span>
                  <span className="mx-2">&lt;</span>
                  <span>sfs・・・O.K</span>
                </div>
                <div className="border-t border-black mt-[1px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c27 = 最大合成応力度
    blocks.push({
      id: `c27-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 9) 最大合成応力度 */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                9<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                最大合成応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="ml-[44px]">
              <div className="inline-block">
                <div className="flex justify-start whitespace-nowrap pr-4">
                  <span className="tracking-[0.05em]">σmax =</span>
                  <span className="mx-1 tracking-[0.05em]">
                    cσb/2
                    <span className="mx-0.5">+</span>
                    τmax
                    <span className="ml-1">=</span>
                  </span>
                  <span>131.0</span>
                  <span className="ml-1">
                    N/mm<sup>2</sup>
                  </span>
                  <span className="mx-2">&lt;</span>
                  <span>sfb・・・O.K</span>
                </div>
                <div className="border-t border-black mt-[1px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });
  });

  // c28 = 基礎部に加わる応力 (Stress applied to the foundation)
  blocks.push({
    id: "c28",
    node: (
      <section className="pt-[40px]">
        {/* Main-section: 基礎部に加わる応力 (Stress applied to the foundation) */}
        <h2 className="page1-title">
          <span className="page1-number">{4 + sectionCounter++}.</span>
          <span className="page1-text tracking-[0.05em] jp">
            基礎部に加わる応力
          </span>
        </h2>

        <div className="flex flex-col">
          <div className="flex justify-start ml-[22px] mb-0">
            <span className="page1-number">
              1<span className="jp">)</span>.
            </span>
            <span className="page1-text tracking-[0.05em]">
              <span className="jp">直風時</span>A
            </span>
          </div>
          <div className="flex justify-start ml-[44px]">
            <div className="flex flex-col mb-0 mr-8">
              <div className="page1-text tracking-[0.05em] jp">・鉛直力</div>
              <div className="page1-text tracking-[0.05em]">
                <span className="jp">【</span>X-<span className="jp">軸】</span>
              </div>
              <div className="page1-text tracking-[0.05em] jp">・水平力</div>
              <div className="page1-text tracking-[0.05em] jp">
                ・曲げモーメント
              </div>
              <div className="page1-text tracking-[0.05em]">
                <span className="jp">【</span>Y-<span className="jp">軸】</span>
              </div>
              <div className="page1-text tracking-[0.05em] jp">・水平力</div>
              <div className="page1-text tracking-[0.05em] jp">
                ・曲げモーメント
              </div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">N</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">P</div>
              <div className="page1-text">M</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">P</div>
              <div className="page1-text">M</div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">=</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
            </div>
            <div className="flex flex-col mb-0">
              <div className="page1-text">1660.3 N</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">3177.0 N</div>
              <div className="page1-text">13102.1 N・m</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">0.0 N</div>
              <div className="page1-text">127.0 N・m</div>
            </div>
          </div>
        </div>
      </section>
    ),
  });

  // c29 = 基礎部に加わる応力 (Stress applied to the foundation)
  blocks.push({
    id: "c29",
    node: (
      <section className="pt-[20px]">
        <div className="flex flex-col">
          <div className="flex justify-start ml-[22px] mb-0">
            <span className="page1-number">
              2<span className="jp">)</span>.
            </span>
            <span className="page1-text tracking-[0.05em]">
              <span className="jp">直風時</span>B
            </span>
          </div>
          <div className="flex justify-start ml-[44px]">
            <div className="flex flex-col mb-0 mr-8">
              <div className="page1-text tracking-[0.05em] jp">・鉛直力</div>
              <div className="page1-text tracking-[0.05em]">
                <span className="jp">【</span>X-<span className="jp">軸】</span>
              </div>
              <div className="page1-text tracking-[0.05em] jp">・水平力</div>
              <div className="page1-text tracking-[0.05em] jp">
                ・曲げモーメント
              </div>
              <div className="page1-text tracking-[0.05em]">
                <span className="jp">【</span>Y-<span className="jp">軸】</span>
              </div>
              <div className="page1-text tracking-[0.05em] jp">・水平力</div>
              <div className="page1-text tracking-[0.05em] jp">
                ・曲げモーメント
              </div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">N</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">P</div>
              <div className="page1-text">M</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">P</div>
              <div className="page1-text">M</div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">=</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
            </div>
            <div className="flex flex-col mb-0">
              <div className="page1-text">1660.3 N</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">0.0 N</div>
              <div className="page1-text">127.0 N・m</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">3177.0 N</div>
              <div className="page1-text">13102.1 N・m</div>
            </div>
          </div>
        </div>
      </section>
    ),
  });

  // c30 = 基礎部に加わる応力 (Stress applied to the foundation)
  blocks.push({
    id: "c30",
    node: (
      <section className="pt-[20px]">
        <div className="flex flex-col">
          <div className="flex justify-start ml-[22px] mb-0">
            <span className="page1-number">
              3<span className="jp">)</span>.
            </span>
            <span className="page1-text tracking-[0.05em] jp">斜風時</span>
          </div>
          <div className="flex justify-start ml-[44px]">
            <div className="flex flex-col mb-0 mr-8">
              <div className="page1-text tracking-[0.05em] jp">・鉛直力</div>
              <div className="page1-text tracking-[0.05em]">
                <span className="jp">【</span>X-<span className="jp">軸】</span>
              </div>
              <div className="page1-text tracking-[0.05em] jp">・水平力</div>
              <div className="page1-text tracking-[0.05em] jp">
                ・曲げモーメント
              </div>
              <div className="page1-text tracking-[0.05em]">
                <span className="jp">【</span>Y-<span className="jp">軸】</span>
              </div>
              <div className="page1-text tracking-[0.05em] jp">・水平力</div>
              <div className="page1-text tracking-[0.05em] jp">
                ・曲げモーメント
              </div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">N</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">P</div>
              <div className="page1-text">M</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">P</div>
              <div className="page1-text">M</div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="page1-text">=</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
            </div>
            <div className="flex flex-col mb-0">
              <div className="page1-text">1660.3 N</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">2055.1 N</div>
              <div className="page1-text">8521.7 N・m</div>
              <div className="min-h-[20px]"></div>
              <div className="page1-text">2055.1 N</div>
              <div className="page1-text">8521.7 N・m</div>
            </div>
          </div>
        </div>
      </section>
    ),
  });

  // c31 = 基礎部に加わる応力 (Stress applied to the foundation)
  blocks.push({
    id: "c31",
    node: (
      <section className="pt-[20px]">
        <div className="flex flex-col">
          <div className="flex justify-start ml-[22px] mb-0">
            <span className="page1-number">
              4<span className="jp">)</span>.
            </span>
            <span className="page1-text tracking-[0.05em] jp">合成応カ</span>
          </div>
          <div className="flex justify-start ml-[44px]">
            <div className="flex flex-col mb-0 mr-8">
              <div className="min-h-[20px]"></div>
              <div className="page1-text tracking-[0.05em] jp">・鉛直力</div>
              <div className="page1-text tracking-[0.05em] jp">・水平力</div>
              <div className="page1-text tracking-[0.05em] jp">
                ・曲げモーメント
              </div>
            </div>
            <div className="flex flex-col mb-0 mr-1">
              <div className="min-h-[20px]"></div>
              <div className="page1-text">N</div>
              <div className="page1-text">P</div>
              <div className="page1-text">M</div>
            </div>
            <div className="flex flex-col mb-0 mr-8">
              <div className="min-h-[20px]"></div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
              <div className="page1-text">=</div>
            </div>
            <div className="flex flex-col mb-0 mr-8">
              <div className="page1-text tracking-[0.05em]">
                <span className="jp">直風時</span>A
              </div>
              <div className="page1-text">1660.3 N</div>
              <div className="page1-text">3177.0 N</div>
              <div className="page1-text">13102.7 N・m</div>
            </div>
            <div className="flex flex-col mb-0 mr-8">
              <div className="page1-text tracking-[0.05em]">
                <span className="jp">直風時</span>B
              </div>
              <div className="page1-text">1660.3 N</div>
              <div className="page1-text">3177.0 N</div>
              <div className="page1-text">13102.7 N・m</div>
            </div>
            <div className="flex flex-col mb-0">
              <div className="page1-text tracking-[0.05em] jp">斜風時</div>
              <div className="page1-text">1660.3 N</div>
              <div className="page1-text">2906.4 N</div>
              <div className="page1-text">12051.5 N・m</div>
            </div>
          </div>
        </div>
      </section>
    ),
  });

  return blocks;
};
