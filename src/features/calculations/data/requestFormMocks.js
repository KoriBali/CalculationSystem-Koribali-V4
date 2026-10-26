// Stand-in data for the New Request form until the BE endpoints exist.

// Workers who can be added to a request (users API).
export const MOCK_WORKERS = [
  {
    id: "u-bintarjo",
    name: "Bintarjo Agus Priyadi",
    department: "Lighting Design Dept.",
  },
  {
    id: "u-ramdan",
    name: "M. Ramdan Purnama",
    department: "Lighting Design Dept.",
  },
  {
    id: "u-ajie",
    name: "Ajie Jodi Sumarno",
    department: "Lighting Design Dept.",
  },
  {
    id: "u-nawid",
    name: "Nawid Ahmad",
    department: "Lighting Design Dept.",
  },
  {
    id: "u-vannto",
    name: "Vannto",
    department: "Lighting Design Dept.",
  },
  {
    id: "u-ricki",
    name: "Ricki Harmon",
    department: "Structural Dept.",
  },
  {
    id: "u-pijar",
    name: "Pijar Eko Saktiaji",
    department: "Structural Dept.",
  },
  {
    id: "u-fitra",
    name: "Muhammad Fitra Romadhon",
    department: "Structural Dept.",
  },
  {
    id: "u-cece",
    name: "Cece Saepurrohman",
    department: "Drafting Dept.",
  },
  {
    id: "u-mediani",
    name: "Mediani Utami",
    department: "Drafting Dept.",
  },
  {
    id: "u-afrisya",
    name: "Raden Nur Afrisya",
    department: "Drafting Dept.",
  },
  {
    id: "u-amiril",
    name: "Amiril Mukminin",
    department: "Development Dept.",
  },
  {
    id: "u-rifa",
    name: "Muhammad Rifa Alfadli",
    department: "Development Dept.",
  },
  {
    id: "u-kayika",
    name: "Ni Nyoman Kayika Manuhita",
    department: "Development Dept.",
  },
  {
    id: "u-azzachra",
    name: "Azzachra Caesyafitri",
    department: "Development Dept.",
  },
  {
    id: "u-bryant",
    name: "Bryant",
    department: "Development Dept.",
  },
];

// What the extraction API will return for a YS cover. `null` = not found on
// the cover (one required and one optional field are left out on purpose so
// both "not found" states can be seen).
export const MOCK_COVER_EXTRACT = {
  requestNo: "YSC-26-0107",
  receptionNo: "26-0311",
  classification: "new",
  requestType: "general",
  deliveryDate: "2026-03-26",
  requestDate: "2026-01-26",
  requestedDate: "2026-01-30",
  deliveryQty: null,
  companyName: "YSポール(東京営業所－YSPOLE)",
  projectNo: "77732",
  projectName: "宮下児童遊園",
  // Standard is picked from this project type's list at auto-fill time.
  standard: "",
  windSpeed: "60",
  foundation: "square",
  foundationWidth: "800",
  foundationLength: "800",
  foundationDepth: "1500",
  openingHeight: "GL＋750",
  openingDirection: "A",
  drawingType: "APD (Approval Drawing)",
  surfaceTreatment: "HDZ55",
  coatingType: null,
  pic: "花村　勇佑",
  // Fills the Discipline cards (workTypes), not a `ys` field.
  discipline: "calc",
};

export const MOCK_EXTRACT_DELAY_MS = 1600;

// Requests already issued per head + project number ("R-658053"), each with
// its history no. (0 = no "-n") — the project lookup API.
const entry = (historyNo, tail, classification, deliveryDate) => ({
  historyNo,
  tail,
  classification,
  deliveryDate,
});
export const MOCK_DOCUMENT_HISTORY = {
  // Started straight at -7.
  "E-123456": [entry(7, "JP", "new", "2026-09-25")],
  "E-660033": [
    entry(0, "PJ", "new", "2025-06-20"),
    entry(1, "PJ", "new", "2025-11-14"),
    entry(2, "PJ", "change", "2026-01-09"),
    entry(3, "YS", "reuse_new", "2026-03-20"),
    entry(4, "PJ", "change", "2026-06-11"),
    entry(5, "YS", "change", "2026-08-02"),
    entry(6, "PJ", "change", "2026-09-18"),
  ],
  "R-658053": [
    entry(0, "PJ", "new", "2026-02-10"),
    entry(1, "PJ", "change", "2026-04-03"),
    entry(2, "YJ", "change", "2026-05-22"),
    entry(3, "ST", "reuse_new", "2026-08-30"),
  ],
};

// Requests of a head + project number, newest first.
export const lookupDocumentHistory = (head, projectNo) =>
  [...(MOCK_DOCUMENT_HISTORY[`${head}-${projectNo}`] ?? [])].sort(
    (a, b) => b.historyNo - a.historyNo,
  );
