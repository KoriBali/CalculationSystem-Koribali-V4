import { useNavigate } from "react-router-dom";
import { useProjectStorage } from "../../calculations/hooks/useProjectStorage";

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Handles report generation — validates cover, builds payload, navigates to report page
export function useReport(projectType) {
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

  // Flags from condition — which calculation steps are enabled
  const { openingEnabled, baseplateEnabled, foundationEnabled } = condition;

  // ── Persisted results ──
  const [results] = useProjectStorage(projectType, "results", []);
  const [resultsDo] = useProjectStorage(projectType, "resultsDo", []);
  const [resultsOhw] = useProjectStorage(projectType, "resultsOhw", []);
  const [resultsArm] = useProjectStorage(projectType, "resultsArm", []);
  const [poleConfig] = useProjectStorage(projectType, "poleConfig", {});

  // ── Opening inputs + result ──
  const [openingType] = useProjectStorage(projectType, "openingType", {});
  const [boxType] = useProjectStorage(projectType, "boxType", {});
  const [rType] = useProjectStorage(projectType, "rType", {});
  const [calculatedOp] = useProjectStorage(projectType, "calculatedOp", {});

  // ── Baseplate inputs + result ──
  const [bpType] = useProjectStorage(projectType, "bpType", {});
  const [fourRibType] = useProjectStorage(projectType, "fourRibType", {});
  const [eightRibType] = useProjectStorage(projectType, "eightRibType", {});
  const [calculatedBaseplate] = useProjectStorage(
    projectType,
    "calculatedBaseplate",
    {},
  );

  // ── Foundation inputs + result ──
  const [foundationType] = useProjectStorage(projectType, "foundationType", {});
  const [squareCaisson] = useProjectStorage(projectType, "squareCaisson", {});
  const [roundCaisson] = useProjectStorage(projectType, "roundCaisson", {});
  const [calculatedFoundation] = useProjectStorage(
    projectType,
    "calculatedFoundation",
    {},
  );

  // ── Validation helpers ──

  // Checks whether a calculated result object has actual data
  const hasResult = (calculated) =>
    calculated && Object.keys(calculated).length > 0;

  // Validates all required calculation results based on enabled flags
  const validateCalculationResults = (showToast) => {
    // Pole results are always required regardless of flags
    if (!results?.length) {
      showToast(
        "No pole calculation results available. Please calculate first.",
      );
      return false;
    }

    // Opening result — only required if openingEnabled
    if (openingEnabled && !hasResult(calculatedOp)) {
      showToast(
        "Opening calculation result is missing. Please calculate the opening first.",
      );
      return false;
    }

    // Baseplate result — only required if baseplateEnabled
    if (baseplateEnabled && !hasResult(calculatedBaseplate)) {
      showToast(
        "Baseplate calculation result is missing. Please calculate the baseplate first.",
      );
      return false;
    }

    // Foundation result — only required if foundationEnabled
    if (foundationEnabled && !hasResult(calculatedFoundation)) {
      showToast(
        "Foundation calculation result is missing. Please calculate the foundation first.",
      );
      return false;
    }

    return true;
  };

  // ── Merge helpers ──
  // Input FE dijadikan base, field dari BE menimpa jika ada key yang sama.

  // Opening: merge openingType + detail input (boxType atau rType) + result BE
  const mergeOpening = () => {
    const type = openingType?.type;

    // Pilih input detail sesuai tipe yang dipilih user
    const detailInput = type === "box" ? boxType : type === "r" ? rType : {};

    return {
      openingType, // tipe opening yang dipilih (box / r)
      ...detailInput, // field input detail: boxWidth, opWidth, opLength, dll
      ...calculatedOp, // hasil kalkulasi dari BE (override jika konflik)
    };
  };

  // Baseplate: merge bpType + detail input (fourRibType atau eightRibType) + result BE
  const mergeBaseplate = () => {
    const ribType = bpType?.ribType;

    // Pilih input detail sesuai jumlah rib yang dipilih user
    const detailInput =
      ribType === "four"
        ? fourRibType
        : ribType === "eight"
          ? eightRibType
          : {};

    return {
      bpType, // tipe baseplate yang dipilih
      ...detailInput, // field input detail sesuai rib type
      ...calculatedBaseplate, // hasil kalkulasi dari BE
    };
  };

  // Foundation: merge foundationType + detail input (sqrCaisson atau roundCaisson) + result BE
  const mergeFoundation = () => {
    const shape = foundationType?.shape;

    // Pilih input detail sesuai bentuk pondasi yang dipilih user
    const detailInput =
      shape === "square"
        ? squareCaisson
        : shape === "round"
          ? roundCaisson
          : {};

    return {
      foundationType, // tipe pondasi yang dipilih
      ...detailInput, // field input detail sesuai shape
      ...calculatedFoundation, // hasil kalkulasi dari BE
    };
  };

  // ── Main function ──

  // Validates cover + all required results, then navigates to report page
  const makeReport = async ({
    cover,
    validateCover,
    isCalculated,
    showToast,
  }) => {
    // Pole calculation must have been run
    if (!isCalculated) {
      showToast("Please calculate first.");
      return;
    }

    // Validate all required results based on condition flags
    const isResultsValid = validateCalculationResults(showToast);
    if (!isResultsValid) return;

    // Cover fields must be complete
    const isCoverValid = await validateCover();
    if (!isCoverValid) {
      showToast("Please complete the Cover Information fields.");
      return;
    }

    // Build report payload
    // results pole sudah merged di usePoleCalculation, langsung pakai
    const reportPayload = {
      results,
      resultsDo,
      resultsOhw,
      resultsArm,
      cover,
      condition,
      poleConfig,
      // Merge input + result, hanya dimasukkan jika step-nya enabled
      ...(openingEnabled && { calculatedOp: mergeOpening() }),
      ...(baseplateEnabled && { calculatedBaseplate: mergeBaseplate() }),
      ...(foundationEnabled && { calculatedFoundation: mergeFoundation() }),
    };

    // Persist snapshot so report page can access it on reload
    sessionStorage.setItem(
      `${projectType}_reportSnapshot`,
      JSON.stringify(reportPayload),
    );

    // Navigate to report page with payload as route state
    navigate("/report", { state: reportPayload });
  };

  return {
    makeReport,
  };
}
