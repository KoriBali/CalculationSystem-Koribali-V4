// data/mockRequests.js
//
// Placeholder data for the Request list until the requests API exists.
// Fields mirror the `requests` table (camelCased); `items` are *my*
// assignments on the request's cases, which is what tab, status label and
// progress are derived from (see utils/requestStatus.js).
//
// NOTE on "Line" fields (A5):
//   Request → `brandLine`  (BE field: brand_line)
//   Project → `requestForm` (BE field: request_form)
//   These are intentionally different names from the BE. Both display as
//   "Line" in the UI, but they must NOT be merged into a single field name.
//
// `picName` is the one active PIC (null when nobody is assigned);
// `closedAt` is when the request was cleared/cancelled, also from events.
// `createdByName` is created_by_user_id joined to the user's name;
// `submittedByName` is whoever submitted it to Japan (from the submit event),
// only set once the request has been submitted.
// `closedAt` is when the request was cleared/cancelled, also from events.
// `createdByName` is created_by_user_id joined to the user's name;
// `submittedByName` is whoever submitted it to Japan (from the submit event),
// only set once the request has been submitted.
import { ITEM_STATUS as S } from "../utils/requestStatus";

const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();

// YYYY-MM-DD, `n` days from today (negative = past)
const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const pad = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const LINES = [
  { key: "ys", label: "YS" },
  { key: "yp", label: "YP" },
];

// issuer_office_code — YS covers only.
export const ISSUER_OFFICES = [
  { key: "YSC", label: "YSC · Tokyo Sales Office" },
  { key: "YSF", label: "YSF · Nagano Sales Office" },
  { key: "YSG", label: "YSG · North Kanto Sales Office" },
  { key: "YSJ", label: "YSJ · Kyushu Branch" },
];

// Staff names for created_by / submitted_by. Creators come from the team of
// the request's line; submissions to Japan from Development (and Bryant).
const TEAM_YS = [
  "Bintarjo Agus Priyadi",
  "M. Ramdan Purnama",
  "Ajie Jodi Sumarno",
  "Nawid Ahmad",
  "Vannto",
];
const TEAM_YP = [
  "Ricki Harmon",
  "Pijar Eko Saktiaji",
  "Muhammad Fitra Romadhon",
  "Cece Saepurrohman",
  "Mediani Utami",
  "Raden Nur Afrisya",
];
const SUBMITTERS = [
  "Amiril Mukminin",
  "Muhammad Rifa Alfadli",
  "Ni Nyoman Kayika Manuhita",
  "Nurul Balqis Apriany",
  "Azzachra Caesyafitri",
  "Bryant",
];

// [no, line, pjNo, subject, company, pic, closed N days ago]
const ARCHIVE = [
  [
    "0108",
    "ys",
    "11902",
    "Tsukuba science park lighting",
    "Ibaraki Denki",
    "Rani Putri",
    12,
  ],
  [
    "0106",
    "yp",
    "T-100120",
    "Kobe harbor signboard pole",
    "Hanshin Signs",
    "Dimas Pratama",
    15,
  ],
  [
    "0104",
    "ys",
    "11870",
    "Sendai station plaza lighting",
    "Tohoku Lighting",
    "Rani Putri",
    18,
  ],
  [
    "0101",
    "yp",
    "T-100098",
    "Osaka ring road speaker pole",
    "Kansai Bousai",
    "Ayu Lestari",
    22,
  ],
  [
    "0099",
    "ys",
    "11833",
    "Kanazawa castle park lighting",
    "Hokuriku Lighting",
    "Rani Putri",
    26,
  ],
  [
    "0097",
    "yp",
    "T-100071",
    "Nagoya expressway signboard pole",
    "Chubu Sign Co.",
    "Dimas Pratama",
    30,
  ],
  [
    "0094",
    "ys",
    "11790",
    "Hiroshima riverside lighting",
    "Setouchi Denko",
    "Rani Putri",
    35,
  ],
  [
    "0092",
    "yp",
    "T-100054",
    "Fukuoka airport floodlight pole",
    "Kyushu Infra",
    "Ayu Lestari",
    41,
  ],
  [
    "0090",
    "ys",
    "11752",
    "Matsumoto city street lighting",
    "Shinano Denki",
    "Rani Putri",
    47,
  ],
  [
    "0087",
    "yp",
    "T-100030",
    "Sapporo snow festival lighting",
    "Hokkaido Lights",
    "Dimas Pratama",
    54,
  ],
  [
    "0085",
    "ys",
    "11708",
    "Kyoto temple path lighting",
    "Rakuto Lighting",
    "Rani Putri",
    60,
  ],
  [
    "0083",
    "yp",
    "T-100012",
    "Okinawa coastal warning pole",
    "Ryukyu Bousai",
    "Ayu Lestari",
    68,
  ],
];

