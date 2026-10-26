import { useState } from "react";
import { REQUEST_FILE_TABS } from "../../../constants/requestFileTabs";
import { BriefConceptTab } from "../files/BriefConceptTab";
import { CaseOutputsTab } from "../files/CaseOutputsTab";
import { CheckingReviewTab } from "../files/CheckingReviewTab";
import { OutputPackageTab } from "../files/OutputPackageTab";

const TAB_COMPONENTS = {
  brief: (props) => (
    <BriefConceptTab
      files={props.files.brief || []}
      onUpload={props.onUpload}
      onRemove={props.onRemove}
    />
  ),
  calculation: (props) => (
    <CaseOutputsTab
      workType="calculation"
      cases={props.cases}
      files={props.files.calculation || []}
      request={props.request}
      onUpload={props.onUpload}
      onRemove={props.onRemove}
    />
  ),
  drawing: (props) => (
    <CaseOutputsTab
      workType="drawing"
      cases={props.cases}
      files={props.files.drawing || []}
      request={props.request}
      onUpload={props.onUpload}
      onRemove={props.onRemove}
    />
  ),
  checking: (props) => (
    <CheckingReviewTab
      cases={props.cases}
      files={props.files.checking || []}
      onUpload={props.onUpload}
      onRemove={props.onRemove}
    />
  ),
  output: (props) => (
    <OutputPackageTab
      cases={props.cases}
      files={[
        ...(props.files.calculation || []),
        ...(props.files.drawing || []),
      ]}
      request={props.request}
    />
  ),
};

export function RequestFiles({
  files = {},
  cases = [],
  request = {},
  onUpload,
  onRemove,
}) {
  const [activeKey, setActiveKey] = useState("brief");

  const renderActiveContent =
    TAB_COMPONENTS[activeKey] || TAB_COMPONENTS.brief;

  return (
    <div className="space-y-4">
      {/* ── Card Header ── */}
      <div className="pb-3 border-b border-gray-100">
        <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
          Project References & Supporting Documents
        </h4>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          There are several file category tabs below. You can organize and adjust your uploads by selecting the corresponding tab according to the file type.
        </p>
      </div>

      {/* ── Main Tab Navigation Bar ── */}
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto scrollbar-soft pb-1 -mb-1 pt-0.5"
      >
        {REQUEST_FILE_TABS.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveKey(tab.key)}
              className={`shrink-0 h-9 px-4 rounded-lg hp:rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#0d3b66] text-white shadow-2xs"
                  : "text-slate-600 hover:bg-[#eef2f6] hover:text-[#0d3b66]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Dynamic Tab Body ── */}
      <div className="pt-2">
        {renderActiveContent({
          files,
          cases,
          request,
          onUpload,
          onRemove,
        })}
      </div>
    </div>
  );
}
