import React from "react";
import { FileText, RotateCcw, ChevronRight } from "lucide-react";
import { useCoverForm } from "../../hooks/useCoverForm";
import { useProjectIdentityForm } from "../../hooks/useProjectIdentityForm";
import { useMasterData } from "../../hooks/useMasterData";
import {
  inputStyle,
  ErrorStyle,
  Label,
} from "../forms/cover/coverFieldPrimitives";
import { FormSelect } from "../../../../shared/components/FormSelect";

// Master-data region/author options come as {value, label} where `value` is
// the code — combine into "CODE - Name" the same way ProjectIdentityFields
// does for its Department field, so both places read consistently.
const toCodeSelectOptions = (opts) =>
  opts.map((o) => ({ value: o.value, label: `${o.value} - ${o.label}` }));

export function CoverFormModal({ open, onClose, projectType, onConfirm }) {
  const coverForm = useCoverForm(projectType);
  const {
    regionOptions,
    authorOptions,
    loading: masterDataLoading,
    error: masterDataError,
    refetch: refetchMasterData,
  } = useMasterData();
  const masterDataFailed =
    masterDataError &&
    !masterDataLoading &&
    regionOptions.length === 0 &&
    authorOptions.length === 0;

  if (!open) return null;

  const handleGenerate = async () => {
    const isValid = await coverForm.validate();
    if (isValid) {
      onConfirm();
    }
  };

  const handleReset = () => {
    coverForm.updateCover({
      reportNumber: "",
      title1: "",
      title2: "",
      title3: "",
      designRequestManagementNo: "",
      region: "",
      author: "",
    });
    coverForm.setCoverErrors({});
  };

  const { coverData, coverErrors, updateCover } = coverForm;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[70] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#1a5a92] px-6 py-6 flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-2 text-white">
            <FileText className="w-4.5 h-4.5" />
            <h2 className="text-base font-bold">Report Cover Information</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-600 mb-6 text-sm">
            Please fill in the project details below. This information will be
            used as the cover page for your generated report.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8">
            {/* Report Number */}
            <div className="relative">
              <Label>Report Number</Label>
              <input
                type="text"
                value={coverData.reportNumber}
                onChange={(e) => updateCover({ reportNumber: e.target.value })}
                className={inputStyle(coverErrors.reportNumber)}
                placeholder="Ex: REP-001"
              />
              <ErrorStyle
                show={coverErrors.reportNumber}
                text={coverErrors.reportNumber}
              />
            </div>

            {/* Design Request Management No */}
            <div className="relative">
              <Label>Design Request Management No.</Label>
              <input
                type="text"
                value={coverData.designRequestManagementNo}
                onChange={(e) =>
                  updateCover({ designRequestManagementNo: e.target.value })
                }
                className={inputStyle(coverErrors.designRequestManagementNo)}
                placeholder="Ex: DR-2023"
              />
              <ErrorStyle
                show={coverErrors.designRequestManagementNo}
                text={coverErrors.designRequestManagementNo}
              />
            </div>

            {/* Titles */}
            <div className="relative md:col-span-2">
              <Label>Report Titles</Label>
              <div className="flex flex-col gap-5 md:gap-6">
                <div className="relative">
                  <input
                    type="text"
                    value={coverData.title1}
                    onChange={(e) => updateCover({ title1: e.target.value })}
                    className={inputStyle(coverErrors.title1)}
                    placeholder="Title Line 1 (Required)"
                  />
                  <ErrorStyle
                    show={coverErrors.title1}
                    text={coverErrors.title1}
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={coverData.title2}
                    onChange={(e) => updateCover({ title2: e.target.value })}
                    className={inputStyle(coverErrors.title2)}
                    placeholder="Title Line 2 (Optional)"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={coverData.title3}
                    onChange={(e) => updateCover({ title3: e.target.value })}
                    className={inputStyle(coverErrors.title3)}
                    placeholder="Title Line 3 (Optional)"
                  />
                </div>
              </div>
            </div>

            {/* Responsible Category block */}
            <div className="md:col-span-2 mt-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-slate-300 flex-1" />
                <h3 className="text-[#0d3b66] text-sm font-semibold">
                  Responsible category
                </h3>
                <div className="h-px bg-slate-300 flex-1" />
              </div>

              {masterDataFailed && (
                <div className="flex items-center justify-between gap-3 mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-xs sm:text-sm text-red-600">
                    Failed to load Region / Author options.
                  </p>
                  <button
                    type="button"
                    onClick={refetchMasterData}
                    className="text-xs sm:text-sm font-medium text-red-600 underline hover:text-red-700 shrink-0"
                  >
                    Retry
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border border-slate-200 p-5 rounded-xl bg-slate-50/50">
                {/* Region */}
                <div className="relative">
                  <Label>Region</Label>
                  <FormSelect
                    value={coverData.region}
                    onChange={(val) => updateCover({ region: val })}
                    options={toCodeSelectOptions(regionOptions)}
                    loading={masterDataLoading}
                    disabled={masterDataFailed}
                    hasError={!!coverErrors.region}
                    placeholder={
                      masterDataFailed ? "Failed to load" : "Select Region"
                    }
                  />
                  <ErrorStyle show={coverErrors.region} text={coverErrors.region} />
                </div>

                {/* Author */}
                <div className="relative">
                  <Label>Author</Label>
                  <FormSelect
                    value={coverData.author}
                    onChange={(val) => updateCover({ author: val })}
                    options={toCodeSelectOptions(authorOptions)}
                    loading={masterDataLoading}
                    disabled={masterDataFailed}
                    hasError={!!coverErrors.author}
                    placeholder={
                      masterDataFailed ? "Failed to load" : "Select Author"
                    }
                  />
                  <ErrorStyle show={coverErrors.author} text={coverErrors.author} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-4 sm:py-5 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-between gap-3 rounded-b-2xl">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 md:px-6 rounded-lg hp:rounded-md bg-white text-red-500 font-medium text-xs md:text-sm hover:bg-red-50 hover:text-red-600 transition-colors border border-red-300"
          >
            <RotateCcw className="w-4 lg:w-4.5 h-4 lg:h-4.5" />
            Reset
          </button>
          <div className="flex flex-col-reverse sm:flex-row w-full sm:w-auto gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm bg-[#eef2f6] text-[#0d3b66] ring-1 ring-inset ring-[#d0d7e2] hover:bg-[#e2e8f0] hover:ring-[#b8c2d1] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white hover:brightness-110 shadow-sm transition-all"
            >
              Generate Report
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
