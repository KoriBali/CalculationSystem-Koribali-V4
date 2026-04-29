import { useNavigate } from "react-router-dom";
import { useProjectStorage } from "../../hooks/useProjectStorage";

// Custom hook to handle report generation across pages
export function useReport(projectType) {
  const navigate = useNavigate();

  // Retrieve condition data from session storage
  const condition = JSON.parse(
    sessionStorage.getItem(`${projectType}_condition`) || "{}",
  );

  // Retrieve all calculation-related data from storage
  const [results] = useProjectStorage(projectType, "results", []);
  const [resultsDo] = useProjectStorage(projectType, "resultsDo", []);
  const [resultsOhw] = useProjectStorage(projectType, "resultsOhw", []);
  const [resultsArm] = useProjectStorage(projectType, "resultsArm", []);
  const [structuralDesign] = useProjectStorage(
    projectType,
    "structuralDesign",
    {},
  );

  // Main handler to validate and generate report
  const handleMakeReport = async ({
    cover,
    validateCover,
    isCalculated,
    showToast,
  }) => {
    // Ensure calculation results exist
    if (!results || results.length === 0) {
      showToast("No calculation results available.");
      return;
    }

    // Validate cover form using schema
    const isValidCover = await validateCover();

    // Stop if cover validation fails
    if (!isValidCover) {
      showToast("Please complete the Cover Information fields.");
      return;
    }

    // Ensure calculation step has been completed
    if (!isCalculated) {
      showToast("Please calculate first.");
      return;
    }

    // Prepare payload for report
    const reportPayload = {
      results,
      resultsDo,
      resultsOhw,
      resultsArm,
      cover,
      condition,
      structuralDesign,
    };

    // Save snapshot to session storage
    sessionStorage.setItem(
      `${projectType}_reportSnapshot`,
      JSON.stringify(reportPayload),
    );

    // Navigate to report page with payload
    navigate("/report", {
      state: reportPayload,
    });
  };

  // Expose report handler
  return { handleMakeReport };
}
