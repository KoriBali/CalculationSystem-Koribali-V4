// The New Request form in progress, kept while the user visits other menus
// (Report Preview, Project Database …) so coming back shows it as they left
// it. One request at a time, per browser tab (sessionStorage), so it also
// survives a page reload.
//
// The cover PDF can't go into sessionStorage, so the file itself is held in
// memory: it survives menu switches, not a reload — the form then shows the
// cover's name and asks for it again, keeping the values it filled in.
import { NO_WORK_TYPES, YP_EMPTY, YS_EMPTY } from "./requestForm";

const STORAGE_KEY = "new_request_draft";
let coverFileInMemory = null;

// What a fresh form starts with. Saved drafts are merged over this, so a
// field added later simply starts empty in an older draft.
const freshForm = () => ({
  coverType: null,
  yp: YP_EMPTY,
  ys: YS_EMPTY,
  requestNotes: { yp: "", ys: "" },
  workTypes: NO_WORK_TYPES,
  extracted: null,
  autoFillStatus: "idle",
  showDesignRef: false,
  docNoTouched: false,
  coverFile: null,
  // Name of a cover that was uploaded but lost on reload.
  lostCover: null,
});

// Anything here the user would lose by leaving? (Picking the cover type
// alone doesn't count.)
const changed = (values, empty) =>
  Object.keys(empty).some((key) => values[key] !== empty[key]);
const ENTRY_CHECKS = [
  (form) => changed(form.yp, YP_EMPTY),
  (form) => changed(form.ys, YS_EMPTY),
  (form) => Object.values(form.requestNotes).some(Boolean),
  (form) => form.workTypes.calc || form.workTypes.drawing,
  (form) => form.coverFile !== null,
];

const read = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
};

// The form to show for `projectType`: the saved one if it's for this
// project type, otherwise a fresh one.
export const loadNewRequestDraft = (projectType) => {
  const saved = read();
  if (saved?.projectType !== projectType) return freshForm();
  const { coverName, ...form } = saved;
  const coverFile =
    coverFileInMemory?.name === coverName ? coverFileInMemory : null;
  return {
    ...freshForm(),
    ...form,
    yp: { ...YP_EMPTY, ...form.yp },
    ys: { ...YS_EMPTY, ...form.ys },
    coverFile,
    lostCover: coverFile ? null : (coverName ?? null),
  };
};

export const saveNewRequestDraft = (projectType, form) => {
  const { coverFile, lostCover, ...rest } = form;
  coverFileInMemory = coverFile;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...rest,
        projectType,
        coverName: coverFile?.name ?? lostCover,
        // A read in progress isn't resumed: the cover can be read again.
        autoFillStatus: rest.autoFillStatus === "done" ? "done" : "idle",
        hasEntries: ENTRY_CHECKS.some((check) => check(form)),
      }),
    );
  } catch {
    // Storage full or blocked — the form still works, it just won't be
    // remembered.
  }
};

export const clearNewRequestDraft = () => {
  coverFileInMemory = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
};

// The project type of a request with entries the user would lose, or null.
export const unfinishedNewRequest = () => {
  const saved = read();
  return saved?.hasEntries ? saved.projectType : null;
};