export const MOCK_REQUESTS = [
  {
    id: "req-0125",
    brandLine: "ys",
    requestNo: "REQ-0125",
    receiptNo: "R-2609-041",
    pjNo: "12345",
    subject: "Route 16 road lighting renewal",
    requestDate: daysFromNow(-12),
    issuerOfficeCode: "YSC",
    requesterPicName: "Sato Hiroshi",
    companyName: "Kawaguchi Denki Co., Ltd.",
    status: "internal",
    requestType: "general",
    designType: "calculation",
    requestClassification: "new",
    poleKind: "standard",
    dueDate: daysFromNow(2),
    documentDeliveryTarget: null,
    updatedAt: hoursAgo(2),
    createdByName: "Bintarjo Agus Priyadi",
    createdAt: hoursAgo(288),
    picName: "Rani Putri",
    items: [
      { caseNo: "001", work_type: "calc", status: S.READY_CHECK },
      { caseNo: "002", work_type: "calc", status: S.INTERNAL_CORRECTION },
    ],
  },
  {
    id: "req-0119",
    brandLine: "yp",
    requestNo: "REQ-0119",
    receiptNo: "R-2609-017",
    pjNo: "T-100234",
    subject: "Shinjuku east exit signboard pole",
    requestDate: daysFromNow(-20),
    issuerOfficeCode: null,
    requesterPicName: "Mori Kaori",
    companyName: "Tokyo Sign Works",
    status: "diajukan",
    requestType: "general",
    designType: "drawing",
    requestClassification: "change",
    poleKind: "custom",
    dueDate: daysFromNow(-1),
    documentDeliveryTarget: null,
    updatedAt: hoursAgo(5),
    createdByName: "Ricki Harmon",
    createdAt: hoursAgo(480),
    submittedByName: "Muhammad Rifa Alfadli",
    picName: "Rani Putri",
    items: [
      {
        caseNo: "001",
        work_type: "drawing",
        status: S.RETURNED,
        note: "Feedback from Japan",
      },
    ],
  },
  {
    id: "req-0123",
    brandLine: "yp",
    requestNo: "REQ-0123",
    receiptNo: "R-2609-033",
    pjNo: "T-100310",
    subject: "Nagano disaster warning speaker pole",
    requestDate: daysFromNow(-8),
    issuerOfficeCode: null,
    requesterPicName: "Kimura Daichi",
    companyName: "Shinano Bousai K.K.",
    status: "internal",
    requestType: "general",
    designType: "calculation",
    requestClassification: "new",
    poleKind: "standard",
    dueDate: daysFromNow(9),
    documentDeliveryTarget: null,
    updatedAt: hoursAgo(26),
    createdByName: "Pijar Eko Saktiaji",
    createdAt: hoursAgo(192),
    picName: "Rani Putri",
    items: [
      { caseNo: "001", work_type: "calc", status: S.READY_CHECK },
      { caseNo: "002", work_type: "calc", status: S.IN_PROGRESS },
      { caseNo: "003", work_type: "calc", status: S.IN_PROGRESS },
    ],
  },
  {
    // No Japanese request number on the cover.
    id: "req-0121",
    brandLine: "ys",
    requestNo: null,
    receiptNo: "R-2609-028",
    pjNo: "12210",
    subject: "Hakusan park lighting",
    requestDate: daysFromNow(-15),
    issuerOfficeCode: "YSG",
    requesterPicName: "Ito Ayaka",
    companyName: "Hokuriku Lighting",
    status: "internal",
    requestType: "general",
    designType: "calculation",
    requestClassification: "reuse_new",
    poleKind: "standard",
    dueDate: daysFromNow(32),
    documentDeliveryTarget: null,
    updatedAt: hoursAgo(74),
    createdByName: "M. Ramdan Purnama",
    createdAt: hoursAgo(360),
    picName: "Rani Putri",
    items: [
      { caseNo: "001", work_type: "calc", status: S.IN_PROGRESS },
      { caseNo: "002", work_type: "calc", status: S.IN_PROGRESS },
      { caseNo: "003", work_type: "calc", status: S.IN_PROGRESS },
    ],
  },
  {
    // drawing_calculation request, but I'm only assigned to the calc side.
    id: "req-0124",
    brandLine: "ys",
    requestNo: "REQ-0124",
    receiptNo: "R-2609-038",
    pjNo: "12398",
    subject: "Arakawa bridge lighting pole",
    requestDate: daysFromNow(-6),
    issuerOfficeCode: "YSF",
    requesterPicName: "Yamada Ken",
    companyName: "Arakawa Kensetsu",
    status: "internal",
    requestType: "general",
    designType: "drawing_calculation",
    requestClassification: "new",
    poleKind: "custom",
    dueDate: daysFromNow(14),
    documentDeliveryTarget: null,
    updatedAt: hoursAgo(6),
    createdByName: "Ajie Jodi Sumarno",
    createdAt: hoursAgo(144),
    picName: "Rani Putri",
    items: [
      { caseNo: "001", work_type: "calc", status: S.READY_CHECK },
      { caseNo: "002", work_type: "calc", status: S.READY_CHECK },
    ],
  },
  {
    id: "req-0118",
    brandLine: "yp",
    requestNo: "REQ-0118",
    receiptNo: "R-2609-012",
    pjNo: "T-100198",
    subject: "Chiba port multi-purpose pole",
    requestDate: daysFromNow(-18),
    issuerOfficeCode: null,
    requesterPicName: "Hayashi Rin",
    companyName: "Keiyo Infra",
    status: "internal",
    requestType: "general",
    designType: "drawing",
    requestClassification: "change",
    poleKind: "standard",
    dueDate: daysFromNow(5),
    documentDeliveryTarget: null,
    updatedAt: hoursAgo(50),
    createdByName: "Muhammad Fitra Romadhon",
    createdAt: hoursAgo(432),
    picName: "Rani Putri",
    items: [{ caseNo: "001", work_type: "drawing", status: S.READY_SUBMIT }],
  },
  {
    id: "req-0115",
    brandLine: "ys",
    requestNo: "REQ-0115",
    receiptNo: "R-2609-006",
    pjNo: "12087",
    subject: "Saitama stadium floodlight pole",
    requestDate: daysFromNow(-25),
    issuerOfficeCode: "YSJ",
    requesterPicName: "Suzuki Taro",
    companyName: "Saitama Denko",
    status: "diajukan",
    requestType: "general",
    designType: "drawing_calculation",
    requestClassification: "new",
    poleKind: "custom",
    dueDate: daysFromNow(20),
    documentDeliveryTarget: null,
    updatedAt: hoursAgo(98),
    createdByName: "Nawid Ahmad",
    createdAt: hoursAgo(600),
    submittedByName: "Bryant",
    picName: "Rani Putri",
    items: [
      { caseNo: "001", work_type: "calc", status: S.SUBMITTED },
      { caseNo: "001", work_type: "drawing", status: S.SUBMITTED },
    ],
  },
  {
    id: "req-0112",
    brandLine: "yp",
    requestNo: "REQ-0112",
    receiptNo: "R-2608-091",
    pjNo: "T-100150",
    subject: "Yokohama bay street light pole",
    requestDate: daysFromNow(-40),
    issuerOfficeCode: null,
    requesterPicName: "Ogawa Mei",
    companyName: "Minato Lighting",
    status: "cleared",
    requestType: "general",
    designType: "calculation",
    requestClassification: "new",
    poleKind: "standard",
    dueDate: daysFromNow(-10),
    documentDeliveryTarget: null,
    updatedAt: hoursAgo(146),
    createdByName: "Cece Saepurrohman",
    createdAt: hoursAgo(960),
    submittedByName: "Amiril Mukminin",
    picName: "Rani Putri",
    closedAt: daysFromNow(-6),
    items: [
      { caseNo: "001", work_type: "calc", status: S.CLEARED },
      { caseNo: "002", work_type: "calc", status: S.CLEARED },
    ],
  },
  {
    // Special request (head code @).
    id: "req-0109",
    brandLine: "ys",
    requestNo: "REQ-0109",
    receiptNo: "R-2608-077",
    pjNo: "10021",
    subject: "Standard pole spec review",
    requestDate: daysFromNow(-30),
    issuerOfficeCode: "YSC",
    requesterPicName: null,
    companyName: null,
    status: "cancel",
    requestType: "special",
    designType: "calculation",
    requestClassification: "new",
    poleKind: "standard",
    dueDate: daysFromNow(-4),
    documentDeliveryTarget: null,
    updatedAt: hoursAgo(220),
    createdByName: "Vannto",
    createdAt: hoursAgo(720),
    picName: null,
    closedAt: daysFromNow(-9),
    items: [{ caseNo: "001", work_type: "calc", status: S.CANCELLED }],
  },
  // Older, already-cleared requests (compact) so Done / All have enough rows
  // to page through.
  ...ARCHIVE.map(
    ([no, line, pjNo, subject, companyName, picName, closedDaysAgo], i) => ({
      id: `req-${no}`,
      brandLine: line,
      requestNo: `REQ-${no}`,
      receiptNo: `R-26${no}`,
      pjNo,
      subject,
      requestDate: daysFromNow(-closedDaysAgo - 21),
      issuerOfficeCode: line === "ys" ? "YSC" : null,
      requesterPicName: null,
      companyName,
      status: "cleared",
      requestType: "general",
      designType: "calculation",
      requestClassification: "new",
      poleKind: "standard",
      // Closed on the due date, 3 days early, or 2 days late, in turn, so the
      // Closed column shows every outcome.
      dueDate: daysFromNow(-closedDaysAgo + [0, 3, -2][i % 3]),
      documentDeliveryTarget: null,
      updatedAt: hoursAgo(closedDaysAgo * 24),
      picName,
      closedAt: daysFromNow(-closedDaysAgo),
      createdByName: (line === "ys" ? TEAM_YS : TEAM_YP)[
        Math.floor(i / 2) % (line === "ys" ? TEAM_YS : TEAM_YP).length
      ],
      createdAt: hoursAgo((closedDaysAgo + 20) * 24),
      submittedByName: SUBMITTERS[i % SUBMITTERS.length],
      items: [{ caseNo: "001", work_type: "calc", status: S.CLEARED }],
    }),
  ),
];
