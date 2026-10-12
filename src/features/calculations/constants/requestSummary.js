// What the Request Detail summary shows for each cover type: the New Request
// form's sections, each with its fields' labels and how to read the value.
// To show another field, add a row here — the page needs no change.
//
// Section: { title, when?(request), fields }
// Field:   { label, jp?, value(fields, request) → string, wide? }
//   An empty string reads as "—". `wide`: the whole row (long text).
import { designStandardOptions } from "./designStandards";
import {
  CAD_FORMAT_OPTIONS,
  CALC_TYPE_OPTIONS,
  CLASSIFICATION_OPTIONS,
  COMPETITOR_OPTIONS,
  DELIVER_TYPE_OPTIONS,
  DESIGN_ORIGIN_OPTIONS,
  DRAFTING_OPTIONS,
  PAPER_FRAME_OPTIONS,
  PAPER_SIZE_OPTIONS,
  PLATING_OPTIONS,
  PLATING_PROVISO_OPTIONS,
  REQUEST_TYPE_OPTIONS,
  SCHEDULE_FLEX_OPTIONS,
  SCOPE_OPTIONS,
} from "./requestFormOptions";

// ─── Value readers ───────────────────────────────────────────────────────────
const labelOf = (options, value) =>
  options.find((o) => o.value === value)?.label ?? "";

// Typed value, with its unit when there is one.
const text = (key, unit) => (f) =>
  f[key] && unit ? `${f[key]} ${unit}` : (f[key] ?? "");
// Picked option's label; "Other" shows what was typed next to it.
const option = (key, options, otherKey) => (f) =>
  otherKey && f[key] === "other" && f[otherKey]
    ? `Other: ${f[otherKey]}`
    : labelOf(options, f[key]);
// Ticked options (each a true/false field), joined. `other`: the option
// whose typed text is shown instead of its label.
const ticked =
  (options, other = {}) =>
  (f) =>
    options
      .filter((o) => f[o.value])
      .map((o) =>
        o.value === other.flag && f[other.key]
          ? `Other: ${f[other.key]}`
          : o.label,
      )
      .join(", ");
// Several typed values in one row.
const joined = (keys, separator) => (f) =>
  keys
    .map((k) => f[k])
    .filter(Boolean)
    .join(separator);

const discipline = (_, request) =>
  [
    request.workTypes.calc && "Calculation",
    request.workTypes.drawing && "Drawing",
  ]
    .filter(Boolean)
    .join(" & ");
const deliverables = (f) =>
  [labelOf(DELIVER_TYPE_OPTIONS, f.deliverType), f.deliverCad && "CAD Data"]
    .filter(Boolean)
    .join(", ");
const competitor = (f) =>
  f.hasCompetitor === "yes" && f.competitorName
    ? `Yes: ${f.competitorName}`
    : labelOf(COMPETITOR_OPTIONS, f.hasCompetitor);
const platingProviso = (f) =>
  [labelOf(PLATING_PROVISO_OPTIONS, f.platingProviso), f.platingProvisoText]
    .filter(Boolean)
    .join(": ");
const designStandard = (f, request) =>
  labelOf(designStandardOptions[request.projectType] ?? [], f.standard);
const note = (_, request) => request.note ?? "";

const hasCalc = (request) => request.workTypes.calc;
const hasDrawing = (request) => request.workTypes.drawing;

// ─── Sections per cover type ─────────────────────────────────────────────────
const NOTE_SECTION = {
  title: "Request Note",
  fields: [{ label: "Note", value: note, wide: true }],
};

