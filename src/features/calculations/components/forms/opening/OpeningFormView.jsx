import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, Box } from "lucide-react";

import { HeaderCalculationPage } from "../../layout/HeaderCalculationPage";
import { OpeningType } from "./OpeningType";
import { BoxTypeForm } from "./BoxTypeForm";
import { RTypeForm } from "./RTypeForm";
import { OpeningResultTable } from "../../tables/opening-result/OpeningResultTable";
import { ToastModal } from "../../modals/ToastModal";
import { CoverFormModal } from "../../modals/CoverFormModal";

import { useOpeningForm } from "../../../hooks/useOpeningForm";
import { useCoverForm } from "../../../hooks/useCoverForm";
import { useReport } from "../../../../report/hooks/useReport";

// Main view for the opening calculation step
export default function OpeningFormView() {
  const { type: projectType } = useParams();

  // ── Hooks ──
  const opening = useOpeningForm();
  const cover = useCoverForm(projectType);
  const report = useReport(projectType);

  // Opens cover modal if this is the last step, otherwise navigates to next
  const handleNextStep = () => {
    const result = opening.finish();
    if (result === "OPEN_COVER") cover.openCoverPopup();
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <Helmet>
          <title>Calculation Opening - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50 border border-gray-250">
          <HeaderCalculationPage />

          <div className="mx-6 2040:mx-[250px] pt-0 pb-8 hp:mx-2">
            {/* ── Opening Type selector ── */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-6 transition-all duration-500 ease-in-out
              ${opening.isOpeningExpanded ? "rounded-t-xl md:rounded-t-2xl" : "rounded-xl md:rounded-2xl"}`}
              onClick={() =>
                opening.setIsOpeningExpanded(!opening.isOpeningExpanded)
              }
            >
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                  Opening Part Type
                </h2>
              </div>
              <div
                className="
                  flex h-8 w-8
                  sm:h-9 sm:w-9
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-white/15
                  text-white
                  border border-white/20
                  transition
                  group-hover:bg-white/20
                  group-active:bg-white/25
                "
              >
                {opening.isOpeningExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            {/* Opening type collapsible body */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden
              ${opening.isOpeningExpanded ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl" : "max-h-0 rounded-b-2xl hp:rounded-b-xl"}`}
            >
              <OpeningType
                openingType={opening.openingType}
                onUpdate={opening.updateOpeningType}
                errors={opening.openingTypeErrors}
              />
            </div>

            {/* ── Opening detail section ── */}
            <div
              className={`bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-4 py-3 md:p-4 flex items-center justify-between cursor-pointer mt-10 transition-all duration-500 ease-in-out
              ${opening.isSelectExpanded ? "rounded-t-2xl hp:rounded-t-xl" : "rounded-2xl hp:rounded-xl"}`}
              onClick={() =>
                opening.setIsSelectExpanded(!opening.isSelectExpanded)
              }
            >
              {/* Dynamic title — only shown when a type is selected */}
              <div>
                {opening.openingType.type && (
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hp:rounded-md border border-white/20 hp:px-3 hp:py-[8px]">
                    <h2 className="text-white text-xs md:text-sm font-semibold md:font-bold">
                      {opening.typeLabelMap[opening.openingType.type]}
                    </h2>
                  </div>
                )}
              </div>
              <div
                className="
                  flex h-8 w-8
                  sm:h-9 sm:w-9
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-white/15
                  text-white
                  border border-white/20
                  transition
                  group-hover:bg-white/20
                  group-active:bg-white/25
                "
              >
                {opening.isSelectExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
            </div>

            {/* Detail collapsible body */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden
              ${opening.isSelectExpanded ? "max-h-[10000px] rounded-b-2xl hp:rounded-b-xl" : "max-h-0 rounded-b-2xl hp:rounded-b-xl"}`}
            >
              {/* Empty state — prompt user to select type first */}
              {!opening.openingType.type && (
                <div className="bg-white border border-gray-200 rounded-b-2xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Box className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Please select opening type first
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Choose the type above to configure parameters
                  </p>
                </div>
              )}

              {/* Box type form */}
              {opening.openingType.type === "box" && (
                <BoxTypeForm
                  boxType={opening.boxType}
                  onUpdate={opening.updateBoxType}
                  errors={opening.boxTypeErrors}
                  onCalculate={opening.calculate}
                  onNext={handleNextStep}
                  isCalculated={opening.isCalculated}
                  buttonLabel={opening.buttonLabel}
                />
              )}

              {/* R type form */}
              {opening.openingType.type === "r" && (
                <RTypeForm
                  rType={opening.rType}
                  onUpdate={opening.updateRType}
                  errors={opening.rTypeErrors}
                  onCalculate={opening.calculate}
                  onNext={handleNextStep}
                  isCalculated={opening.isCalculated}
                  buttonLabel={opening.buttonLabel}
                />
              )}
            </div>

            {/* ── Result table ── */}
            <div id="results-op">
              {opening.showResultsOp && (
                <OpeningResultTable
                  openingType={opening.calculatedOp?.openingType}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Cover modal — shown when this is the last step ── */}
      <CoverFormModal
        open={cover.showCoverPopup}
        onClose={cover.closeCoverPopup}
        cover={cover.coverData}
        onUpdateCover={cover.updateCover}
        coverErrors={cover.coverErrors}
        onMakeReport={() =>
          report.makeReport({
            cover: cover.coverData,
            validateCover: cover.validate,
            isCalculated: opening.isCalculated,
            showToast: opening.showToast,
          })
        }
      />

      {/* ── Toast notification ── */}
      <ToastModal
        toast={opening.toast}
        onClose={() => opening.setToast(null)}
      />
    </>
  );
}
