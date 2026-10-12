import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { format, getDaysInMonth, isValid, parse, parseISO } from "date-fns";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "react-datepicker/dist/react-datepicker.css";
import "./DateInput.css";

const DATE_FORMAT = "yyyy-MM-dd";

const toDate = (iso) => {
  const date = iso ? parseISO(iso) : null;
  return date && isValid(date) ? date : null;
};
const toIso = (date) => (date ? format(date, DATE_FORMAT) : "");
// Same day in another month / year; a day the month doesn't have becomes
// its last day (31 → 28 in February).
const withMonthYear = (date, year, month) =>
  new Date(
    year,
    month,
    Math.min(date.getDate(), getDaysInMonth(new Date(year, month))),
  );

// ─── Typing ──────────────────────────────────────────────────────────────────
// Only digits are kept, and the dashes go in by themselves: 2026 → 2026-,
// 202610 → 2026-10-, 20261009 → 2026-10-09. The trailing dash is only added
// while typing forward, so Backspace can still remove it.
const maskDate = (raw, inserting) => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const text = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6)]
    .filter(Boolean)
    .join("-");
  const trailingDash =
    inserting && (digits.length === 4 || digits.length === 6) ? "-" : "";
  return text + trailingDash;
};
// Where the caret goes in the masked text: after the same number of digits
// as before masking (and past a dash that was just added).
const caretAfterDigits = (masked, digitCount, inserting) => {
  let pos = 0;
  for (let seen = 0; pos < masked.length && seen < digitCount; pos++) {
    if (/\d/.test(masked[pos])) seen++;
  }
  return inserting && masked[pos] === "-" ? pos + 1 : pos;
};
// Rewrites the input's text before react-datepicker reads it.
const maskInputEvent = (event) => {
  const input = event?.target;
  if (!(input instanceof HTMLInputElement)) return; // a day clicked in the calendar
  const inserting = event.nativeEvent?.inputType?.startsWith("insert") ?? false;
  const raw = input.value;
  const masked = maskDate(raw, inserting);
  if (masked === raw) return;
  const digitsBeforeCaret = raw
    .slice(0, input.selectionStart ?? raw.length)
    .replace(/\D/g, "").length;
  input.value = masked;
  const caret = caretAfterDigits(masked, digitsBeforeCaret, inserting);
  input.setSelectionRange(caret, caret);
};

// ─── Pasting ─────────────────────────────────────────────────────────────────
// Year-first dates only — day-first ones (09/10/2026) can't be told apart
// from month-first. Whatever was pasted, the field shows yyyy-MM-dd.
const PASTE_PATTERNS = [
  // 2026-10-09 · 2026/10/9 · 2026.10.09 · 2026年10月9日
  /^(\d{4})\s*[-/.年]\s*(\d{1,2})\s*[-/.月]\s*(\d{1,2})\s*日?$/,
  // 20261009
  /^(\d{4})(\d{2})(\d{2})$/,
];
// "yyyy-MM-dd" for a real date (no 2026-02-30), otherwise null.
const pastedDate = (text) => {
  const [, y, m, d] =
    PASTE_PATTERNS.map((re) => text.trim().match(re)).find(Boolean) ?? [];
  if (!y) return null;
  const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  return isValid(parse(iso, DATE_FORMAT, new Date())) ? iso : null;
};
// A date goes in as yyyy-MM-dd; anything else is ignored. Sent through the
// input's own change event so react-datepicker parses it like typed text.
const handlePaste = (event) => {
  event.preventDefault();
  const iso = pastedDate(event.clipboardData.getData("text"));
  if (!iso) return;
  const input = event.currentTarget;
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(
    input,
    iso,
  );
  input.dispatchEvent(new Event("input", { bubbles: true }));
};

// ─── Calendar header ─────────────────────────────────────────────────────────
// "‹  December ⌄  2026 ⌄  ›". Clicking the month or the year swaps the day
// grid for a grid of months / years, so jumping far is one click instead of
// many arrow clicks. Picking one goes back to the days.
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  long: format(new Date(2000, i, 1), "MMMM"),
  short: format(new Date(2000, i, 1), "MMM"),
}));
const YEARS_PER_PAGE = 12;
const yearPageStart = (year) =>
  Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;

const ARROW =
  "flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:bg-[#eef2f6] hover:text-[#0d3b66] transition-colors disabled:opacity-30 disabled:pointer-events-none";
const PILL =
  "inline-flex items-center gap-1 h-8 px-2.5 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors";
const PILL_TONE = {
  active: "bg-[#e8f1f8] text-[#0d3b66]",
  idle: "text-[#0d3b66] hover:bg-[#eef2f6]",
};
const CELL =
  "h-10 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3399cc]/40";
// Grid cell look: the one the calendar is on, today's month / year, or
// any other.
const CELL_TONE = {
  current: "bg-[#0d3b66] text-white font-semibold shadow-sm",
  today: "text-[#3399cc] font-semibold hover:bg-[#eef2f6]",
  idle: "text-slate-600 hover:bg-[#eef2f6] hover:text-[#0d3b66]",
};
const cellTone = (isCurrent, isToday) =>
  CELL_TONE[(isCurrent && "current") || (isToday && "today") || "idle"];

