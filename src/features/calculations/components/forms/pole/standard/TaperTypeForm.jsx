import { useEffect, useState } from "react";
import { RotateCcw, Box, Loader2 } from "lucide-react";
import { GROUND_POSITION_OPTIONS } from "../../../../constants/taperPoleStandradOptions";
import { usePoleStandardData } from "../../../../hooks/usePoleStandardData";
import { ConfirmResetAllModal } from "../../../modals/ConfirmResetAllModal";
import { preloadImagesWhenIdle } from "../../../../utils/preloadImages";
import { FormSelect } from "../../../../../../shared/components/FormSelect";
import STANDARD_POLE_DATA from "../../../../data/specStandardPole.json";

// === IMAGES (12 cases: 6 pole types × 2 ground positions) ===
const DIAGRAM_IMAGE_MAP = {
  IS: {
    onGL: "/images/IS_OnGL.svg",
    underGL: "/images/IS_UnderGL.svg",
  },
  IA: {
    onGL: "/images/IA_OnGL.svg",
    underGL: "/images/IA_UnderGL.svg",
  },
  LS: {
    onGL: "/images/LS_OnGL.svg",
    underGL: "/images/LS_UnderGL.svg",
  },
  LA: {
    onGL: "/images/LA_OnGL.svg",
    underGL: "/images/LA_UnderGL.svg",
  },
  TS: {
    onGL: "/images/TS_OnGL.svg",
    underGL: "/images/TS_UnderGL.svg",
  },
  TA: {
    onGL: "/images/TA_OnGL.svg",
    underGL: "/images/TA_UnderGL.svg",
  },
};

// Embedment variant (used when !isBaseplate) for each pole type
const EMBED_IMAGE_MAP = Object.fromEntries(
  Object.keys(DIAGRAM_IMAGE_MAP).map((type) => [
    type,
    `/images/${type}-Type-Embed.svg`,
  ]),
);

const ALL_DIAGRAM_IMAGES = [
  ...Object.values(DIAGRAM_IMAGE_MAP).flatMap((byGround) =>
    Object.values(byGround),
  ),
  ...Object.values(EMBED_IMAGE_MAP),
];

// === DIMENSION LABELS ON THE DIAGRAM ===
// Where each dimension's text sits on a diagram, in that SVG's own viewBox
// units (so labels stay glued to the dimension lines at any rendered size).
// `anchor` says which side of the text the point is: "left" = text starts
// there, "right" = text ends there, "bottom-left" = text sits above it,
// "leader" = the point is the start of a leader line's horizontal segment,
// with the first text line above it and the second below, "vertical" = text
// rotated to read bottom-to-top, centred on the point, "bottom-center" /
// "bottom-right" = text sits above the point, centred on / ending at it.
// Mapped so far: IS, IA, LS, LA and TS (On GL / Under GL); other diagrams
// simply show no labels.

// The short dimension at the pole base is always 750mm — for every pole
// type, ground position and height. Not in specStandardPole.json.
const BASE_DIMENSION_MM = 750;

// Under GL poles are always buried 300mm below G.L. (8.3 / 10.3 / 12.3 m),
// so the part above G.L. is the selected height minus this.
const UNDER_GL_DEPTH_MM = 300;

// Arm types (LS…): the horizontal dimension above the arm is always 300mm.
// Not in specStandardPole.json.
const ARM_TOP_DIMENSION_MM = 300;

