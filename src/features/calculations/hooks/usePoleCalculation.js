import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";

import {
  validatePoleForm,
  validatePoleReport,
} from "../logic/pole/poleValidation";
import { executePoleCalculation } from "../logic/pole/poleCalculation";
import { scrollToFirstError, scrollToFirstNestedError } from "../utils/scrollToError";
import { notifyCalculationProgressChanged } from "../utils/calculationProgressEvent";
import * as Utils from "../utils";

// Orchestrates pole calculation — validates, calls API, maps errors back to UI
export function usePoleCalculation({
  poleForm,
  directObjectForm,
  ohwForm,
  armForm,
  poleStandardForm,
  poleConfigForm, // structural design (lowestStep, overDesign)
  // Optional callbacks to expand collapsed accordion sections before scrolling
  expandPole,
  expandDo,
  expandOhw,
  expandArm,
}) {
  const { type: projectType, draftId } = useParams();
  const navigate = useNavigate();

  // Read condition from sessionStorage
  const condition = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`${projectType}_condition`) || "{}",
      );
    } catch {
      return {};
    }
  })();

  // Read cover from sessionStorage — used for the report payload in makeReport()
  const cover = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`${projectType}_cover`) || "{}"
      ) || {};
    } catch {
      return {};
    }
  })();

  // Read workflow flags from sessionStorage
  const workflow = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`${projectType}_workflow`) || "{}"
      ) || {};
    } catch {
      return {};
    }
  })();

  // ── Persisted results ──
  const [results, setResults] = useProjectStorage(projectType, "results", []);
  const [resultsDo, setResultsDo] = useProjectStorage(
    projectType,
    "resultsDo",
    [],
  );
  const [resultsOhw, setResultsOhw] = useProjectStorage(
    projectType,
    "resultsOhw",
    [],
  );
  const [resultsArm, setResultsArm] = useProjectStorage(
    projectType,
    "resultsArm",
    [],
  );
  const [showResults, setShowResults] = useProjectStorage(
    projectType,
    "showResults",
    false,
  );

  // ── UI state ──
  const [isCalculated, setIsCalculated] = useProjectStorage(
    projectType,
    "isCalculatedPole",
    false
  );
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => setToast({ message, type });

  // Any edit to the underlying pole/object/wire/arm/standard/config data
  // after a calculation invalidates it — Calculate should go back to being
  // the primary action (and Next/Finish back to disabled) until the user
  // recalculates.
  //
  // Guarded by comparing against the *previous* dependency values (not a
  // simple "have I mounted before" boolean) — React StrictMode
  // double-invokes effects on mount to catch bugs, and a boolean guard
  // gets fooled by that second synchronous call, wrongly treating it as
  // "data changed since mount" and wiping results every single time the
  // Pole page is (re)visited. Comparing references instead is immune to
  // that: between the two StrictMode calls nothing re-rendered, so every
  // dependency is still the exact same reference and this correctly does
  // nothing — it only fires for a *real* edit, which always produces a new
  // reference for whatever changed.
  const prevDepsRef = useRef(null);
  useEffect(() => {
    const currentDeps = [
      poleForm.poles,
      directObjectForm.directObjects,
      ohwForm.overheadWires,
      armForm.arms,
      poleStandardForm.poleTypeStandard,
      poleStandardForm.taperPoleStandard,
      poleStandardForm.straightPoleStandard,
      poleConfigForm.poleConfig,
    ];

    const hasChanged =
      prevDepsRef.current !== null &&
      currentDeps.some((dep, i) => dep !== prevDepsRef.current[i]);

    prevDepsRef.current = currentDeps;

    if (!hasChanged) return;

    if (isCalculated) {
      setIsCalculated(false);
    }

    // Opening, Baseplate, and Foundation each take one of their calculation
    // parameters from Pole's result — so once Pole's own inputs change
    // (meaning its current result is about to go stale), their previously
    // calculated results are stale too, even though nothing on their own
    // pages was touched. Their tab in the header nav already re-locks based
    // on isCalculatedPole, but that only blocks getting there by clicking
    // the tab — a direct URL/back-button visit would still land on a page
    // that looks fully calculated. Resetting their own "isCalculated" flags
    // here (written straight to sessionStorage, since this hook only has
    // scope over the Pole page) makes each page correctly show "needs
    // recalculating" regardless of how the user gets there.
    sessionStorage.removeItem(`${projectType}_isCalculatedOp`);
    sessionStorage.removeItem(`${projectType}_isCalculatedBp`);
    sessionStorage.removeItem(`${projectType}_isCalculatedFd`);

    // Header nav computes tab-lock state by reading sessionStorage
    // directly, which a plain write like the ones above can't itself
    // prompt it to re-read — this nudges it to re-render immediately
    // instead of only catching up on the next route change.
    notifyCalculationProgressChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    poleForm.poles,
    directObjectForm.directObjects,
    ohwForm.overheadWires,
    armForm.arms,
    poleStandardForm.poleTypeStandard,
    poleStandardForm.taperPoleStandard,
    poleStandardForm.straightPoleStandard,
    poleConfigForm.poleConfig,
  ]);

  // Step navigation — determines button label and next route
  const { buttonLabel, nextStep, isLast } = Utils.getStepNavigation(
    condition,
    "pole",
    workflow.withReport
  );

  // ── Resets all error states across all sub-forms ──
  const resetAllErrors = () => {
    poleConfigForm.setPoleConfigErrors({});
    poleForm.setPoleErrors({});
    directObjectForm.setDoErrors({});
    ohwForm.setOhwErrors({});
    armForm.setArmsErrors({});
    armForm.setAoErrors({});
    poleStandardForm.setStraightPoleErrors({});
    poleStandardForm.setTaperPoleErrors({});
  };

  // ── Maps validation errors back to each sub-form's error state ──
  const mapErrors = (result) => {
    if (result.poleConfigErrors)
      poleConfigForm.setPoleConfigErrors(result.poleConfigErrors);
    if (result.polesErrors) poleForm.setPoleErrors(result.polesErrors);
    if (result.doErrors) directObjectForm.setDoErrors(result.doErrors);
    if (result.ohwErrors) ohwForm.setOhwErrors(result.ohwErrors);
    if (result.armsErrors) armForm.setArmsErrors(result.armsErrors);
    if (result.aoErrors) armForm.setAoErrors(result.aoErrors);
    if (result.straightPoleStandardErrors)
      poleStandardForm.setStraightPoleErrors(result.straightPoleStandardErrors);
    if (result.taperPoleStandardErrors)
      poleStandardForm.setTaperPoleErrors(result.taperPoleStandardErrors);
  };

  // ── Merge helpers ──
  // Menggabungkan input FE (dari sessionStorage) dengan hasil kalkulasi BE.
  // Input FE dijadikan base, field dari BE menimpa jika ada key yang sama —
  // karena BE adalah sumber kebenaran untuk field kalkulasi.

  // Merge poles: tiap pole input + result BE berdasarkan index
  const mergePoles = (beResults, resolvedPoles) =>
    (beResults || []).map((result, i) => ({
      ...(resolvedPoles[i] || {}), // name, material, poleType, diameter, height, dll
      ...result, // fb, stb, sts, sectionArea, dll dari BE
    }));

  // Merge direct objects: tiap DO input + result BE berdasarkan index
  const mergeDirectObjects = (beResults, resolvedDo) =>
    (beResults || []).map((result, i) => ({
      ...(resolvedDo[i] || {}), // name, typeOfDo, frontArea, weightDo, dll
      ...result, // fixLoad, cfDo, windLoadAreaFront, slDo, dll dari BE
    }));

  // Merge overhead wires: tiap OHW input + result BE berdasarkan index
  const mergeOverheadWires = (beResults, resolvedOhw) =>
    (beResults || []).map((result, i) => ({
      ...(resolvedOhw[i] || {}), // nameOhw, weightOhw, diameterOhw, spanOhw, dll
      ...result, // flOhwKg, cfOhw, wlOhw, tensionFixOhw, dll dari BE
    }));

  // Merge arms + arm objects (nested): tiap arm input + result BE berdasarkan index
  const mergeArms = (beResults, resolvedArms) =>
    (beResults || []).map((result, i) => {
      const inputArm = resolvedArms[i] || {};

      // Merge arm objects secara nested
      const mergedArmObjects = (result.armObjects || []).map((aoResult, j) => ({
        ...(inputArm.armObjects?.[j] || {}), // nameAo, typeOfAo, frontAreaAo, weightAo, dll
        ...aoResult, // flAo, cfAo, windLoadAreaFrontAo, mFixAo, dll dari BE
      }));

      return {
        ...inputArm, // nameArm, materialArm, diameterArm, lengthArm, dll
        ...result, // fb, sfb, massaArm, flArm, mFixArm, dll dari BE
        armObjects: mergedArmObjects, // nested arm objects yang sudah di-merge
      };
    });

  // ── Calculate ──
  // Validates all inputs then calls the pole calculation API
  const calculate = async () => {
    resetAllErrors();

    const validation = await validatePoleForm({
      condition,
      poleTypeStandard: poleStandardForm.poleTypeStandard,
      taperPoleStandard: poleStandardForm.taperPoleStandard,
      straightPoleStandard: poleStandardForm.straightPoleStandard,
      poleConfig: poleConfigForm.poleConfig,
      poles: poleForm.poles,
      directObjects: directObjectForm.directObjects,
      overheadWires: ohwForm.overheadWires,
      arms: armForm.arms,
    });

    if (!validation.isValid) {
      mapErrors(validation);
      showToast(validation.message);

      // Helper: expand a section then scroll after the DOM has updated
      const expandAndScroll = (expandFn, scrollFn) => {
        if (expandFn) expandFn(true);
        // Wait a tick so the accordion animation starts before we scroll
        setTimeout(scrollFn, 50);
      };

      if (
        validation.poleStandardErrors &&
        Object.keys(validation.poleStandardErrors).length > 0
      ) {
        expandAndScroll(expandPole, () =>
          scrollToFirstError(validation.poleStandardErrors)
        );
      } else if (
        validation.straightPoleStandardErrors &&
        Object.keys(validation.straightPoleStandardErrors).length > 0
      ) {
        expandAndScroll(expandPole, () =>
          scrollToFirstError(validation.straightPoleStandardErrors)
        );
      } else if (
        validation.taperPoleStandardErrors &&
        Object.keys(validation.taperPoleStandardErrors).length > 0
      ) {
        expandAndScroll(expandPole, () =>
          scrollToFirstError(validation.taperPoleStandardErrors, "taperPoleStandard.")
        );
      } else if (
        validation.poleConfigErrors &&
        Object.keys(validation.poleConfigErrors).length > 0
      ) {
        expandAndScroll(expandPole, () =>
          scrollToFirstError(validation.poleConfigErrors)
        );
      } else if (
        validation.polesErrors &&
        Object.keys(validation.polesErrors).length > 0
      ) {
        expandAndScroll(expandPole, () =>
          scrollToFirstNestedError(validation.polesErrors, "pole-")
        );
      } else if (
        validation.doErrors &&
        Object.keys(validation.doErrors).length > 0
      ) {
        expandAndScroll(expandDo, () =>
          scrollToFirstNestedError(validation.doErrors, "do-")
        );
      } else if (
        validation.ohwErrors &&
        Object.keys(validation.ohwErrors).length > 0
      ) {
        expandAndScroll(expandOhw, () =>
          scrollToFirstNestedError(validation.ohwErrors, "ohw-")
        );
      } else if (
        validation.armsErrors &&
        Object.keys(validation.armsErrors).length > 0
      ) {
        expandAndScroll(expandArm, () =>
          scrollToFirstNestedError(validation.armsErrors, "arm-")
        );
      }

      return;
    }

    try {
      setLoading(true);

      const data = await executePoleCalculation({
        condition,
        poleTypeStandard: poleStandardForm.poleTypeStandard,
        poleConfig: poleConfigForm.poleConfig,
        poles: validation.resolvedPoles,
        directObjects: validation.resolvedDirectObjects,
        overheadWires: validation.resolvedOverheadWires,
        arms: validation.resolvedArms,
        straightPoleStandard: poleStandardForm.straightPoleStandard,
        taperPoleStandard: poleStandardForm.taperPoleStandard,
      });

      // Merge input FE + hasil kalkulasi BE sebelum disimpan ke state
      setResults(mergePoles(data.results, validation.resolvedPoles));
      setResultsDo(
        mergeDirectObjects(data.resultsDo, validation.resolvedDirectObjects),
      );
      setResultsOhw(
        mergeOverheadWires(data.resultsOhw, validation.resolvedOverheadWires),
      );
      setResultsArm(mergeArms(data.resultsArm, validation.resolvedArms));
      setShowResults(true);
      setIsCalculated(true);
      // Let Header re-read sessionStorage now — otherwise the Opening tab
      // stays locked-looking until the user also clicks Next and navigates.
      notifyCalculationProgressChanged();

      document
        .getElementById("results-pole")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      showToast(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Make Report ──
  // Validates all inputs before generating the final report
  const makeReport = async () => {
    resetAllErrors();

    const validation = await validatePoleForm({
      condition,
      poleTypeStandard: poleStandardForm.poleTypeStandard,
      taperPoleStandard: poleStandardForm.taperPoleStandard,
      straightPoleStandard: poleStandardForm.straightPoleStandard,
      poleConfig: poleConfigForm.poleConfig,
      poles: poleForm.poles,
      directObjects: directObjectForm.directObjects,
      overheadWires: ohwForm.overheadWires,
      arms: armForm.arms,
    });

    if (!validation.isValid) {
      mapErrors(validation);
      showToast(validation.message);
      return;
    }

    // results sudah merged (input + kalkulasi), langsung dipakai untuk report


    const reportPayload = {
      results,
      resultsDo,
      resultsOhw,
      resultsArm,
      cover,
      condition,
      poleConfig: poleConfigForm.poleConfig,
    };

    sessionStorage.setItem(
      `${projectType}_reportSnapshot`,
      JSON.stringify(reportPayload),
    );

    navigate("/report", { state: reportPayload });
  };

  // ── Finish ──
  // Navigates to next step or opens cover modal if this is the last step
  const finish = () => {
    if (!isCalculated) return;
    if (isLast) return "OPEN_COVER";
    navigate(`/calculation/${projectType}/${draftId}/${nextStep}`);
  };

  return {
    results,
    resultsDo,
    resultsOhw,
    resultsArm,
    showResults,

    isCalculated,
    loading,
    toast,
    buttonLabel,

    setToast,

    calculate,
    makeReport,
    finish,
    showToast,
  };
}