function Pill({ active, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={active}
      className={`${PILL} ${PILL_TONE[active ? "active" : "idle"]}`}
    >
      {children}
      <ChevronDown
        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${active ? "rotate-180" : ""}`}
      />
    </button>
  );
}

// `view`: "days" | "months" | "years" (held by DateInput, which also
// hides the day grid while a month / year grid is open). `onPick(year,
// month)`: a month or year was picked from the grid.
function CalendarHeader({
  date,
  changeMonth,
  changeYear,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  view,
  onViewChange,
  onPick,
}) {
  const month = date.getMonth();
  const year = date.getFullYear();
  const today = new Date();
  const [pageStart, setPageStart] = useState(() => yearPageStart(year));
  const toggle = (next) => {
    setPageStart(yearPageStart(year));
    onViewChange(view === next ? "days" : next);
  };
  // What the arrows step through in each view.
  const NAV = {
    days: {
      label: "month",
      prev: decreaseMonth,
      next: increaseMonth,
      prevDisabled: prevMonthButtonDisabled,
      nextDisabled: nextMonthButtonDisabled,
    },
    months: {
      label: "year",
      prev: () => changeYear(year - 1),
      next: () => changeYear(year + 1),
    },
    years: {
      label: "years",
      prev: () => setPageStart((y) => y - YEARS_PER_PAGE),
      next: () => setPageStart((y) => y + YEARS_PER_PAGE),
    },
  };
  const nav = NAV[view];
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => pageStart + i);

  return (
    <div className="px-3">
      <div className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={nav.prev}
          disabled={nav.prevDisabled}
          aria-label={`Previous ${nav.label}`}
          className={ARROW}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-0.5">
          <Pill
            active={view === "months"}
            onClick={() => toggle("months")}
            label="Choose month"
          >
            {MONTHS[month].long}
          </Pill>
          <Pill
            active={view === "years"}
            onClick={() => toggle("years")}
            label="Choose year"
          >
            {year}
          </Pill>
        </div>
        <button
          type="button"
          onClick={nav.next}
          disabled={nav.nextDisabled}
          aria-label={`Next ${nav.label}`}
          className={ARROW}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {view === "months" && (
        <div className="grid grid-cols-3 gap-1.5 pt-1 pb-3">
          {MONTHS.map(({ short, long }, i) => (
            <button
              key={short}
              type="button"
              aria-label={long}
              onClick={() => {
                changeMonth(i);
                onPick(year, i);
                onViewChange("days");
              }}
              className={`${CELL} ${cellTone(
                i === month,
                i === today.getMonth() && year === today.getFullYear(),
              )}`}
            >
              {short}
            </button>
          ))}
        </div>
      )}
      {view === "years" && (
        <div className="grid grid-cols-3 gap-1.5 pt-1 pb-3">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => {
                changeYear(y);
                onPick(y, month);
                onViewChange("days");
              }}
              className={`${CELL} ${cellTone(y === year, y === today.getFullYear())}`}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Date field that always reads year-month-day (2026-10-09), whatever the
// browser's language — a native <input type="date"> follows the browser
// (10/09/2026 in English, 09/10/2026 in Indonesian, …).
// `value` / `onChange(value)` use the same "yyyy-MM-dd" string as a native
// date input, so form state and the BE payload don't change. Any other prop
// (data-*, aria-*, disabled, …) goes on the input itself.
// The calendar opens from the icon only; clicking the field is for typing.
export function DateInput({
  value,
  onChange,
  className = "",
  placeholder = "yyyy-mm-dd",
  ...rest
}) {
  const [open, setOpen] = useState(false);
  // Calendar body: the days, or the month / year grid from the header.
  const [view, setView] = useState("days");
  const iconRef = useRef(null);
  // Picking a month or year in the header changes the date right away,
  // keeping its day: the field then shows what the header shows. With no
  // date yet there's no day to keep, so it only moves the calendar.
  const pickMonthYear = (year, month) => {
    const date = toDate(value);
    if (date) onChange(toIso(withMonthYear(date, year, month)));
  };
  // Always reopens on the days.
  const showCalendar = (show) => {
    setOpen(show);
    setView("days");
  };
  return (
    // Escape (from the field or inside the calendar) and tabbing to another
    // field close it; a click outside is handled by onClickOutside.
    <div
      className="relative w-full"
      onKeyDown={(e) => e.key === "Escape" && showCalendar(false)}
      onBlur={(e) =>
        e.relatedTarget &&
        !e.currentTarget.contains(e.relatedTarget) &&
        showCalendar(false)
      }
    >
      <DatePicker
        selected={toDate(value)}
        onChange={(date) => onChange(toIso(date))}
        onChangeRaw={maskInputEvent}
        open={open}
        onSelect={() => showCalendar(false)}
        // A click on the icon is "outside" too — the icon's own toggle
        // handles that one.
        onClickOutside={(e) =>
          !iconRef.current?.contains(e.target) && showCalendar(false)
        }
        renderCustomHeader={(header) => (
          <CalendarHeader
            {...header}
            view={view}
            onViewChange={setView}
            onPick={pickMonthYear}
          />
        )}
        calendarClassName={view === "days" ? "" : "dp-picking"}
        dateFormat={DATE_FORMAT}
        strictParsing
        placeholderText={placeholder}
        todayButton="Today"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        wrapperClassName="w-full"
        customInput={
          <input
            {...rest}
            inputMode="numeric"
            maxLength={10}
            onPaste={handlePaste}
            className={`${className} pr-9`}
          />
        }
      />
      <button
        ref={iconRef}
        type="button"
        onClick={() => showCalendar(!open)}
        disabled={rest.disabled}
        aria-label="Open calendar"
        aria-expanded={open}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-[#0d3b66] hover:bg-[#eef2f6] disabled:pointer-events-none"
      >
        <CalendarDays className="w-4 h-4" />
      </button>
    </div>
  );
}