const DIAGRAM_LABEL_LAYOUT = {
  "IS.onGL": {
    viewBox: { width: 315, height: 771 },
    // x of the overall-height dimension line — the Height select sits
    // right up against it so it reads as that dimension's value.
    heightLineX: 11.7,
    positions: {
      // Diameters sit on top of their horizontal dimension line, as in the
      // standard drawings. At the top the extension lines come in from
      // above, so the text starts just right of where they meet the line;
      // at the base they go downward, so it can start at the line's left end.
      upperDiameter: { x: 196.2, y: 42.05, anchor: "bottom-left" },
      // Pole spec straddles the leader's horizontal line: type above,
      // standard below.
      poleSpec: { x: 186.2, y: 349.55, anchor: "leader" },
      // Vertical, just left of the 750 line (x 75.7, y 693 → 758).
      baseDimension: { x: 62.7, y: 725.55, anchor: "vertical" },
      lowerDiameter: { x: 173.2, y: 720.05, anchor: "bottom-left" },
    },
  },
  // Same labels as On GL (offsets from each line kept identical), plus the
  // split of the overall height into the part above G.L. and the 300mm
  // below it.
  "IS.underGL": {
    viewBox: { width: 363, height: 771 },
    heightLineX: 8,
    positions: {
      upperDiameter: { x: 245, y: 42.5, anchor: "bottom-left" },
      poleSpec: { x: 234.5, y: 349.5, anchor: "leader" },
      // Between the two vertical dimension lines, just left of the inner
      // one (x 60.5, y 9 → 733).
      aboveGroundHeight: { x: 45.5, y: 371, anchor: "vertical" },
      // Vertical, just left of the 750 line (x 124.5, y 667 → 734).
      baseDimension: { x: 110.5, y: 700.5, anchor: "vertical" },
      lowerDiameter: { x: 221.5, y: 697, anchor: "bottom-left" },
      // Vertical, in line with the above-G.L. height text, centred on the
      // short G.L. → base segment (x 60.5, y 737 → 759).
      underGroundDepth: { x: 45.5, y: 744, anchor: "vertical" },
    },
  },
  // Stepped pole: straight top → taper → straight bottom, so four diameters
  // and the three section lengths on the inner dimension line (x 60.2).
  // Offsets from each line match the IS layouts above.
  "IA.onGL": {
    viewBox: { width: 370, height: 772 },
    heightLineX: 7.75,
    positions: {
      // Diameter lines at y 45.5 / 183.5 (extension lines from above) and
      // y 590 / 725 (extension lines going down).
      diameter1: { x: 251.75, y: 42.55, anchor: "bottom-left" },
      diameter2: { x: 251.75, y: 181.05, anchor: "bottom-left" },
      poleSpec: { x: 241.15, y: 349.55, anchor: "leader" },
      diameter3: { x: 228.25, y: 585.05, anchor: "bottom-left" },
      diameter4: { x: 228.25, y: 721.05, anchor: "bottom-left" },
      // Section lengths, centred on y 9→145 / 147→622 / 624→760.
      topSectionLength: { x: 45.25, y: 77.05, anchor: "vertical" },
      taperSectionLength: { x: 45.25, y: 384.55, anchor: "vertical" },
      bottomSectionLength: { x: 45.25, y: 692.05, anchor: "vertical" },
      // Vertical, just left of the 750 line (x 130.2, y 693 → 760).
      baseDimension: { x: 116.25, y: 726.55, anchor: "vertical" },
    },
  },
  // Same labels and values as IA On GL, plus the 300mm below G.L. Texts
  // come from the On GL entry at (height − 0.3m): the IA underGL entries in
  // specStandardPole.json store the bottom section as 1800, which would
  // make the taper section read 300 short of On GL.
  "IA.underGL": {
    viewBox: { width: 364, height: 772 },
    heightLineX: 8,
    textsFromOnGL: true,
    positions: {
      diameter1: { x: 246, y: 42.7, anchor: "bottom-left" },
      diameter2: { x: 246, y: 181.2, anchor: "bottom-left" },
      poleSpec: { x: 235.4, y: 350.7, anchor: "leader" },
      diameter3: { x: 223.5, y: 560.2, anchor: "bottom-left" },
      diameter4: { x: 223.5, y: 698.2, anchor: "bottom-left" },
      // Inner dimension line x 60.9: y 10.6→144.2 / 148.6→596.2 /
      // 600.6→734.2, then the 300 below G.L. at 738.6→759.2.
      topSectionLength: { x: 46.5, y: 77.2, anchor: "vertical" },
      taperSectionLength: { x: 46.5, y: 372.2, anchor: "vertical" },
      bottomSectionLength: { x: 46.5, y: 667.2, anchor: "vertical" },
      underGroundDepth: { x: 46.5, y: 745.8, anchor: "vertical" },
      // Vertical, just left of the 750 line (x 123.9, y 669.6 → 734.2).
      baseDimension: { x: 110.5, y: 701.7, anchor: "vertical" },
    },
  },
  // Taper pole with one lighting arm at the top: pole labels as IS, plus
  // the pole-top-to-arm offset, the arm height, and the arm's own labels.
  "LS.onGL": {
    viewBox: { width: 385, height: 868 },
    heightLineX: 8.85,
    positions: {
      // Arm: 300 centred above its dimension line (y 7.3, x 201.5 → 247.5);
      // (180) above its line (y 40.3), ending just left of the arrow at
      // x 201.5 — the gap between the arrows is too narrow for the text.
      armTopDimension: { x: 224.85, y: 4.95, anchor: "bottom-center" },
      armLength: { x: 192, y: 37.95, anchor: "bottom-right" },
      // Diameter line at y 57.3; extension lines come up from the arm and
      // end at x 278.5, so the text starts just right of them.
      upperDiameter: { x: 281.35, y: 53.95, anchor: "bottom-left" },
      // Arm spec: second line (material) centred under the first, as in
      // the standard drawings.
      armSpec: { x: 256.25, y: 141, anchor: "leader", centered: true },
      poleSpec: { x: 238.25, y: 446.45, anchor: "leader" },
      // Inner dimension line x 61.5: the short 100 between the pole top
      // (y 104.3) and the arm (y 113.3) has its arrows outside, so its text
      // runs along the upper arrow stem (y 64 → 102); then the arm height
      // (y 115.5 → 855).
      poleTopOffset: { x: 47.35, y: 82.65, anchor: "vertical" },
      armHeight: { x: 47.35, y: 484.95, anchor: "vertical" },
      // Vertical, just left of the 750 line (x 126.5, y 790.5 → 855).
      baseDimension: { x: 113.35, y: 822.45, anchor: "vertical" },
      lowerDiameter: { x: 225.35, y: 816.95, anchor: "bottom-left" },
    },
  },
  // Same labels and values as LS On GL, plus the 300 below G.L. Texts come
  // from the On GL entry at (height − 0.3m): the LS underGL entries store
  // the pole top as 8400 vs the arm's 8000, which would read 400 instead
  // of On GL's 100.
  "LS.underGL": {
    viewBox: { width: 384, height: 868 },
    heightLineX: 8.05,
    textsFromOnGL: true,
    positions: {
      armTopDimension: { x: 223.05, y: 4.95, anchor: "bottom-center" },
      armLength: { x: 192, y: 37.95, anchor: "bottom-right" },
      upperDiameter: { x: 280.55, y: 53.95, anchor: "bottom-left" },
      armSpec: { x: 253.45, y: 141, anchor: "leader", centered: true },
      poleSpec: { x: 237.52, y: 445.45, anchor: "leader" },
      // Inner dimension line x 61.05: 100 on the upper arrow stem, arm
      // height y 115.2 → 829.7, then the 300 below G.L. y 834.2 → 854.7.
      poleTopOffset: { x: 46.55, y: 82.65, anchor: "vertical" },
      armHeight: { x: 46.55, y: 472.45, anchor: "vertical" },
      underGroundDepth: { x: 46.55, y: 841.1, anchor: "vertical" },
      // Vertical, just left of the 750 line (x 126.05, y 765.2 → 829.7).
      baseDimension: { x: 112.55, y: 797.45, anchor: "vertical" },
      lowerDiameter: { x: 224.55, y: 793.95, anchor: "bottom-left" },
    },
  },
  // Stepped pole (as IA) with a lighting arm (as LS): the pole top sits
  // 100 above the arm, and the top section is measured from the arm down.
  "LA.onGL": {
    viewBox: { width: 386, height: 868 },
    heightLineX: 8.2,
    positions: {
      armTopDimension: { x: 226.2, y: 5.35, anchor: "bottom-center" },
      armLength: { x: 194.5, y: 38.35, anchor: "bottom-right" },
      diameter1: { x: 283.7, y: 54.35, anchor: "bottom-left" },
      armSpec: { x: 257.6, y: 142, anchor: "leader", centered: true },
      diameter2: { x: 250.2, y: 307.35, anchor: "bottom-left" },
      poleSpec: { x: 239.67, y: 449.85, anchor: "leader" },
      diameter3: { x: 226.7, y: 681.35, anchor: "bottom-left" },
      diameter4: { x: 227.7, y: 817.35, anchor: "bottom-left" },
      // Inner dimension line x 60.2: 100 on the upper arrow stem (y 65 →
      // 103), then y 116.6→270.1 / 274.6→717.1 / 721.6→855.1.
      poleTopOffset: { x: 45.7, y: 84.2, anchor: "vertical" },
      topSectionLength: { x: 45.7, y: 193.35, anchor: "vertical" },
      taperSectionLength: { x: 45.7, y: 495.85, anchor: "vertical" },
      bottomSectionLength: { x: 45.7, y: 788.34, anchor: "vertical" },
      // Vertical, just left of the 750 line (x 128.2, y 790.6 → 855.1).
      baseDimension: { x: 114.7, y: 822.85, anchor: "vertical" },
    },
  },
  // Same labels and values as LA On GL, plus the 300 below G.L. Texts come
  // from the On GL entry at (height − 0.3m): the LA underGL entries store
  // the bottom section as 1900 (1600 + the buried 300).
  "LA.underGL": {
    viewBox: { width: 385, height: 867 },
    heightLineX: 7.85,
    textsFromOnGL: true,
    positions: {
      armTopDimension: { x: 224.85, y: 5.1, anchor: "bottom-center" },
      armLength: { x: 194.5, y: 38.1, anchor: "bottom-right" },
      diameter1: { x: 282.35, y: 54.1, anchor: "bottom-left" },
      armSpec: { x: 255.25, y: 141, anchor: "leader", centered: true },
      diameter2: { x: 248.85, y: 278.1, anchor: "bottom-left" },
      poleSpec: { x: 238.32, y: 444.6, anchor: "leader" },
      diameter3: { x: 225.35, y: 655.1, anchor: "bottom-left" },
      diameter4: { x: 226.35, y: 793.1, anchor: "bottom-left" },
      // Inner dimension line x 58.85: 100 on the upper arrow stem, then
      // y 114.3→240.9 / 245.3→690.9 / 695.3→828.9, and 300 at 833.3→853.9.
      poleTopOffset: { x: 44.35, y: 82.98, anchor: "vertical" },
      topSectionLength: { x: 44.35, y: 177.6, anchor: "vertical" },
      taperSectionLength: { x: 44.35, y: 468.1, anchor: "vertical" },
      bottomSectionLength: { x: 44.35, y: 762.1, anchor: "vertical" },
      underGroundDepth: { x: 44.35, y: 841.1, anchor: "vertical" },
      // Vertical, just left of the 750 line (x 127.31, y 764.3 → 828.9).
      baseDimension: { x: 113.81, y: 796.6, anchor: "vertical" },
    },
  },
  // Taper pole (as LS) with two arms, left and right: the arm dimensions
  // appear on both sides, each placed outside its arrows as in the
  // standard drawings; the arm spec sits on the right-hand leader.
  "TS.onGL": {
    viewBox: { width: 386, height: 871 },
    heightLineX: 8,
    positions: {
      // 300s on the line at y 10 (left arrow x 158, right arrow x 248);
      // (180)s on the line at y 43 — kept outside the 300 extension lines
      // (x 158 / 248) too, so the text never crosses them.
      armTopDimension: { x: 150, y: 8, anchor: "bottom-right" },
      armTopDimensionRight: { x: 256, y: 8, anchor: "bottom-left" },
      armLength: { x: 156, y: 41, anchor: "bottom-right" },
      armLengthRight: { x: 251, y: 41, anchor: "bottom-left" },
      armSpec: { x: 280.47, y: 76, anchor: "leader", centered: true },
      // Diameter line at y 144.5; extension lines come in from above and
      // end at x 243, so the text starts just right of them.
      upperDiameter: { x: 249, y: 141.5, anchor: "bottom-left" },
      poleSpec: { x: 239.47, y: 452.5, anchor: "leader" },
      // Inner dimension line x 59: 100 on the upper arrow stem (y 68 →
      // 105.8), then the arm height y 118.2 → 857.8.
      poleTopOffset: { x: 44.5, y: 86.9, anchor: "vertical" },
      armHeight: { x: 44.5, y: 488, anchor: "vertical" },
      // Vertical, just left of the 750 line (x 128, y 793.2 → 857.8).
      baseDimension: { x: 114.5, y: 825.5, anchor: "vertical" },
      lowerDiameter: { x: 226.5, y: 820, anchor: "bottom-left" },
    },
  },
  // Same labels and values as TS On GL, plus the 300 below G.L. Texts come
  // from the On GL entry at (height − 0.3m): the TS underGL entries store
  // the pole top as 8400 vs the arms' 8000, which would read 400 instead
  // of On GL's 100.
  "TS.underGL": {
    viewBox: { width: 386, height: 872 },
    heightLineX: 8,
    textsFromOnGL: true,
    positions: {
      armTopDimension: { x: 149.5, y: 8, anchor: "bottom-right" },
      armTopDimensionRight: { x: 256, y: 8, anchor: "bottom-left" },
      armLength: { x: 155.5, y: 41, anchor: "bottom-right" },
      armLengthRight: { x: 251, y: 41, anchor: "bottom-left" },
      armSpec: { x: 280.47, y: 76, anchor: "leader", centered: true },
      upperDiameter: { x: 249, y: 141.5, anchor: "bottom-left" },
      poleSpec: { x: 239.47, y: 453, anchor: "leader" },
      // Inner dimension line x 59: 100 on the upper arrow stem, arm
      // height y 118.2 → 834.1, then the 300 below G.L. y 838.5 → 859.1.
      poleTopOffset: { x: 44.5, y: 87, anchor: "vertical" },
      armHeight: { x: 44.5, y: 476, anchor: "vertical" },
      underGroundDepth: { x: 44.5, y: 845, anchor: "vertical" },
      // Vertical, just left of the 750 line (x 128, y 769.5 → 834.1).
      baseDimension: { x: 114.5, y: 802, anchor: "vertical" },
      lowerDiameter: { x: 226.5, y: 798, anchor: "bottom-left" },
    },
  },
  // Taper pole (stepped like LA) with two arms (like TS)
  "TA.onGL": {
    viewBox: { width: 386, height: 871 },
    heightLineX: 8.2,
    positions: {
      armTopDimension: { x: 149.5, y: 8, anchor: "bottom-right" },
      armTopDimensionRight: { x: 256, y: 8, anchor: "bottom-left" },
      armLength: { x: 155.5, y: 41, anchor: "bottom-right" },
      armLengthRight: { x: 251.5, y: 41, anchor: "bottom-left" },
      armSpec: { x: 280.47, y: 76, anchor: "leader", centered: true },
      diameter1: { x: 249, y: 141.5, anchor: "bottom-left" },
      diameter2: { x: 249, y: 309, anchor: "bottom-left" },
      poleSpec: { x: 239.67, y: 451.85, anchor: "leader" },
      diameter3: { x: 226.7, y: 682.8, anchor: "bottom-left" },
      diameter4: { x: 226.7, y: 818, anchor: "bottom-left" },
      poleTopOffset: { x: 45.7, y: 84.2, ancho: "vertical" },
      topSectionLength: { x: 45.7, y: 193.35, anchor: "vertical" },
      taperSectionLength: { x: 45.7, y: 495.85, anchor: "vertical" },
      bottomSectionLength: { x: 45.7, y: 790.34, anchor: "vertical" },
      baseDimension: { x: 114.7, y: 825, anchor: "vertical" },
    },
  },
  "TA.underGL": {
    viewBox: { width: 386, height: 872 },
    heightLineX: 7.85,
    textsFromOnGL: true,
    positions: {
      armTopDimension: { x: 149.5, y: 8, anchor: "bottom-right" },
      armTopDimensionRight: { x: 256, y: 8, anchor: "bottom-left" },
      armLength: { x: 155.3, y: 41, anchor: "bottom-right" },
      armLengthRight: { x: 249.8, y: 41, anchor: "bottom-left" },
      armSpec: { x: 277.5, y: 76, anchor: "leader", centered: true },
      diameter1: { x: 249, y: 141.5, anchor: "bottom-left" },
      diameter2: { x: 249, y: 281.1, anchor: "bottom-left" },
      poleSpec: { x: 239.67, y: 451.85, anchor: "leader" },
      diameter3: { x: 225.35, y: 661.2, anchor: "bottom-left" },
      diameter4: { x: 225.35, y: 795.5, anchor: "bottom-left" },
      poleTopOffset: { x: 44.35, y: 82.98, anchor: "vertical" },
      topSectionLength: { x: 44.35, y: 177.6, anchor: "vertical" },
      taperSectionLength: { x: 44.35, y: 468.1, anchor: "vertical" },
      bottomSectionLength: { x: 44.35, y: 765.1, anchor: "vertical" },
      underGroundDepth: { x: 44.35, y: 845.1, anchor: "vertical" },
      baseDimension: { x: 113.81, y: 801.6, anchor: "vertical" },
    },
  },
};

