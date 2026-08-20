// Scrolls to and focuses the first invalid field after a failed validation,
// so the user lands on the problem instead of hunting for a red border.
// `errors` is a Yup-style { fieldName: message } object; `prefix` namespaces
// ids when a page renders multiple sub-forms that could share field names
// (e.g. "pole-" vs "directObject-").
export function scrollToFirstError(errors, prefix = "") {
  const firstField = Object.keys(errors || {})[0];
  if (!firstField) return;

  const el = document.getElementById(`${prefix}${firstField}`);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.focus({ preventScroll: true });
}

// Scrolls to the first invalid field from a nested (multi-item) error object.
// `nestedErrors` shape: { [itemId]: { fieldName: message } }
// The DOM id must follow the pattern: `{prefix}{itemId}-{fieldName}`
// e.g. scrollToFirstNestedError(doErrors, "do-") looks for id "do-1-name"
export function scrollToFirstNestedError(nestedErrors, prefix = "") {
  const firstItemId = Object.keys(nestedErrors || {})[0];
  if (!firstItemId) return;

  const innerErrors = nestedErrors[firstItemId];
  const firstField = Object.keys(innerErrors || {})[0];
  if (!firstField) return;

  const el = document.getElementById(`${prefix}${firstItemId}-${firstField}`);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.focus({ preventScroll: true });
}

// Builds a toast message naming the first invalid field, falling back to a
// generic message if the field has no human-readable label mapped.
export function firstErrorMessage(errors, fieldLabels = {}) {
  const firstField = Object.keys(errors || {})[0];
  if (!firstField) return null;

  const message = errors[firstField];
  const label = fieldLabels[firstField];
  return label ? `${label} — ${message}` : message;
}
