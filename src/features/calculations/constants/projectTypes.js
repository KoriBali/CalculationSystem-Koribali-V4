// constants/projectTypes.js
//
// `id` is the stable key used in routes, sessionStorage keys, calculation
// logic, report templates and the API (?category=) — DO NOT change it.
// `title` is the display label only.
export const PROJECT_TYPES = [
  {
    id: "lighting-project",
    title: "Lighting Project",
  },
  {
    id: "signboard-project",
    title: "Signboard Project",
  },
  {
    id: "disaster-prevention-project",
    title: "Disaster Prevention Project",
  },
  {
    id: "multi-purpose-project",
    title: "Multi-purpose Project",
  },
];

// Display label for a project type id. Falls back to a humanised id
// ("foo-bar" → "Foo Bar") for anything not in the list.
export function projectTypeLabel(id) {
  if (!id) return "Project";
  const match = PROJECT_TYPES.find((p) => p.id === id);
  if (match) return match.title;
  return id
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
