/**
 * dummyReportPayload.js
 * Provides simulation / fallback report payload so that the report page
 * and schematic drawing (Page 2) can be tested immediately even when
 * live backend calculations are not yet available.
 */

import STANDARD_POLE_DATA from "../../calculations/data/specStandardPole.json";

export function getDummyReportPayload(projectType = "lighting-project", customPoleStandard = null) {
  const dataTaper = STANDARD_POLE_DATA?.tapered || STANDARD_POLE_DATA?.taper || {};

  // Default to IA onGL 10m if none provided
  const taperPole = customPoleStandard || {
    poleType: "IA",
    groundPosition: "onGL",
    height: "10",
  };

  const poleType = (taperPole.poleType || "IA").toUpperCase();
  const groundPos = taperPole.groundPosition || "onGL";
  const heightKey = String(taperPole.height || "10");

  const selectedPole =
    dataTaper?.[poleType]?.[groundPos]?.[heightKey] ||
    dataTaper?.["IA"]?.["onGL"]?.["10"] ||
    dataTaper?.["IS"]?.["onGL"]?.["12"] ||
    {};

  const rawPoles = selectedPole.poles || [
    {
      name: "支柱−1",
      material: "STK400",
      poleType: "Straight",
      lowerDiameter: "89.1",
      upperDiameter: "89.1",
      lowerThickness: "4",
      upperThickness: "4",
      zHeight: "10000",
    },
    {
      name: "支柱−2",
      material: "STK400",
      poleType: "Taper",
      lowerDiameter: "216.3",
      upperDiameter: "89.1",
      lowerThickness: "4.5",
      upperThickness: "4.5",
      zHeight: "8500",
    },
    {
      name: "支柱−3",
      material: "STK400",
      poleType: "Straight",
      lowerDiameter: "216.3",
      upperDiameter: "216.3",
      lowerThickness: "4.5",
      upperThickness: "4.5",
      zHeight: "1500",
    },
  ];

  const results = rawPoles.map((p, idx) => ({
    name: p.name || `支柱−${idx + 1}`,
    poleType: p.poleType || "Taper",
    material: p.material || "STK400",
    lowerDiameter: Number(p.lowerDiameter || 165),
    upperDiameter: Number(p.upperDiameter || 75),
    lowerThickness: Number(p.lowerThickness || 4),
    upperThickness: Number(p.upperThickness || 4),
    zHeight: Number(p.zHeight || 10000),
    heightSection: 1000,
    sectionArea: 15.5 + idx * 5,
    sectionModulus: 32.4 + idx * 40,
    momentInertia: 120.5 + idx * 400,
    fb: 123.45,
    stb: 100,
    sts: 85,
    stc: 75,
    bendingMoment: 1250 * (idx + 1),
    shearStress: 15.2,
    bendingStress: 55.8,
    combinedStress: 60.1,
    safetyRatio: 0.65 + idx * 0.05,
    judgment: "O.K",
  }));

  const rawDOs = selectedPole.directObjects || [
    {
      name: "灯具",
      type: "directional",
      frontArea: "0.1",
      sideArea: "0.1",
      weight: "14",
      zHeight: String(taperPole.height ? Number(taperPole.height) * 1000 : 10000),
    },
  ];

  const resultsDo = rawDOs.map((d) => ({
    name: d.name || "灯具",
    weight: Number(d.weight || 14),
    frontArea: Number(d.frontArea || 0.1),
    sideArea: Number(d.sideArea || 0.1),
    zHeight: Number(d.zHeight || 10000),
    fixLoad: Number(d.weight || 14),
    windLoadAreaFront: 60,
    windLoadAreaSide: 40,
    seismicLoad: 20,
    cf: 1.1,
  }));

  const rawArms = selectedPole.arms || [];
  const resultsArm = rawArms.map((a, idx) => ({
    name: a.name || `Arm ${idx + 1}`,
    material: a.material || "STK400",
    diameter: Number(a.diameter || 60),
    thickness: Number(a.thickness || 4),
    length: Number(a.length || 1500),
    zHeight: Number(a.zHeight || 8000),
    fb: 50,
    sfb: 45,
    sfs: 40,
    sfc: 35,
    sectionArea: 6.8,
    sectionModulus: 4.5,
    momentInertia: 14.2,
    armObjects: [],
  }));

  let storedCover = null;
  let storedIdentity = null;
  try {
    storedCover = JSON.parse(
      sessionStorage.getItem(`${projectType}_cover`) || "null",
    );
  } catch {}
  try {
    storedIdentity = JSON.parse(
      sessionStorage.getItem(`${projectType}_projectIdentity`) || "null",
    );
  } catch {}

  const mgmtParts = [
    storedCover?.region,
    storedCover?.author,
    storedCover?.responsibleDepartment,
  ].filter(Boolean);
  const computedMgmtCode =
    mgmtParts.length > 0
      ? mgmtParts.join(" ― ")
      : storedCover?.managementCode
        ? storedCover.managementCode.replace(/\s*-\s*/g, " ― ")
        : (storedIdentity?.requestNo || "");

  const cover = {
    calculationNumber:
      storedCover?.reportNumber ||
      storedCover?.calculationNumber ||
      "",
    managementCode: computedMgmtCode,
    projectName:
      storedCover?.title1 ||
      storedCover?.projectName ||
      storedIdentity?.projectName ||
      "",
    coverTopText:
      storedCover?.title2 ||
      storedCover?.coverTopText ||
      "",
    coverBottomText:
      storedCover?.title3 ||
      storedCover?.coverBottomText ||
      "",
    companyName:
      storedCover?.author ||
      storedIdentity?.companyName ||
      "",
    date: storedCover?.date || new Date().toISOString(),
  };

  return {
    isSimulation: true,
    cover,
    condition: {
      poleType: "standard",
      standardPoleType: poleType,
      standardId: selectedPole.standardId || `${poleType}-${heightKey}`,
      designStandard: "v60",
      windSpeed: 60,
      groundPosition: groundPos,
      height: Number(heightKey),
      baseplateEnabled: true,
    },
    poleConfig: {
      safetyFactor: 1.5,
    },
    taperPoleStandard: {
      poleType,
      groundPosition: groundPos,
      height: heightKey,
    },
    results,
    resultsDo,
    resultsArm,
    resultsOhw: [],
  };
}