export const REQUEST_SUMMARY = {
  yp: [
    {
      title: "Request Identity",
      fields: [
        {
          label: "Requesting Department",
          jp: "依頼部署",
          value: text("department"),
        },
        { label: "Request No.", jp: "図番", value: text("documentNo") },
        {
          label: "Subject",
          jp: "依頼件名",
          value: text("subject"),
          wide: true,
        },
        {
          label: "Design Request Management No.",
          jp: "設計依頼管理No",
          value: text("mgmtNo"),
        },
        {
          label: "Classification",
          jp: "分類",
          value: option("classification", CLASSIFICATION_OPTIONS),
        },
        { label: "Request Date", jp: "依頼年月日", value: text("requestDate") },
        {
          label: "Expected Completion Date",
          jp: "完成希望日",
          value: text("dueDate"),
        },
        {
          label: "Request Type",
          jp: "依頼種別",
          value: option("requestType", REQUEST_TYPE_OPTIONS),
        },
        { label: "Discipline", value: discipline },
      ],
    },
    {
      title: "Request Scope · Calculation",
      when: hasCalc,
      fields: [
        {
          label: "Calculation",
          jp: "構造計算",
          value: ticked(CALC_TYPE_OPTIONS),
        },
        {
          label: "Scope",
          value: ticked(SCOPE_OPTIONS, {
            flag: "scopeOtherOn",
            key: "scopeOther",
          }),
        },
        {
          label: "Calculation Report No.",
          jp: "計算書番号",
          value: text("calcReportNo"),
        },
        {
          label: "Finished Copies",
          jp: "完成部数",
          value: text("finishedCopies", "copies"),
        },
      ],
    },
    {
      title: "Request Scope · Drawing",
      when: hasDrawing,
      fields: [
        { label: "Drafting", jp: "作図", value: ticked(DRAFTING_OPTIONS) },
        { label: "Deliverables", value: deliverables },
        {
          label: "Paper Size",
          jp: "用紙サイズ指定",
          value: option("paperSize", PAPER_SIZE_OPTIONS, "paperSizeOther"),
        },
        {
          label: "Paper Frame",
          jp: "用紙枠指定",
          value: option("paperFrame", PAPER_FRAME_OPTIONS),
        },
        {
          label: "CAD Format",
          jp: "CADデータ形式",
          value: option("cadFormat", CAD_FORMAT_OPTIONS, "cadFormatOther"),
        },
      ],
    },
    {
      title: "Request Details",
      fields: [
        {
          label: "Design Origin",
          jp: "設計起源",
          value: option("designOrigin", DESIGN_ORIGIN_OPTIONS),
        },
        {
          label: "Attachments",
          jp: "添付書類",
          value: text("attachments", "sheets"),
        },
        { label: "Department Code", jp: "部門コード", value: text("deptCode") },
        { label: "Person In Charge", jp: "担当者", value: text("pic") },
        {
          label: "Schedule Adjustment",
          jp: "日程調整",
          value: option("scheduleFlex", SCHEDULE_FLEX_OPTIONS),
        },
        { label: "Schedule Note", value: text("scheduleNote") },
        {
          label: "Submission",
          jp: "提出先",
          value: joined(["submitTo1", "submitTo2", "submitTo3"], " › "),
        },
        {
          label: "Scheduled Delivery Date",
          jp: "納入予定日",
          value: text("deliveryDate"),
        },
        { label: "Number of Types", value: text("quantityTypes", "types") },
        { label: "Number of Units", value: text("quantityUnits", "units") },
        { label: "Competitor", jp: "競合他社", value: competitor },
      ],
    },
    {
      title: "Plating",
      fields: [
        {
          label: "Hot-dip Galvanizing",
          jp: "溶融亜鉛メッキ",
          value: option("plating", PLATING_OPTIONS),
        },
        {
          label: "Additional Wording",
          jp: "以降の文言",
          value: platingProviso,
          wide: true,
        },
      ],
    },
    NOTE_SECTION,
  ],
  ys: [
    {
      title: "Project Identity",
      fields: [
        { label: "Project No. (PJNO)", value: text("projectNo") },
        { label: "Project Name", value: text("projectName"), wide: true },
      ],
    },
    {
      title: "Request Identity",
      fields: [
        {
          label: "Design Request Management No.",
          jp: "設計依頼管理No",
          value: text("mgmtNo"),
        },
        { label: "Request No.", jp: "依頼No", value: text("requestNo") },
        { label: "Company Name", jp: "会社名", value: text("companyName") },
        {
          label: "Classification",
          jp: "分類",
          value: option("classification", CLASSIFICATION_OPTIONS),
        },
        { label: "Request Date", jp: "依頼日", value: text("requestDate") },
        {
          label: "Requested Due Date",
          jp: "要望期日",
          value: text("requestedDate"),
        },
        {
          label: "Request Type",
          jp: "依頼種別",
          value: option("requestType", REQUEST_TYPE_OPTIONS),
        },
        { label: "Discipline", value: discipline },
      ],
    },
    {
      title: "Request Details",
      fields: [
        { label: "Reception No.", jp: "受付No", value: text("receptionNo") },
        { label: "Person In Charge", jp: "担当", value: text("pic") },
        {
          label: "Delivery Schedule",
          jp: "納入時期",
          value: text("deliveryDate"),
        },
        {
          label: "Delivery Quantity",
          jp: "納入数量",
          value: text("deliveryQty"),
        },
      ],
    },
    {
      title: "Cover Design Conditions",
      fields: [
        {
          label: "Opening Height",
          jp: "開口部高さ",
          value: text("openingHeight"),
        },
        {
          label: "Opening Direction",
          jp: "開口部方向",
          value: text("openingDirection"),
        },
        {
          label: "Foundation Shape",
          jp: "基礎形状",
          value: text("foundation"),
        },
        {
          label: "Width (Diameter)",
          jp: "巾（直径）",
          value: text("foundationWidth"),
        },
        { label: "Length", jp: "奥行", value: text("foundationLength") },
        { label: "Depth", jp: "深さ", value: text("foundationDepth") },
      ],
    },
    {
      title: "Cover Design Conditions · Calculation",
      when: hasCalc,
      fields: [
        { label: "Standard", jp: "規格", value: designStandard },
        { label: "Wind Speed", jp: "風速", value: text("windSpeed", "m/s") },
      ],
    },
    {
      title: "Cover Design Conditions · Drawing",
      when: hasDrawing,
      fields: [
        { label: "Drawing Type", jp: "図面種類", value: text("drawingType") },
        {
          label: "Surface Treatment",
          jp: "表面処理",
          value: text("surfaceTreatment"),
        },
        { label: "Coating Type", jp: "塗装種類", value: text("coatingType") },
      ],
    },
    NOTE_SECTION,
  ],
};

// The request's number and title, as on its cover.
export const REQUEST_HEADLINE = {
  yp: { no: "documentNo", title: "subject" },
  ys: { no: "requestNo", title: "projectName" },
};
export const requestNoOf = (request) =>
  request.fields[REQUEST_HEADLINE[request.coverType].no] ?? "";
