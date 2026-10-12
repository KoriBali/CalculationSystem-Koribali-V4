// Small building blocks of the New Request form: labels, section frames,
// field hints and the unit input. Same look as ConditionForm / CoverForm.

const RequiredMark = ({ className = "" }) => (
  <span
    aria-hidden="true"
    className={`text-red-500 font-semibold ${className}`}
  >
    *
  </span>
);

// Field label.
// `jp`: the field's caption exactly as printed on the cover, shown under the
// English label so users copying from the paper can match it at a glance.
// `required`: red * right after the text (inline, so it stays with the last
// word when a long label wraps).
// `action`: optional control on the right of the label row (e.g. "Use cover
// value"), kept outside <label> so clicking the caption doesn't trigger it.
export function Label({ children, jp, action, required }) {
  const label = (
    <label className="block text-gray-700 mb-1 md:mb-2 text-xs md:text-sm font-medium">
      <span>
        {children}
        {required && <RequiredMark className="ml-1" />}
      </span>
      {jp && (
        <span
          lang="ja"
          className="block mt-0.5 text-xs md:text-[13px] font-normal text-gray-500"
        >
          {jp}
        </span>
      )}
    </label>
  );
  return action ? (
    <div className="flex items-start justify-between gap-2">
      {label}
      {action}
    </div>
  ) : (
    label
  );
}

// Section title with the left accent bar.
// `tag`: "Required" / "Optional" in brackets, lighter, e.g. "(Required)".
export function SectionTitle({ children, tag, hint, required }) {
  return (
    <h3 className="text-[#0d3b66] mb-4 flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
      <div className="w-1 h-4 md:h-5 bg-[#3399cc] rounded-full" />
      <span className="inline-flex items-center gap-1">
        {children}
        {required && <RequiredMark />}
      </span>
      {tag && <span className="font-normal text-gray-500">({tag})</span>}
      {hint && (
        <span className="text-xs text-gray-500 font-normal ml-1">{hint}</span>
      )}
    </h3>
  );
}

// Heading for a group of fields inside a section card.
export function SubGroupTitle({ children }) {
  return (
    <p className="mb-4 flex flex-wrap items-baseline gap-x-2 text-xs md:text-sm font-semibold text-slate-700">
      {children}
    </p>
  );
}

// White card that holds a section's fields.
export function SectionCard({ children }) {
  return (
    <div className="bg-white px-4 md:px-5 py-5 rounded-xl hp:rounded-lg border border-gray-200">
      {children}
    </div>
  );
}

// "*This field is required." under a required field Save found empty.
// `floating`: positioned just below the field (in the gap to the next row) so
// it doesn't make the field taller and throw a bottom-aligned row out of
// line; the field's wrapper must be `relative`.
export function RequiredHint({ floating = true }) {
  return (
    <p
      className={`${floating ? "absolute left-0 top-full" : ""} mt-1 text-[11px] md:text-xs text-red-500 whitespace-nowrap`}
    >
      *This field is required.
    </p>
  );
}

// Note under a field the cover auto-fill couldn't find: grey for optional
// fields (may stay empty), red for required ones.
const NOT_FOUND = {
  optional: { tone: "text-gray-500", text: "Not found on cover" },
  required: {
    tone: "text-red-500",
    text: "*Not found on cover. Please fill in manually.",
  },
};
export function NotFoundHint({ optional }) {
  const { tone, text } = NOT_FOUND[optional ? "optional" : "required"];
  return <p className={`mt-1 text-[11px] md:text-xs ${tone}`}>{text}</p>;
}

// Number input with its unit on the right (m/s, sheets, %, …). `inputProps`
// are spread on the <input> (value, onChange, className, …).
export function UnitInput({ unit, inputProps }) {
  return (
    <div className="relative">
      <input
        type="number"
        {...inputProps}
        className={`${inputProps.className} pr-12`}
      />
      <span className="absolute right-3 xl:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 pointer-events-none">
        {unit}
      </span>
    </div>
  );
}
