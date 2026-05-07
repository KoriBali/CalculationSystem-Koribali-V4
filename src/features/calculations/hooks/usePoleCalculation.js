// hooks/usePoleCalculation.js
import { useNavigate, useParams } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";
import { getCondition } from "../utils/sessionStorage";
import { runCalculation, runMakeReport } from "../logic/pole/poleCalculation";
import * as Utils from "../../utils/pole-analyzer";
import STANDARD_POLE_DATA from "../../data/specStandardPole.json";

export function usePoleCalculation({
  poleSection,
  directObject,
  ohw,
  arm,
  cover,
  poleStandard,
}) {
  const navigate = useNavigate();
  const { type: projectType } = useParams();
  const condition = getCondition(projectType);

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
  const [isCalculated, setIsCalculated] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => setToast({ message, type });

  const { buttonLabel, nextStep, isLast } = Utils.getStepNavigation(
    condition,
    "pole",
  );

  // Resolves final data source — static JSON for standard, user input for custom
  const resolveData = () => {
    if (condition.method !== "standard") {
      return {
        poles: poleSection.poles,
        directObjects: directObject.directObjects,
        arms: arm.arms,
        overheadWires: ohw.overheadWires,
      };
    }

    const shape = poleStandard.poleType.poleShape;
    const empty = { poles: [], directObjects: [], arms: [], overheadWires: [] };

    if (shape === "taper") {
      const data =
        STANDARD_POLE_DATA?.taper?.[poleStandard.taperPole.poleType]?.[
          poleStandard.taperPole.groundPosition
        ]?.[poleStandard.taperPole.height];

      if (!data) {
        showToast("Standard taper pole data not found.");
        return empty;
      }

      return {
        poles: data.sections || [],
        directObjects: data.directObjects || [],
        arms: data.arms || [],
        overheadWires: data.overheadWires || [],
      };
    }

    if (shape === "straight") {
      const key = poleStandard.steppedPole.combination;
      if (!key) {
        showToast("Please select pole combination.");
        return empty;
      }

      const data = STANDARD_POLE_DATA?.straight?.[key];
      if (!data) {
        showToast("Standard straight pole data not found.");
        return empty;
      }

      const lengths = [
        Number(poleStandard.steppedPole.upperLength || 0),
        Number(poleStandard.steppedPole.lowerLength || 0),
      ];
      const heights = lengths.map((_, i) =>
        lengths.slice(i).reduce((s, v) => s + v, 0),
      );

      const poles = data.sections.map((sec, i) => ({
        ...sec,
        thicknessLower:
          i === 0
            ? poleStandard.steppedPole.upperThickness
            : poleStandard.steppedPole.lowerThickness,
        thicknessUpper:
          i === 0
            ? poleStandard.steppedPole.upperThickness
            : poleStandard.steppedPole.lowerThickness,
        height: heights[i],
      }));

      return { poles, directObjects: [], arms: [], overheadWires: [] };
    }

    return empty;
  };

  // Runs full validation then triggers calculation engine
  const calculate = async () => {
    // Reset all error states before re-validating
    poleSection.setPoleErrors({});
    directObject.setDoErrors({});
    ohw.setOhwErrors({});
    arm.setArmsErrors({});
    arm.setAoErrors({});
    poleStandard.setSteppedPoleErrors({});

    const { poles, directObjects, arms, overheadWires } = resolveData();

    if (condition.method === "standard" && !poleStandard.isPoleTypeComplete()) {
      showToast("Please select the pole type first.");
      return;
    }

    if (condition.method === "standard" && poles.length === 0) {
      showToast("Please complete all required standard selections.");
      return;
    }

    const result = await runCalculation({
      condition,
      poleTypeStandard: poleStandard.poleType,
      structuralDesign: cover.structuralDesign,
      poles,
      directObjects,
      overheadWires,
      arms,
      steppedPole: poleStandard.steppedPole,
      showToast,
      setResults,
      setResultsDo,
      setResultsOhw,
      setResultsArm,
      setShowResults,
    });

    if (!result?.isValid) {
      const { errors } = result;
      const isCustom = condition.method !== "standard";
      const isStraight = poleStandard.poleType.poleShape === "straight";

      if (errors.steppedPole && condition.method !== "custom" && isStraight)
        poleStandard.setSteppedPoleErrors(
          Utils.getStepPoleStandardErrors(poleStandard.steppedPole, condition),
        );
      if (errors.section && isCustom)
        poleSection.setPoleErrors(Utils.getSectionsErrors(poles));
      if (errors.directObject && isCustom)
        directObject.setDoErrors(Utils.getDoErrors(directObjects));
      if (errors.overheadWire && isCustom)
        ohw.setOhwErrors(Utils.getOhwErrors(overheadWires));
      if (errors.arm && isCustom) arm.setArmsErrors(Utils.getArmsErrors(arms));
      if (errors.armObject && isCustom)
        arm.setAoErrors(Utils.getAoErrors(arms));
      return;
    }

    setIsCalculated(true);
    document
      .getElementById("results-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Navigates to next step or opens cover modal if this is the last step
  const finish = () => {
    if (!isCalculated) return;
    if (isLast) {
      cover.openCoverPopup();
    } else {
      navigate(`/calculation/${projectType}/${nextStep}`);
    }
  };

  // Validates all fields then generates the report
  const makeReport = async () => {
    const { poles, directObjects, arms, overheadWires } = resolveData();

    if (condition.method === "standard" && poles.length === 0) {
      showToast("Selected standard configuration not found.");
      return;
    }

    const result = await runMakeReport({
      condition,
      poleTypeStandard: poleStandard.poleType,
      results,
      cover: cover.coverData,
      structuralDesign: cover.structuralDesign,
      poles,
      directObjects,
      overheadWires,
      arms,
      steppedPole: poleStandard.steppedPole,
      validateCover: cover.validateCover,
      showToast,
    });

    if (!result?.isValid) {
      const { errors } = result;
      const isCustom = condition.method !== "standard";
      const isStraight = poleStandard.poleType.poleShape === "straight";

      if (errors.cover)
        cover.setCoverErrors(Utils.getCoverErrors(cover.coverData));
      if (errors.structuralDesign)
        cover.setStructuralDesignErrors(
          Utils.getStructuralDesignErrors(cover.structuralDesign),
        );
      if (errors.steppedPole && condition.method !== "custom" && isStraight)
        poleStandard.setSteppedPoleErrors(
          Utils.getStepPoleStandardErrors(poleStandard.steppedPole, condition),
        );
      if (errors.section && isCustom)
        poleSection.setPoleErrors(Utils.getSectionsErrors(poles));
      if (errors.directObject && isCustom)
        directObject.setDoErrors(Utils.getDoErrors(directObjects));
      if (errors.overheadWire && isCustom)
        ohw.setOhwErrors(Utils.getOhwErrors(overheadWires));
      if (errors.arm && isCustom) arm.setArmsErrors(Utils.getArmsErrors(arms));
      if (errors.armObject && isCustom)
        arm.setAoErrors(Utils.getAoErrors(arms));
      return;
    }

    sessionStorage.setItem(`${projectType}_hasReport`, "true");

    const payload = {
      results,
      resultsDo,
      resultsOhw,
      resultsArm,
      cover: cover.coverData,
      condition,
      structuralDesign: cover.structuralDesign,
    };
    sessionStorage.setItem(
      `${projectType}_reportSnapshot`,
      JSON.stringify(payload),
    );
    navigate("/report", { state: payload });
  };

  return {
    results,
    resultsDo,
    resultsOhw,
    resultsArm,
    showResults,
    isCalculated,
    toast,
    setToast,
    buttonLabel,
    calculate,
    finish,
    makeReport,
  };
}