const LABEL_ANCHOR_TRANSFORM = {
  left: "translate(0, -50%)",
  right: "translate(-100%, -50%)",
  "bottom-left": "translate(0, -100%)",
  // Shift up by one text line (--label-lh, the labels' line height) plus
  // half the 1px gap, so the gap lands exactly on the SVG's leader line.
  leader: "translate(0, calc(-1 * var(--label-lh) - 0.5px))",
  vertical: "translate(-50%, -50%) rotate(-90deg)",
  "bottom-center": "translate(-50%, -100%)",
  "bottom-right": "translate(-100%, -100%)",
};

// Builds the label texts for the selected pole from specStandardPole.json.
// Returns null until a height is chosen or when the diagram isn't mapped.
function getDiagramLabels(poleType, groundPosition, height) {
  const layout = DIAGRAM_LABEL_LAYOUT[`${poleType}.${groundPosition}`];
  if (!layout) return null;
  // Layouts flagged textsFromOnGL read the On GL entry for the same pole
  // above G.L. (e.g. 8.3 → "8", 4.8 → "4.5").
  const dataGround = layout.textsFromOnGL ? "onGL" : groundPosition;
  const dataHeight = layout.textsFromOnGL
    ? String(Math.round((Number(height) - UNDER_GL_DEPTH_MM / 1000) * 10) / 10)
    : height;
  const entry =
    STANDARD_POLE_DATA.taper?.[poleType]?.[dataGround]?.[dataHeight];
  const poles = entry?.poles;
  const arm = entry?.arms?.[0];
  const arm2 = entry?.arms?.[1];
  const pole = poles?.[0];
  if (!pole) return null;

  // Spec text describes the tapered section (the only section for IS; the
  // middle one for stepped types like IA).
  const taper = poles.find((p) => p.poleType === "Taper") ?? pole;
  const thickness = Number(taper.upperThickness).toFixed(1);

  // Stepped poles (straight → taper → straight): each section's zHeight is
  // the height of its top end, so section lengths are the differences.
  const [top, middle, bottom] = poles;
  const isStepped = poles.length >= 3;

  const texts = {
    upperDiameter: [`φ${pole.upperDiameter}`],
    poleSpec: [`t${thickness}`, `[JIS G3444 ${taper.material}]`],
    baseDimension: [`${BASE_DIMENSION_MM}`],
    lowerDiameter: [`φ${pole.lowerDiameter}`],
    aboveGroundHeight: [
      `${Math.round(Number(height) * 1000) - UNDER_GL_DEPTH_MM}`,
    ],
    underGroundDepth: [`${UNDER_GL_DEPTH_MM}`],
    // Stepped poles — diameters top to bottom, then section lengths.
    diameter1: [`φ${top.upperDiameter}`],
    diameter2: [`φ${taper.upperDiameter}`],
    diameter3: [`φ${taper.lowerDiameter}`],
    diameter4: [`φ${poles[poles.length - 1].lowerDiameter}`],
    // Arm types — pole top sits above the arm by (pole zHeight − arm
    // zHeight); the arm's own spec goes on its leader.
    ...(arm && {
      poleTopOffset: [`${pole.zHeight - arm.zHeight}`],
      armHeight: [`${arm.zHeight}`],
      armTopDimension: [`${ARM_TOP_DIMENSION_MM}`],
      armLength: [`(${arm.length})`],
      // Second arm (TS / TA): mirrored dimensions on the other side.
      ...(arm2 && {
        armTopDimensionRight: [`${ARM_TOP_DIMENSION_MM}`],
        armLengthRight: [`(${arm2.length})`],
      }),
      armSpec: [
        `φ${arm.diameter}×t${Number(arm.thickness).toFixed(1)}`,
        arm.material,
      ],
    }),
    ...(isStepped && {
      // With an arm, the part above it is its own label (poleTopOffset),
      // so the top section runs from the arm down.
      topSectionLength: [`${(arm ?? top).zHeight - middle.zHeight}`],
      taperSectionLength: [`${middle.zHeight - bottom.zHeight}`],
      bottomSectionLength: [`${bottom.zHeight}`],
    }),
  };

  return Object.entries(layout.positions)
    .filter(([key]) => texts[key])
    .map(([key, pos]) => ({
      key,
      isLeader: pos.anchor === "leader",
      isCentered: !!pos.centered,
      lines: texts[key],
      style: {
        left: `${(pos.x / layout.viewBox.width) * 100}%`,
        top: `${(pos.y / layout.viewBox.height) * 100}%`,
        transform: LABEL_ANCHOR_TRANSFORM[pos.anchor],
      },
    }));
}

