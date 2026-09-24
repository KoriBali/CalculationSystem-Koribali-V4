// A tiny same-tab pub/sub for "a step's isCalculated flag changed."
//
// HeaderCalculationPage computes each step tab's locked/unlocked state by
// reading sessionStorage directly in its render body (isCalculatedPole,
// isCalculatedOp, isCalculatedBp, isCalculatedFd). That's fine for reading
// the *current* value, but React only re-renders a component when its own
// state/props/context change — a sessionStorage write made by a different
// mounted component (e.g. the Pole page, right after Calculate succeeds)
// is invisible to HeaderCalculationPage until something else it actually
// depends on changes. The only thing it depends on is the route
// (useLocation()), so previously a tab only unlocked once the user also
// clicked Next and navigated — Calculate alone didn't do it.
//
// Each calculation hook (usePoleCalculation, useOpeningForm,
// useBaseplateForm, useFoundationForm) calls notifyCalculationProgressChanged()
// right after it flips its own `isCalculated` flag (and after
// useConditionFrom's condition-change cascade). HeaderCalculationPage
// listens for this event and forces a re-render, so tabs unlock the
// instant Calculate succeeds — no navigation required.
export const CALCULATION_PROGRESS_EVENT = "calculation-progress-changed";

export function notifyCalculationProgressChanged() {
  window.dispatchEvent(new Event(CALCULATION_PROGRESS_EVENT));
}

// Drawing-phase progress flags (drawing_completed, drawing_*_completed,
// drawing_coupling_confirmed) are plain "true"/absent sessionStorage keys
// that HeaderCalculationPage also reads to lock/unlock tabs. Writing them
// through here keeps the header in sync the moment they change — e.g. an
// edit that clears drawing_pole_completed re-locks the later tabs right
// away instead of only after a reload.
export function setProgressFlag(projectType, key, isSet) {
  const storageKey = `${projectType}_${key}`;
  // Edit handlers call this with `false` on every keystroke — only signal
  // the header when the flag actually flips.
  if ((sessionStorage.getItem(storageKey) === "true") === isSet) return;
  if (isSet) {
    sessionStorage.setItem(storageKey, "true");
  } else {
    sessionStorage.removeItem(storageKey);
  }
  notifyCalculationProgressChanged();
}
