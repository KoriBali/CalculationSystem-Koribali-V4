import React from "react";
import {
  formatDateYP,
  getDesignStandardTextMultiple,
} from "../../../utils/reportFormatters";
import "../../../styles/report.css";

export default function MultipleReportContent({
  cover = {},
  condition = {},
  results = [],
  pages = [],
}) {
  return (
    <>
      {/* ================================= COVER PAGE ================================= */}
      <div className="page-preview">
        <div className="page-a4 page-cover">
          <div className="page-content page-content-border cover-border">
            {/* Header cover: management mark & calculation number */}
            <div className="flex justify-between">
              <p className="cover-row-1 ml-[10px] tracking-[0.05em]">
                <span className="jp">管理記号:</span>
                <span> {cover?.managementCode ?? ""}</span>
              </p>
              <div className="cover-row-1 mr-[10px] flex justify-center items-center">
                <span className="tracking-[0.05em] jp">計算書番号:</span>
                <span> {cover?.calculationNumber ?? ""}</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="cover-row-2 ml-[10px] jp">殿</div>

            {/* Main title */}
            <h1 className="cover-title text-center jp">強 度 計 算 書</h1>

            {/* Project information block */}
            <div className="cover-double-line-mpl">
              <p className="cover-inner-text cover-inner-text-line text-center py-[7px] jp">
                {cover?.projectName ?? ""}
              </p>
              <p
                className={`cover-inner-text cover-inner-text-line text-center jp ${
                  !cover?.coverTopText ? "py-[19px]" : "py-[7px]"
                }`}
              >
                {cover?.coverTopText ?? ""}
              </p>
              <p
                className={`cover-inner-text text-center jp py-[7px] ${
                  !cover?.coverBottomText ? "mb-[24px]" : ""
                }`}
              >
                {cover?.coverBottomText ?? ""}
              </p>
            </div>

            {/* Date & logo */}
            <div className="cover-row-3 text-center jp">
              {cover?.date ? formatDateYP(cover.date) : ""}
            </div>
            <img
              src="/images/ys-logo.png"
              alt="logo YS"
              className="mx-auto w-[300px] h-auto mt-[30px]"
            />
          </div>
        </div>
      </div>

      {/* =================================== PAGE 1 =================================== */}
      <div className="page-preview">
        <div className="page-a4">
          <div className="page-header">
            No. {cover?.calculationNumber ?? ""} P-1
          </div>

          <div className="page1-content">
            {/* 1. Calculation conditions */}
            <h2 className="page1-title">
              <span className="page1-number">1.</span>
              <span className="page1-text tracking-[0.05em] jp">計算条件</span>
            </h2>

            {/* 1) Design standard */}
            <div className="page1-item">
              <span className="page1-number">
                1<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">設計基準</span>
              <span className="page1-text tracking-[0.05em] jp ml-[8px] mr-[8px]">
                :
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                {getDesignStandardTextMultiple(condition?.designStandard)}
              </span>
            </div>

            {/* 2) Wind speed */}
            <div className="page1-item">
              <span className="page1-number">
                2<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">設計風速</span>
              <span className="page1-text tracking-[0.05em] jp ml-[8px] mr-[8px]">
                :
              </span>
              <span className="page1-text">
                V = {condition?.designWindSpeed ?? ""} m/s
              </span>
            </div>

            {/* 3) Wind load calculation */}
            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">
                  3<span className="jp">)</span>.
                </span>
                <span className="page1-text tracking-[0.05em] jp">風荷重</span>
                <span className="page1-text tracking-[0.05em] jp ml-[22.8px] mr-[8px]">
                  :
                </span>
                <span className="page1-text">
                  P = q・C・A <span className="jp">(</span>N
                  <span className="jp">)</span>
                </span>
              </div>

              <div className="flex ml-[44px] tracking-[0.05em] jp">ここで</div>

              <div className="flex ml-[68px] flex-col">
                <div className="flex justify-start">
                  <span>q:</span>
                  <span className="jp tracking-[0.05em] ml-[6px]">速度圧</span>
                  <span className="mr-[22px]">
                    <span className="jp">(</span>N/m<sup>2</sup>
                    <span className="jp">)</span>
                  </span>
                  <span className="jp tracking-[0.05em] mr-[3px]">
                    空気密度
                  </span>
                  <span>
                    ρ = {condition?.designAirDensity ?? ""} N・sec<sup>2</sup>/m
                    <sup>4</sup>
                  </span>
                </div>
                <div className="ml-[19px]">
                  q = 1/2・ρ・V<sup>2</sup> = 2214.0 N/m<sup>2</sup>
                </div>

                <div className="flex justify-start">
                  <span>C:</span>
                  <span className="jp tracking-[0.05em] ml-[4px]">
                    風力係数
                  </span>
                </div>
                <div className="flex justify-start ml-[19px]">
                  <span className="jp tracking-[0.05em] mr-[2px]">○鋼管:</span>
                  <span className="mr-9">0.7</span>
                  {/* <span className="jp tracking-[0.05em] mr-[2px]">灯具:</span>
                  <span>1.0</span> */}
                </div>

                <div className="flex justify-start">
                  <span>A:</span>
                  <span className="jp tracking-[0.05em] ml-[4px]">
                    受風圧面積
                  </span>
                  <span>
                    <span className="jp">(</span>m<sup>2</sup>
                    <span className="jp">)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 4) Allowable stress */}
            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">
                  4<span className="jp">)</span>.
                </span>
                <span className="page1-text jp tracking-[0.05em]">
                  短期許容応力度
                </span>
                <span className="page1-text">
                  <span className="jp">(</span>SS400, STK400, STKR400
                  <span className="jp">)</span>
                </span>
              </div>
              <div className="flex ml-[44px]">
                <div className="jp flex flex-col">
                  <div>曲げ</div>
                  <div>剪断</div>
                </div>
                <div className="flex flex-col mx-1">
                  <div>:</div>
                  <div>:</div>
                </div>
                <div className="flex flex-col">
                  <div>sfb</div>
                  <div>sfs</div>
                </div>
                <div className="flex flex-col mx-1">
                  <div>=</div>
                  <div>=</div>
                </div>
                <div className="flex flex-col">
                  <div>
                    235 N/mm<sup>2</sup>
                  </div>
                  <div>
                    135 N/mm<sup>2</sup>
                  </div>
                </div>
              </div>
            </div>

            {/* 5) Pole specification */}
            <div className="flex flex-col">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">
                  5<span className="jp">)</span>.
                </span>
                <span className="page1-text jp tracking-[0.05em]">
                  支持柱の仕様
                </span>
              </div>

              <div className="ml-[44px]">
                {results?.map((r, index) => (
                  <React.Fragment key={index}>
                    <div className="flex">
                      <span className="mr-1 jp tracking-[0.05em]">
                        {r?.name ?? ""}:
                      </span>
                      <span className="tracking-[0.05em]">
                        <span className="jp">t</span>
                        {r?.lowerThickness?.toFixed(1) ?? ""}
                      </span>
                      <span className="ml-1 tracking-[0.05em]">
                        1/100<span className="jp">テーパー柱</span>
                      </span>
                    </div>
                    <div className="flex">
                      <span className="mr-1 jp tracking-[0.05em]">検討部:</span>
                      <span className="tracking-[0.05em]">
                        <span className="jp">φ</span>
                        {r?.lowerDiameter?.toFixed(1) ?? ""}
                      </span>
                      <span className="text-[10.5pt] mx-[2px]">×</span>
                      <span className="tracking-[0.05em]">
                        <span className="jp">t</span>
                        {r?.lowerThickness?.toFixed(1) ?? ""}
                      </span>
                      <span className="ml-1">
                        <span className="jp">(</span>
                        {r?.material ?? ""}
                        <span className="jp">)</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2  ml-[22px] mb-[20px] w-[45%]">
                      <div className="flex flex-col">
                        <div className="flex justify-start">
                          <div className="flex flex-col mr-1">
                            <div>A</div>
                            <div>I</div>
                            <div>i</div>
                          </div>
                          <div className="flex flex-col mr-1">
                            <div className="page1-text">=</div>
                            <div className="page1-text">=</div>
                            <div className="page1-text">=</div>
                          </div>
                          <div className="flex flex-col">
                            <div className="tracking-[0.05em]">
                              {r?.crossSectionArea?.toFixed(2) ?? ""} cm
                              <sup>2</sup>
                            </div>
                            <div className="tracking-[0.05em]">
                              {r?.momentInertia?.toFixed(2) ?? ""} cm
                              <sup>4</sup>
                            </div>
                            <div className="tracking-[0.05em]">
                              {r?.radiusGyration?.toFixed(2) ?? ""} cm
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex justify-start">
                          <div className="flex flex-col mr-1">
                            <div>Z</div>
                          </div>
                          <div className="flex flex-col mr-1">
                            <div className="page1-text">=</div>
                          </div>
                          <div className="flex flex-col">
                            <div className="tracking-[0.05em]">
                              {r?.sectionModulus?.toFixed(2) ?? ""} cm
                              <sup>3</sup>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <h2 className="page1-title mt-[20px]">
              <span className="page1-number">2.</span>
              <span className="page1-text tracking-[0.05em] jp">仕様略図</span>
            </h2>

            <div className="flex justify-start ml-[44px] jp">次頁。</div>
          </div>
        </div>
      </div>

      {/* =================================== PAGE 2 =================================== */}
      <div className="page-preview">
        <div className="page-a4">
          <div className="page-header">
            No. {cover?.calculationNumber ?? ""} P-2
          </div>

          <div className="page1-content">
            <h2 className="page1-title">
              <span className="page1-number">3.</span>
              <span className="page1-text tracking-[0.05em] jp">
                各ア－ムの検討
              </span>
            </h2>

            <div className="flex flex-col">
              {/* Sub-section: 1) 荷重計算 (Load calculation) */}
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">
                  1<span className="jp">)</span>.
                </span>
                <span className="page1-text tracking-[0.05em] jp">
                  歩行者信号アーム1
                </span>
                <span className="page1-text ml-[22px] jp">φ</span>
                <span className="page1-text">48.6</span>
                <span className="page1-text px-[2px] text-[10.5pt]">×</span>
                <span className="page1-text jp">t</span>
                <span className="page1-text">2.3</span>
                <span className="jp ml-1.5">(</span>
                <span className="page1-text">STK400</span>
                <span className="jp">)</span>
                <span className="page1-text ml-1.5">
                  Z = 3.70
                  <span className="ml-1">
                    cm<sup>3</sup>
                  </span>
                </span>
              </div>

              <div className="ml-[4px]">
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
                        個 数
                      </th>
                      <th className="col-left" rowspan={1}>
                        重 量
                      </th>
                      <th className="col-gap"></th>
                      <th className="col-right" colspan={1}>
                        受風圧面積
                      </th>
                      <th className="col-right" colspan={1}>
                        風力係数
                      </th>
                      <th className="col-right" colspan={1}>
                        単位風荷重
                      </th>
                      <th className="col-right" colspan={1}>
                        個 数
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
                      <td className="col-num">No.1</td>
                      <td className="col-1 tracking-[0.05em] jp">アーム</td>
                      <td className="col-left">15.5</td>
                      <td className="col-left">2</td>
                      <td className="col-left">31.0</td>
                      <td className="col-gap"></td>
                      <td className="col-right">0.029</td>
                      <td className="col-right">0.7</td>
                      <td className="col-right">44.9</td>
                      <td className="col-right">2</td>
                      <td className="col-right">89.8</td>
                    </tr>
                    <tr>
                      <td className="col-num">No.2</td>
                      <td className="col-1 tracking-[0.05em] jp">歩行者信号</td>
                      <td className="col-left">196.1</td>
                      <td className="col-left">1</td>
                      <td className="col-left">196.1</td>
                      <td className="col-gap"></td>
                      <td className="col-right">0.266</td>
                      <td className="col-right">1.2</td>
                      <td className="col-right">706.7</td>
                      <td className="col-right">1</td>
                      <td className="col-right">706.7</td>
                    </tr>
                  </tbody>

                  {/* Total N(vertical force) dan Pmax(horizontal force) */}
                  <tfoot>
                    <tr>
                      <td className="col-num"></td>
                      <td className="col-1-tf"></td>
                      <td colspan={2} className="tfoot-title col-left">
                        <span className="tracking-[0.05em] jp">鉛直力 </span>N1=
                      </td>
                      <td className="tfoot-value col-left">227.1</td>
                      <td className="col-gap"></td>
                      <td colspan={4} className="tfoot-title col-right">
                        <span className="tracking-[0.05em] jp">水平力 </span>
                        Pmax1=
                      </td>
                      <td colspan={1} className="tfoot-value col-right">
                        796.5
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[44px] mb-0">
                <span className="page1-number">a.</span>
                <span className="page1-text tracking-[0.05em] jp">
                  固定時曲げモーメント
                </span>
              </div>

              {/* Moment formula */}
              <div className="flex justify-start ml-[66px]">
                <span>Mw1 =</span>
                <span className="mx-1 tracking-[0.05em]">
                  2・W1・L1/2<span className="mx-1">+</span>W2・L1
                  <span className="ml-1">=</span>
                </span>
                <span>127.0</span>
                <span className="ml-1">N・m</span>
              </div>
            </div>

            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[44px] mb-0">
                <span className="page1-number">b.</span>
                <span className="page1-text tracking-[0.05em] jp">
                  風時曲げモーメント
                </span>
              </div>

              {/* Moment formula */}
              <div className="flex justify-start ml-[66px]">
                <span>Mp1 =</span>
                <span className="mx-1 tracking-[0.05em]">
                  2・P1・L1/2<span className="mx-1">+</span>P2・L1
                  <span className="ml-1">=</span>
                </span>
                <span>451.0</span>
                <span className="ml-1">N・m</span>
              </div>
            </div>

            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[44px] mb-0">
                <span className="page1-number">c.</span>
                <span className="page1-text tracking-[0.05em] jp">
                  合成曲げモーメント
                </span>
              </div>

              {/* Moment formula */}
              <div className="flex justify-start ml-[66px]">
                <span>Mmax =</span>
                <span className="mx-1 tracking-[0.05em]">
                  <span className="jp">(</span>Mw1<sup>2</sup>
                  <span className="mx-1">+</span>Mp1<sup>2</sup>
                  <span className="jp">)</span>
                  <sup>0.5</sup>
                  <span className="ml-1">=</span>
                </span>
                <span>468.5</span>
                <span className="ml-1">N・m</span>
              </div>
            </div>

            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[44px] mb-0">
                <span className="page1-number">d.</span>
                <span className="page1-text tracking-[0.05em] jp">
                  強度判定
                </span>
              </div>

              {/* Moment formula */}
              <div className="ml-[66px]">
                <div className="inline-block">
                  <div className="flex justify-start whitespace-nowrap pr-4">
                    <span className="tracking-[0.05em]">cσb =</span>
                    <span className="mx-1 tracking-[0.05em]">
                      Mmax/<span className="jp">(</span>Z・2
                      <span className="jp">)</span>
                      <span className="ml-1">=</span>
                    </span>
                    <span>63.3</span>
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

            {/* 2) */}
            <div className="flex flex-col">
              {/* Sub-section: 1) 荷重計算 (Load calculation) */}
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">
                  2<span className="jp">)</span>.
                </span>
                <span className="page1-text tracking-[0.05em] jp">
                  歩行者信号アーム2
                </span>
                <span className="page1-text ml-[22px] jp">φ</span>
                <span className="page1-text">48.6</span>
                <span className="page1-text px-[2px] text-[10.5pt]">×</span>
                <span className="page1-text jp">t</span>
                <span className="page1-text">2.3</span>
                <span className="jp ml-1.5">(</span>
                <span className="page1-text">STK400</span>
                <span className="jp">)</span>
                <span className="page1-text ml-1.5">
                  Z = 3.70
                  <span className="ml-1">
                    cm<sup>3</sup>
                  </span>
                </span>
              </div>

              <div className="ml-[4px]">
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
                        個 数
                      </th>
                      <th className="col-left" rowspan={1}>
                        重 量
                      </th>
                      <th className="col-gap"></th>
                      <th className="col-right" colspan={1}>
                        受風圧面積
                      </th>
                      <th className="col-right" colspan={1}>
                        風力係数
                      </th>
                      <th className="col-right" colspan={1}>
                        単位風荷重
                      </th>
                      <th className="col-right" colspan={1}>
                        個 数
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
                      <td className="col-num">No.1</td>
                      <td className="col-1 tracking-[0.05em] jp">アーム</td>
                      <td className="col-left">15.5</td>
                      <td className="col-left">2</td>
                      <td className="col-left">31.0</td>
                      <td className="col-gap"></td>
                      <td className="col-right">0.029</td>
                      <td className="col-right">0.7</td>
                      <td className="col-right">44.9</td>
                      <td className="col-right">2</td>
                      <td className="col-right">89.8</td>
                    </tr>
                    <tr>
                      <td className="col-num">No.2</td>
                      <td className="col-1 tracking-[0.05em] jp">歩行者信号</td>
                      <td className="col-left">196.1</td>
                      <td className="col-left">1</td>
                      <td className="col-left">196.1</td>
                      <td className="col-gap"></td>
                      <td className="col-right">0.266</td>
                      <td className="col-right">1.2</td>
                      <td className="col-right">706.7</td>
                      <td className="col-right">1</td>
                      <td className="col-right">706.7</td>
                    </tr>
                  </tbody>

                  {/* Total N(vertical force) dan Pmax(horizontal force) */}
                  <tfoot>
                    <tr>
                      <td className="col-num"></td>
                      <td className="col-1-tf"></td>
                      <td colspan={2} className="tfoot-title col-left">
                        <span className="tracking-[0.05em] jp">鉛直力 </span>N2=
                      </td>
                      <td className="tfoot-value col-left">227.1</td>
                      <td className="col-gap"></td>
                      <td colspan={4} className="tfoot-title col-right">
                        <span className="tracking-[0.05em] jp">水平力 </span>
                        Pmax2=
                      </td>
                      <td colspan={1} className="tfoot-value col-right">
                        796.5
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[44px] mb-0">
                <span className="page1-number">a.</span>
                <span className="page1-text tracking-[0.05em] jp">
                  固定時曲げモーメント
                </span>
              </div>

              {/* Moment formula */}
              <div className="flex justify-start ml-[66px]">
                <span>Mw2 =</span>
                <span className="mx-1 tracking-[0.05em]">
                  2・W1・L2/2<span className="mx-1">+</span>W2・L2
                  <span className="ml-1">=</span>
                </span>
                <span>127.0</span>
                <span className="ml-1">N・m</span>
              </div>
            </div>

            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[44px] mb-0">
                <span className="page1-number">b.</span>
                <span className="page1-text tracking-[0.05em] jp">
                  風時曲げモーメント
                </span>
              </div>

              {/* Moment formula */}
              <div className="flex justify-start ml-[66px]">
                <span>Mp2 =</span>
                <span className="mx-1 tracking-[0.05em]">
                  2・P1・L2/2<span className="mx-1">+</span>P2・L2
                  <span className="ml-1">=</span>
                </span>
                <span>451.0</span>
                <span className="ml-1">N・m</span>
              </div>
            </div>

            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[44px] mb-0">
                <span className="page1-number">c.</span>
                <span className="page1-text tracking-[0.05em] jp">
                  合成曲げモーメント
                </span>
              </div>

              {/* Moment formula */}
              <div className="flex justify-start ml-[66px]">
                <span>Mmax =</span>
                <span className="mx-1 tracking-[0.05em]">
                  <span className="jp">(</span>Mw2<sup>2</sup>
                  <span className="mx-1">+</span>Mp2<sup>2</sup>
                  <span className="jp">)</span>
                  <sup>0.5</sup>
                  <span className="ml-1">=</span>
                </span>
                <span>468.5</span>
                <span className="ml-1">N・m</span>
              </div>
            </div>

            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[44px] mb-0">
                <span className="page1-number">d.</span>
                <span className="page1-text tracking-[0.05em] jp">
                  強度判定
                </span>
              </div>

              {/* Moment formula */}
              <div className="ml-[66px]">
                <div className="inline-block">
                  <div className="flex justify-start whitespace-nowrap pr-4">
                    <span className="tracking-[0.05em]">cσb =</span>
                    <span className="mx-1 tracking-[0.05em]">
                      Mmax/<span className="jp">(</span>Z・2
                      <span className="jp">)</span>
                      <span className="ml-1">=</span>
                    </span>
                    <span>63.3</span>
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
          </div>
        </div>
      </div>

      {/* =================================== PAGE ++ =================================== */}
      {pages?.map((pageBlocks, i) => (
        <div className="page-preview" key={i}>
          <div className="page-a4">
            <div className="page-header">
              No. {cover?.calculationNumber ?? ""} P-{i + 3}
            </div>
            <div className="page1-content">{pageBlocks}</div>
          </div>
        </div>
      ))}
    </>
  );
}
