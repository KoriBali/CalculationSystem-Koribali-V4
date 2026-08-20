import React, { useEffect, useState, useRef } from "react";
import { FileText, RotateCcw, ChevronRight } from "lucide-react";
import { useCoverForm } from "../../hooks/useCoverForm";
import { useProjectIdentityForm } from "../../hooks/useProjectIdentityForm";
import { useMasterData } from "../../hooks/useMasterData";
import {
  inputStyle,
  ErrorStyle,
  Label,
} from "../forms/cover/coverFieldPrimitives";

export function CoverFormModal({ open, onClose, projectType, onConfirm }) {
  const coverForm = useCoverForm(projectType);
  const {
    regionOptions,
    authorOptions,
    departmentOptions,
    loading: masterDataLoading,
  } = useMasterData();

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
      departmentInCharge: "",
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

              <div className="grid grid-cols-3 gap-4 border border-slate-200 p-5 rounded-xl bg-slate-50/50">
                {/* Region */}
                <div className="flex flex-col items-center gap-3">
                  <label className="text-xs md:text-sm font-medium text-slate-700">
                    Region
                  </label>
                  <div className="relative flex flex-col items-center w-full mb-4 md:mb-5">
                    <BadgeSelect
                      value={coverData.region}
                      onChange={(val) => updateCover({ region: val })}
                      error={coverErrors.region}
                      placeholder={masterDataLoading ? "Loading..." : "-"}
                      options={masterDataLoading ? [] : regionOptions}
                    />
                    {coverErrors.region && (
                      <div className="absolute -bottom-4 md:-bottom-5 flex justify-center w-full whitespace-nowrap text-[9px] md:text-[11px] text-red-500">
                        <span>*{coverErrors.region}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Author */}
                <div className="flex flex-col items-center gap-3">
                  <label className="text-xs md:text-sm font-medium text-slate-700">
                    Author
                  </label>
                  <div className="relative flex flex-col items-center w-full mb-4 md:mb-5">
                    <BadgeSelect
                      value={coverData.author}
                      onChange={(val) => updateCover({ author: val })}
                      error={coverErrors.author}
                      placeholder={masterDataLoading ? "Loading..." : "-"}
                      options={masterDataLoading ? [] : authorOptions}
                    />
                    {coverErrors.author && (
                      <div className="absolute -bottom-4 md:-bottom-5 flex justify-center w-full whitespace-nowrap text-[9px] md:text-[11px] text-red-500">
                        <span>*{coverErrors.author}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Department in charge */}
                <div className="flex flex-col items-center gap-3">
                  <label className="text-xs md:text-sm font-medium text-slate-700">
                    Department
                  </label>
                  <div className="relative flex flex-col items-center w-full mb-4 md:mb-5">
                    <BadgeSelect
                      value={coverData.departmentInCharge}
                      onChange={(val) =>
                        updateCover({ departmentInCharge: val })
                      }
                      error={coverErrors.departmentInCharge}
                      placeholder={masterDataLoading ? "Loading..." : "-"}
                      options={masterDataLoading ? [] : departmentOptions}
                    />
                    {coverErrors.departmentInCharge && (
                      <div className="absolute -bottom-4 md:-bottom-5 flex justify-center w-full whitespace-nowrap text-[9px] md:text-[11px] text-red-500">
                        <span>*{coverErrors.departmentInCharge}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-4 sm:py-5 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-between gap-3 rounded-b-2xl">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-[#eef2f6] hover:bg-[#e2e8f0] text-[#0d3b66] text-sm ring-1 ring-inset ring-[#d0d7e2] hover:ring-[#b8c2d1] shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
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

// ─── SUB-COMPONENT ───────────────────────────────────────────────────────────

function BadgeSelect({ value, onChange, options, error, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`${inputStyle(error)} w-full flex items-center justify-center text-center uppercase bg-white shadow-sm cursor-pointer ${!value ? "!text-slate-400" : ""}`}
        >
          {value || placeholder}
        </button>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-90" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[100] overflow-hidden py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs md:text-sm transition-colors truncate ${value === opt.value ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`}
            >
              {opt.value} - {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
