import React from "react";
import { getRowsForStep } from "../../../utils/reportFormatters";

const toNumFixed = (val, digits = 1) => {
  if (val === undefined || val === null || val === "" || isNaN(Number(val)))
    return "";
  const n = Number(val);
  return n.toFixed(digits);
};

const formatSpecNum = (val, maxDecimals = 1) => {
  if (val === undefined || val === null || val === "" || isNaN(Number(val)))
    return "";
  const num = Number(val);
  if (Math.abs(num - Math.round(num)) < 0.0001) {
    return String(Math.round(num));
  }
  return Number(num.toFixed(maxDecimals)).toString();
};

const formatAoArea = (val, defaultDecimals = 3) => {
  if (val === undefined || val === null || val === "" || isNaN(Number(val)))
    return "";
  const num = Number(val);
  if (num === 0) return "0";
  if (num < 0.1) return num.toFixed(4);
  return num.toFixed(defaultDecimals);
};

const formatAoWeight = (val, defaultDecimals = 1) => {
  if (val === undefined || val === null || val === "" || isNaN(Number(val)))
    return "";
  const num = Number(val);
  if (num === 0) return "0";
  if (defaultDecimals === 1) {
    return num.toFixed(1);
  }
  return Number(num.toFixed(2)).toString();
};

const formatAoDist = (val) => {
  if (val === undefined || val === null || val === "" || isNaN(Number(val)))
    return "";
  return Math.round(Number(val)).toString();
};

