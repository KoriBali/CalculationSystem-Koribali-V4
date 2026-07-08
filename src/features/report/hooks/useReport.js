import { useNavigate } from "react-router-dom";

// ─── HOOK ────────────────────────────────────────────────────────────────────

// Handles report generation — validates cover, builds payload, navigates to report page
export function useReport(projectType) {
  const navigate = useNavigate();

  // ── Read helper ──
  // Reads and parses a value from sessionStorage by key
  const read = (key, fallback = null) => {
    try {
      const raw = sessionStorage.getItem(`${projectType}_${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  // Read condition once at hook level — used to determine which steps are enabled
  const condition = read("condition", {});
  const { openingEnabled, baseplateEnabled, foundationEnabled } = condition;

  // ── Validation helpers ──

  // Checks whether a calculated result object has actual data
  const hasResult = (calculated) =>
    calculated && Object.keys(calculated).length > 0;

  // Validates all required calculation results based on enabled flags
  const validateCalculationResults = (
    results,
    calculatedOp,
    calculatedBaseplate,
    calculatedFoundation,
    showToast,
  ) => {
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
  const mergeOpening = (openingType, boxType, rType, calculatedOp) => {
    const type = openingType?.type;

    // Pilih input detail sesuai tipe yang dipilih user
    const detailInput = type === "box" ? boxType : type === "r" ? rType : {};

    return {
      openingType, // tipe opening yang dipilih (box / r)
      ...detailInput, // field input detail: boxWidth, opWidth, opLength, dll
      ...calculatedOp, // hasil kalkulasi dari BE (override jika konflik)
    };
  };

  // Baseplate: merge baseplateType + detail input (fourRibType atau eightRibType) + result BE
  const mergeBaseplate = (
    baseplateType,
    fourRibType,
    eightRibType,
    calculatedBaseplate,
  ) => {
    const ribType = baseplateType?.ribType;

    // Pilih input detail sesuai jumlah rib yang dipilih user
    const detailInput =
      ribType === "four"
        ? fourRibType
        : ribType === "eight"
          ? eightRibType
          : {};

    return {
      baseplateType, // tipe baseplate yang dipilih
      ...detailInput, // field input detail sesuai rib type
      ...calculatedBaseplate, // hasil kalkulasi dari BE
    };
  };

  // Foundation: merge foundationType + detail input (squareCaisson atau roundCaisson) + result BE
  const mergeFoundation = (
    foundationType,
    squareCaisson,
    roundCaisson,
    calculatedFoundation,
  ) => {
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

  // Validates all required results, then navigates to report page
  const makeReport = async ({
    isCalculated,
    showToast,
  }) => {
    // Pole calculation must have been run
    if (!isCalculated) {
      showToast("Please calculate first.");
      return;
    }

    // Read all results from sessionStorage at call time
    const results = read("results", []);
    const resultsDo = read("resultsDo", []);
    const resultsOhw = read("resultsOhw", []);
    const resultsArm = read("resultsArm", []);
    const poleConfig = read("poleConfig", {});
    const cover = read("cover", {});

    // Read calculated results for optional steps
    const calculatedOp = read("calculatedOp", {});
    const calculatedBaseplate = read("calculatedBaseplate", {});
    const calculatedFoundation = read("calculatedFoundation", {});

    // Validate all required results based on condition flags
    const isResultsValid = validateCalculationResults(
      results,
      calculatedOp,
      calculatedBaseplate,
      calculatedFoundation,
      showToast,
    );
    if (!isResultsValid) return;

    // Cover fields must be complete (simple validation since they already validated at step 1)
    if (!cover.managementCode || !cover.calculationNumber || !cover.projectName || !cover.date) {
      showToast("Please complete the Cover Information fields in Initial Setup.");
      return;
    }

    // Build report payload
    const reportPayload = {
      results,
      resultsDo,
      resultsOhw,
      resultsArm,
      cover,
      condition,
      poleConfig,
      ...(openingEnabled && {
        calculatedOp: mergeOpening(
          read("openingType", {}),
          read("boxType", {}),
          read("rType", {}),
          calculatedOp,
        ),
      }),
      ...(baseplateEnabled && {
        calculatedBaseplate: mergeBaseplate(
          read("baseplateType", {}),
          read("fourRibType", {}),
          read("eightRibType", {}),
          calculatedBaseplate,
        ),
      }),
      ...(foundationEnabled && {
        calculatedFoundation: mergeFoundation(
          read("foundationType", {}),
          read("squareCaisson", {}),
          read("roundCaisson", {}),
          calculatedFoundation,
        ),
      }),
    };

    // Persist snapshot so report page can access it on reload
    sessionStorage.setItem(
      `${projectType}_reportSnapshot`,
      JSON.stringify(reportPayload),
    );

    // Navigate to report page with payload as route state
    navigate("/report", { state: reportPayload });
  };

  return { makeReport };
}
