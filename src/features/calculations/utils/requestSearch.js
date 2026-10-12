// utils/requestSearch.js
//
// Searching the request lists:
//   - the main box searches every field below at once (quick search)
//   - "More filters" has one input per field, DataBank style (PJNo, 依頼No,
//     受付番号, 施主名, 依頼担当 …), and every filled input must match, so
//     "Request no. 123 + PIC Rina" narrows down to exactly that.
//
// Number fields match from the start of the number, ignoring separators and
// leading zeros: "100234" finds T-100234 and "125" finds REQ-0125, while
// "123" doesn't drag in T-100123 the way a plain substring search would.
// Text fields match anywhere in the text.

export const SEARCH_FIELDS = [
  { key: "pjNo", label: "Project no.", placeholder: "e.g. 100234", number: true },
  { key: "requestNo", label: "Request no.", placeholder: "e.g. 0125", number: true },
  { key: "receiptNo", label: "Receipt no.", placeholder: "e.g. 2609-041", number: true },
  { key: "companyName", label: "Client", placeholder: "Client name" },
  { key: "requesterPicName", label: "Japan PIC", placeholder: "Name on the cover" },
  // Searched by the main box only; no input of their own in More filters.
  { key: "picName", label: "PIC", mainOnly: true },
  { key: "subject", label: "Subject", mainOnly: true },
];

// Digits only, leading zeros dropped: "T-100234" → "100234", "REQ-0125" → "125".
const numberPart = (v) =>
  String(v ?? "").replace(/\D/g, "").replace(/^0+/, "");

// Letters and digits only, lowercased: "R-2609-041" → "r2609041".
const compact = (v) =>
  String(v ?? "").toLowerCase().replace(/[^a-z0-9@]/g, "");

function matchesNumber(value, term) {
  if (!value) return false;
  // A term with letters ("T-1002", "@100") is matched as written.
  if (/[a-z@]/i.test(term)) return compact(value).startsWith(compact(term));
  const digits = numberPart(term);
  return digits !== "" && numberPart(value).startsWith(digits);
}

// One field against its own input; an empty input always matches.
export function matchesField(row, key, rawTerm) {
  const term = (rawTerm ?? "").trim();
  if (!term) return true;
  const field = SEARCH_FIELDS.find((f) => f.key === key);
  if (field?.number) return matchesNumber(row[key], term);
  return !!row[key]?.toLowerCase().includes(term.toLowerCase());
}

// Main search box: substring match on any field.
export function matchesQuickSearch(row, rawTerm) {
  const term = (rawTerm ?? "").trim().toLowerCase();
  if (!term) return true;
  return SEARCH_FIELDS.some((f) => row[f.key]?.toLowerCase().includes(term));
}
