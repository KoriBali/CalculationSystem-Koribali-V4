import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";

import {
  validatePoleForm,
  validatePoleReport,
} from "../logic/pole/poleValidation";
import { executePoleCalculation } from "../logic/pole/poleCalculation";
import * as Utils from "../utils";

// Orchestrates pole calculation — validates, calls API, maps errors back to UI
export function usePoleCalculation({
  poleForm,
  directObjectForm,
  ohwForm,
  armForm,
  poleStandardForm,
  poleConfigForm, // structural design (lowestStep, overDesign)
  coverForm, // cover info only (projectName, date, dll)
}) {
  const { type: projectType } = useParams();
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
  const [isCalculated, setIsCalculated] = useState(!!results?.length);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => setToast({ message, type });

  // Step navigation — determines button label and next route
  const { buttonLabel, nextStep, isLast } = Utils.getStepNavigation(
    condition,
    "pole",
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

    const validation = await validatePoleReport({
      condition,
      poleTypeStandard: poleStandardForm.poleTypeStandard,
      taperPoleStandard: poleStandardForm.taperPoleStandard,
      straightPoleStandard: poleStandardForm.straightPoleStandard,
      poleConfig: poleConfigForm.poleConfig,
      poles: poleForm.poles,
      directObjects: directObjectForm.directObjects,
      overheadWires: ohwForm.overheadWires,
      arms: armForm.arms,
      results,
      isCoverComplete: () => coverForm.validate(),
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
      cover: coverForm.coverData,
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
    navigate(`/calculation/${projectType}/${nextStep}`);
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
