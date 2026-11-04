// constants/projectTypes.js
//
// `id` is the stable key used in routes, sessionStorage keys, calculation
// logic, report templates and the API (?category=) — DO NOT change it.
// `title` is the display label only.
export const PROJECT_TYPES = [
  {
    id: "lighting-project",
    title: "Lighting Project",
    categoryName: "lighting",
  },
  {
    id: "signboard-project",
    title: "Signboard Project",
    categoryName: "signboard",
  },
  {
    id: "disaster-prevention-project",
    title: "Disaster Prevention Project",
    categoryName: "acemast",
  },
  {
    id: "multi-purpose-project",
    title: "Multi-purpose Project",
    categoryName: "multiple",
  },
];

// Display label for a project type id. Falls back to a humanised id
// ("foo-bar" → "Foo Bar") for anything not in the list.
export function projectTypeLabel(id) {
  if (!id) return "Project";
  const normalized = String(id).toLowerCase().trim().replace(/_/g, "-");
  const match = PROJECT_TYPES.find(
    (p) =>
      p.id === id ||
      p.id === normalized ||
      p.categoryName === id ||
      p.categoryName === normalized ||
      normalized.startsWith(p.id.replace(/-project$/, "")),
  );
  if (match) return match.title;
  return id
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}
