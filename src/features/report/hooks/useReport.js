import { useNavigate } from "react-router-dom";
import { useProjectStorage } from "./useProjectStorage";

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

  // Read all calculation results from sessionStorage
  const [results] = useProjectStorage(projectType, "results", []);
  const [resultsDo] = useProjectStorage(projectType, "resultsDo", []);
  const [resultsOhw] = useProjectStorage(projectType, "resultsOhw", []);
  const [resultsArm] = useProjectStorage(projectType, "resultsArm", []);
  const [structuralDesign] = useProjectStorage(
    projectType,
    "structuralDesign",
    {},
  );

  // Validates cover, checks calculation status, then navigates to report page
  const makeReport = async ({
    cover,
    validateCover,
    isCalculated,
    showToast,
  }) => {
    // Results must exist before generating report
    if (!results?.length) {
      showToast("No calculation results available.");
      return;
    }

    // Cover fields must be complete
    const isCoverValid = await validateCover();
    if (!isCoverValid) {
      showToast("Please complete the Cover Information fields.");
      return;
    }

    // Calculation must have been run
    if (!isCalculated) {
      showToast("Please calculate first.");
      return;
    }

    // Build report payload from all persisted data
    const reportPayload = {
      results,
      resultsDo,
      resultsOhw,
      resultsArm,
      cover,
      condition,
      structuralDesign,
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
    makeReport, // fn — validates + builds + navigates to report
  };
}