const renderJpText = (str) => {
  if (!str) return "";
  const parts = String(str).split(/([()（）])/g);
  return parts.map((part, idx) =>
    part === "(" || part === ")" || part === "（" || part === "）" ? (
      <span key={idx} className="jp">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const hasJapaneseChar = (str) =>
  /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(
    str,
  );

const getPoleTypeDesc = (p, index = 0, totalPoles = 1) => {
  // Excel logic: =IF(Data!B30="Straight","","t"&Data!F30&Data!T30)
  const typeStr = String(p?.poleType || p?.typeofTaper || p?.type || "")
    .trim()
    .toLowerCase();

  // If pole is Straight, return empty string ""
  if (typeStr === "straight") {
    return "";
  }

  const thick = toNumFixed(p?.lowerThickness ?? p?.thickness ?? 4, 0);
  const tPrefix = thick ? `t${thick} ` : "";

  // 1. If typeofTaper or name already contains Japanese text (e.g. "温間スピニングテーパー柱", "1/100テーパー柱")
  if (p?.typeofTaper && hasJapaneseChar(p.typeofTaper)) {
    return `${tPrefix}${p.typeofTaper}`;
  }
  if (
    p?.name &&
    hasJapaneseChar(p.name) &&
    (p.name.includes("スピニング") ||
      p.name.includes("温間") ||
      p.name.includes("テーパー"))
  ) {
    return `${tPrefix}${p.name}`;
  }

  // 2. Check if 1/100 taper explicitly
  const taperStr = String(p?.taperRatio || p?.typeofTaper || "");
  if (taperStr.includes("1/100")) {
    return `${tPrefix}1/100テーパー柱`;
  }

  // 3. Multi-pole stepped system bottom pole check (e.g. Pole 2 in 2-pole system with diameter >= 200)
  if (
    totalPoles > 1 &&
    index === totalPoles - 1 &&
    Number(p?.lowerDiameter || 0) >= 200
  ) {
    return `${tPrefix}1/100テーパー柱`;
  }

  // Default for Taper: 温間スピニングテーパー柱
  return `${tPrefix}温間スピニングテーパー柱`;
};

const getPoleSpecs = (p) => {
  const dia = Number(p?.lowerDiameter ?? 197);
  const thick = Number(p?.lowerThickness ?? p?.thickness ?? 4);
  const material = p?.material || "STK400";
  const L = Number(
    p?.length ?? p?.heightSection ?? (p?.zHeight ? Number(p.zHeight) : 3500),
  );

  const d = Math.max(0, dia - 2 * thick);
  const calcA = ((Math.PI / 4) * (dia * dia - d * d)) / 100;
  const A = p?.crossSectionArea ?? p?.sectionArea ?? calcA;

  const calcImm4 = (Math.PI / 64) * (Math.pow(dia, 4) - Math.pow(d, 4));
  let I = p?.momentInertia ?? p?.I;
  if (!I || I <= 0) {
    I = calcImm4;
  } else if (I < 100000) {
    I = I * 10000;
  }

  const calcZmm3 = calcImm4 / (dia / 2);
  let Z = p?.sectionModulus ?? p?.Z;
  if (!Z || Z <= 0) {
    Z = calcZmm3;
  } else if (Z < 10000) {
    Z = Z * 1000;
  }

  const calcIcm = Math.sqrt((dia * dia + d * d) / 16) / 10;
  const i = p?.radiusGyration ?? p?.i ?? calcIcm;

  const calcW_Nm = Number(A) * 0.785 * 9.80665;
  const w = p?.fixLoadM ?? p?.w ?? calcW_Nm;
  const W = p?.fixLoad ?? p?.W ?? Number(w) * (L / 1000);

  const upperDia = Number(p?.upperDiameter ?? dia);
  const avgDia = (dia + upperDia) / 2;
  const calcAp = (avgDia / 1000) * (L / 1000);
  const Ap = p?.frontArea ?? p?.windLoadAreaFront ?? p?.Ap ?? calcAp;

  return {
    dia,
    thick,
    material,
    L,
    w,
    W,
    A,
    I,
    Z,
    i,
    Ap,
  };
};

const getArmSpecs = (arm, index) => {
  const dia = Number(arm?.diameter ?? 101.6);
  const thick = Number(arm?.thickness ?? 4.2);
  const material = arm?.material || "STK400";
  const L = Number(arm?.length ?? 4000);
  const H = Number(arm?.zHeight ?? arm?.height ?? 6000);

  const d = Math.max(0, dia - 2 * thick);
  const calcA = ((Math.PI / 4) * (dia * dia - d * d)) / 100;
  const A = arm?.sectionArea ?? arm?.crossSectionArea ?? arm?.A ?? calcA;

  const calcImm4 = (Math.PI / 64) * (Math.pow(dia, 4) - Math.pow(d, 4));
  let I = arm?.momentInertia ?? arm?.I;
  if (!I || I <= 0) {
    I = calcImm4;
  } else if (I < 100000) {
    I = I * 10000;
  }

  const calcZmm3 = calcImm4 / (dia / 2);
  let Z = arm?.sectionModulus ?? arm?.Z;
  if (!Z || Z <= 0) {
    Z = calcZmm3;
  } else if (Z < 10000) {
    Z = Z * 1000;
  }

  const calcIcm = Math.sqrt((dia * dia + d * d) / 16) / 10;
  const i = arm?.radiusGyration ?? arm?.i ?? calcIcm;

  const calcW_Nm = Number(A) * 0.785 * 9.80665;
  const w = arm?.fixLoadM ?? arm?.w ?? calcW_Nm;
  const W = arm?.fixLoad ?? arm?.weight ?? arm?.W ?? Number(w) * (L / 1000);

  const calcAf = (dia / 1000) * (L / 1000);
  const Af = arm?.frontArea ?? arm?.Af ?? calcAf;

  return {
    name: arm?.name || `アーム${index + 1}`,
    dia,
    thick,
    material,
    L,
    H,
    w,
    W,
    A,
    I,
    Z,
    i,
    Af,
  };
};

export const createBlocks = (
  results = [],
  resultsDo = [],
  poleConfig = {},
  resultsArm = [],
  _condition = {},
  resultsOhw = [],
) => {
  const blocks = [];
  let sectionCounter = 0;

  // ── 1. Resolve arms list ──
  let effectiveArms =
    Array.isArray(resultsArm) && resultsArm.length > 0 ? resultsArm : [];
  if (
    effectiveArms.length === 0 &&
    Array.isArray(poleConfig?.arms) &&
    poleConfig.arms.length > 0
  ) {
    effectiveArms = poleConfig.arms;
  }
  if (effectiveArms.length === 0) {
    try {
      const savedArms = JSON.parse(
        sessionStorage.getItem("lighting-project_arms") ||
          sessionStorage.getItem("arms") ||
          "[]",
      );
      if (Array.isArray(savedArms) && savedArms.length > 0) {
        effectiveArms = savedArms;
      }
    } catch (e) {
      void e;
    }
  }

  // ── 1.2 Resolve direct objects list ──
  // Note: For standard taper pole types LA, LS, TA, TS, all objects belong to the arm (Arm Objects).
  // Only types IA and IS have Direct Objects mounted directly to the pole.
  let standardPoleType = "";
  try {
    const std = JSON.parse(
      sessionStorage.getItem("lighting-project_taperPoleStandard") ||
        sessionStorage.getItem("taperPoleStandard") ||
        "null",
    );
    if (std?.poleType) standardPoleType = String(std.poleType).toUpperCase();
  } catch (e) {
    void e;
  }
  if (!standardPoleType && _condition?.standardPoleType) {
    standardPoleType = String(_condition.standardPoleType).toUpperCase();
  }
  if (!standardPoleType && _condition?.taperPoleStandard?.poleType) {
    standardPoleType = String(
      _condition.taperPoleStandard.poleType,
    ).toUpperCase();
  }
  if (!standardPoleType && poleConfig?.standardPoleType) {
    standardPoleType = String(poleConfig.standardPoleType).toUpperCase();
  }
  if (!standardPoleType && poleConfig?.taperPoleStandard?.poleType) {
    standardPoleType = String(
      poleConfig.taperPoleStandard.poleType,
    ).toUpperCase();
  }
  const stdId = String(
    _condition?.standardId || poleConfig?.standardId || "",
  ).toUpperCase();
  if (!standardPoleType && stdId) {
    const match = stdId.match(/^(LA|LS|TA|TS|IA|IS)/);
    if (match) standardPoleType = match[1];
  }
  if (
    !standardPoleType &&
    typeof window !== "undefined" &&
    window.sessionStorage
  ) {
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.endsWith("taperPoleStandard")) {
          const val = JSON.parse(sessionStorage.getItem(k) || "null");
          if (val?.poleType) {
            standardPoleType = String(val.poleType).toUpperCase();
            break;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  const filterDirectOnly = (arr) =>
    (arr || []).filter(
      (d) =>
        d &&
        d.sourceType !== "arm" &&
        !(effectiveArms.length > 0 && Number(d.zHeight || 0) <= 500),
    );

  let effectiveDirectObjects = [];
  if (Array.isArray(resultsDo) && resultsDo.length > 0) {
    effectiveDirectObjects = filterDirectOnly(resultsDo);
  } else if (
    Array.isArray(poleConfig?.directObjects) &&
    poleConfig.directObjects.length > 0
  ) {
    effectiveDirectObjects = filterDirectOnly(poleConfig.directObjects);
  } else {
    try {
      const savedDo = JSON.parse(
        sessionStorage.getItem("lighting-project_directObjects") ||
          sessionStorage.getItem("directObjects") ||
          "[]",
      );
      if (Array.isArray(savedDo) && savedDo.length > 0) {
        effectiveDirectObjects = filterDirectOnly(savedDo);
      }
    } catch (e) {
      void e;
    }
  }

  // ── 1.3 Resolve overhead wires list ──
  let effectiveOverheadWires =
    Array.isArray(resultsOhw) && resultsOhw.length > 0 ? resultsOhw : [];
  if (
    effectiveOverheadWires.length === 0 &&
    Array.isArray(poleConfig?.overheadWires) &&
    poleConfig.overheadWires.length > 0
  ) {
    effectiveOverheadWires = poleConfig.overheadWires;
  }
  if (effectiveOverheadWires.length === 0) {
    try {
      const savedOhw = JSON.parse(
        sessionStorage.getItem("lighting-project_overheadWires") ||
          sessionStorage.getItem("overheadWires") ||
          "[]",
      );
      if (Array.isArray(savedOhw) && savedOhw.length > 0) {
        effectiveOverheadWires = savedOhw;
      }
    } catch (e) {
      void e;
    }
  }

  // Dynamic counter for sub-sections under 3. 構造概要
  let subCounter = 2;
  const armSubNumber = effectiveArms.length > 0 ? subCounter++ : null;
  const aoSubNumber = effectiveArms.length > 0 ? subCounter++ : null;
  const doSubNumber = effectiveDirectObjects.length > 0 ? subCounter++ : null;
  const ohwSubNumber = effectiveOverheadWires.length > 0 ? subCounter++ : null;

  // ── 2. Block: 3. 構造概要 - (1). 支持柱の仕様 ──
  blocks.push({
    id: "overview-poles",
    node: (
      <section className="pt-[20px]">
        {/* Main Title: 3. 構造概要 */}
        <h2 className="page1-title mb-[2px]">
          <span className="page1-number">3.</span>
          <span className="page1-text tracking-[0.05em] jp">構造概要</span>
        </h2>

        {/* Sub Title: (1). 支持柱の仕様 */}
        <div className="flex justify-start ml-[22px] mb-[4px]">
          <span className="page1-number">
            <span className="jp">(</span>1<span className="jp">)</span>.
          </span>
          <span className="page1-text tracking-[0.05em] jp ml-1">
            支持柱の仕様
          </span>
        </div>

        {/* Dynamic Pole entries */}
        <div className="flex flex-col gap-y-[18px]">
          {results?.map((pole, index) => {
            const spec = getPoleSpecs(pole, index, results);
            const desc = getPoleTypeDesc(pole, index, results?.length || 1);
            return (
              <div key={index} className="ml-[66px]">
                {/* Line 1: Pole{N} (支柱) : {desc} */}
                <div className="flex items-baseline text-[9.5pt]">
                  <span className="w-[80px] inline-block tracking-[0.05em]">
                    Pole{index + 1} <span className="jp">(支柱)</span>
                  </span>
                  <span className="ml-2 mr-4 jp">:</span>
                  {desc ? (
                    <span className="tracking-[0.05em] jp">{desc}</span>
                  ) : null}
                </div>

                {/* Line 2: φ{dia} × t{thick} (material) */}
                <div className="ml-[24px] text-[9.5pt] mb-1">
                  <span className="jp">φ</span>
                  {toNumFixed(spec.dia, 0)}
                  <span className="text-[11pt] jp mx-[2px]">×</span>
                  <span className="jp">t</span>
                  {toNumFixed(spec.thick, 0)}
                  <span className="ml-1 jp">(</span>
                  {spec.material}
                  <span className="jp">)</span>
                </div>

                {/* 3 Columns Grid for Pole Parameters */}
                <div className="grid grid-cols-[165px_165px_165px] gap-x-6 text-[9.5pt] ml-[24px] leading-relaxed">
                  {/* Row 1 */}
                  <div className="flex items-baseline">
                    <span className="w-[18px] inline-block">w</span>
                    <span className="mx-1.5">=</span>
                    <span className="tabular-nums">
                      {formatSpecNum(spec.w, 0)} N/m
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[18px] inline-block">A</span>
                    <span className="mx-1.5">=</span>
                    <span className="tabular-nums">
                      {formatSpecNum(spec.A, 0)} cm<sup>2</sup>
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[24px] inline-block">W</span>
                    <span className="mx-1.5">=</span>
                    <span className="tabular-nums">
                      {formatSpecNum(spec.W, 0)} N
                    </span>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-baseline">
                    <span className="w-[18px] inline-block">I</span>
                    <span className="mx-1.5">=</span>
                    <span className="tabular-nums">
                      {formatSpecNum(spec.I, 0)} m<sup>4</sup>
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[18px] inline-block">Z</span>
                    <span className="mx-1.5">=</span>
                    <span className="tabular-nums">
                      {formatSpecNum(spec.Z, 0)} m<sup>3</sup>
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[24px] inline-block">Ap</span>
                    <span className="mx-1.5">=</span>
                    <span className="tabular-nums">
                      {formatSpecNum(spec.Ap, 3)} m<sup>2</sup>
                    </span>
                  </div>

                  {/* Row 3 */}
                  <div className="flex items-baseline">
                    <span className="w-[18px] inline-block">i</span>
                    <span className="mx-1.5">=</span>
                    <span className="tabular-nums">
                      {toNumFixed(spec.i, 2)} cm
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[18px] inline-block">L</span>
                    <span className="mx-1.5">=</span>
                    <span className="tabular-nums">
                      {formatSpecNum(spec.L, 0)} mm
                    </span>
                  </div>
                  <div></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    ),
  });

  // ── 3. Block: ({armSubNumber}). アームの仕様 (only when arms exist) ──
  if (effectiveArms.length > 0) {
    blocks.push({
      id: "overview-arms",
      node: (
        <section className="pt-[18px]">
          {/* Sub Title: ({armSubNumber}). アームの仕様 */}
          <div className="flex justify-start ml-[22px] mb-[4px]">
            <span className="page1-number">
              <span className="jp">(</span>
              {armSubNumber}
              <span className="jp">)</span>.
            </span>
            <span className="page1-text tracking-[0.05em] jp ml-1">
              アームの仕様
            </span>
          </div>

          <div className="flex flex-col gap-y-[18px]">
            {effectiveArms.map((arm, index) => {
              const spec = getArmSpecs(arm, index);
              return (
                <div key={index} className="ml-[66px]">
                  {/* Line 1: Arm{N} (name) : φD × tT (material) */}
                  <div className="flex items-baseline text-[9.5pt] mb-1">
                    <span className="w-[185px] inline-block tracking-[0.05em]">
                      Arm{index + 1} <span className="jp">({spec.name})</span>
                    </span>
                    <span className="mx-2 jp">:</span>
                    <span className="tracking-[0.05em]">
                      <span className="jp">φ</span>
                      {toNumFixed(spec.dia, 1)}
                      <span className="text-[11pt] jp mx-[1px]">×</span>
                      <span className="jp">t</span>
                      {toNumFixed(spec.thick, 1)}
                      <span className="ml-1 jp">(</span>
                      {spec.material}
                      <span className="jp">)</span>
                    </span>
                  </div>

                  {/* 3 Columns Grid for Arm Parameters */}
                  <div className="grid grid-cols-[165px_165px_165px] gap-x-6 text-[9.5pt] ml-[24px] leading-relaxed">
                    {/* Row 1 */}
                    <div className="flex items-baseline">
                      <span className="w-[18px] inline-block">w</span>
                      <span className="mx-1.5">=</span>
                      <span className="tabular-nums">
                        {formatSpecNum(spec.w, 1)} N/m
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-[18px] inline-block">Z</span>
                      <span className="mx-1.5">=</span>
                      <span className="tabular-nums">
                        {formatSpecNum(spec.Z, 0)} m<sup>3</sup>
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-[24px] inline-block">Af</span>
                      <span className="mx-1.5">=</span>
                      <span className="tabular-nums">
                        {formatSpecNum(spec.Af, 4)} m<sup>2</sup>
                      </span>
                    </div>

                    {/* Row 2 */}
                    <div className="flex items-baseline">
                      <span className="w-[18px] inline-block">I</span>
                      <span className="mx-1.5">=</span>
                      <span className="tabular-nums">
                        {formatSpecNum(spec.I, 0)} cm<sup>4</sup>
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-[18px] inline-block">L</span>
                      <span className="mx-1.5">=</span>
                      <span className="tabular-nums">
                        {formatSpecNum(spec.L, 0)} mm
                      </span>
                    </div>
                    <div></div>

                    {/* Row 3 */}
                    <div className="flex items-baseline">
                      <span className="w-[18px] inline-block">i</span>
                      <span className="mx-1.5">=</span>
                      <span className="tabular-nums">
                        {toNumFixed(spec.i, 2)} cm
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-[18px] inline-block">H</span>
                      <span className="mx-1.5">=</span>
                      <span className="tabular-nums">
                        {formatSpecNum(spec.H, 0)} mm
                      </span>
                    </div>
                    <div></div>

                    {/* Row 4 */}
                    <div className="flex items-baseline">
                      <span className="w-[18px] inline-block">A</span>
                      <span className="mx-1.5">=</span>
                      <span className="tabular-nums">
                        {formatSpecNum(spec.A, 1)} cm<sup>2</sup>
                      </span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="w-[18px] inline-block">W</span>
                      <span className="mx-1.5">=</span>
                      <span className="tabular-nums">
                        {formatSpecNum(spec.W, 1)} N
                      </span>
                    </div>
                    <div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ),
    });

    // ── 3.5 Block: ({aoSubNumber}). Arm Object (AO) (only when arms exist) ──
    blocks.push({
      id: "overview-arm-objects",
      node: (
        <section className="pt-[18px]">
          {/* Sub Title: ({aoSubNumber}). Arm Object (AO) */}
          <div className="flex justify-start ml-[22px] mb-[4px]">
            <span className="page1-number">
              <span className="jp">(</span>
              {aoSubNumber}
              <span className="jp">)</span>.
            </span>
            <span className="page1-text tracking-[0.05em] ml-1">
              Arm Object <span className="jp">(</span>AO
              <span className="jp">)</span>
            </span>
          </div>

          <div className="flex flex-col gap-y-[18px]">
            {effectiveArms.map((arm, aIdx) => {
              const armSpec = getArmSpecs(arm, aIdx);
              const armName = arm?.name || `アーム${aIdx + 1}`;
              const armDia = Number(arm?.diameter || armSpec?.dia || 0);
              const armLen = Number(arm?.length || armSpec?.L || 0);
              const armCalcAf = (armDia / 1000) * (armLen / 1000);
              const armFrontArea =
                arm?.frontArea ??
                arm?.Af ??
                (armDia && armLen ? armCalcAf : null);
              const armSideArea = arm?.sideArea ?? 0;
              const armWeight =
                arm?.massa ??
                arm?.weight ??
                (armSpec?.W ? Number(armSpec.W) / 9.80665 : null);
              const armHdist = arm?.hDistance ?? (armLen ? armLen / 2 : null);

              const armObjs =
                Array.isArray(arm?.armObjects) && arm.armObjects.length > 0
                  ? arm.armObjects
                  : Array.isArray(poleConfig?.arms?.[aIdx]?.armObjects) &&
                      poleConfig.arms[aIdx].armObjects.length > 0
                    ? poleConfig.arms[aIdx].armObjects
                    : [];

              const items = [
                {
                  name: armName,
                  frontArea: formatAoArea(armFrontArea, 3),
                  sideArea: formatAoArea(armSideArea, 0),
                  weight: formatAoWeight(armWeight, 1),
                  hDistance: formatAoDist(armHdist),
                  isArm: true,
                },
              ];

              armObjs.forEach((ao, oIdx) => {
                const slotNum = oIdx + 2;
                const defaultName = `AO${slotNum}`;
                items.push({
                  name: ao?.name || defaultName,
                  frontArea: formatAoArea(ao?.frontArea, 4),
                  sideArea: formatAoArea(ao?.sideArea, 4),
                  weight: formatAoWeight(ao?.weight, 2),
                  hDistance: formatAoDist(ao?.hDistance ?? ao?.zHeight),
                  isArm: false,
                });
              });

              return (
                <div key={aIdx} className="ml-[66px]">
                  {/* Bold header: Arm{N} */}
                  <div className="font-bold text-[9.5pt] mb-[4px]">
                    Arm{aIdx + 1}
                  </div>

                  {/* List of Arm + Attached Objects */}
                  <div className="flex flex-col gap-y-[12px]">
                    {items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="flex items-start text-[9.5pt] leading-tight"
                      >
                        {/* Col 1: Name */}
                        <div className="w-[185px] tracking-[0.05em] jp shrink-0">
                          {renderJpText(item.name)}
                        </div>

                        {/* Col 2: Front Area & Side Area */}
                        <div className="w-[195px] shrink-0">
                          <div className="flex items-baseline">
                            <span className="w-[72px] inline-block jp shrink-0">
                              正面面積：
                            </span>
                            <span className="w-[58px] inline-block tabular-nums shrink-0">
                              {item.frontArea}
                            </span>
                            <span>
                              m<sup>2</sup>
                            </span>
                          </div>
                          <div className="flex items-baseline">
                            <span className="w-[72px] inline-block jp shrink-0">
                              側面面積：
                            </span>
                            <span className="w-[58px] inline-block tabular-nums shrink-0">
                              {item.sideArea}
                            </span>
                            <span>
                              m<sup>2</sup>
                            </span>
                          </div>
                        </div>

                        {/* Col 3: Weight & H-dist */}
                        <div className="w-[180px] shrink-0">
                          <div className="flex items-baseline">
                            <span className="w-[56px] inline-block jp shrink-0">
                              重量：
                            </span>
                            <span className="w-[50px] inline-block tabular-nums shrink-0">
                              {item.weight}
                            </span>
                            <span>kg</span>
                          </div>
                          <div className="flex items-baseline">
                            <span className="w-[56px] inline-block shrink-0">
                              H-dist.
                            </span>
                            <span className="w-[50px] inline-block tabular-nums shrink-0">
                              {item.hDistance}
                            </span>
                            <span>mm</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ),
    });
  }

  // ── 3.6 Block: ({doSubNumber}). Direct Object (DO) ──
  if (effectiveDirectObjects.length > 0) {
    blocks.push({
      id: "overview-direct-objects",
      node: (
        <section className="pt-[18px]">
          {/* Sub Title: ({doSubNumber}). Direct Object (DO) */}
          <div className="flex justify-start ml-[22px] mb-[4px]">
            <span className="page1-number">
              <span className="jp">(</span>
              {doSubNumber}
              <span className="jp">)</span>.
            </span>
            <span className="page1-text tracking-[0.05em] ml-1">
              Direct Object <span className="jp">(</span>DO
              <span className="jp">)</span>
            </span>
          </div>

          <div className="flex flex-col gap-y-[12px] ml-[66px]">
            {effectiveDirectObjects.map((doItem, doIdx) => (
              <div
                key={doIdx}
                className="flex items-start text-[9.5pt] leading-tight"
              >
                {/* Col 1: Name */}
                <div className="w-[185px] tracking-[0.05em] jp shrink-0">
                  {renderJpText(doItem?.name || "灯具")}
                </div>

                {/* Col 2: Front Area & Side Area */}
                <div className="w-[195px] shrink-0">
                  <div className="flex items-baseline">
                    <span className="w-[72px] inline-block jp shrink-0">
                      正面面積：
                    </span>
                    <span className="w-[58px] inline-block tabular-nums shrink-0">
                      {formatAoArea(doItem?.frontArea, 3)}
                    </span>
                    <span>
                      m<sup>2</sup>
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[72px] inline-block jp shrink-0">
                      側面面積：
                    </span>
                    <span className="w-[58px] inline-block tabular-nums shrink-0">
                      {formatAoArea(doItem?.sideArea, 3)}
                    </span>
                    <span>
                      m<sup>2</sup>
                    </span>
                  </div>
                </div>

                {/* Col 3: Weight & Height */}
                <div className="w-[180px] shrink-0">
                  <div className="flex items-baseline">
                    <span className="w-[56px] inline-block jp shrink-0">
                      重量：
                    </span>
                    <span className="w-[50px] inline-block tabular-nums shrink-0">
                      {formatAoWeight(doItem?.weight, 1)}
                    </span>
                    <span>kg</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[56px] inline-block shrink-0">
                      Height:
                    </span>
                    <span className="w-[50px] inline-block tabular-nums shrink-0">
                      {formatAoDist(doItem?.zHeight)}
                    </span>
                    <span>mm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ),
    });
  }

  // ── 3.7 Block: ({ohwSubNumber}). 架空線の仕様 ──
  if (effectiveOverheadWires.length > 0) {
    blocks.push({
      id: "overview-overhead-wires",
      node: (
        <section className="pt-[18px]">
          {/* Sub Title: ({ohwSubNumber}). 架空線の仕様 */}
          <div className="flex justify-start ml-[22px] mb-[4px]">
            <span className="page1-number">
              <span className="jp">(</span>
              {ohwSubNumber}
              <span className="jp">)</span>.
            </span>
            <span className="page1-text tracking-[0.05em] jp ml-1">
              架空線の仕様
            </span>
          </div>

          <div className="flex flex-col gap-y-[14px] ml-[66px]">
            {effectiveOverheadWires.map((wire, wIdx) => {
              const spanVal =
                wire?.span !== undefined &&
                wire?.span !== null &&
                wire?.span !== ""
                  ? formatSpecNum(wire.span, 2)
                  : "";
              const unitWeightVal =
                wire?.weight !== undefined &&
                wire?.weight !== null &&
                wire?.weight !== ""
                  ? formatSpecNum(wire.weight, 3)
                  : wire?.unitWeight !== undefined &&
                      wire?.unitWeight !== null &&
                      wire?.unitWeight !== ""
                    ? formatSpecNum(wire.unitWeight, 3)
                    : "";
              const diaVal =
                wire?.diameter !== undefined &&
                wire?.diameter !== null &&
                wire?.diameter !== ""
                  ? formatSpecNum(wire.diameter, 1)
                  : wire?.calcDia !== undefined &&
                      wire?.calcDia !== null &&
                      wire?.calcDia !== ""
                    ? formatSpecNum(wire.calcDia, 1)
                    : "";
              const zVal =
                wire?.zHeight !== undefined &&
                wire?.zHeight !== null &&
                wire?.zHeight !== ""
                  ? formatSpecNum(wire.zHeight, 0)
                  : wire?.Z !== undefined && wire?.Z !== null && wire?.Z !== ""
                    ? formatSpecNum(wire.Z, 0)
                    : "";

              // Total weight m in kg
              let weightTotalVal = "";
              if (
                wire?.fixLoadKg !== undefined &&
                wire?.fixLoadKg !== null &&
                wire?.fixLoadKg !== ""
              ) {
                weightTotalVal = formatSpecNum(wire.fixLoadKg, 1);
              } else if (
                wire?.flOhwKg !== undefined &&
                wire?.flOhwKg !== null &&
                wire?.flOhwKg !== ""
              ) {
                weightTotalVal = formatSpecNum(wire.flOhwKg, 1);
              } else if (
                wire?.m !== undefined &&
                wire?.m !== null &&
                wire?.m !== ""
              ) {
                weightTotalVal = formatSpecNum(wire.m, 1);
              } else if (wire?.weight && wire?.span) {
                weightTotalVal = formatSpecNum(
                  Number(wire.weight) * Number(wire.span),
                  1,
                );
              }

              // Area A in m2
              let areaVal = "";
              if (
                wire?.Area !== undefined &&
                wire?.Area !== null &&
                wire?.Area !== ""
              ) {
                areaVal = formatSpecNum(wire.Area, 4);
              } else if (
                wire?.area !== undefined &&
                wire?.area !== null &&
                wire?.area !== ""
              ) {
                areaVal = formatSpecNum(wire.area, 4);
              } else if (
                wire?.A !== undefined &&
                wire?.A !== null &&
                wire?.A !== ""
              ) {
                areaVal = formatSpecNum(wire.A, 4);
              } else if (wire?.diameter && wire?.span) {
                areaVal = formatSpecNum(
                  (Number(wire.diameter) / 1000) * Number(wire.span),
                  4,
                );
              }

              return (
                <div key={wIdx}>
                  {/* Header: 架空線{N} : */}
                  <div className="text-[9.5pt] mb-[2px] tracking-[0.05em]">
                    <span className="jp">架空線</span>
                    {wIdx + 1} <span className="jp">:</span>
                  </div>

                  {/* 3 Columns Grid matching Arm & DO column widths */}
                  <div className="grid grid-cols-[185px_195px_180px] text-[9.5pt] leading-relaxed">
                    {/* Col 1 */}
                    <div>
                      <div className="flex items-baseline">
                        <span className="tracking-[0.05em]">
                          <span className="jp">スパン</span>S
                        </span>
                        <span className="mx-1.5">=</span>
                        <span className="min-w-[28px] tabular-nums text-center">
                          {spanVal}
                        </span>
                        <span className="ml-1">m</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="tracking-[0.05em]">
                          <span className="jp">重量</span> m
                        </span>
                        <span className="mx-1.5">=</span>
                        <span className="min-w-[28px] tabular-nums text-center">
                          {weightTotalVal}
                        </span>
                        <span className="ml-1">kg</span>
                      </div>
                    </div>

                    {/* Col 2 */}
                    <div>
                      <div className="flex items-baseline">
                        <span className="tracking-[0.05em] jp">計算外径φ</span>
                        <span className="mx-1.5">=</span>
                        <span className="min-w-[28px] tabular-nums text-center">
                          {diaVal}
                        </span>
                        <span className="ml-1">mm</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="tracking-[0.05em]">Z</span>
                        <span className="mx-1.5">=</span>
                        <span className="min-w-[28px] tabular-nums text-center">
                          {zVal}
                        </span>
                        <span className="ml-1">mm</span>
                      </div>
                    </div>

                    {/* Col 3 */}
                    <div>
                      <div className="flex items-baseline">
                        <span className="tracking-[0.05em]">
                          <span className="jp">単位重量</span> w
                        </span>
                        <span className="mx-1.5">=</span>
                        <span className="min-w-[28px] tabular-nums text-center">
                          {unitWeightVal}
                        </span>
                        <span className="ml-1">kg/m</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="tracking-[0.05em]">A</span>
                        <span className="mx-1.5">=</span>
                        <span className="min-w-[28px] tabular-nums text-center">
                          {areaVal}
                        </span>
                        <span className="ml-1">
                          m<sup>2</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ),
    });
  }

  // ── 3.8 Block: 4. Center Length Calculation ──
  const normalizeMm = (val) => {
    if (val === undefined || val === null || val === "" || isNaN(Number(val)))
      return 0;
    const num = Number(val);
    return num > 0 && num <= 100 ? Math.round(num * 1000) : Math.round(num);
  };

  const numPoles =
    Array.isArray(results) && results.length > 0 ? results.length : 1;
  const xValues = [];
  for (let j = 0; j < numPoles; j++) {
    if (j < numPoles - 1) {
      xValues.push(normalizeMm(results[j + 1]?.zHeight));
    } else {
      xValues.push(normalizeMm(poleConfig?.lowestHeight || 0));
    }
  }

  // 1. Pole rows
  const clPoleRows = (results || []).map((p, i) => {
    const hTop = normalizeMm(p?.zHeight);
    const hBot =
      i < numPoles - 1
        ? normalizeMm(results[i + 1]?.zHeight)
        : normalizeMm(poleConfig?.lowestHeight || 0);
    const segL = Math.max(0, hTop - hBot);
    const dBot = Number(p?.lowerDiameter || 0);
    const dTop = Number(p?.upperDiameter || dBot);

    let yBar = segL / 2;
    if (dBot + dTop > 0 && segL > 0) {
      yBar = (segL / 3) * ((dBot + 2 * dTop) / (dBot + dTop));
    }
    const zCentroid = hBot + yBar;

    const lcValues = [];
    for (let c = 0; c < 4; c++) {
      if (c >= numPoles) {
        lcValues.push("");
      } else {
        const X = xValues[c];
        if (hTop <= X) {
          lcValues.push("");
        } else if (hBot >= X) {
          lcValues.push(String(Math.round(zCentroid - X)));
        } else {
          const partL = hTop - X;
          const dMid = dBot + (dTop - dBot) * ((X - hBot) / (segL || 1));
          const yPart = (partL / 3) * ((dMid + 2 * dTop) / (dMid + dTop || 1));
          lcValues.push(String(Math.round(yPart)));
        }
      }
    }

    let poleName = p?.name || `支柱-${i + 1}`;
    if (/^pole\s*\d+$/i.test(poleName.trim())) {
      poleName = `支柱-${i + 1}`;
    }

    return {
      name: poleName,
      lcValues,
    };
  });

  // 2. Direct Object rows
  const clDoRows = effectiveDirectObjects.map((d) => {
    const z = normalizeMm(d?.zHeight);
    const lcValues = [];
    for (let c = 0; c < 4; c++) {
      if (c >= numPoles) {
        lcValues.push("");
      } else {
        const X = xValues[c];
        if (z <= X) {
          lcValues.push("");
        } else {
          lcValues.push(String(Math.round(z - X)));
        }
      }
    }
    let doName = d?.name || "灯具";
    if (
      /^direct\s*object\s*\d*$/i.test(doName.trim()) ||
      /^do\s*\d*$/i.test(doName.trim())
    ) {
      doName = "灯具";
    }
    return {
      name: doName,
      lcValues,
    };
  });

  // 3. Arm rows (rows represent the arms, not arm objects)
  const clArmRows = effectiveArms.map((a, i) => {
    const z = normalizeMm(a?.zHeight ?? a?.height);
    const lcValues = [];
    for (let c = 0; c < 4; c++) {
      if (c >= numPoles) {
        lcValues.push("");
      } else {
        const X = xValues[c];
        if (z <= X) {
          lcValues.push("");
        } else {
          lcValues.push(String(Math.round(z - X)));
        }
      }
    }
    let armName = a?.name || a?.armName || `アーム-${i + 1}`;
    if (/^arm\s*(\d+)$/i.test(armName.trim())) {
      const match = armName.trim().match(/^arm\s*(\d+)$/i);
      armName = `アーム-${match[1]}`;
    }
    return {
      name: armName,
      lcValues,
    };
  });

  // 4. Overhead Wire rows
  const clOhwRows = effectiveOverheadWires.map((w, i) => {
    const z = normalizeMm(w?.zHeight ?? w?.Z);
    const lcValues = [];
    for (let c = 0; c < 4; c++) {
      if (c >= numPoles) {
        lcValues.push("");
      } else {
        const X = xValues[c];
        if (z <= X) {
          lcValues.push("");
        } else {
          lcValues.push(String(Math.round(z - X)));
        }
      }
    }
    let ohwName = w?.name || `架空線-${i + 1}`;
    if (
      /^overhead\s*wire\s*(\d+)$/i.test(ohwName.trim()) ||
      /^ohw\s*(\d+)$/i.test(ohwName.trim())
    ) {
      const match = ohwName.trim().match(/\d+/);
      ohwName = `架空線-${match ? match[0] : i + 1}`;
    }
    return {
      name: ohwName,
      lcValues,
    };
  });

  const renderCenterLengthTable = (subNumber, title, rows, isFirst = false) => (
    <div
      key={title}
      className={`flex flex-col ${isFirst ? "mt-[6px]" : "mt-[16px]"}`}
    >
      {/* Sub-heading row: (N). Title on left, X:固定面からの高さ starts exactly at Col 3 */}
      <div className="flex items-baseline mb-[3px] ml-[22px] w-[calc(100%-22px)] text-[9pt] leading-normal">
        <div className="w-[29.5%] shrink-0">
          <span className="jp">(</span>
          <span>{subNumber}</span>
          <span className="jp">). </span>
          <span>{title}</span>
        </div>
        <div className="w-[70.5%] tracking-[0.05em]">
          <span>X</span>
          <span className="jp">:固定面からの高さ</span>
        </div>
      </div>

      {/* Table container */}
      <div className="ml-[33px] w-[calc(100%-33px)]">
        <table className="w-full border border-black border-collapse text-[9pt] leading-tight">
          <thead>
            <tr className="bg-white">
              <th className="w-[7%] border border-black text-center align-middle font-normal py-[4px]">
                No.
              </th>
              <th className="w-[21%] border border-black text-center align-middle font-normal py-[4px] jp">
                品名
              </th>
              {[0, 1, 2, 3].map((colIdx) => (
                <th
                  key={colIdx}
                  className="w-[18%] border border-black text-center align-middle font-normal py-[4px] leading-snug"
                >
                  <div>
                    <span className="jp">荷重中心高(</span>
                    <span>Lc</span>
                    <span className="jp">)</span>
                  </div>
                  <div>
                    {colIdx < numPoles ? (
                      <span>
                        X{colIdx + 1} = {xValues[colIdx]} mm
                      </span>
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="h-[25px]">
                <td className="border border-black text-center align-middle py-[2px]">
                  {rIdx + 1}
                </td>
                <td className="border border-black text-left px-2.5 align-middle py-[2px]">
                  <span className="jp">{row.name}</span>
                </td>
                {[0, 1, 2, 3].map((colIdx) => (
                  <td
                    key={colIdx}
                    className="border border-black text-right px-3 align-middle py-[2px] tabular-nums"
                  >
                    {row.lcValues[colIdx] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const clTables = [];
  clTables.push({ title: "Pole", rows: clPoleRows });
  if (clDoRows.length > 0) {
    clTables.push({ title: "Direct Object", rows: clDoRows });
  }
  if (clArmRows.length > 0) {
    clTables.push({ title: "Arm", rows: clArmRows });
  }
  if (clOhwRows.length > 0) {
    clTables.push({ title: "Overhead Wire", rows: clOhwRows });
  }

  blocks.push({
    id: "center-length-calculation",
    node: (
      <section className="pt-[20px]">
        {/* Main Title: 4. Center Length Calculation */}
        <h2 className="page1-title mb-[2px]">
          <span className="page1-number">4.</span>
          <span className="page1-text tracking-[0.05em]">
            Center Length Calculation
          </span>
        </h2>

        {/* Dynamically numbered sub-tables (1), (2), (3)... based on active tables */}
        {clTables.map((tbl, idx) =>
          renderCenterLengthTable(idx + 1, tbl.title, tbl.rows, idx === 0),
        )}
      </section>
    ),
  });

  // ── 5. Dynamic pillar calculation blocks (renumbered starting at 5.) ──
  results?.forEach((r, index) => {
    const rows = getRowsForStep(
      index,
      results,
      effectiveDirectObjects,
      poleConfig,
    );
    const suffix = index + 1; // biar id unik: c1-1, c1-2, dst

    //  c1 = (Consideration of pillars) and 荷重計算 (Load calculation)
    blocks.push({
      id: `c1-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Main-section: (Consideration of pillars) + material specifications */}
          <h2 className="page1-title">
            <span className="page1-number">{5 + sectionCounter++}.</span>
            <span className="page1-text tracking-[0.1em] jp">
              {r?.name ?? ""}:
            </span>
            <span className="page1-text ml-[18px] jp">φ</span>
            <span className="page1-text">
              {toNumFixed(r?.lowerDiameter, 1)}
            </span>
            <span className="page1-text px-[2px] text-[10.5pt]">×</span>
            <span className="page1-text">
              t{toNumFixed(r?.lowerThickness, 1)}
            </span>
            <span className="page1-text ml-[20px]">{r?.material ?? ""}</span>
            <span className="page1-text ml-[20px]">
              Z = {toNumFixed(r?.sectionModulus, 2)} cm<sup>3</sup>
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
                            {row.data.name ?? ""}
                          </td>
                          <td className="col-left">
                            {toNumFixed(row.data.fixLoad, 1)}
                          </td>
                          <td className="col-left">
                            {row.data.quantity ?? ""}
                          </td>
                          <td className="col-left">
                            {toNumFixed(row.data.fixLoad, 1)}
                          </td>
                          <td className="col-gap"></td>
                          <td className="col-right">
                            {toNumFixed(row.data.frontArea, 1)}
                          </td>
                          <td className="col-right">
                            {toNumFixed(row.data.cf, 1)}
                          </td>
                          <td className="col-right">
                            {toNumFixed(row.data.windLoadAreaFront, 1)}
                          </td>
                          <td className="col-right">
                            {row.data.quantity ?? ""}
                          </td>
                          <td className="col-right">
                            {toNumFixed(row.data.windLoadAreaFront, 1)}
                          </td>
                        </>
                      )}

                      {row.type === "pole" && (
                        <>
                          <td className="col-1 tracking-[0.1em] jp">
                            {row.data.name ?? ""}
                          </td>
                          <td className="col-left">149.6</td>
                          <td className="col-left">
                            {row.data.quantity ?? ""}
                          </td>
                          <td className="col-left">149.6</td>
                          <td className="col-gap"></td>
                          <td className="col-right">0.203</td>
                          <td className="col-right">0.7</td>
                          <td className="col-right">310.0</td>
                          <td className="col-right">
                            {row.data.quantity ?? ""}
                          </td>
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
                    <td colSpan={2} className="tfoot-title col-left">
                      <span className="tracking-[0.1em] jp">鉛直力 </span>N
                      {index + 1}=
                    </td>
                    <td className="tfoot-value col-left">185.9</td>
                    <td className="col-gap"></td>
                    <td colSpan={4} className="tfoot-title col-right">
                      <span className="tracking-[0.1em] jp">水平力 </span>
                      Pmax{index + 1}=
                    </td>
                    <td colSpan={1} className="tfoot-value col-right">
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
          <span className="page1-number">{5 + sectionCounter++}.</span>
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