// === HELPERS ===
// Renders a red error message below an invalid field
const ErrorStyle = ({ show, text }) =>
  show ? (
    <p className="mt-1.5 text-[11px] md:text-xs text-red-500">*{text}</p>
  ) : null;

const SectionTitle = ({ children }) => (
  <h3 className="text-[#0d3b66] mb-4 flex items-center gap-2 text-xs md:text-sm font-medium hp:text-xs hp:gap-1">
    <div className="w-1 h-5 bg-[#3399cc] rounded-full hp:h-4" />
    {children}
  </h3>
);

const EMPTY_HEIGHT_OPTIONS = { onGL: [], underGL: [] };

const EMPTY_POLE_STANDARD = {
  poleType: "",
  groundPosition: "",
  height: "",
};

export function TaperPoleStandardForm({
  taperPoleStandard,
  onUpdate,
  hideReset = false,
  isBaseplate = true,
  errors = {},
}) {
  const {
    poleStandardOptions,
    heightOptionsByStandard,
    loading: poleStandardLoading,
    error: poleStandardError,
    refetch: refetchPoleStandard,
  } = usePoleStandardData();

  // Tracks which diagram URLs have already finished loading, so re-selecting
  // a pole type/ground position already shown once never re-shows a skeleton.
  const [loadedImages, setLoadedImages] = useState(() => new Set());

  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    if (
      !isBaseplate &&
      taperPoleStandard.poleType &&
      taperPoleStandard.groundPosition !== "underGL"
    ) {
      onUpdate({ groundPosition: "underGL", height: "" });
    }
  }, [
    isBaseplate,
    taperPoleStandard.poleType,
    taperPoleStandard.groundPosition,
    onUpdate,
  ]);

  // Warm the browser cache with every pole diagram in the background so
  // switching pole type / ground position later never shows a blank flash.
  useEffect(() => preloadImagesWhenIdle(ALL_DIAGRAM_IMAGES), []);
  const currentHeightOptions =
    heightOptionsByStandard[taperPoleStandard.poleType] ?? EMPTY_HEIGHT_OPTIONS;

  // In Embedment mode groundPosition is always forced to "underGL" (see
  // effect above) — that's only used to pick the embedment diagram/field.
  // The height list itself should stay the plain onGL values; the +0.3m
  // embedment allowance is entered separately via Embedment Length, not
  // baked into the dropdown.
  const heightLookupKey = !isBaseplate
    ? "onGL"
    : taperPoleStandard.groundPosition;

  const currentImage =
    taperPoleStandard.poleType && taperPoleStandard.groundPosition
      ? !isBaseplate && taperPoleStandard.groundPosition === "underGL"
        ? EMBED_IMAGE_MAP[taperPoleStandard.poleType]
        : (DIAGRAM_IMAGE_MAP[taperPoleStandard.poleType]?.[
            taperPoleStandard.groundPosition
          ] ?? null)
      : null;

  // Dimension texts drawn over the diagram (plain On/Under GL diagrams only,
  // not the Embedment variant).
  const diagramLabels = isBaseplate
    ? getDiagramLabels(
        taperPoleStandard.poleType,
        taperPoleStandard.groundPosition,
        taperPoleStandard.height,
      )
    : null;

  // ── Highlight labels whose value just changed ──
  // When the Height changes, briefly flash only the labels that now read
  // differently, so the user sees exactly which dimensions followed. Not on
  // first appearance, and not when switching to a different diagram.
  // Uses React's "adjust state while rendering" pattern to compare with the
  // previous render's texts.
  const labelDiagramKey = `${taperPoleStandard.poleType}.${taperPoleStandard.groundPosition}`;
  const labelTexts = diagramLabels
    ? Object.fromEntries(diagramLabels.map((l) => [l.key, l.lines.join("|")]))
    : null;
  const labelSignature = labelTexts
    ? `${labelDiagramKey}:${JSON.stringify(labelTexts)}`
    : "";
  const [prevLabels, setPrevLabels] = useState({
    signature: labelSignature,
    diagramKey: labelDiagramKey,
    texts: labelTexts,
  });
  const [flashingLabels, setFlashingLabels] = useState([]);
  if (labelSignature !== prevLabels.signature) {
    const isSameDiagram =
      prevLabels.diagramKey === labelDiagramKey &&
      prevLabels.texts &&
      labelTexts;
    setFlashingLabels(
      isSameDiagram
        ? Object.keys(labelTexts).filter(
            (key) =>
              prevLabels.texts[key] !== undefined &&
              prevLabels.texts[key] !== labelTexts[key],
          )
        : [],
    );
    setPrevLabels({
      signature: labelSignature,
      diagramKey: labelDiagramKey,
      texts: labelTexts,
    });
  }

  const diagramLayout = isBaseplate
    ? DIAGRAM_LABEL_LAYOUT[
        `${taperPoleStandard.poleType}.${taperPoleStandard.groundPosition}`
      ]
    : null;

  const isGroundDisabled = !taperPoleStandard.poleType;
  const showDiagram = !!currentImage;
  const isImageLoaded = currentImage ? loadedImages.has(currentImage) : false;

  const heightField = (
    <>
      <span className="block text-gray-600 text-xs md:text-sm font-medium mb-2">
        Height
      </span>
      <FormSelect
        id="taperPoleStandard.height"
        value={taperPoleStandard.height}
        onChange={(val) => onUpdate({ height: val })}
        options={(currentHeightOptions[heightLookupKey] || []).map((h) => ({
          value: h.id,
          label: h.label,
        }))}
        loading={poleStandardLoading}
        hasError={!!errors.height}
        placeholder="Select Height"
      />
      <ErrorStyle show={errors.height} text={errors.height} />
    </>
  );

  const activeGroundOptions = isBaseplate
    ? GROUND_POSITION_OPTIONS
    : [{ id: "underGL", label: "Embedment" }];

  return (
    <div className="bg-white px-4 md:px-6 pb-6 rounded-b-2xl hp:rounded-b-xl">
      {/* ── Section title ── */}
      <div className="mb-4">
        <SectionTitle>Pole Configuration</SectionTitle>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 hp:gap-3">
        {/* ── LEFT: Pole Type ── */}
        <div
          id="taperPoleStandard.poleType"
          className={`border rounded-xl hp:rounded-lg bg-white shadow-sm overflow-hidden flex flex-col ${
            errors.poleType ? "border-red-300" : "border-slate-200"
          }`}
        >
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
            <p className="text-xs md:text-sm font-medium text-slate-500">
              Pole Standard Type
            </p>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4 flex-1 md:flex md:flex-col">
            {poleStandardLoading && poleStandardOptions.length === 0 && (
              <p className="text-xs sm:text-sm text-slate-400">
                Loading pole standard options...
              </p>
            )}
            {!poleStandardLoading &&
              poleStandardError &&
              poleStandardOptions.length === 0 && (
                <div className="col-span-2 md:col-span-1 flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs sm:text-sm text-red-600">
                    Failed to load pole standard options.
                  </p>
                  <button
                    type="button"
                    onClick={refetchPoleStandard}
                    className="text-xs sm:text-sm font-medium text-red-600 underline hover:text-red-700 shrink-0"
                  >
                    Retry
                  </button>
                </div>
              )}
            {poleStandardOptions.map((option) => {
              const isActive = taperPoleStandard.poleType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      poleType: option.id,
                      groundPosition: !isBaseplate ? "underGL" : "",
                      height: "",
                    })
                  }
                  className={`w-full rounded-lg hp:rounded-md border px-4 py-2 lg:py-2.5 text-xs md:text-sm font-medium transition-all text-left
                  ${
                    isActive
                      ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {errors.poleType && (
            <div className="px-4 pb-3">
              <ErrorStyle show={errors.poleType} text={errors.poleType} />
            </div>
          )}
        </div>

        {/* ── RIGHT: Ground Position + Diagram ── */}
        <div
          className={`border rounded-xl hp:rounded-lg bg-white shadow-sm overflow-hidden flex flex-col ${
            errors.groundPosition ? "border-red-300" : "border-slate-200"
          }`}
        >
          {/* ── Ground position header ── */}
          <div
            id="taperPoleStandard.groundPosition"
            className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex flex-col xl:flex-row items-start xl:items-center gap-3 xl:gap-4 flex-shrink-0"
          >
            <p className="text-xs md:text-sm font-medium text-slate-500 flex-shrink-0">
              Ground Position
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                {activeGroundOptions.map((option) => {
                  const isActive =
                    taperPoleStandard.groundPosition === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={isGroundDisabled}
                      onClick={() => {
                        if (isGroundDisabled) return;
                        onUpdate({ groundPosition: option.id, height: "" });
                      }}
                      className={`
                      flex items-center gap-2
                      rounded-lg hp:rounded-md border px-4 py-2 lg:py-2.5 text-xs md:text-sm font-medium
                      transition-all duration-150 select-none
                      ${
                        isGroundDisabled
                          ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                          : isActive
                            ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm cursor-pointer"
                            : "border-slate-200 text-slate-700 cursor-pointer hover:border-slate-300 hover:bg-slate-100"
                      }
                    `}
                    >
                      {/* Radio circle */}
                      <span
                        className={`
                        w-3.5 h-3.5 rounded-full border-2 flex-shrink-0
                        flex items-center justify-center transition-colors
                        ${
                          isGroundDisabled
                            ? "border-slate-300"
                            : isActive
                              ? "border-blue-500"
                              : "border-slate-400"
                        }
                      `}
                      >
                        {isActive && !isGroundDisabled && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {isGroundDisabled && (
                <span className="text-xs xl:text-sm text-slate-400 italic">
                  Select a pole standard first
                </span>
              )}
              <ErrorStyle
                show={errors.groundPosition}
                text={errors.groundPosition}
              />
            </div>
          </div>

          {/* ── Diagram area ──
              bg-white  → belum ada gambar
              bg-slate-50 → sudah ada gambar
              fixed height → SVG tinggi tidak merusak layout
          ── */}
          <div
            className={`
          relative flex items-center justify-center overflow-hidden
          transition-colors duration-300
          py-8 h-[520px] sm:h-[620px] md:h-[720px] lg:h-[820px] xl:h-[820px]
          ${showDiagram ? "bg-slate-50" : "bg-white"}
        `}
          >
            {/* Dimension texts are plain numbers (drawing convention), so
                state the unit once for the whole diagram. */}
            {showDiagram && isImageLoaded && diagramLabels?.length > 0 && (
              <span className="absolute bottom-3 right-4 text-xs md:text-sm font-medium text-slate-600 pointer-events-none">
                Unit: mm
              </span>
            )}
            {showDiagram ? (
              <div className="flex items-center justify-start xl:justify-center gap-4 w-full px-2 sm:px-3 xl:px-8 h-full">
                {/* Kiri: Height input — only as its own column for diagrams
                    without a mapped layout; mapped ones pin it to the
                    height dimension line inside the image wrapper below. */}
                {!diagramLayout && (
                  <div className="flex-shrink-0 w-[120px] sm:w-[150px] xl:w-[160px] -mr-2">
                    {heightField}
                  </div>
                )}

                {/* Kanan: Diagram image — gambar yang tentukan tinggi container */}
                <div
                  className={`xl:flex-shrink-0 relative flex items-center justify-center h-full min-w-[80px] ${
                    diagramLayout
                      ? "ml-[120px] sm:ml-[150px] xl:ml-[160px]"
                      : ""
                  }`}
                >
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-[11px] md:text-xs">
                        Loading diagram...
                      </span>
                    </div>
                  )}
                  {/* Wrapper sized exactly to the rendered image, so the
                      %-positioned labels line up with the SVG's own
                      coordinates. */}
                  <div className="relative flex max-w-full max-h-full">
                    {/* Height select pinned against the overall-height
                        dimension line (its right edge 8px left of it),
                        vertically centred on it. The left margin on the
                        parent reserves room for it. */}
                    {diagramLayout && (
                      <div
                        style={{
                          left: `${(diagramLayout.heightLineX / diagramLayout.viewBox.width) * 100}%`,
                        }}
                        className="absolute top-1/2 z-10 -translate-y-1/2 -translate-x-[calc(100%+8px)] w-[120px] sm:w-[150px] xl:w-[160px]"
                      >
                        {heightField}
                      </div>
                    )}
                    <img
                      key={currentImage}
                      src={currentImage}
                      alt={`${taperPoleStandard.poleType} diagram`}
                      onLoad={() =>
                        setLoadedImages((prev) =>
                          new Set(prev).add(currentImage),
                        )
                      }
                      className={`w-auto h-auto max-w-full max-h-full object-contain transition-opacity duration-300 ${
                        isImageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {isImageLoaded &&
                      diagramLabels?.map((label) => (
                        // Same size as the Height select's value text
                        // (FormSelect: text-xs md:text-sm) — keep in sync.
                        // Keyed by text too, so a changed value remounts and
                        // its flash animation replays on every change.
                        <div
                          key={`${label.key}:${label.lines.join("|")}`}
                          style={label.style}
                          className={`absolute pointer-events-none whitespace-nowrap text-xs md:text-sm [--label-lh:15px] md:[--label-lh:18px] leading-[var(--label-lh)] text-[#1d4ed8] rounded-sm ${
                            label.isCentered ? "text-center" : ""
                          } ${
                            flashingLabels.includes(label.key)
                              ? "animate-[label-flash_0.9s_ease-out] motion-reduce:animate-none"
                              : ""
                          }`}
                        >
                          {label.isLeader ? (
                            <>
                              <div className="px-[3px]">{label.lines[0]}</div>
                              {/* 1px gap where the SVG's leader line runs */}
                              <div className="h-px" />
                              <div className="px-[3px] pt-px">
                                {label.lines[1]}
                              </div>
                            </>
                          ) : (
                            label.lines.map((line) => (
                              <div key={line}>{line}</div>
                            ))
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Kanan Gambar: Embedment Input */}
                {!isBaseplate &&
                  taperPoleStandard.groundPosition === "underGL" && (
                    <div className="self-end pb-0 mb-0 -translate-y-3 xl:-translate-y-0.5 xl:flex-shrink-0 w-[110px] sm:w-[130px]">
                      <span className="block text-gray-600 text-xs md:text-sm font-medium mb-2">
                        Embedment Length
                      </span>
                      <div className="relative">
                        <input
                          id="taperPoleStandard.embedmentLength"
                          type="number"
                          min="0"
                          value={taperPoleStandard.embedmentLength || ""}
                          onChange={(e) =>
                            onUpdate({ embedmentLength: e.target.value })
                          }
                          onWheel={(e) => e.target.blur()}
                          className={`w-full px-2 py-1.5 md:py-2 lg:py-2.5 border rounded-lg hp:rounded-md text-xs md:text-sm outline-none transition-all pr-8 md:pr-10 min-h-[34px] sm:min-h-[38px] lg:min-h-[42px] ${
                            errors.embedmentLength
                              ? "border-red-500 bg-[#fff5f5] ring-1 ring-red-200"
                              : "border-gray-300 focus:border-[#1D4ED8]"
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm pointer-events-none">
                          mm
                        </span>
                      </div>
                      <ErrorStyle
                        show={errors.embedmentLength}
                        text={errors.embedmentLength}
                      />
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-center px-8 py-10">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl hp:rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                  <Box className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm md:text-base font-medium text-slate-500">
                  {isGroundDisabled
                    ? "No pole standard selected"
                    : "No ground position selected"}
                </p>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-[300px]">
                  {isGroundDisabled
                    ? "Select a standard type to continue. Ground position and pole dimensions will become available."
                    : "Choose a ground position to view the pole diagram and fill in the height of structure."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer: Reset ── */}
      {!hideReset && (
        <div className="flex justify-between pt-5 border-t mt-6">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="flex justify-center items-center text-sm gap-2 px-5 py-2.5 sm:py-2.5 lg:py-2.5 md:px-6 bg-white text-red-500 border border-red-300 rounded-lg hp:rounded-md
            hover:bg-red-50 hover:text-red-600 transition-colors font-medium hp:text-xs"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Reset
          </button>
        </div>
      )}

      <ConfirmResetAllModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={() => onUpdate(EMPTY_POLE_STANDARD)}
        title="Reset all inputs on this section?"
        description="This will clear all inputs entered in this section. This action cannot be undone."
      />
    </div>
  );
}
