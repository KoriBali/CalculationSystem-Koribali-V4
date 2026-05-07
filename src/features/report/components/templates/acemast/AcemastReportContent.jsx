import React from "react";
import {
  formatJpYp,
  NameCell,
} from "../../../utils/report-handlers/textFormatter";
import "../../../styles/report.css";

export default function AcemastReportContent({
  cover = {},
  condition = {},
  results = [],
  resultsOhw = [],
  resultsDo = [],
  structuralDesign = {},
}) {
  const hasOhw = resultsOhw?.length > 0;

  return (
    <>
      {/* ================================= COVER PAGE ================================= */}
      <div className="page-preview">
        <div className="page-a4 page-cover">
          <div className="page-content page-content-border cover-border">
            {/* Header cover: management mark & calculation number */}
            <div className="flex justify-between">
              <p className="cover-row-1 ml-[10px] tracking-[0.1em]">
                <span className="jp">管理記号:</span>
                <span> {cover?.managementMark || ""}</span>
              </p>
              <div className="cover-row-1 mr-[10px] flex justify-center items-center">
                <span className="tracking-[0.1em] jp">計算書番号:</span>
                <span> {cover?.calculationNumber || ""}</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="cover-row-2-yp ml-[10px] jp">殿</div>

            {/* Main title */}
            <h1 className="cover-title text-center jp">強 度 計 算 書</h1>

            {/* Project information block */}
            <div className="cover-double-line-yp">
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
            <br />
            {["v60", "act"].includes(condition?.designStandard) && (
              <div className="tracking-[0.05em] mb-[220px] flex justify-center">
                <div className="border border-black px-6">
                  {condition?.designStandard === "v60" && (
                    <>
                      <span className="jp">設計風速：</span>V ={" "}
                      {condition?.windSpeed ?? 34} m/s
                    </>
                  )}

                  {condition?.designStandard === "act" && (
                    <>
                      <span className="jp">建築基準法：地方区分（三）</span>
                      Vo = {condition?.windSpeed ?? 34} m/s ，
                      <span className="jp">粗度区分</span>
                      {condition?.roughness ?? "II"}
                    </>
                  )}
                </div>
              </div>
            )}

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

      {/* =================================== PAGE 1 ACT =================================== */}
      {condition?.designStandard === "act" && (
        <>
          <div className="page-preview">
            <div className="page-a4">
              <div className="page-header">
                No. {cover?.calculationNumber || ""} P-1
              </div>

              <div className="leading-[1.55]">
                {/* 1. Calculation conditions */}
                <h2 className="page1-title">
                  <span className="page1-number">1.</span>
                  <span className="page1-text tracking-[0.05em] jp">
                    設計基準
                  </span>
                </h2>

                <div className="ml-[22px] tracking-[0.05em] gap-2 jp">
                  建築基準法・同施行令及び国土交通省告示
                </div>
                <div className="page1-item gap-3">
                  <div className="flex flex-col">
                    <div className="page1-text tracking-[0.05em] jp">
                      鋼構造設計規準
                    </div>
                    <div className="page1-text tracking-[0.05em] jp">
                      鋼管構造設計施工指針
                    </div>
                    <div className="page1-text tracking-[0.05em] jp">
                      塔状鋼構造設計指針・同解説
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="page1-text tracking-[0.05em] jp">
                      ((社)日本建築学会)
                    </div>
                    <div className="page1-text tracking-[0.05em] jp">
                      ((社)日本建築学会)
                    </div>
                    <div className="page1-text tracking-[0.05em] jp">
                      ((社)日本建築学会)
                    </div>
                  </div>
                </div>

                {/* 2. Calculation conditions */}
                <h2 className="page1-title">
                  <span className="page1-number">2.</span>
                  <span className="page1-text tracking-[0.05em] jp">
                    計算条件
                  </span>
                </h2>

                {/* (1) Wind speed */}
                <div className="flex justify-start ml-[22px]">
                  <span className="page1-number">
                    <span className="jp">(</span>1<span className="jp">)</span>.
                  </span>
                  <span className="page1-text tracking-[0.05em] jp">
                    荷重条件
                  </span>
                </div>
                <div className="flex justify-start ml-[44px]">
                  <span className="page1-number">
                    1<span className="jp">)</span>.
                  </span>
                  <span className="page1-text tracking-[0.05em]">
                    <span className="jp">風圧荷重 </span>P
                    <span className="jp">(</span>N
                    <span className="jp">) (建築基準法施行令第</span> 87{" "}
                    <span className="jp">条)</span>
                  </span>
                </div>
                <div className="flex flex-col ml-[66px]">
                  <div className="page1-text tracking-[0.05em]">
                    P<span className="jp">(</span>N<span className="jp">)</span>{" "}
                    =<span className="jp"> 速度圧</span> ｑ
                    <span className="jp">(</span>
                    N/m^2<span className="jp">)</span>
                    <span className="text-[10.5pt] mx-[1.5px]">×</span>
                    <span className="jp">風圧係数</span> Cf
                    <span className="text-[10.5pt] mx-[1.5px]">×</span>
                    <span className="jp">受風圧面積</span> A
                    <span className="jp">(</span>m<sup>2</sup>
                    <span className="jp">)</span>
                  </div>
                  <div className="page1-text tracking-[0.05em]">
                    <span className="jp">□速度圧</span> q
                    <span className="jp">(</span>
                    N/m<sup>2</sup>
                    <span className="jp">)</span>
                  </div>
                  <div className="ml-[16px] page1-text tracking-[0.05em]">
                    <div>
                      q = 0.6･E･Vo<sup>2</sup>
                    </div>
                    <div className="flex justify-start gap-1">
                      <div className="flex flex-col">
                        <div>E</div>
                        <br />
                        <div>Vo</div>
                      </div>
                      <div className="flex flex-col">
                        <div>:</div>
                        <br />
                        <div>:</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="jp">
                          当該建築物の高さ及び周辺の地域に存する建築物その他の工作物、樹木その他の風速に影響
                        </div>
                        <div className="jp">
                          するものの状況に応じて国土交通大臣が定める方法により算出した数値。
                        </div>
                        <div>
                          <span className="jp">
                            その地方における過去の台風の記録に基づく風害の程度その他風の性状に応じて
                          </span>
                          30m/s <span className="jp">から</span>
                        </div>
                        <div>
                          46m/s{" "}
                          <span className="jp">
                            までの範囲内において国土交通大臣が定める風速(
                          </span>
                          m/s<span className="jp">)。</span>
                        </div>
                        <div>
                          ・E
                          <span className="jp">
                            を算出するために用いる式及び各数値
                          </span>
                        </div>
                        <div className="ml-[22px]">
                          <div>
                            E = Eγ<sup>2</sup>･Gf
                          </div>
                          <div>
                            <span>Eγ</span>
                            <span>: </span>
                            <span className="jp">
                              平均風速の高さ方向の分布を表す係数
                            </span>
                          </div>
                          <div className="ml-[20px]">
                            <div>
                              H <span className="jp">(頂部高)</span> ≦ Zb{" "}
                              <span className="jp">の時</span>
                            </div>
                            <div className="ml-[20px]">
                              Eγ = 1.7･<span className="jp">(</span>Zb/ZG
                              <span className="jp">)</span>
                              <sup>α</sup>
                            </div>
                            <div>
                              H {">"} Zb <span className="jp">の時</span>
                            </div>
                            <div className="ml-[20px]">
                              Eγ = 1.7･<span className="jp">(</span>H/ZG
                              <span className="jp">)</span>
                              <sup>α</sup>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start gap-1">
                      <div>Gf:</div>
                      <div className="jp">ガスト影響係数</div>
                    </div>
                  </div>
                  <div>
                    Zb, ZG, α, Gf <span className="jp">は下表による。</span>
                  </div>
                </div>

                <div className="ml-[66px]">
                  <table className="border border-black border-collapse">
                    <thead>
                      <tr>
                        <th
                          className="jp tracking-[0.05em] border border-black text-center align-middle font-normal"
                          colSpan={2}
                          rowSpan={2}
                        >
                          地表面粗度区分
                        </th>
                        <th
                          className="border tracking-[0.05em] border-black text-center px-2 align-middle font-normal"
                          rowSpan={2}
                        >
                          Zb<span className="jp">(</span>m
                          <span className="jp">)</span>
                        </th>
                        <th
                          className="border tracking-[0.05em] border-black text-center px-2 align-middle font-normal"
                          rowSpan={2}
                        >
                          ZG<span className="jp">(</span>m
                          <span className="jp">)</span>
                        </th>
                        <th
                          className="border tracking-[0.05em] border-black text-center align-middle font-normal"
                          rowSpan={2}
                        >
                          α
                        </th>
                        <th
                          className="border tracking-[0.05em] border-black text-center align-middle font-normal"
                          colSpan={3}
                        >
                          Gf
                        </th>
                      </tr>
                      <tr>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                          H≦10
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                          10{"<"}H{"<"}40
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                          40≦H
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle p-2 border-black">
                          I
                        </td>
                        <td className="jp border tracking-[0.05em] text-justify p-2 border-black">
                          都市計画区域外にあって、極めて平坦で障害物が
                          ないものとして特定行政庁が規則で定める地域
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          5
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          250
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                          0.10
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          2.0
                        </td>
                        <td
                          className="jp tracking-[0.05em] text-center align-middle border border-black"
                          rowSpan={4}
                        >
                          直線補間
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          1.8
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle p-2 border-black">
                          II
                        </td>
                        <td className="border tracking-[0.05em] p-2 text-justify border-black">
                          <span className="jp">
                            都市計画区域外にあって、地表面粗度区分
                          </span>
                          I
                          <span className="jp">
                            の以外の区域。又は地表面粗度区分
                          </span>
                          IV
                          <span className="jp">
                            以外の区域のうち、海岸線、湖岸線までの距離が
                          </span>{" "}
                          500 m <span className="jp">以内の地域</span>
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          5
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          350
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                          0.15
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          2.2
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          2.0
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle p-2 border-black">
                          III
                        </td>
                        <td className="border tracking-[0.05em] p-2 border-black">
                          <span className="jp">地表面粗度区分</span>I
                          <span className="jp">，</span>II
                          <span className="jp">又はⅣ以外の区域</span>
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          5
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          450
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                          0.20
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          2.5
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          2.1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle p-2 border-black">
                          IV
                        </td>
                        <td className="jp border tracking-[0.05em] p-2 text-justify border-black">
                          都市計画区域内にあって、都市化が極めて著しいものとして特定行政庁が規則で定める地域
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          10
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          550
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                          0.27
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          3.1
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle border-black">
                          2.3
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =================================== PAGE 1 V60 =================================== */}
      {condition?.designStandard === "v60" && (
        <>
          <div className="page-preview">
            <div className="page-a4">
              <div className="page-header">
                No. {cover?.calculationNumber || ""} P-1
              </div>

              <div className="leading-[1.55]">
                <h2 className="page1-title">
                  <span className="page1-number">1.</span>
                  <span className="page1-text tracking-[0.05em] jp">
                    計算条件
                  </span>
                </h2>

                <div className="flex justify-start ml-[22px]">
                  <span className="page1-number">
                    <span className="jp">(</span>1<span className="jp">)</span>.
                  </span>
                  <span className="jp">荷重条件</span>
                </div>
                <div className="flex flex-col ml-[44px]">
                  <div className="flex justify-start">
                    <span className="page1-number">
                      1<span className="jp">)</span>.
                    </span>
                    <span className="page1-text tracking-[0.05em] jp mr-1">
                      風圧荷重
                    </span>
                    P<span className="jp">(</span>N<span className="jp">)</span>
                  </div>

                  <div className="ml-[22px] tracking-[0.05em] flex flex-col">
                    <div>
                      P<span className="jp">(</span>N
                      <span className="jp">)</span> ={" "}
                      <span className="jp">速度圧</span> q
                      <span className="jp">(</span>
                      N/m<sup>2</sup>
                      <span className="jp">)</span>
                      <span className="page1-text px-[2px] text-[10.5pt]">
                        ×
                      </span>
                      <span className="jp">風圧係数</span> Cf
                      <span className="page1-text px-[2px] text-[10.5pt]">
                        ×
                      </span>
                      <span className="jp">受風圧面積</span> A
                      <span className="jp">(</span>m<sup>2</sup>
                      <span className="jp">)</span>
                    </div>
                    <br />
                    <div>
                      <span className="jp">□速度圧</span> q
                      <span className="jp">(</span>
                      N/m<sup>2</sup>
                      <span className="jp">)</span>
                    </div>
                    <div className="ml-[22px]">
                      q = 1/2･ρ･Vo<sup>2</sup> = 2091.9 N/m<sup>2</sup>
                    </div>
                    <br />
                    <div>
                      <div>
                        <span className="jp">□風力係数</span> Cf
                      </div>
                      <div className="ml-[22px] jp">・マスト</div>
                      <div className="ml-[22px]">Cf = 0.7</div>
                      <div className="ml-[22px] jp">・装柱物</div>
                      <div className="ml-[22px] jp">
                        装柱物の形状により決定する。
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="flex flex-col ml-[44px]">
                  <div className="flex justify-start">
                    <span className="page1-number">
                      2<span className="jp">)</span>.
                    </span>
                    <span className="page1-text tracking-[0.05em] jp mr-1">
                      鉛直荷重
                    </span>
                    W<span className="jp">(</span>N<span className="jp">)</span>
                  </div>
                  <div className="ml-[22px] tracking-[0.05em]">
                    <span className="jp">柱自重</span> Wp
                    <span className="jp">、装柱物重量</span> Wa{" "}
                    <span className="jp">を考慮する。</span>
                  </div>
                </div>
                <br />
                <div className="flex flex-col ml-[44px]">
                  <div className="flex justify-start">
                    <span className="page1-number">
                      3<span className="jp">)</span>.
                    </span>
                    <span className="page1-text tracking-[0.05em] jp mr-1">
                      地震荷重
                    </span>
                    Pk <span className="jp">[</span>N
                    <span className="jp">]</span>
                  </div>
                  <div className="ml-[22px] tracking-[0.05em]">
                    <span className="jp">平成</span>12
                    <span className="jp">年</span>5
                    <span className="jp">月</span>31
                    <span className="jp">日</span>{" "}
                    <span className="jp">建告第</span>1449
                    <span className="jp">号その</span>2{" "}
                    <span className="jp">に準拠し、水平震度</span> k=0.5
                    <span className="jp">とする。</span>
                  </div>
                  <br />

                  <div className="ml-[44px] flex justify-start tracking-[0.05em] gap-4">
                    <div>Pk = k • W</div>
                    <div>
                      {" "}
                      W<span className="jp">: 鉛直荷重(</span>N
                      <span className="jp">)</span>
                    </div>
                  </div>
                </div>
                <br />
                <div className="flex justify-start ml-[22px] tracking-[0.05em]">
                  <span className="page1-number">
                    <span className="jp">(</span>2<span className="jp">)</span>.
                  </span>
                  <span className="jp">許容応力度</span>
                </div>
                <table className="border border-black border-collapse ml-[44px]">
                  <thead>
                    <tr>
                      <th
                        className="border border-black"
                        colSpan={3}
                        rowSpan={2}
                      >
                        {" "}
                      </th>
                      <th
                        className="border tracking-[0.05em] border-black text-center align-middle font-normal"
                        colSpan={4}
                      >
                        <span className="jp">短期許容応力度(</span>N/mm
                        <sup>2</sup>
                        <span className="jp">)</span>
                      </th>
                    </tr>
                    <tr>
                      <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                        <span className="jp">引張(</span>sft
                        <span className="jp">)</span>
                      </th>
                      <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                        <span className="jp">圧縮(</span>sfc
                        <span className="jp">)</span>
                      </th>
                      <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                        <span className="jp">曲げ(</span>sfb
                        <span className="jp">)</span>
                      </th>
                      <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                        <span className="jp">せん断(</span>sfs
                        <span className="jp">)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        className="jp border tracking-[0.05em] text-center align-middle px-2 border-black"
                        rowSpan={7}
                      >
                        鋼材
                      </td>
                      <td
                        className="border tracking-[0.05em] text-center align-middle px-2 border-black"
                        rowSpan={2}
                      >
                        SS400,STK400
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        t≦40
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        235
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
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        40{"<"}t≦100
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        215
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        215
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        215
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        124
                      </td>
                    </tr>

                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        STK500
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        t≦40
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        350
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        350
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        350
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        202
                      </td>
                    </tr>

                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        SS540,STK540
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        t≦40
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        375
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        375
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        375
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        216
                      </td>
                    </tr>

                    <tr>
                      <td className="jp border tracking-[0.05em] text-center align-middle px-2 border-black">
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
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        105
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="jp border tracking-[0.05em] text-center align-middle px-2 border-black"
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
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        225
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="jp border tracking-[0.05em] text-center align-middle px-2 border-black"
                        rowSpan={2}
                      >
                        溶接
                      </td>
                      <td
                        className="border tracking-[0.05em] text-center align-middle px-2 border-black"
                        rowSpan={2}
                      >
                        SS400,STK400
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        t≦40
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        135
                      </td>
                    </tr>

                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        40{"<"}t≦100
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        －
                      </td>
                      <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                        124
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br />
              <div>
                <h2 className="page1-title">
                  <span className="page1-number">2.</span>
                  <span className="page1-text tracking-[0.05em] jp">
                    構造概要
                  </span>
                </h2>
                <div className="flex justify-start ml-[22px]">
                  <span className="page1-number">
                    <span className="jp">(</span>1<span className="jp">)</span>.
                  </span>
                  <span className="jp">主要部材</span>
                </div>
                <div className="ml-[44px]">
                  <table className="border border-black border-collapse w-full">
                    <thead>
                      <tr>
                        <th className="border border-black" rowSpan={2}>
                          {" "}
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-3 font-normal">
                          外径φ
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-3 font-normal">
                          <span className="jp">肉厚</span>t
                        </th>
                        <th
                          className="jp border tracking-[0.05em] border-black text-center align-middle px-3 font-normal"
                          rowSpan={2}
                        >
                          材質
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-3 font-normal">
                          単位重量
                        </th>
                        <th
                          className="jp border tracking-[0.05em] border-black text-center align-middle px-3 font-normal"
                          colSpan={4}
                        >
                          断面性能
                        </th>
                      </tr>

                      <tr>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-3  font-normal">
                          <span className="jp">(</span>mm
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-3 font-normal">
                          <span className="jp">(</span>mm
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-3 font-normal">
                          W<span className="jp">(</span>N/m
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-3 font-normal">
                          A<span className="jp">(</span>cm<sup>2</sup>
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-3 font-normal">
                          I<span className="jp">(</span>cm<sup>4</sup>
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-3 font-normal">
                          Z<span className="jp">(</span>cm<sup>3</sup>
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-3 font-normal">
                          i<span className="jp">(</span>cm
                          <span className="jp">)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          1
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          318.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          6.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          520.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          67.55
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          8201.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          515.03
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          11.02
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          406.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          7.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          761.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          98.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          19640.05
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          966.54
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          14.09
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          3
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          508.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          7.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          955.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          124.112
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          38811.99
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          1528.03
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          17.68
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          609.6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          7.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          1149.6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          149.33
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          67593.02
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          2217.62
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          21.28
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          711.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          9.50
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          1612.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          209.42
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          128919.17
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          3625.40
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          24.81
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          812.8
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          9.50
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          1845.6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          239.75
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          193408.38
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          4759.09
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          28.40
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="tracking-[0.05em] text-right">
                    <span className="mr-3">
                      A:<span className="jp"> 断面積</span>
                    </span>
                    <span className="mr-3">
                      I:<span className="jp"> 断面二次モーメント</span>
                    </span>
                    <span className="mr-3">
                      Z:<span className="jp"> 断面係数</span>
                    </span>
                    <span>
                      i:<span className="jp"> 断面二次半径</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =================================== PAGE 2 ACT =================================== */}
      {condition?.designStandard === "act" && (
        <>
          <div className="page-preview">
            <div className="page-a4">
              <div className="page-header">
                No. {cover?.calculationNumber || ""} P-2
              </div>

              <div className="flex flex-col ml-[88px] tracking-[0.05em] leading-[1.55]">
                <div>
                  <span className="page1-number">・</span>
                  <span className="jp">設置場所への適用</span>
                </div>
                <div className="ml-[22px]">
                  <div className="flex justify-start gap-2">
                    <div className="flex flex-col jp">
                      <div>設置場所</div>
                      <div>地方区分</div>
                      <div>設計風速</div>
                      <div>施設高さ</div>
                    </div>
                    <div className="flex flex-col">
                      <div>:</div>
                      <div>:</div>
                      <div>:</div>
                      <div>:</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="jp">宮城県山元町</div>
                      <div className="jp">三</div>
                      <div>Vo = 34 m/s</div>
                      <div>H = 40.000 m</div>
                    </div>
                  </div>
                  <div>
                    <span className="jp">地表面粗度区分</span>: II
                    <span className="jp"> を採用する。</span>
                  </div>
                  <div className="ml-[22px]">
                    <div>
                      <span className="mr-3">ZB = 5m</span>
                      <span className="mr-3">ZG = 350m</span>
                      <span>α = 0.15</span>
                    </div>
                    <div className="ml-[22px]">
                      <div>
                        H {">"} Zb <span className="jp">より</span>
                      </div>
                      <div>
                        Eγ = 1.7･<span className="jp">(</span>H/ZG
                        <span className="jp">)</span>
                        <sup>α</sup> = 1.228
                      </div>
                      <div>Gf = 2.000</div>
                    </div>
                    <div>
                      E = Eγ<sup>2</sup>･Gf = 3.016
                    </div>
                  </div>
                  <div className="jp">従って速度圧は、</div>
                  <div className="ml-[22px] underline">
                    q = 0.6･E･Vo<sup>2</sup> = 2091.9 N/m<sup>2</sup>
                  </div>
                </div>
              </div>
              <br />
              <div className="ml-[66px] tracking-[0.05em]">
                <div>
                  <span className="jp">□風力係数</span> Cf
                </div>
                <div className="ml-[22px]">
                  <div className="jp">・マスト</div>
                  <table className="border border-black border-collapse">
                    <tbody>
                      <tr>
                        <td
                          className="border tracking-[0.05em] text-center align-middle px-3 border-black"
                          rowSpan={2}
                        >
                          Cf
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-2  border-black">
                          H/B≦1
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                          1{"<"}H/B{"<"}8
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-2  border-black">
                          8≦H/B
                        </td>
                      </tr>
                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3.5 py-1 border-black">
                          0.700kz
                        </td>
                        <td className="border jp tracking-[0.05em] text-center align-middle px-8 py-1 border-black">
                          直線補間
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-3.5 py-1 border-black">
                          0.900kz
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div>
                    <span className="mr-4">
                      H:<span className="jp">各支柱の長さ</span>
                    </span>
                    <span>
                      B:<span className="jp">各支柱の見附幅</span>
                    </span>
                  </div>
                  <div className="jp">・装柱物</div>
                  <div className="ml-[22px]">
                    <div className="jp">装柱物の形状により決定する。</div>
                    <br />
                    <div className="ml-[20px]">
                      <div>
                        kz:
                        <span className="jp">
                          次に掲げる表によって計算した数値
                        </span>
                      </div>
                      <table className="border border-black border-collapse">
                        <thead>
                          <tr>
                            <th
                              className="border tracking-[0.05em] border-black text-center py-0.5 align-middle font-normal"
                              colSpan={2}
                            >
                              H<span className="jp">が</span>Zb
                              <span className="jp">以下の場合</span>
                            </th>
                            <th className="border tracking-[0.05em] border-black text-center py-0.5 align-middle font-normal">
                              1.0
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              className="border tracking-[0.05em] text-center align-middle px-2 border-black"
                              rowSpan={2}
                            >
                              H<span className="jp">が</span>Zb
                              <span className="jp">を超える場合</span>
                            </td>
                            <td className="border tracking-[0.05em] text-center align-middle px-2 py-0.5 border-black">
                              Z<span className="jp">が</span>Zb
                              <span className="jp">以下の場合</span>
                            </td>
                            <td className="border tracking-[0.05em] text-center align-middle px-3.5 py-0.5 border-black">
                              <span className="jp">(</span>Zb/H
                              <span className="jp">)</span>
                              <sup>2α</sup>
                            </td>
                          </tr>
                          <tr>
                            <td className="border tracking-[0.05em] text-center align-middle px-2 py-0.5 border-black">
                              Z<span className="jp">が</span>Zb
                              <span className="jp">を超える場合</span>
                            </td>
                            <td className="border tracking-[0.05em] text-center align-middle px-3.5 py-0.5 border-black">
                              <span className="jp">(</span>Z/H
                              <span className="jp">)</span>
                              <sup>2α</sup>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="ml-[44px] tracking-[0.05em]">
                <div className="flex justify-start">
                  <span className="page1-number">
                    2<span className="jp">)</span>.
                  </span>
                  <span className="page1-text">
                    <span className="jp">鉛直荷重 </span>W
                    <span className="jp">(</span>N<span className="jp">)</span>
                  </span>
                </div>
                <div className="ml-[22px]">
                  <span className="jp">柱自重 </span>Wp
                  <span className="jp">、装柱物重量 </span>Wa{" "}
                  <span className="jp">を考慮する。</span>
                </div>
              </div>
              <br />
              <div className="ml-[44px] tracking-[0.05em]">
                <div className="flex justify-start">
                  <span className="page1-number">
                    3<span className="jp">)</span>.
                  </span>
                  <span className="page1-text">
                    <span className="jp">地震荷重 </span>Pk
                    <span className="jp">[</span>N<span className="jp">]</span>
                  </span>
                </div>
                <div className="ml-[22px]">
                  <div>
                    <span className="jp">平成</span>12
                    <span className="jp">年</span>5
                    <span className="jp">月</span>31
                    <span className="jp">日 建告第</span>1449
                    <span className="jp">号その</span>2{" "}
                    <span className="jp">に準拠し、水平震度 </span>k = 0.5
                    <span className="jp">とする。</span>
                  </div>

                  <div className="ml-[22px] mt-3">
                    <span className="mr-4">Pk = k • W</span>
                    <span>
                      W: <span className="jp">鉛直荷重(</span>N
                      <span className="jp">)</span>
                    </span>
                  </div>
                </div>
              </div>
              <br />
              <div className="flex justify-start ml-[22px]">
                <span className="page1-number">
                  <span className="jp">(</span>2<span className="jp">)</span>.
                </span>
                <span className="page1-text tracking-[0.05em] jp">
                  許容応力度
                </span>
              </div>
              <table className="border border-black border-collapse ml-[44px]">
                <thead>
                  <tr>
                    <th className="border border-black" colSpan={3} rowSpan={2}>
                      {" "}
                    </th>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle font-normal"
                      colSpan={4}
                    >
                      <span className="jp">短期許容応力度(</span>N/mm
                      <sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                  </tr>
                  <tr>
                    <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                      <span className="jp">引張(</span>sft
                      <span className="jp">)</span>
                    </th>
                    <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                      <span className="jp">圧縮(</span>sfc
                      <span className="jp">)</span>
                    </th>
                    <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                      <span className="jp">曲げ(</span>sfb
                      <span className="jp">)</span>
                    </th>
                    <th className="border tracking-[0.05em] border-black text-center align-middle px-2 font-normal">
                      <span className="jp">せん断(</span>sfs
                      <span className="jp">)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="jp border tracking-[0.05em] text-center align-middle px-2 border-black"
                      rowSpan={7}
                    >
                      鋼材
                    </td>
                    <td
                      className="border tracking-[0.05em] text-center align-middle px-2 border-black"
                      rowSpan={2}
                    >
                      SS400,STK400
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      t≦40
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      235
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
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      40{"<"}t≦100
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      215
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      215
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      215
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      124
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      STK500
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      t≦40
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      350
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      350
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      350
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      202
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      SS540,STK540
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      t≦40
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      375
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      375
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      375
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      216
                    </td>
                  </tr>

                  <tr>
                    <td className="jp border tracking-[0.05em] text-center align-middle px-2 border-black">
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
                      －
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      105
                    </td>
                  </tr>

                  <tr>
                    <td
                      className="jp border tracking-[0.05em] text-center align-middle px-2 border-black"
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
                      －
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      225
                    </td>
                  </tr>

                  <tr>
                    <td
                      className="jp border tracking-[0.05em] text-center align-middle px-2 border-black"
                      rowSpan={2}
                    >
                      溶接
                    </td>
                    <td
                      className="border tracking-[0.05em] text-center align-middle px-2 border-black"
                      rowSpan={2}
                    >
                      SS400,STK400
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      t≦40
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      －
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      －
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      －
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      135
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      40{"<"}t≦100
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      －
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      －
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      －
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-2 border-black">
                      124
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =================================== PAGE 2 V60 =================================== */}
      {condition?.designStandard === "v60" && (
        <>
          <div className="page-preview">
            <div className="page-a4">
              <div className="page-header">
                No. {cover?.calculationNumber || ""} P-2
              </div>

              <div className="leading-[1.55]">
                <h2 className="page1-title">
                  <span className="page1-number">3.</span>
                  <span className="page1-text tracking-[0.05em] jp">
                    風荷重の算出
                  </span>
                </h2>
                <div className="flex justify-start ml-[22px]">
                  <span className="page1-number">
                    <span className="jp">(</span>1<span className="jp">)</span>.
                  </span>
                  <span className="page1-text tracking-[0.05em] jp mr-[135px]">
                    荷重算出
                  </span>
                  L:{" "}
                  <span className="page1-text tracking-[0.05em] jp mr-3">
                    固定面からの高さ
                  </span>
                  Z: G.L
                  <span className="page1-text tracking-[0.05em] jp">
                    からの高さ
                  </span>
                </div>
                <div>
                  <table className="border border-black border-collapse w-full">
                    <thead>
                      <tr>
                        <th className="border border-black" rowSpan={2}>
                          {" "}
                        </th>
                        <th
                          className="jp border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                          rowSpan={2}
                        >
                          名称
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                          重量
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0em] text-center jp align-middle px-1 font-normal">
                          荷重中心高
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0em] text-center jp align-middle px-1 font-normal">
                          装柱高
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal">
                          <span className="jp">風圧係数 </span>Cf
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0em] text-center jp align-middle px-1 font-normal">
                          受風圧面積
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0em] text-center jp align-middle px-1 font-normal">
                          風荷重
                        </th>
                        <th
                          className="jp border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                          rowSpan={2}
                        >
                          数量
                        </th>
                      </tr>

                      <tr>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          W<span className="jp">(</span>N
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          L<span className="jp">(</span>m
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          Z<span className="jp">(</span>m
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal">
                          Cf
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          A<span className="jp">(</span>m<sup>2</sup>
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          P<span className="jp">(</span>N
                          <span className="jp">)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className="border tracking-[0.05em] text-left align-middle px-1 border-black"
                          colSpan={2}
                        >
                          <span className="jp">装柱物 </span>Ppa
                        </td>
                        <td
                          className="border tracking-[0.05em] text-center align-middle px-1 border-black"
                          colSpan={5}
                        >
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          1
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Lighting Rod" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          127.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          16.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.700
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.150
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          166.9
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          10
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          2
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="3-yagi antenna" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          107.9
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (6.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          10.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.300
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          497.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          3
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Mounting Bracket" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          98.1
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (6.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          10.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.110
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          182.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          4
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Box" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          29.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (11.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          5.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.024
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          32.3
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          5
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Co Linear antenna" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          29.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (11.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          5.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.180
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          242.1
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          6
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Mounting Bracket" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          205.9
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (14.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.294
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          395.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          7
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Box" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          39.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (14.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.050
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          67.3
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          8
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          9
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          10
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          11
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          12
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          13
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          14
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          15
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          16
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          17
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          18
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          19
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          20
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td
                          className="border tracking-[0.05em] text-left align-middle px-1 border-black"
                          colSpan={2}
                        >
                          <span className="jp">マスト </span>Ppp
                        </td>
                        <td
                          className="border tracking-[0.05em] text-center align-middle px-1 border-black"
                          colSpan={5}
                        >
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          1
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>1
                          <span className="jp">(φ</span>318.5
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2079.9
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          22.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          40.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.900
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.274
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2398.6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>
                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          2
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>2
                          <span className="jp">(φ</span>406.4
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3045.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          18.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          36.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.900
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.626
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2966.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>
                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          3
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>3
                          <span className="jp">(φ</span>508.0
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3822.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          14.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          32.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.896
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.032
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3562.1
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          4
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>4
                          <span className="jp">(φ</span>609.6
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          4598.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          10.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          28.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.859
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.438
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3937.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          5
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>5
                          <span className="jp">(φ</span>711.2
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          6448.8
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          6.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          24.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.714
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.845
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          4249.3
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          6
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>6
                          <span className="jp">(φ</span>812.8
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          7382.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          20.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.659
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3.251
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          4481.7
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =================================== PAGE 3 ACT =================================== */}
      {condition?.designStandard === "act" && (
        <>
          <div className="page-preview">
            <div className="page-a4">
              <div className="page-header">
                No. {cover?.calculationNumber || ""} P-3
              </div>

              <div className="leading-[1.55]">
                {/* 1. Calculation conditions */}
                <h2 className="page1-title">
                  <span className="page1-number">3.</span>
                  <span className="page1-text tracking-[0.05em] jp">
                    構造概要
                  </span>
                </h2>
                <div className="flex justify-start ml-[22px]">
                  <span className="page1-number">
                    <span className="jp">(</span>1<span className="jp">)</span>.
                  </span>
                  <span className="page1-text tracking-[0.05em] jp">
                    主要部材
                  </span>
                </div>

                <div className="ml-[44px]">
                  <table className="border border-black border-collapse w-full">
                    <thead>
                      <tr>
                        <th className="border border-black" rowSpan={2}>
                          {" "}
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-3 font-normal">
                          外径φ
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-3 font-normal">
                          <span className="jp">肉厚</span>t
                        </th>
                        <th
                          className="jp border tracking-[0.05em] border-black text-center align-middle px-3 font-normal"
                          rowSpan={2}
                        >
                          材質
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-3 font-normal">
                          単位重量
                        </th>
                        <th
                          className="jp border tracking-[0.05em] border-black text-center align-middle px-3 font-normal"
                          colSpan={4}
                        >
                          断面性能
                        </th>
                      </tr>

                      <tr>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-3  font-normal">
                          <span className="jp">(</span>mm
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-3 font-normal">
                          <span className="jp">(</span>mm
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-3 font-normal">
                          W<span className="jp">(</span>N/m
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-3 font-normal">
                          A<span className="jp">(</span>cm<sup>2</sup>
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-3 font-normal">
                          I<span className="jp">(</span>cm<sup>4</sup>
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-3 font-normal">
                          Z<span className="jp">(</span>cm<sup>3</sup>
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-3 font-normal">
                          i<span className="jp">(</span>cm
                          <span className="jp">)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          1
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          318.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          6.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          520.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          67.55
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          8201.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          515.03
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          11.02
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          406.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          7.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          761.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          98.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          19640.05
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          966.54
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          14.09
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          3
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          508.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          7.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          955.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          124.112
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          38811.99
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          1528.03
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          17.68
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          609.6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          7.90
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          1149.6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          149.33
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          67593.02
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          2217.62
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          21.28
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          711.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          9.50
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          1612.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          209.42
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          128919.17
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          3625.40
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          24.81
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          812.8
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          9.50
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          STK400
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          1845.6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          239.75
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          193408.38
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          4759.09
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-3 border-black">
                          28.40
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="tracking-[0.05em] text-right">
                    <span className="mr-3">
                      A:<span className="jp"> 断面積</span>
                    </span>
                    <span className="mr-3">
                      I:<span className="jp"> 断面二次モーメント</span>
                    </span>
                    <span className="mr-3">
                      Z:<span className="jp"> 断面係数</span>
                    </span>
                    <span>
                      i:<span className="jp"> 断面二次半径</span>
                    </span>
                  </div>
                </div>
                <h2 className="page1-title  mt-[20px]">
                  <span className="page1-number">4.</span>
                  <span className="page1-text tracking-[0.05em] jp">
                    風荷重の算出
                  </span>
                </h2>
                <div className="flex justify-start ml-[22px]">
                  <span className="page1-number">
                    <span className="jp">(</span>1<span className="jp">)</span>.
                  </span>
                  <span className="page1-text tracking-[0.05em] jp mr-[135px]">
                    荷重算出
                  </span>
                  L:{" "}
                  <span className="page1-text tracking-[0.05em] jp mr-3">
                    固定面からの高さ
                  </span>
                  Z: G.L
                  <span className="page1-text tracking-[0.05em] jp">
                    からの高さ
                  </span>
                </div>
                <div>
                  <table className="border border-black border-collapse w-full">
                    <thead>
                      <tr>
                        <th className="border border-black" rowSpan={2}>
                          {" "}
                        </th>
                        <th
                          className="jp border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                          rowSpan={2}
                        >
                          名称
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                          重量
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0em] text-center jp align-middle px-1 font-normal">
                          荷重中心高
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0em] text-center jp align-middle px-1 font-normal">
                          装柱高
                        </th>
                        <th
                          className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                          colSpan={3}
                        >
                          <span className="jp">風圧係数 </span>Cf
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0em] text-center jp align-middle px-1 font-normal">
                          受風圧面積
                        </th>
                        <th className="border-r border-l border-t border-black tracking-[0em] text-center jp align-middle px-1 font-normal">
                          風荷重
                        </th>
                        <th
                          className="jp border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                          rowSpan={2}
                        >
                          数量
                        </th>
                      </tr>

                      <tr>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          W<span className="jp">(</span>N
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          L<span className="jp">(</span>m
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          Z<span className="jp">(</span>m
                          <span className="jp">)</span>
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal">
                          {""}
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal">
                          kz
                        </th>
                        <th className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal">
                          Cf
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          A<span className="jp">(</span>m<sup>2</sup>
                          <span className="jp">)</span>
                        </th>
                        <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                          P<span className="jp">(</span>N
                          <span className="jp">)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          className="border tracking-[0.05em] text-left align-middle px-1 border-black"
                          colSpan={2}
                        >
                          <span className="jp">装柱物 </span>Ppa
                        </td>
                        <td
                          className="border tracking-[0.05em] text-center align-middle px-1 border-black"
                          colSpan={7}
                        >
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                          1
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Lighting Rod" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          127.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          16.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.700kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.760
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.532
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.150
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          166.9
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          10
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          2
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="3-yagi antenna" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          107.9
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (6.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          10.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.660
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.792
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.300
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          497.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          3
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Mounting Bracket" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          98.1
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (6.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          10.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.660
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.792
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.110
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          182.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          4
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Box" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          29.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (11.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          5.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.536
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.643
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.024
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          32.3
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          5
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Co Linear antenna" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          29.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (11.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          5.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.536
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.643
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.180
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          242.1
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          6
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Mounting Bracket" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          205.9
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (14.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.536
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.643
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.294
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          395.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          7
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <NameCell text="Box" />
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          39.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          (14.000)
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.200kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.536
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.643
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.050
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          67.3
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          8
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          9
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          10
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          11
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          12
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          13
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          14
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          15
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          16
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          17
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          18
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          19
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          20
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td
                          className="border tracking-[0.05em] text-left align-middle px-1 border-black"
                          colSpan={2}
                        >
                          <span className="jp">マスト </span>Ppp
                        </td>
                        <td
                          className="border tracking-[0.05em] text-center align-middle px-1 border-black"
                          colSpan={7}
                        >
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          {""}
                        </td>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          {""}
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          1
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>1
                          <span className="jp">(φ</span>318.5
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2079.9
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          22.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          40.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.900kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.900
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.274
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2398.6
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>
                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          2
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>2
                          <span className="jp">(φ</span>406.4
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3045.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          18.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          36.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.900kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.969
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.872
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1.626
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2966.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>
                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          3
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>3
                          <span className="jp">(φ</span>508.0
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3822.0
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          14.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          32.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.896kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.935
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.838
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.032
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3562.1
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          4
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>4
                          <span className="jp">(φ</span>609.6
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          4598.4
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          10.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          28.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.859kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.899
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.772
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.438
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3937.2
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          5
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>5
                          <span className="jp">(φ</span>711.2
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          6448.8
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          6.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          24.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.832kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.858
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.714
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.845
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          4249.3
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>

                      <tr>
                        <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                          6
                        </td>
                        <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                          <span className="jp">マスト</span>6
                          <span className="jp">(φ</span>812.8
                          <span className="jp">)</span>
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          7382.5
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          2.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          20.000
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.812kz
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.812
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          0.659
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          3.251
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          4481.7
                        </td>
                        <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                          1
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =================================== PAGE OHW =================================== */}
      {hasOhw && (
        <>
          <div className="page-preview">
            <div className="page-a4">
              <div className="page-header">
                No. {cover?.calculationNumber || ""} P-
                {condition?.designStandard === "v60"
                  ? 3
                  : condition?.designStandard === "act"
                    ? 4
                    : ""}
              </div>

              <div className="ml-[22px] leading-[1.55]">
                <div className="flex justify-start">
                  <span className="page1-number">
                    <span className="jp">(</span>2<span className="jp">)</span>.
                  </span>
                  <span className="page1-text tracking-[0.05em] jp">
                    架空線荷重の算出
                  </span>
                </div>
                <div className="flex justify-start ml-[22px]">
                  <span className="page1-number">
                    1<span className="jp">)</span>.
                  </span>
                  <span className="page1-text tracking-[0.05em]">
                    <span className="jp mr-[220px]">架空線の諸元 </span>
                  </span>
                  L:{" "}
                  <span className="page1-text tracking-[0.05em] jp mr-3">
                    固定面からの高さ
                  </span>
                  Z: G.L
                  <span className="page1-text tracking-[0.05em] jp">
                    からの高さ
                  </span>
                </div>
                <table className="border border-black border-collapse w-[85%] ml-[44px]">
                  <thead>
                    <tr>
                      <th
                        className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                        rowSpan={2}
                      >
                        No.
                      </th>
                      <th
                        className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal jp min-w-[145px]"
                        rowSpan={2}
                      >
                        名称
                      </th>
                      <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                        重量
                      </th>
                      <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                        仕上外径
                      </th>
                      <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                        取付高
                      </th>
                      <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                        装柱高
                      </th>
                      <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                        スパン
                      </th>
                      <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                        弛度
                      </th>
                    </tr>
                    <tr>
                      <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                        Wo<span className="jp">(</span>N/m
                        <span className="jp">)</span>
                      </th>
                      <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                        <span className="jp">φ(</span>mm
                        <span className="jp">)</span>
                      </th>
                      <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                        L<span className="jp">(</span>m
                        <span className="jp">)</span>
                      </th>
                      <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                        Z<span className="jp">(</span>m
                        <span className="jp">)</span>
                      </th>
                      <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                        S<span className="jp">(</span>m
                        <span className="jp">)</span>
                      </th>
                      <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                        D<span className="jp">(</span>m
                        <span className="jp">)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                        1
                      </td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                    </tr>
                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                        2
                      </td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                    </tr>
                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                        3
                      </td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <div className="flex justify-start ml-[22px]">
                  <div className="flex flex-col w-[80%]">
                    <div className="flex justify-start">
                      <span className="page1-number">
                        2<span className="jp">)</span>.
                      </span>
                      <span className="page1-text tracking-[0.05em]">
                        <span className="jp">荷重算出 </span>
                      </span>
                    </div>
                    <div className="ml-[22px]">
                      <table className="border border-black border-collapse w-[100%]">
                        <thead>
                          <tr>
                            <th
                              className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                              rowSpan={2}
                            >
                              No.
                            </th>
                            <th
                              className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal jp min-w-[145px]"
                              rowSpan={2}
                            >
                              名称
                            </th>
                            <th
                              className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                              colSpan={3}
                            >
                              <span className="jp">風圧係数</span> Cf
                            </th>
                            <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                              ※単位風荷重
                            </th>
                          </tr>
                          <tr>
                            <th className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal min-w-[35px]"></th>
                            <th className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal min-w-[35px]">
                              kz
                            </th>
                            <th className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal min-w-[35px]">
                              Cf
                            </th>
                            <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                              Po<span className="jp">(</span>N/m
                              <span className="jp">)</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                              1
                            </td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                          </tr>
                          <tr>
                            <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                              2
                            </td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                          </tr>
                          <tr>
                            <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                              3
                            </td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                            <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-right tracking-[0.05em]">
                      ※Po = q･C･<span className="jp">φ</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <img
                        src="/images/wire.png"
                        alt="wire"
                        className="h-[95px] w-[210px]"
                      />
                    </div>
                    <div className="tracking-[0.05em] flex flex-col justify-center items-center">
                      <div>
                        <div>
                          S: <span className="jp">スパン(</span>m
                          <span className="jp">)</span>
                        </div>
                        <div>
                          D: <span className="jp">弛度(</span>m
                          <span className="jp">)</span>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="flex flex-col tracking-[0.05em] ml-[44px]">
                  <div className="flex justify-start">
                    <span className="jp mr-1">・鉛直荷重</span>Wc
                    <span className="jp">(</span>N<span className="jp">)</span>
                  </div>
                  <div className="jp ml-[22px]">
                    鉛直荷重は、スパンの半分を支持柱が負担する。
                  </div>
                  <div className="ml-[44px]">Wc = Wo･S/2</div>
                  <br />
                  <div className="flex justify-start">
                    <span className="jp mr-1">・張力</span>T
                    <span className="jp">(</span>N
                    <span className="jp">) (弛度</span>D
                    <span className="jp">は、スパンSの </span>3
                    <span className="jp">% とする。)</span>
                  </div>
                  <div className="ml-[44px]">
                    T = <span className="jp">(</span>Wo<sup>2</sup>
                    <span className="mx-1">+</span>Po<sup>2</sup>
                    <span className="jp">)</span>
                    <sup>0.5</sup>･S<sup>2</sup>/<span className="jp">(</span>
                    8･D
                    <span className="jp">)</span>
                  </div>
                  <br />
                  <div className="flex justify-start">
                    <span className="jp mr-1">・風荷重</span>Pc
                    <span className="jp">(</span>N<span className="jp">)</span>
                  </div>
                  <div className="jp ml-[22px]">
                    風荷重は、スパンの半分を支持柱が負担する。
                  </div>
                  <div className="ml-[44px]">Pc = Po･S/2</div>
                </div>
                <br />
                <div className="flex justify-start ml-[22px]">
                  <span className="page1-number">
                    3<span className="jp">)</span>.
                  </span>
                  <span className="page1-text tracking-[0.05em]">
                    <span className="jp">計算結果</span>
                  </span>
                </div>
                <table className="border border-black border-collapse w-[55%] ml-[44px]">
                  <thead>
                    <tr>
                      <th
                        className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                        rowSpan={2}
                      >
                        No.
                      </th>
                      <th
                        className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal jp min-w-[145px]"
                        rowSpan={2}
                      >
                        名称
                      </th>
                      <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                        重量
                      </th>
                      <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                        張力
                      </th>
                      <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                        風荷重
                      </th>
                    </tr>
                    <tr>
                      <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                        Wc<span className="jp">(</span>N
                        <span className="jp">)</span>
                      </th>
                      <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                        T<span className="jp">(</span>N
                        <span className="jp">)</span>
                      </th>
                      <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                        Pc<span className="jp">(</span>N
                        <span className="jp">)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                        1
                      </td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                    </tr>
                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                        2
                      </td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                    </tr>
                    <tr>
                      <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                        3
                      </td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                      <td className="border tracking-[0.05em] text-right align-middle px-1 border-black"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =================================== PAGE 3 V60 || PAGE 4 ACT =================================== */}
      <div className="page-preview">
        <div className="page-a4">
          <div className="page-header">
            No. {cover?.calculationNumber || ""} P-
            {condition?.designStandard === "v60"
              ? hasOhw
                ? 4
                : 3
              : condition?.designStandard === "act"
                ? hasOhw
                  ? 5
                  : 4
                : ""}
          </div>

          <div>
            <div className="flex justify-start ml-[22px] leading-[1.55]">
              <span className="page1-number">
                <span className="jp">(</span>
                {hasOhw ? 3 : 2}
                <span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] mr-8 jp">
                計算結果
              </span>
              X:
              <span className="page1-text tracking-[0.05em] ml-1 jp">
                固定面からの高さ
              </span>
            </div>
            <div className="ml-[44px]">
              <table className="border border-black border-collapse w-[55%]">
                <thead>
                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 py-0.5 font-normal"
                      colSpan={5}
                    >
                      <span className="jp">鉛直荷重(</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      No.
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      検討断面高
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Wpa
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Wpp
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      ΣWp
                    </th>
                  </tr>

                  <tr>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      X<span className="jp">(</span>m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (装柱物)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (マスト)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Wpa+Wpp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2079.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2079.9
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      16.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      5125.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      5125.4
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8947.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8947.4
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      13545.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      13545.8
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      19994.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      19994.6
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      27377.1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      27377.1
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <table className="border border-black border-collapse w-[55%]">
                <thead>
                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      colSpan={5}
                    >
                      <span className="jp">風荷重(</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      No.
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      検討断面高
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Ppa
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Ppp
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      ΣPp
                    </th>
                  </tr>

                  <tr>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      X<span className="jp">(</span>m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (装柱物)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (マスト)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-[9px] font-normal">
                      Ppa+Ppp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2398.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2398.6
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      16.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      5364.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      5364.6
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8926.7
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8926.7
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12863.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12863.9
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      17113.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      17113.2
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      21594.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      21594.9
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <table className="border border-black border-collapse w-[55%]">
                <thead>
                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      colSpan={5}
                    >
                      <span className="jp">曲げモーメント(</span>N･m
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      No.
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      検討断面高
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Mpa
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Mpp
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      ΣMp
                    </th>
                  </tr>

                  <tr>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      X<span className="jp">(</span>m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (装柱物)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (マスト)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-[5px] font-normal">
                      Mpa+Mpp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4797.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4797.2
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      16.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20323.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20323.6
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      48906.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      48906.2
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      92487.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      92487.4
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      152441.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      152441.6
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      229857.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      229857.8
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-start mt-[20px]">
                <div>
                  <img
                    src="/images/antenna.png"
                    alt="antenna"
                    className="w-[265px]"
                  />
                </div>

                <div className="tracking-[0.05em] flex flex-col justify-center">
                  <div className="jp">
                    ・曲げモーメント算出式(荷重
                    <span className="text-[12pt] mx-[1.5px]">×</span>
                    荷重中心高)
                  </div>
                  <div className="ml-[22px] flex justify-start gap-1">
                    <div className="flex flex-col">
                      <div>Ma = Pa1･L1+Pa2･L2・・・</div>
                      <div>
                        Mp = Pp･h <span className="jp">(</span>h = H'/2
                        <span className="jp">)</span>
                      </div>
                    </div>
                    <div className="flex flex-col jp">
                      <div>(装柱物の曲げモーメント)</div>
                      <div>(マストの曲げモーメント)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================== PAGE 4 V60 || PAGE 5 ACT =================================== */}
      <div className="page-preview">
        <div className="page-a4">
          <div className="page-header">
            No. {cover?.calculationNumber || ""} P-
            {condition?.designStandard === "v60"
              ? hasOhw
                ? 5
                : 4
              : condition?.designStandard === "act"
                ? hasOhw
                  ? 6
                  : 5
                : ""}
          </div>

          <div className="leading-[1.37]">
            <h2 className="page1-title">
              <span className="page1-number">
                {condition?.designStandard === "v60"
                  ? 4
                  : condition?.designStandard === "act"
                    ? 5
                    : ""}
              </span>
              <span className="page1-text tracking-[0.05em] mr-2 jp">
                地震荷重算出
              </span>
              <span className="tracking-[0.05em]">
                <span className="jp">平成</span>12<span className="jp">年</span>
                5<span className="jp">月</span>31
                <span className="jp">日 建告第</span>1449
                <span className="jp">号その</span>2{" "}
                <span className="jp">に準拠する。</span>
              </span>
            </h2>
            <div className="flex justify-start ml-[22px]">
              <span className="page1-number">
                <span className="jp">(</span>1<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp mr-[135px]">
                荷重算出
              </span>
            </div>
            <div className="ml-[44px]">
              <table className="border border-black border-collapse w-[80%]">
                <thead>
                  <tr>
                    <th className="border border-black" rowSpan={2}>
                      {" "}
                    </th>
                    <th
                      className="jp border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      名称
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      重量
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0em] text-center jp align-middle px-1 font-normal">
                      荷重中心高
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      水平震度
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      地震荷重
                    </th>
                    <th
                      className="jp border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      数量
                    </th>
                  </tr>

                  <tr>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      W<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      L<span className="jp">(</span>m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      k
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Pk<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="border tracking-[0.05em] text-left align-middle px-1 border-black"
                      colSpan={2}
                    >
                      <span className="jp">装柱物 </span>Pka
                    </td>
                    <td
                      className="border tracking-[0.05em] text-center align-middle px-1 border-black"
                      colSpan={3}
                    >
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      Lighting Rod
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      127.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      63.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      10
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      3-yagi antenna
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      107.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      (6.000)
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      54.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      Mounting Bracket
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      98.1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      (6.000)
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      49.1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>

                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      Box
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      29.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      (11.000)
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      14.7
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      Co linear antenna
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      29.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      (11.000)
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      24.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      Mounting Bracket
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      205.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      (14.000)
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      103.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      7
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      Box
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      39.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      (14.000)
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      19.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      8
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      9
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      10
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      11
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      12
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      13
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      14
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      15
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      16
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      17
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      18
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      19
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      20
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td
                      className="border tracking-[0.05em] text-left align-middle px-1 border-black"
                      colSpan={2}
                    >
                      <span className="jp">マスト </span>Pkp
                    </td>
                    <td
                      className="border tracking-[0.05em] text-center align-middle px-1 border-black"
                      colSpan={3}
                    >
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      {""}
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      {""}
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      <span className="jp">マスト</span>1
                      <span className="jp">(φ</span>318.5
                      <span className="jp">)</span>
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2079.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      22.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1040.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      <span className="jp">マスト</span>2
                      <span className="jp">(φ</span>406.4
                      <span className="jp">)</span>
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      3045.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      18.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1522.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      <span className="jp">マスト</span>3
                      <span className="jp">(φ</span>508.0
                      <span className="jp">)</span>
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      3822.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      14.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1911.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      <span className="jp">マスト</span>4
                      <span className="jp">(φ</span>609.6
                      <span className="jp">)</span>
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4598.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      10.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2299.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      <span className="jp">マスト</span>5
                      <span className="jp">(φ</span>711.2
                      <span className="jp">)</span>
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      6448.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      6000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      3224.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-left align-middle px-1 border-black">
                      <span className="jp">マスト</span>6
                      <span className="jp">(φ</span>812.8
                      <span className="jp">)</span>
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      7382.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      3691.3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <div className="flex justify-start ml-[22px]">
              <span className="page1-number">
                <span className="jp">(</span>2<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">計算結果</span>
            </div>

            <div className="ml-[44px]">
              <table className="border border-black border-collapse w-[55%]">
                <thead>
                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      colSpan={5}
                    >
                      <span className="jp">地震荷重(</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      No.
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      検討断面高
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Pka
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Pkp
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      ΣPk
                    </th>
                  </tr>

                  <tr>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      X<span className="jp">(</span>m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (装柱物)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (マスト)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-[9px] font-normal">
                      Pka+Pkp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1040.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1040.0
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      16.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2562.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2562.8
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4473.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4473.8
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      6773.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      6773.0
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      9997.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      9997.4
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      13688.7
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      13688.7
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <table className="border border-black border-collapse w-[55%]">
                <thead>
                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      colSpan={5}
                    >
                      <span className="jp">曲げモーメント(</span>N･m
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      No.
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      検討断面高
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Mka
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      Mkp
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      ΣMk
                    </th>
                  </tr>

                  <tr>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      X<span className="jp">(</span>m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (装柱物)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (マスト)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-[5px] font-normal">
                      Mka+Mkp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2080.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2080.0
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      16.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      9285.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      9285.6
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      23358.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      23358.8
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      45852.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      45852.4
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      79393.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      79393.2
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      126765.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      126765.4
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* =================================== PAGE 5 V60 || PAGE 6 ACT =================================== */}
      <div className="page-preview">
        <div className="page-a4">
          <div className="page-header">
            No. {cover?.calculationNumber || ""} P-
            {condition?.designStandard === "v60"
              ? hasOhw
                ? 6
                : 5
              : condition?.designStandard === "act"
                ? hasOhw
                  ? 7
                  : 6
                : ""}
          </div>

          <div className="leading-[1.39]">
            <h2 className="page1-title">
              <span className="page1-number">
                {condition?.designStandard === "v60"
                  ? 5
                  : condition?.designStandard === "act"
                    ? 6
                    : ""}
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                荷重の比較(応力のまとめ)
              </span>
            </h2>
            <div className="ml-[22px] tracking-[0.05em]">
              <div className="jp">
                各検討断面について、風時と地震時の曲げモーメントを比較し応力の大きい方で検討を行なう。
              </div>
              <table className="border border-black border-collapse w-[95%]">
                <thead>
                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      No.
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      検討断面高
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      ΣMp<span className="jp">(</span>N･m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      ΣMk<span className="jp">(</span>N･m
                      <span className="jp">)</span>
                    </th>
                    <th
                      className="jp border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      判定
                    </th>
                    <th
                      className="jp border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                      colSpan={3}
                    >
                      検討応
                    </th>
                  </tr>

                  <tr>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      X<span className="jp">(</span>m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (風時)
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center jp align-middle px-1 font-normal">
                      (地震時)
                    </th>
                    <th className="border border-black tracking-[0.05em] text-center align-middle px-[5px] font-normal">
                      ΣW<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="border border-black tracking-[0.05em] text-center align-middle px-[5px] font-normal">
                      ΣP<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="border border-black tracking-[0.05em] text-center align-middle px-[5px] font-normal">
                      ΣM<span className="jp">(</span>N･m
                      <span className="jp">)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4797.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2080.0
                    </td>
                    <td className="jp border tracking-[0.05em] text-center align-middle px-1 border-black">
                      風荷重で検討
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2079.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2398.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4797.2
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      16.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20323.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      9285.6
                    </td>
                    <td className="jp border tracking-[0.05em] text-center align-middle px-1 border-black">
                      風荷重で検討
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      5125.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      5364.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20323.6
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      48906.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      23358.8
                    </td>
                    <td className="jp border tracking-[0.05em] text-center align-middle px-1 border-black">
                      風荷重で検討
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8947.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8926.7
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      48906.2
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      92487.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      45852.4
                    </td>
                    <td className="jp border tracking-[0.05em] text-center align-middle px-1 border-black">
                      風荷重で検討
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      13545.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12863.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      92487.4
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      152441.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      79393.2
                    </td>
                    <td className="jp border tracking-[0.05em] text-center align-middle px-1 border-black">
                      風荷重で検討
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      19994.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      17113.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      152441.6
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      229857.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      126765.4
                    </td>
                    <td className="jp border tracking-[0.05em] text-center align-middle px-1 border-black">
                      風荷重で検討
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      27377.1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      21594.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      229857.8
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2 className="page1-title mt-[20px]">
              <span className="page1-number">
                {condition?.designStandard === "v60"
                  ? 6
                  : condition?.designStandard === "act"
                    ? 7
                    : ""}
              </span>
              <span className="page1-text tracking-[0.05em] jp">強度判定</span>
            </h2>
            <div className="flex justify-start ml-[22px]">
              <span className="page1-number">
                <span className="jp">(</span>1<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp mr-[135px]">
                検討方法
              </span>
            </div>
            <div className="ml-[44px] tracking-[0.05em]">
              <div className="jp">
                各検討断面において次式を満たした時、安全である。
              </div>
              <div className="flex ml-[44px] mt-2">
                <div className="mr-12">
                  <div className="flex items-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <div className="border-b border-black px-2.5">σc</div>
                      <div>1.5･fc</div>
                    </div>
                    <div className="mx-1">+</div>
                    <div className="flex flex-col items-center">
                      <div className="border-b border-black px-1.5">σb</div>
                      <div>sfb</div>
                    </div>
                    <div className="mx-1.5">≦</div>
                    <div className="flex items-center">1.0</div>
                  </div>
                </div>
                <div className="mr-1">
                  <div className="flex flex-col">
                    <div>
                      σc: <span className="jp">圧縮応力度(</span>N/mm
                      <sup>2</sup>
                      <span className="jp">)</span>
                    </div>
                    <div>
                      σb: <span className="jp">曲げ応力度(</span>N/mm
                      <sup>2</sup>
                      <span className="jp">)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col">
                    <div>σc = W/A</div>
                    <div>σb = M/Z</div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="flex justify-start ml-[22px]">
              <span className="page1-number">
                <span className="jp">(</span>2<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp mr-1">
                許容圧縮応力度の算出
              </span>
              fc
            </div>
            <div className="flex gap-14 ml-[44px] tracking-[0.05em]">
              <div>
                <div>
                  λ ≦ Λ<span className="jp">のとき</span>
                </div>
                <div className="ml-[22px]">
                  fc = <span className="jp">{"{"}</span>1-0.4･
                  <span className="jp">(</span>λ/Λ<span className="jp">)</span>
                  <sup>2</sup>
                  <span className="jp">{"}"}</span>･F/ν
                </div>
                <div>
                  λ {">"} Λ<span className="jp">のとき</span>
                </div>
                <div className="ml-[22px]">
                  fc = 0.277･F/
                  <span className="jp">(</span>λ/Λ<span className="jp">)</span>
                  <sup>2</sup>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="flex flex-col">
                  <div>λ</div>
                  <br />
                  <div>Λ</div>
                  <br />
                  <div>ν</div>
                </div>
                <div className="flex flex-col mr-1">
                  <div>:</div>
                  <br />
                  <div>:</div>
                  <br />
                  <div>:</div>
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    <div className="jp">圧縮材の細長比</div>
                    <div>λ = Lk/i</div>
                  </div>
                  <div className="ml-[15px] flex gap-8">
                    <div className="jp">座屈長</div>
                    <div>
                      Lk = 2･L<span className="jp">(</span>L
                      <span className="jp">は検討断面より上部材長)</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="jp">限界細長比</div>
                    <div>
                      Λ= <span className="jp">{"{"}(</span>π<sup>2</sup>・E
                      <span className="jp">)</span>
                      <span className="jp">(</span>0.6・F
                      <span className="jp">){"}"}</span>
                      <sup>0.5</sup>
                    </div>
                  </div>
                  <div className="ml-[15px] flex gap-2">
                    <div className="jp">ヤング係数</div>
                    <div>
                      E = 205000 N/mm<sup>2</sup>
                    </div>
                  </div>
                  <div className="flex gap-9">
                    <div className="jp">安全率</div>
                    <div>
                      ν = 3/2+2/3・<span className="jp">(</span>λ/Λ
                      <span className="jp">)</span>
                      <sup>2</sup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <table className="ml-[44px] border border-black border-collapse w-[50%]">
              <thead>
                <th className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                  No.
                </th>
                <th className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                  Lk<span className="jp">(</span>cm<span className="jp">)</span>
                </th>
                <th className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                  λ
                </th>
                <th className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                  Λ
                </th>
                <th className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                  ν
                </th>
                <th className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                  fc<span className="jp">(</span>N/mm<sup>2</sup>
                  <span className="jp">)</span>
                </th>
              </thead>
              <tbody>
                <tr>
                  <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                    1
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    800.0
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    72.6
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    120
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    1.74
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    115.3
                  </td>
                </tr>
                <tr>
                  <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                    2
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    1600.0
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    113.6
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    120
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    2.10
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    71.8
                  </td>
                </tr>
                <tr>
                  <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                    3
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    2400.0
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    135.7
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    120
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    2.35
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    50,9
                  </td>
                </tr>
                <tr>
                  <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                    4
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    3200.0
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    150.4
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    120
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    2.55
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    41.4
                  </td>
                </tr>
                <tr>
                  <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                    5
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    4000.0
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    161.2
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    120
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    2.70
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    36.1
                  </td>
                </tr>
                <tr>
                  <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                    6
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    4800.0
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    169.0
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    120
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    2.82
                  </td>
                  <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                    32.8
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <div className="ml-[22px]">
              <div className="flex justify-start">
                <span className="page1-number">
                  <span className="jp">(</span>3<span className="jp">)</span>.
                </span>
                <span className="page1-text tracking-[0.05em] jp">
                  算定結果
                </span>
              </div>
              <table className="ml-[22px] border border-black border-collapse w-[70%]">
                <thead>
                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1.5 font-normal"
                      rowSpan={2}
                    >
                      No.
                    </th>
                    <th className="border-r border-l border-t border-black pt-0.5 tracking-[0.05em] jp text-center align-middle px-1 font-normal">
                      検討断面高
                    </th>
                    <th
                      className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      W<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th
                      className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      A<span className="jp">(</span>cm<sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      σc
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      fc
                    </th>
                    <th
                      className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      σc/<span className="jp">(</span>1.5･fc
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  <tr>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      X<span className="jp">(</span>m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      <span className="jp">(</span>N/mm<sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      <span className="jp">(</span>N/mm<sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2079.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      67.55
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      115.3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.002
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      16.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      5125.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      98.90
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      71.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.005
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8947.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      124.12
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.7
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      50.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.009
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      13545.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      149.33
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.9
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      41.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.014
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      19994.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      209.42
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      36.1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.018
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      27377.1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      239.75
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1.1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      32.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.022
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <table className="ml-[22px] border border-black border-collapse w-[95%]">
                <thead>
                  <tr>
                    <th
                      className="border tracking-[0.05em] border-black text-center align-middle px-1.5 font-normal"
                      rowSpan={2}
                    >
                      No.
                    </th>
                    <th className="border-r border-l border-t border-black pt-0.5 tracking-[0.05em] jp text-center align-middle px-1 font-normal">
                      検討断面高
                    </th>
                    <th
                      className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      M<span className="jp">(</span>N･m
                      <span className="jp">)</span>
                    </th>
                    <th
                      className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      A<span className="jp">(</span>cm<sup>3</sup>
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      σb
                    </th>
                    <th className="border-r border-l border-t border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      sfb
                    </th>
                    <th
                      className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      σb/sfb
                    </th>
                    <th
                      className="border border-black tracking-[0.05em] text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      σc/<span className="jp">(</span>1.5･fc
                      <span className="jp">)</span>+σb/sfb
                    </th>
                    <th
                      className="border border-black tracking-[0.05em] jp text-center align-middle px-1 font-normal"
                      rowSpan={2}
                    >
                      判定
                    </th>
                  </tr>

                  <tr>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      X<span className="jp">(</span>m
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      <span className="jp">(</span>N/mm<sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                    <th className="border-r border-l border-b border-black tracking-[0.05em] text-center align-middle px-1 font-normal">
                      <span className="jp">(</span>N/mm<sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      1
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4797.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      515.03
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      9.3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      235
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.040
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      0.042 ≦ 1.0
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-3 border-black">
                      O.K
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      16.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      20323.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      966.54
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      21.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      235
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.089
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      0.094 ≦ 1.0
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      O.K
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      12.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      48906.2
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      1528.03
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      32.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      235
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.136
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      0.145 ≦ 1.0
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      O.K
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      8.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      92487.4
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      2217.62
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      41.7
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      235
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.177
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      0.191 ≦ 1.0
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      O.K
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      5
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      152441.6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      3625.40
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      42.0
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      235
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.179
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      0.197 ≦ 1.0
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      O.K
                    </td>
                  </tr>

                  <tr>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      6
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.000
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      229857.8
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      4759.09
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      48.3
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      235
                    </td>
                    <td className="border tracking-[0.05em] text-right align-middle px-1 border-black">
                      0.206
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      0.228 ≦ 1.0
                    </td>
                    <td className="border tracking-[0.05em] text-center align-middle px-1 border-black">
                      O.K
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <div
                className="ml-[44px] jp tracking-[0.05em]
                inline-block relative pb-[2.5px]
                before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-[2.5px] before:border-b before:border-black
                after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b after:border-black
              "
              >
                以上の結果より、この柱は強度的安全性を確保出来る。
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
