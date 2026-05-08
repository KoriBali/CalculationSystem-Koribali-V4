import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";

import {
  validatePoleForm,
  validatePoleReport,
} from "../logic/pole/validatePoleForm";
import { executePoleCalculation } from "../logic/pole/poleCalculation";
import * as Utils from "../utils/pole-analyzer";

// Orchestrates pole calculation — validates, calls API, maps errors back to UI
export function usePoleCalculation({
  poleForm,
  directObjectForm,
  ohwForm,
  armForm,
  poleStandardForm,
  coverForm,
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

  // Resets all error states across all sub-forms
  const resetAllErrors = () => {
    poleForm.setPoleErrors({});
    directObjectForm.setDoErrors({});
    ohwForm.setOhwErrors({});
    armForm.setArmsErrors({});
    armForm.setAoErrors({});
    poleStandardForm.setStraightPoleErrors({});
  };

  // Maps validation errors back to each sub-form's error state
  const mapErrors = (result) => {
    if (result.structuralDesignErrors)
      coverForm.setPoleConfigErrors?.(result.structuralDesignErrors);
    if (result.polesErrors) poleForm.setPoleErrors(result.polesErrors);
    if (result.doErrors) directObjectForm.setDoErrors(result.doErrors);
    if (result.ohwErrors) ohwForm.setOhwErrors(result.ohwErrors);
    if (result.armsErrors) armForm.setArmsErrors(result.armsErrors);
    if (result.aoErrors) armForm.setAoErrors(result.aoErrors);
    if (result.straightPoleStandardErrors)
      poleStandardForm.setStraightPoleErrors(result.straightPoleStandardErrors);
  };

  // Validates all inputs then calls the pole calculation API
  const calculate = async () => {
    resetAllErrors();

    // Run full validation + data resolution
    const validation = await validatePoleForm({
      condition,
      poleTypeStandard: poleStandardForm.poleTypeStandard,
      taperPoleStandard: poleStandardForm.taperPoleStandard,
      straightPoleStandard: poleStandardForm.straightPoleStandard,
      structuralDesign: coverForm.poleConfig,
      poles: poleForm.poles,
      directObjects: directObjectForm.directObjects,
      overheadWires: ohwForm.overheadWires,
      arms: armForm.arms,
      isPoleTypeStandardComplete: poleStandardForm.isPoleTypeComplete,
    });

    if (!validation.isValid) {
      mapErrors(validation);
      showToast(validation.message);
      return;
    }

    try {
      setLoading(true);

      // Call calculation API with resolved data
      const data = await executePoleCalculation({
        condition,
        poleTypeStandard: poleStandardForm.poleTypeStandard,
        poleConfig: coverForm.poleConfig,
        poles: validation.resolvedPoles,
        directObjects: validation.resolvedDirectObjects,
        overheadWires: validation.resolvedOverheadWires,
        arms: validation.resolvedArms,
        straightPoleStandard: poleStandardForm.straightPoleStandard,
        taperPoleStandard: poleStandardForm.taperPoleStandard,
      });

      // Persist results
      setResults(data.results || []);
      setResultsDo(data.resultsDo || []);
      setResultsOhw(data.resultsOhw || []);
      setResultsArm(data.resultsArm || []);
      setShowResults(true);
      setIsCalculated(true);

      // Scroll to results section
      document
        .getElementById("results-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      showToast(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Validates all inputs before generating the final report
  const makeReport = async () => {
    resetAllErrors();

    const validation = await validatePoleReport({
      condition,
      poleTypeStandard: poleStandardForm.poleTypeStandard,
      taperPoleStandard: poleStandardForm.taperPoleStandard,
      straightPoleStandard: poleStandardForm.straightPoleStandard,
      structuralDesign: coverForm.poleConfig,
      poles: poleForm.poles,
      directObjects: directObjectForm.directObjects,
      overheadWires: ohwForm.overheadWires,
      arms: armForm.arms,
      results,
      isCoverComplete: () => coverForm.validate(),
      isPoleTypeStandardComplete: poleStandardForm.isPoleTypeComplete,
    });

    if (!validation.isValid) {
      mapErrors(validation);
      showToast(validation.message);
      return;
    }

    // Build and persist report payload
    const reportPayload = {
      results,
      resultsDo,
      resultsOhw,
      resultsArm,
      cover: coverForm.coverData,
      condition,
      structuralDesign: coverForm.poleConfig,
    };

    sessionStorage.setItem(
      `${projectType}_reportSnapshot`,
      JSON.stringify(reportPayload),
    );

    navigate("/report", { state: reportPayload });
  };

  // Navigates to next step or opens cover modal if this is the last step
  const finish = () => {
    if (!isCalculated) return;
    if (isLast) return "OPEN_COVER";
    navigate(`/calculation/${projectType}/${nextStep}`);
  };

  return {
    // Results
    results,
    resultsDo,
    resultsOhw,
    resultsArm,
    showResults,

    // UI state
    isCalculated,
    loading,
    toast,
    buttonLabel,

    // Setters
    setToast,

    // Handlers
    calculate,
    makeReport,
    finish,
    showToast,
  };
}
