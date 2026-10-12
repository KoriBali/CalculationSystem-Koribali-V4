// utils/requestDateFilters.js
//
// From / To date-range filters for the request lists (request date, due
// date, completed date). A range is { from: "YYYY-MM-DD", to } and either
// end may be empty: "from 1 Mar" alone means "since 1 Mar".
//
// Values are compared as local-calendar YYYY-MM-DD strings, in the viewer's
// own timezone, so a request cleared at 23:30 stays on that day for whoever
// is looking (WIB in Bali, JST in Japan).

export const EMPTY_DATE_RANGE = { from: "", to: "" };

const pad = (n) => String(n).padStart(2, "0");

// Local calendar day of a date-only string or a timestamp.
export function localDay(value) {
  if (!value) return "";
  if (value.length === 10) return value;
  const d = new Date(value);
  return isNaN(d.getTime())
    ? ""
    : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "From" after "To" — shown as an error, never applied.
export const isInvalidRange = (r) => !!r.from && !!r.to && r.from > r.to;

export const isRangeActive = (r) =>
  (!!r.from || !!r.to) && !isInvalidRange(r);

export function matchesDateRange(value, r) {
  if (!isRangeActive(r)) return true;
  const day = localDay(value);
  if (!day) return false;
  return (!r.from || day >= r.from) && (!r.to || day <= r.to);
}
