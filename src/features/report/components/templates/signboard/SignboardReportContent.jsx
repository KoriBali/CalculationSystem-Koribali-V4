import React from "react";
import { formatJpYp } from "../../../utils/report-handlers/textFormatter";
import "../../../styles/report.css";

export default function SignboardReportContent({
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
                <span> {cover?.managementMark || ""}</span>
              </p>
              <div className="cover-row-1 mr-[10px] flex justify-center items-center">
                <span className="tracking-[0.05em] jp">計算書番号:</span>
                <span> {cover?.calculationNumber || ""}</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="cover-row-2-sb ml-[10px] jp">殿</div>

            {/* Main title */}
            <h1 className="cover-title text-center jp">強 度 計 算 書</h1>

            {/* Project information block */}
            <div className="cover-double-line-sb">
              <p className="cover-inner-text cover-inner-text-line text-center py-[7px] jp">
                {cover?.projectName || ""}
              </p>
              <p
                className={`cover-inner-text cover-inner-text-line text-center jp ${
                  !cover?.contentr2 ? "py-[19px]" : "py-[7px]"
                }`}
              >
                {cover?.contentr2 || ""}
              </p>
              <p
                className={`cover-inner-text text-center jp py-[7px] ${
                  !cover?.contentr3 ? "mb-[24px]" : ""
                }`}
              >
                {cover?.contentr3 || ""}
              </p>
            </div>

            {/* Date & logo */}
            <div className="cover-row-3 text-center jp">
              {cover?.date ? formatJpYp(cover.date) : ""}
            </div>
            <br />
            <br />
            <img
              src="/images/yp-logo.jpg"
              alt="logo YP"
              className="mx-auto w-[300px] h-auto"
            />
          </div>
        </div>
      </div>

      {/* =================================== PAGE 1 =================================== */}
      <div className="page-preview">
        <div className="page-a4">
          <div className="page-header">
            No. {cover?.calculationNumber || ""} P-1
          </div>

          <div className="page1-content">
            {/* 1. Calculation conditions */}
            <h2 className="page1-title">
              <span className="page1-number">1.</span>
              <span className="page1-text tracking-[0.05em] jp">計算条件</span>
            </h2>

            {/* 1) Design standard */}
            <div className="page1-item-sb">
              <span className="page1-number">
                1<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">設計基準</span>
              <span className="page1-text tracking-[0.05em] jp ml-[8px] mr-[8px]">
                :
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                道路標識設置基準・同解説
              </span>
            </div>

            {/* 2) Wind speed */}
            <div className="page1-item-sb">
              <span className="page1-number">
                2<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">設計風速</span>
              <span className="page1-text tracking-[0.05em] jp ml-[8px] mr-[8px]">
                :
              </span>
              <span className="page1-text">
                V = {condition?.windSpeed || 0} m/s
              </span>
            </div>

            {/* 3) Wind load calculation */}
            <div className="flex flex-col mb-[15px]">
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
                  <span className="jp tracking-[0.05em] mr-[8px]">
                    空気密度
                  </span>
                  <span>
                    ρ = 1.23 N・sec<sup>2</sup>/m<sup>4</sup>
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
                  <span className="ml-1 mr-9">0.7</span>
                  <span className="jp tracking-[0.05em] mr-[2px]">表示板:</span>
                  <span>1.2</span>
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
            <div className="flex flex-col mb-[15px]">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">
                  4<span className="jp">)</span>.
                </span>
                <span className="page1-text jp tracking-[0.05em]">
                  固定荷重
                </span>
              </div>
              <div className="ml-[44px]">
                <div className="jp tracking-[0.05em]">
                  装柱物,支持柱を考慮する。
                </div>
                <div>
                  <span className="jp tracking-[0.05em]">
                    表示板単位面積当り質量
                  </span>
                  <span className="ml-4">
                    w= 20 kg/m<sup>2</sup>
                  </span>
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
                  許容応力度
                </span>
              </div>

              <div className="flex flex-col ml-[44px] w-[70%]">
                <div className="jp tracking-[0.05em] text-center">
                  鋼材の許容応力度
                </div>
                <table className="border border-black border-collapse">
                  <thead>
                    <tr>
                      <th
                        className="border tracking-[0.05em] border-black text-center align-middle font-normal jp w-[40%]"
                        colSpan={3}
                        rowSpan={2}
                      >
                        材質
                      </th>
                      <th
                        className="border tracking-[0.05em] border-black text-center align-middle font-normal"
                        colSpan={3}
                      >
                        <span className="jp">短期許容応力度(</span>N/mm
                        <sup>2</sup>
                        <span className="jp">)</span>
                      </th>
                    </tr>
                    <tr>
                      <th className="border tracking-[0.05em] border-black text-center align-middle font-normal">
                        <span className="jp">引張(</span>sft
                        <span className="jp">)</span>
                      </th>
                      <th className="border tracking-[0.05em] border-black text-center align-middle font-normal">
                        <span className="jp">曲げ(</span>sfb
                        <span className="jp">)</span>
                      </th>
                      <th className="border tracking-[0.05em] border-black text-center align-middle font-normal">
                        <span className="jp">せん断(</span>sfs
                        <span className="jp">)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        className="border tracking-[0.05em] text-center align-middle px-2 border-black jp"
                        rowSpan={4}
                      >
                        材料
                      </td>
                      <td
                        className="border tracking-[0.05em] text-center align-middle px-2 border-black"
                        colSpan={2}
                      >
                        SS400,STK400
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        235
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        235
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        135
                      </td>
                    </tr>
                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black jp">
                        ボルト
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        SS400
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        180
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        105
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="border tracking-[0.05em] text-center align-middle px-2 border-black jp"
                        rowSpan={2}
                      >
                        高力ボルト
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        F8T
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        375
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        180
                      </td>
                    </tr>
                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        F10T
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        465
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        225
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================== PAGE 2 =================================== */}
      <div className="page-preview">
        <div className="page-a4">
          <div className="page-header">
            No. {cover?.calculationNumber || ""} P-2
          </div>

          <div className="page1-content">
            <h2 className="page1-title">
              <span className="page1-number">2.</span>
              <span className="page1-text tracking-[0.05em] jp">仕様略図</span>
            </h2>
            <div className="ml-[44px] flex flex-col">
              {results?.map((r, index) => (
                <React.Fragment key={index}>
                  <div className="flex gap-x-[20px]">
                    <div className="jp tracking-[0.05em]">
                      ・{r?.description ?? ""}
                    </div>
                    <div className="flex">
                      <span className="jp">φ</span>
                      <span className="tracking-[0.05em]">
                        {r?.diaLower?.toFixed(1) ?? ""}
                      </span>
                      <span className="text-[10.5pt] mx-[1.5px]">×</span>
                      <span className="tracking-[0.05em]">
                        t{r?.thickLower?.toFixed(1) ?? ""}
                      </span>
                    </div>
                    <div className="flex">{r?.material ?? ""}</div>
                  </div>
                  <div className="ml-[22px] flex gap-x-[20px] mb-[15px]">
                    <div className="flex flex-col">
                      <div className="flex justify-start">
                        <div className="flex flex-col mr-1">
                          <div>w</div>
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
                            {r?.flU?.toFixed(2) ?? ""} kg/m
                          </div>
                          <div className="tracking-[0.05em]">
                            {r?.InasMp?.toFixed(2) ?? ""} cm<sup>4</sup>
                          </div>
                          <div className="tracking-[0.05em]">
                            {r?.RadGy?.toFixed(2) ?? ""} cm
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-start">
                        <div className="flex flex-col mr-1">
                          <div>A</div>
                          <div>Z</div>
                        </div>
                        <div className="flex flex-col mr-1">
                          <div className="page1-text">=</div>
                          <div className="page1-text">=</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="tracking-[0.05em]">
                            {r?.CrossAp?.toFixed(2) ?? ""} cm<sup>2</sup>
                          </div>
                          <div className="tracking-[0.05em]">
                            {r?.SecMdl?.toFixed(2) ?? ""} cm<sup>3</sup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}

              <div className="flex gap-x-[20px]">
                <div className="jp tracking-[0.05em]">・梁材</div>
                <div className="flex">
                  <span className="jp">φ</span>
                  <span className="tracking-[0.05em]">114.3</span>
                  <span className="text-[10.5pt] mx-[1.5px]">×</span>
                  <span className="tracking-[0.05em]">t4.5</span>
                </div>
                <div className="flex">STK400</div>
              </div>
              <div className="ml-[22px] flex gap-x-[20px] mb-[15px]">
                <div className="flex flex-col">
                  <div className="flex justify-start">
                    <div className="flex flex-col mr-1">
                      <div>w</div>
                      <div>I</div>
                      <div>i</div>
                    </div>
                    <div className="flex flex-col mr-1">
                      <div className="page1-text">=</div>
                      <div className="page1-text">=</div>
                      <div className="page1-text">=</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="tracking-[0.05em]">12.19 kg/m</div>
                      <div className="tracking-[0.05em]">
                        234.32 cm<sup>4</sup>
                      </div>
                      <div className="tracking-[0.05em]">3.89 cm</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-start">
                    <div className="flex flex-col mr-1">
                      <div>A</div>
                      <div>Z</div>
                    </div>
                    <div className="flex flex-col mr-1">
                      <div className="page1-text">=</div>
                      <div className="page1-text">=</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="tracking-[0.05em]">
                        15.52 cm<sup>2</sup>
                      </div>
                      <div className="tracking-[0.05em]">
                        41.00 cm<sup>3</sup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-x-[20px]">
                <div className="jp tracking-[0.05em]">・つなぎ材</div>
                <div className="flex">
                  <span className="jp">φ</span>
                  <span className="tracking-[0.05em]">89.1</span>
                  <span className="text-[10.5pt] mx-[1.5px]">×</span>
                  <span className="tracking-[0.05em]">t3.2</span>
                </div>
                <div className="flex">STK400</div>
              </div>
              <div className="ml-[22px] flex gap-x-[20px] mb-[15px]">
                <div className="flex flex-col">
                  <div className="flex justify-start">
                    <div className="flex flex-col mr-1">
                      <div>w</div>
                      <div>I</div>
                      <div>i</div>
                    </div>
                    <div className="flex flex-col mr-1">
                      <div className="page1-text">=</div>
                      <div className="page1-text">=</div>
                      <div className="page1-text">=</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="tracking-[0.05em]">6.78 kg/m</div>
                      <div className="tracking-[0.05em]">
                        79.76 cm<sup>4</sup>
                      </div>
                      <div className="tracking-[0.05em]">3.04 cm</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-start">
                    <div className="flex flex-col mr-1">
                      <div>A</div>
                      <div>Z</div>
                    </div>
                    <div className="flex flex-col mr-1">
                      <div className="page1-text">=</div>
                      <div className="page1-text">=</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="tracking-[0.05em]">
                        8.64 cm<sup>2</sup>
                      </div>
                      <div className="tracking-[0.05em]">
                        17.90 cm<sup>3</sup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================== PAGE 3 =================================== */}
      <div className="page-preview">
        <div className="page-a4">
          <div className="page-header">
            No. {cover?.calculationNumber || ""} P-3
          </div>

          <div className="page1-content">
            <h2 className="page1-title">
              <span className="page1-number">3.</span>
              <span className="page1-text tracking-[0.05em] jp">
                梁材の検討
              </span>
              <span className="page1-text ml-[18px] jp">φ</span>
              <span className="page1-text">114.3</span>
              <span className="page1-text px-[2px] text-[10.5pt]">×</span>
              <span className="page1-text">4.5</span>
              <span className="page1-text ml-[20px]">STK400</span>
              <span className="page1-text ml-[20px]">
                Z = 41.00
                <span className="ml-1.5">
                  cm<sup>3</sup>
                </span>
              </span>
            </h2>

            <div className="flex flex-col mb-[15px]">
              {/* Sub-section: 1) 荷重計算 (Load calculation) */}
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">
                  1<span className="jp">)</span>.
                </span>
                <span className="page1-text tracking-[0.05em] jp">
                  荷重計算
                </span>
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
                      <td className="col-num">1</td>
                      <td className="col-1 tracking-[0.05em] jp">表示板</td>
                      <td className="col-left">588.4</td>
                      <td className="col-left">1</td>
                      <td className="col-left">588.4</td>
                      <td className="col-gap"></td>
                      <td className="col-right">3.000</td>
                      <td className="col-right">1.2</td>
                      <td className="col-right">5535.0</td>
                      <td className="col-right">1</td>
                      <td className="col-right">5535.0</td>
                    </tr>
                    <tr>
                      <td className="col-num">2</td>
                      <td className="col-1 tracking-[0.05em] jp">つなぎ材</td>
                      <td className="col-left">59.8</td>
                      <td className="col-left">2</td>
                      <td className="col-left">119.6</td>
                      <td className="col-gap"></td>
                      <td className="col-right"></td>
                      <td className="col-right"></td>
                      <td className="col-right"></td>
                      <td className="col-right"></td>
                      <td className="col-right"></td>
                    </tr>
                    <tr>
                      <td className="col-num">3</td>
                      <td className="col-1 tracking-[0.05em] jp">梁材</td>
                      <td className="col-left">358.6</td>
                      <td className="col-left">2</td>
                      <td className="col-left">717.2</td>
                      <td className="col-gap"></td>
                      <td className="col-right">0.114</td>
                      <td className="col-right">0.7</td>
                      <td className="col-right">122.7</td>
                      <td className="col-right">2</td>
                      <td className="col-right">245.4</td>
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
                      <td className="tfoot-value col-left">1425.2</td>
                      <td className="col-gap"></td>
                      <td colspan={4} className="tfoot-title col-right">
                        <span className="tracking-[0.05em] jp">水平力 </span>
                        Pmax1=
                      </td>
                      <td colspan={1} className="tfoot-value col-right">
                        5780.4
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex flex-col mb-[15px]">
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
                <span className="mr-[8px]">Mw1 =</span>
                <span className="mr-[8px]">
                  <span className="jp">(</span>W1+2・W2
                  <span className="jp">)</span>・<span className="jp">(</span>
                  L2/2+L3<span className="jp">)</span>+2・W3・L1/2
                  <span className="ml-1.5">=</span>
                </span>
                <span>2491.8</span>
                <span className="ml-1.5">N・m</span>
              </div>
            </div>

            <div className="flex flex-col mb-[15px]">
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
                <span className="mr-[8px]">Mp1 =</span>
                <span className="mr-[8px]">
                  P1・<span className="jp">(</span>L2/2+L3
                  <span className="jp">)</span>+2・P3・L3/2
                  <span className="ml-1.5">=</span>
                </span>
                <span>11192.7</span>
                <span className="ml-1.5">N・m</span>
              </div>
            </div>

            <div className="flex flex-col mb-[15px]">
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
                <span className="mr-[8px]">Mmax1 =</span>
                <span className="mr-[8px]">
                  <span className="jp">(</span>Mw1<sup>2</sup>+Mp1<sup>2</sup>
                  <span className="jp">)</span>
                  <sup>0.5</sup>
                  <span className="ml-1.5">=</span>
                </span>
                <span>11466.7</span>
                <span className="ml-1.5">N・m</span>
              </div>
            </div>

            <div className="flex flex-col mb-[15px]">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">
                  5<span className="jp">)</span>.
                </span>
                <span className="page1-text tracking-[0.05em] jp">
                  曲げ応力度
                </span>
              </div>

              {/* Bending stress calculation */}
              <div className="flex justify-start ml-[44px]">
                <span className="mr-[8px] tracking-[0.05em]">cσb =</span>
                <span className="mr-[8px]">
                  Mmax1/<span className="jp">(</span>2・Z
                  <span className="jp">)</span>
                  <span className="ml-1.5">=</span>
                </span>
                <span>
                  139.8{" "}
                  <span className="ml-1.5">
                    N/mm<sup>2</sup>
                  </span>
                </span>
              </div>

              {/* Checking the ratio to allowable stress */}
              <div className="ml-[68px] leading-none inline-block">
                <div className="inline-block">
                  <div className="flex items-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <div className="border-b border-black pb-[3px] tracking-[0.05em] px-1.5">
                        cσb
                      </div>
                      <div className="mt-[3px] tracking-[0.05em]">sfb</div>
                    </div>
                    <div className="mx-2">=</div>
                    <div className="flex flex-col items-center">
                      <div className="border-b border-black pb-[3px] px-1.5">
                        139.8
                      </div>
                      <div className="mt-[3px]">235</div>
                    </div>
                    <div className="mx-2">=</div>
                    <div className="flex items-center">
                      <span>0.595</span>
                      <span className="mx-3.5">&lt;</span>
                      <span className="pr-4">1.0・・・O.K</span>
                    </div>
                  </div>
                  <div className="border-t border-black mt-[3px] w-full"></div>
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
              No. {cover?.calculationNumber || ""} P-{i + 4}
            </div>
            <div className="page1-content-sb">{pageBlocks}</div>
          </div>
        </div>
      ))}
    </>
  );
}
