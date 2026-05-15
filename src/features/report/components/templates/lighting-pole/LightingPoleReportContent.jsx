import React from "react";
import {
  formatDateYS,
  getDesignStandardText,
} from "../../../utils/reportFormatters";
import "../../../styles/report.css";

export default function LightingPoleReportContent({
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
              <p className="cover-row-1 ml-[10px] tracking-[0.1em]">
                <span className="jp">管理記号:</span>
                <span> {cover?.managementCode ?? ""}</span>
              </p>
              <div className="cover-row-1 mr-[10px] flex justify-center items-center">
                <span className="tracking-[0.1em] jp">計算書番号:</span>
                <span> {cover?.calculationNumber ?? ""}</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="cover-row-2 ml-[10px] jp">殿</div>

            {/* Main title */}
            <h1 className="cover-title text-center jp">強 度 計 算 書</h1>

            {/* Project information block */}
            <div className="cover-double-line">
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
              {cover?.date ? formatDateYS(cover.date) : ""}
            </div>
            <img
              src="/images/ys-logo.png"
              alt="logo YS"
              className="mx-auto w-[300px] h-auto"
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
              <span className="page1-text tracking-[0.1em] jp">計算条件</span>
            </h2>

            {/* 1) Design standard */}
            <div className="page1-item">
              <span className="page1-number">1).</span>
              <span className="page1-text tracking-[0.1em] jp">設計基準</span>
              <span className="page1-text tracking-[0.1em] jp ml-[8px] mr-[8px]">
                :
              </span>
              <span className="page1-text tracking-[0.1em] jp">
                {getDesignStandardText(condition?.designStandard)}
              </span>
            </div>

            {/* 2) Wind speed */}
            <div className="page1-item">
              <span className="page1-number">2).</span>
              <span className="page1-text tracking-[0.1em] jp">設計風速</span>
              <span className="page1-text tracking-[0.1em] jp ml-[8px] mr-[8px]">
                :
              </span>
              <span className="page1-text">
                V = {condition?.designWindSpeed ?? ""} m/s
              </span>
            </div>

            {/* 3) Wind load calculation */}
            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">3).</span>
                <span className="page1-text tracking-[0.1em] jp">風荷重</span>
                <span className="page1-text tracking-[0.1em] jp ml-[22.8px] mr-[8px]">
                  :
                </span>
                <span className="page1-text">P = q・C・A (N)</span>
              </div>

              <div className="flex ml-[44px] tracking-[0.1em] jp">ここで</div>

              <div className="flex ml-[68px] flex-col">
                <div className="flex justify-start">
                  <span>q:</span>
                  <span className="jp tracking-[0.1em] ml-[6px]">速度圧</span>
                  <span className="mr-[22px]">
                    (N/m<sup>2</sup>)
                  </span>
                  <span className="jp tracking-[0.1em] mr-[3px]">空気密度</span>
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
                  <span className="jp tracking-[0.1em] ml-[4px]">風力係数</span>
                </div>
                <div className="flex justify-start ml-[19px]">
                  <span className="jp tracking-[0.1em] mr-[2px]">○鋼管:</span>
                  <span className="mr-9">0.7</span>
                  {/* <span className="jp tracking-[0.1em] mr-[2px]">灯具:</span>
                  <span>1.0</span> */}
                </div>

                <div className="flex justify-start">
                  <span>A:</span>
                  <span className="jp tracking-[0.1em] ml-[4px]">
                    受風圧面積
                  </span>
                  <span>
                    (m<sup>2</sup>)
                  </span>
                </div>
              </div>
            </div>

            {/* 4) Allowable stress */}
            <div className="flex flex-col mb-[20px]">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">4).</span>
                <span className="page1-text jp tracking-[0.1em]">
                  短期許容曲げ応力度
                </span>
                <span className="page1-text">(SS400, STK400, STKR400)</span>
              </div>
              <div className="flex ml-[44px]">
                <span className="mr-[4px] tracking-[0.1em]">sfb</span>
                <span>
                  = 235 N/mm<sup>2</sup>
                </span>
              </div>
            </div>

            {/* 5) Pole specification */}
            <div className="flex flex-col">
              <div className="flex justify-start ml-[22px] mb-0">
                <span className="page1-number">5).</span>
                <span className="page1-text jp tracking-[0.1em]">
                  支持柱の仕様
                </span>
              </div>

              <div className="ml-[44px] grid grid-cols-2 gap-y-[20px] w-[45%]">
                {results?.map((r, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col">
                      <div className="flex">
                        <span className="mr-1 jp tracking-[0.1em]">
                          {r?.name ?? ""}:
                        </span>
                        <span className="jp">φ</span>
                        <span className="tracking-[0.05em]">
                          {r?.lowerDiameter?.toFixed(1) ?? ""}
                        </span>
                        <span className="text-[10.5pt] mx-[1.5px]">×</span>
                        <span className="tracking-[0.05em]">
                          t{r?.lowerThickness?.toFixed(1) ?? ""}
                        </span>
                      </div>
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
                            {r?.fixLoad?.toFixed(2) ?? ""} kg/m
                          </div>
                          <div className="tracking-[0.05em]">
                            {r?.momentInertia?.toFixed(2) ?? ""} cm<sup>4</sup>
                          </div>
                          <div className="tracking-[0.05em]">
                            {r?.radiusGyration?.toFixed(2) ?? ""} cm
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex">{r?.material ?? ""}</div>
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
                            {r?.crossSectionArea?.toFixed(2) ?? ""} cm
                            <sup>2</sup>
                          </div>
                          <div className="tracking-[0.05em]">
                            {r?.sectionModulus?.toFixed(2) ?? ""} cm<sup>3</sup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
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
              No. {cover?.calculationNumber ?? ""} P-{i + 2}
            </div>
            <div className="page1-content">{pageBlocks}</div>
          </div>
        </div>
      ))}
    </>
  );
}
