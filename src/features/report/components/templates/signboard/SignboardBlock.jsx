import React from "react";
import { getRowsForStep } from "../../../utils/report-handlers/textFormatter";

export const createBlocks = (
  results = [],
  resultsDo = [],
  structuralDesign = {},
) => {
  const blocks = [];
  // let sectionCounter = 0;

  results?.forEach((r, index) => {
    const rows = getRowsForStep(index, results, resultsDo, structuralDesign);

    const suffix = index + 1; // biar id unik: c1-1, c1-2, dst

    //  c1 = (Consideration of pillars) and 荷重計算 (Load calculation)
    blocks.push({
      id: `c1-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Main-section: (Consideration of pillars) + material specifications */}
          <h2 className="page1-title">
            <span className="page1-number">4.</span>
            <span className="page1-text tracking-[0.05em] jp">
              {r?.description ?? ""}
              {"の検討－<直風時>"}
            </span>
            <span className="page1-text ml-[18px] jp">φ</span>
            <span className="page1-text">{r?.diaLower?.toFixed(1) ?? ""}</span>
            <span className="page1-text px-[2px] text-[10.5pt]">×</span>
            <span className="page1-text">
              t{r?.thickLower?.toFixed(1) ?? ""}
            </span>
            <span className="page1-text ml-[20px]">{r?.material ?? ""}</span>
          </h2>

          <div className="flex flex-col">
            <div className="flex justify-end gap-[30px]">
              <div>
                A= 38.36
                <span className="ml-1.5">
                  cm<sup>2</sup>
                </span>
              </div>
              <div>
                I= 2126.05
                <span className="ml-1.5">
                  cm<sup>4</sup>
                </span>
              </div>
              <div>
                Z= {r?.SecMdl?.toFixed(2) ?? ""}
                <span className="ml-1.5">
                  cm<sup>3</sup>
                </span>
              </div>
              <div>
                i= 7.44
                <span className="ml-1.5">cm</span>
              </div>
            </div>
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
                  <tr className="tracking-[0.05em] jp">
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
                    <th className="col-left">
                      W<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-left">
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
                    <th className="tracking-[0.05em] jp">
                      <span className="jp">(</span>受風物
                      <span className="jp">)</span>
                    </th>
                    <th className="col-right">
                      <span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="col-num">A</td>
                    <td className="col-1 tracking-[0.05em] jp">アーム部</td>
                    <td className="col-left">1425.2</td>
                    <td className="col-left">1</td>
                    <td className="col-left">1425.2</td>
                    <td className="col-gap"></td>
                    <td className="col-right"></td>
                    <td className="col-right"></td>
                    <td className="col-right">5780.4</td>
                    <td className="col-right">1</td>
                    <td className="col-right">5780.4</td>
                  </tr>

                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="col-num">{String.fromCharCode(66 + i)}</td>

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

                      {row.type === "pole" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
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
                      <span className="tracking-[0.05em] jp">鉛直力 </span>N=
                    </td>
                    <td className="tfoot-value col-left">3433.1</td>
                    <td className="col-gap"></td>
                    <td colspan={4} className="tfoot-title col-right">
                      <span className="tracking-[0.05em] jp">水平力 </span>
                      Pmax=
                    </td>
                    <td colspan={1} className="tfoot-value col-right">
                      7363.6
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
        <section className="pt-[15px]">
          {/* Sub-section: 2) 風時曲げモーメント (Bending Moment due to Wind) */}
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
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mw =</span>
              <span className="mr-[8px]">
                Mw1<span className="ml-1.5">=</span>
              </span>
              <span>2491.8</span>
              <span className="ml-1.5">N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c3 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c3-${suffix}`,
      node: (
        <section className="pt-[15px]">
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
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mp =</span>
              <span className="mr-[8px]">
                PA・<span className="jp">(</span>H2/2+H3
                <span className="jp">)</span>+PB・H1/2
                <span className="ml-1.5">=</span>
              </span>
              <span>40354.3</span>
              <span className="ml-1.5">N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c4 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c4-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 4) 風時曲げモーメント (Bending Moment due to Wind) */}
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
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mmax =</span>
              <span className="mr-[8px]">
                <span className="jp">(</span>Mw<sup>2</sup>+Mp<sup>2</sup>
                <span className="jp">)</span>
                <sup>0.5</sup>
                <span className="ml-1.5">=</span>
              </span>
              <span>40431.2</span>
              <span className="ml-1.5">N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c5 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c5-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 5) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                5<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                回転モーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mt =</span>
              <span className="mr-[8px]">
                Mp1<span className="ml-1.5">=</span>
              </span>
              <span>11192.7</span>
              <span className="ml-1.5">N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c6 = 曲げ応力度 (Bending Stress)
    blocks.push({
      id: `c6-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 6) 曲げ応力度 (Bending Stress) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                6<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] mr-1.5 jp">
                許容圧縮応力度の算定
              </span>
              fc
            </div>

            <div className="flex flex-col ml-[44px] tracking-[0.05em]">
              <div>
                λ ≦ Λ<span className="jp">のとき</span>
              </div>
              <div className="ml-[22px] flex gap-[35px]">
                <div>
                  fc = <span className="jp">{"{"}</span>1-0.4 ･
                  <span className="jp"> (</span>λ / Λ
                  <span className="jp">)</span>
                  <sup>2</sup>
                  <span className="jp">{"}"}</span> ･ F / ν
                </div>
                <div>
                  ν: <span className="ml-1 jp">安全率</span> = 3/2+2/3・
                  <span className="jp">(</span>λ / Λ
                  <span className="jp">)</span>
                  <sup>2</sup>
                </div>
              </div>
              <div>
                λ {">"} Λ<span className="jp">のとき</span>
              </div>
              <div className="ml-[22px]">
                fc = 0.277 ･ F/
                <span className="jp">(</span>λ / Λ<span className="jp">)</span>
                <sup>2</sup>
              </div>
              <div className="flex gap-[20px]">
                <div className="jp">・ 座屈長(上下梁の中心距離とする)</div>
                <div>
                  Lk=2・L= 1210.0<span className="ml-1.5">cm</span>
                </div>
                <div className="ml-[20px]">
                  L= 605.0<span className="ml-1.5">cm</span>
                </div>
              </div>
              <div className="flex gap-[20px]">
                <div className="jp">・ 圧縮材の細長比</div>
                <div>λ= Lk/i= 162.6</div>
              </div>
              <div className="flex gap-[10px]">
                <div className="jp">・ 限界細長比</div>
                <div>
                  Λ=<span className="jp">{"{("}</span>π<sup>2</sup>・E
                  <span className="jp">{")"}</span>/
                  <span className="jp">{"("}</span>0.6・F
                  <span className="jp">{")}"}</span>
                  <sup>0.5</sup> = 120
                </div>
                <div className="ml-[30px]">
                  E= 205000
                  <span className="ml-1.5">
                    N/mm<sup>2</sup>
                  </span>
                </div>
                <div className="jp">(ヤング係数)</div>
              </div>
              <div className="flex gap-[20px]">
                <div>
                  λ {">"} Λ<span className="jp">より</span>
                </div>
                <div className="flex justify-start gap-1">
                  <div>fc</div>
                  <div className="flex flex-col">
                    <div>
                      = 0.277 ･ F/
                      <span className="jp">(</span>λ / Λ
                      <span className="jp">)</span>
                      <sup>2</sup>
                    </div>
                    <div>
                      = 35.5
                      <span className="ml-1.5">
                        N/mm<sup>2</sup>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c7 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c7-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 2) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                7<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                圧縮応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">σ c =</span>
              <span className="mr-[8px]">
                N/A<span className="ml-1.5">=</span>
              </span>
              <span>0.89</span>
              <span className="ml-1.5">
                N/mm<sup>2</sup>
              </span>
            </div>
          </div>
        </section>
      ),
    });

    // c8 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c8-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 2) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                8<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                曲げ応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">c σ b =</span>
              <span className="mr-[8px]">
                Mmax/Z<span className="ml-1.5">=</span>
              </span>
              <span>205.7</span>
              <span className="ml-1.5">
                N/mm<sup>2</sup>
              </span>
            </div>
          </div>
        </section>
      ),
    });

    // c9 = 曲げ応力度 (Bending Stress)
    blocks.push({
      id: `c9-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 3) 曲げ応力度 (Bending Stress) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">9).</span>
              <span className="page1-text tracking-[0.05em] jp">
                組み合わせ応力度
              </span>
            </div>

            {/* Bending stress calculation */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px] tracking-[0.05em]">σ =</span>
              <span className="mr-[8px]">σ c+c σ b =</span>
              <span>
                206.6 N/mm<sup>2</sup>
              </span>
            </div>

            {/* Checking the ratio to allowable stress */}
            <div className="ml-[68px] leading-none inline-block">
              <div className="inline-block">
                <div className="flex items-center whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-2.5">
                      σ c
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">fc・1.5</div>
                  </div>
                  <div className="mx-2">+</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] px-1.5">
                      c σ b
                    </div>
                    <div className="mt-[3px]">sfb</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-2.5">
                      0.89
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">53.3</div>
                  </div>
                  <div className="mx-2">+</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] px-1.5">
                      205.7
                    </div>
                    <div className="mt-[3px]">235</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex items-center">
                    <span>0.892</span>
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

    // c10 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c10-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 2) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                10<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                ねじりせん断応力度
              </span>
              <span className="ml-[20px]">Ip :</span>
              <span className="ml-1 jp">断面極二次モーメント</span>
              <span className="mx-1">=</span>
              <span>2・I</span>
              <span className="mx-1">=</span>
              <span>
                4252.10 cm<sup>4</sup>
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">τ =</span>
              <span className="mr-[8px]">
                Mt / Ip・<span className="jp">φ</span>/ 2
                <span className="ml-1.5">=</span>
              </span>
              <span>28.5</span>
              <span className="ml-1.5">
                N/mm<sup>2</sup>
              </span>
            </div>
          </div>
        </section>
      ),
    });

    // c11 = 曲げ応力度 (Bending Stress)
    blocks.push({
      id: `c11-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 3) 曲げ応力度 (Bending Stress) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">11).</span>
              <span className="page1-text tracking-[0.05em] jp">
                最大せん断応力度
              </span>
            </div>

            {/* Bending stress calculation */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px] tracking-[0.05em]">τ max =</span>
              <span className="mr-[8px]">
                <span className="jp">(</span>σ<sup>2</sup>+4・τ<sup>2</sup>
                <span className="jp">)</span>
                <sup>0.5</sup>/2<span className="mx-1">=</span>
              </span>
              <span>
                107.2 N/mm<sup>2</sup>
              </span>
            </div>

            {/* Checking the ratio to allowable stress */}
            <div className="ml-[68px] leading-none inline-block">
              <div className="inline-block">
                <div className="flex items-center whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-1.5">
                      τ max
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">sfs</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-2">
                      107.2
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">135</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex items-center">
                    <span>0.794</span>
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

    // c12 = 曲げ応力度 (Bending Stress)
    blocks.push({
      id: `c12-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 3) 曲げ応力度 (Bending Stress) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">12).</span>
              <span className="page1-text tracking-[0.05em] jp">
                最大合成応力度
              </span>
            </div>

            {/* Bending stress calculation */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px] tracking-[0.05em]">σ max =</span>
              <span className="mr-[8px]">
                σ / 2 + τ max<span className="mx-1">=</span>
              </span>
              <span>
                210.5 N/mm<sup>2</sup>
              </span>
            </div>

            {/* Checking the ratio to allowable stress */}
            <div className="ml-[68px] leading-none inline-block">
              <div className="inline-block">
                <div className="flex items-center whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-1.5">
                      σ max
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">sfb</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-2">
                      210.5
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">235</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex items-center">
                    <span>0.896</span>
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

    // c13 = (Consideration of pillars) and 荷重計算 (Load calculation)
    blocks.push({
      id: `c13-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Main-section: (Consideration of pillars) + material specifications */}
          <h2 className="page1-title">
            <span className="page1-number">5.</span>
            <span className="page1-text tracking-[0.05em] jp">
              {r?.description ?? ""}
              {"の検討-<斜風時>"}
            </span>
            <span className="page1-text ml-[18px] jp">φ</span>
            <span className="page1-text">{r?.diaLower?.toFixed(1) ?? ""}</span>
            <span className="page1-text px-[2px] text-[10.5pt]">×</span>
            <span className="page1-text">
              t{r?.thickLower?.toFixed(1) ?? ""}
            </span>
            <span className="page1-text ml-[20px]">{r?.material ?? ""}</span>
          </h2>

          <div className="flex flex-col">
            <div className="flex justify-end gap-[30px]">
              <div>
                A= 38.36
                <span className="ml-1.5">
                  cm<sup>2</sup>
                </span>
              </div>
              <div>
                I= 2126.05
                <span className="ml-1.5">
                  cm<sup>4</sup>
                </span>
              </div>
              <div>
                Z= {r?.SecMdl?.toFixed(2) ?? ""}
                <span className="ml-1.5">
                  cm<sup>3</sup>
                </span>
              </div>
              <div>
                i= 7.44
                <span className="ml-1.5">cm</span>
              </div>
            </div>
            {/* Sub-section: 1) 荷重計算 (Load calculation) */}
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">1).</span>
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
                  <tr className="tracking-[0.05em] jp">
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
                    <th className="col-left">
                      W<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-left">
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
                    <th className="tracking-[0.05em] jp">
                      <span className="jp">(</span>受風物
                      <span className="jp">)</span>
                    </th>
                    <th className="col-right">
                      <span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="col-num">A</td>
                    <td className="col-1 tracking-[0.05em] jp">アーム部</td>
                    <td className="col-left">1425.2</td>
                    <td className="col-left">1</td>
                    <td className="col-left">1425.2</td>
                    <td className="col-gap"></td>
                    <td className="col-right" colSpan={2}>
                      Pmax1/2<sup>0.5</sup>
                      <span className="ml-1">=</span>
                    </td>
                    <td className="col-right">4087.4</td>
                    <td className="col-right">1</td>
                    <td className="col-right">4087.4</td>
                  </tr>

                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="col-num">{String.fromCharCode(66 + i)}</td>

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

                      {row.type === "pole" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.description ?? ""}
                          </td>
                          <td className="col-left">149.6</td>
                          <td className="col-left">{row.data.qty ?? ""}</td>
                          <td className="col-left">149.6</td>
                          <td className="col-gap"></td>
                          <td className="col-right"></td>
                          <td className="col-right"></td>
                          <td className="col-right">1583.2</td>
                          <td className="col-right">{row.data.qty ?? ""}</td>
                          <td className="col-right">1583.2</td>
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
                    <td className="tfoot-value col-left">3433.1</td>
                    <td className="col-gap"></td>
                    <td colspan={4} className="tfoot-title col-right">
                      <span className="tracking-[0.05em] jp">水平力 </span>
                      Pmax'=
                    </td>
                    <td colspan={1} className="tfoot-value col-right">
                      7363.6
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      ),
    });

    // c14 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c14-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 2) 風時曲げモーメント (Bending Moment due to Wind) */}
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
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mw' =</span>
              <span className="mr-[8px]">
                Mw1<span className="ml-1.5">=</span>
              </span>
              <span>2491.8</span>
              <span className="ml-1.5">N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c15 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c15-${suffix}`,
      node: (
        <section className="pt-[15px]">
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
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mp' =</span>
              <span className="mr-[8px]">
                PA・<span className="jp">(</span>H2/2+H3
                <span className="jp">)</span>+PB・H1/2
                <span className="ml-1.5">=</span>
              </span>
              <span>30111.7</span>
              <span className="ml-1.5">N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c16 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c16-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 4) 風時曲げモーメント (Bending Moment due to Wind) */}
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
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mmax' =</span>
              <span className="mr-[8px]">
                <span className="jp">{"{("}</span>Mp' / 2<sup>0.5</sup>+Mw'
                <span className="jp">)</span>
                <sup>2</sup>
                <span className="mx-1">+</span>
                <span className="jp">(</span>Mp' / 2<sup>0.5</sup>
                <span className="jp">)</span>
                <sup>2</sup>
                <span className="jp">{"}"}</span>
                <sup>0.5</sup>
                <span className="ml-1.5">=</span>
              </span>
              <span>31922.3</span>
              <span className="ml-1.5">N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c17 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c17-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 5) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                5<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                回転モーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">Mt' =</span>
              <span className="mr-[8px]">
                Mp1 / 2<span className="ml-1.5">=</span>
              </span>
              <span>5596.4</span>
              <span className="ml-1.5">N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c18 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c18-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 5) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                6<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                許容圧縮応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">fc =</span>
              <span className="mx-1.5">=</span>
              <span>11192.7</span>
              <span className="ml-1.5">N・m</span>
            </div>
          </div>
        </section>
      ),
    });

    // c19 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c19-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 2) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                7<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                圧縮応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">σ c =</span>
              <span className="mr-[8px]">
                N/A<span className="ml-1.5">=</span>
              </span>
              <span>0.89</span>
              <span className="ml-1.5">
                N/mm<sup>2</sup>
              </span>
            </div>
          </div>
        </section>
      ),
    });

    // c20 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c20-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 2) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                8<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                曲げ応力度
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">c σ b =</span>
              <span className="mr-[8px]">
                Mmax'/Z<span className="ml-1.5">=</span>
              </span>
              <span>162.4</span>
              <span className="ml-1.5">
                N/mm<sup>2</sup>
              </span>
            </div>
          </div>
        </section>
      ),
    });

    // c21 = 曲げ応力度 (Bending Stress)
    blocks.push({
      id: `c21-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 3) 曲げ応力度 (Bending Stress) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">9).</span>
              <span className="page1-text tracking-[0.05em] jp">
                組み合わせ応力度
              </span>
            </div>

            {/* Bending stress calculation */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px] tracking-[0.05em]">σ =</span>
              <span className="mr-[8px]">σ c+c σ b =</span>
              <span>
                163.3 N/mm<sup>2</sup>
              </span>
            </div>

            {/* Checking the ratio to allowable stress */}
            <div className="ml-[68px] leading-none inline-block">
              <div className="inline-block">
                <div className="flex items-center whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-2.5">
                      σ c
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">fc・1.5</div>
                  </div>
                  <div className="mx-2">+</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] px-1.5">
                      c σ b
                    </div>
                    <div className="mt-[3px]">sfb</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-2.5">
                      0.89
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">53.3</div>
                  </div>
                  <div className="mx-2">+</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] px-1.5">
                      162.4
                    </div>
                    <div className="mt-[3px]">235</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex items-center">
                    <span>0.708</span>
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

    // c22 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c22-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 2) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                10<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                ねじりせん断応力度
              </span>
              <span className="ml-[20px]">Ip :</span>
              <span className="ml-1 jp">断面極二次モーメント</span>
              <span className="mx-1">=</span>
              <span>2・I</span>
              <span className="mx-1">=</span>
              <span>
                4252.10 cm<sup>4</sup>
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px]">τ =</span>
              <span className="mr-[8px]">
                Mt' / Ip・<span className="jp">φ</span>/ 2
                <span className="ml-1.5">=</span>
              </span>
              <span>14.2</span>
              <span className="ml-1.5">
                N/mm<sup>2</sup>
              </span>
            </div>
          </div>
        </section>
      ),
    });

    // c23 = 曲げ応力度 (Bending Stress)
    blocks.push({
      id: `c23-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 3) 曲げ応力度 (Bending Stress) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">11).</span>
              <span className="page1-text tracking-[0.05em] jp">
                最大せん断応力度
              </span>
            </div>

            {/* Bending stress calculation */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px] tracking-[0.05em]">τ max =</span>
              <span className="mr-[8px]">
                <span className="jp">(</span>σ<sup>2</sup>+4・τ<sup>2</sup>
                <span className="jp">)</span>
                <sup>0.5</sup>/2<span className="mx-1">=</span>
              </span>
              <span>
                82.9 N/mm<sup>2</sup>
              </span>
            </div>

            {/* Checking the ratio to allowable stress */}
            <div className="ml-[68px] leading-none inline-block">
              <div className="inline-block">
                <div className="flex items-center whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-1.5">
                      τ max
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">sfs</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-2">
                      82.9
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">135</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex items-center">
                    <span>0.614</span>
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

    // c24 = 曲げ応力度 (Bending Stress)
    blocks.push({
      id: `c24-${suffix}`,
      node: (
        <section className="pt-[15px]">
          {/* Sub-section: 3) 曲げ応力度 (Bending Stress) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">12).</span>
              <span className="page1-text tracking-[0.05em] jp">
                最大合成応力度
              </span>
            </div>

            {/* Bending stress calculation */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px] tracking-[0.05em]">σ max =</span>
              <span className="mr-[8px]">
                σ / 2 + τ max<span className="mx-1">=</span>
              </span>
              <span>
                164.5<span className="ml-1.5"></span>N/mm<sup>2</sup>
              </span>
            </div>

            {/* Checking the ratio to allowable stress */}
            <div className="ml-[68px] leading-none inline-block">
              <div className="inline-block">
                <div className="flex items-center whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-1.5">
                      σ max
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">sfb</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-2">
                      164.5
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">235</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex items-center">
                    <span>0.700</span>
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

  // c25 = 基礎部に加わる応力 (Stress applied to the foundation)
  blocks.push({
    id: "25",
    node: (
      <section className="pt-[15px]">
        {/* Main-section: 基礎部に加わる応力 (Stress applied to the foundation) */}
        <h2 className="page1-title">
          <span className="page1-number">6.</span>
          <span className="page1-text tracking-[0.05em] jp">
            基礎部に加わる応力
          </span>
        </h2>
        <div className="ml-[22px] flex justify-start gap-x-[20px]">
          <div className="flex flex-col">
            <div className="flex justify-start mb-0">
              <span className="page1-number">
                1<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">直風時</span>
            </div>
            <div className="flex justify-start ml-[22px]">
              <div className="flex flex-col mb-0 mr-[20px]">
                <div className="page1-text tracking-[0.05em] jp">・鉛直力</div>
                <div className="page1-text tracking-[0.05em] jp">・水平力</div>
                <div className="page1-text tracking-[0.05em] jp">
                  ・曲げモーメント
                </div>
                <div className="page1-text tracking-[0.05em] jp">
                  ・回転モーメント
                </div>
              </div>
              <div className="flex flex-col mb-0 mr-1">
                <div className="page1-text">N</div>
                <div className="page1-text">P</div>
                <div className="page1-text">M</div>
                <div className="page1-text">Mt</div>
              </div>
              <div className="flex flex-col mb-0 mr-1">
                <div className="page1-text">=</div>
                <div className="page1-text">=</div>
                <div className="page1-text">=</div>
                <div className="page1-text">=</div>
              </div>
              <div className="flex flex-col mb-0">
                <div className="page1-text">
                  3433.1<span className="ml-1.5">N</span>
                </div>
                <div className="page1-text">
                  7363.6<span className="ml-1.5">N</span>
                </div>
                <div className="page1-text">
                  40431.2<span className="ml-1.5">N・m</span>
                </div>
                <div className="page1-text">
                  11192.7<span className="ml-1.5">N・m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-start mb-0">
              <span className="page1-number">
                2<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                斜風時(軸方向に置換)
              </span>
            </div>
            <div className="flex justify-start ml-[22px]">
              <div className="flex flex-col mb-0 mr-[20px]">
                <div className="page1-text tracking-[0.05em] jp">・鉛直力</div>
                <div className="page1-text tracking-[0.05em] jp">・水平力</div>
                <div className="page1-text tracking-[0.05em] jp">
                  ・曲げモーメント
                </div>
                <div className="page1-text tracking-[0.05em] jp">
                  ・回転モーメント
                </div>
              </div>
              <div className="flex flex-col mb-0 mr-1">
                <div className="page1-text">N</div>
                <div className="page1-text">P</div>
                <div className="page1-text">M</div>
                <div className="page1-text">Mt</div>
              </div>
              <div className="flex flex-col mb-0 mr-1">
                <div className="page1-text">=</div>
                <div className="page1-text">=</div>
                <div className="page1-text">=</div>
                <div className="page1-text">=</div>
              </div>
              <div className="flex flex-col mb-0">
                <div className="page1-text">
                  3433.1<span className="ml-1.5">N</span>
                </div>
                <div className="flex justify-start">
                  <div className="flex flex-col mb-0 mr-1 tracking-[0.05em]">
                    <div className="page1-text">
                      Pmax'/2<sup>0.5</sup>
                    </div>
                    <div className="page1-text">
                      Mp'/2<sup>0.5</sup>+Mw'
                    </div>
                  </div>
                  <div className="flex flex-col mb-0  mr-1">
                    <div className="page1-text">=</div>
                    <div className="page1-text">=</div>
                  </div>
                  <div className="flex flex-col mb-0">
                    <div className="page1-text">
                      4009.7<span className="ml-1.5">N</span>
                    </div>
                    <div className="page1-text">
                      23784.0<span className="ml-1.5">N・m</span>
                    </div>
                  </div>
                </div>
                <div className="page1-text">
                  5596.4<span className="ml-1.5">N・m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  });

  return blocks;
};
