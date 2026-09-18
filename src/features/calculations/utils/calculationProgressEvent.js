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
