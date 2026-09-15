import {
  inputStyle,
  ErrorStyle,
  Label,
  SectionTitle,
  SectionCard,
} from "./coverFieldPrimitives";
import { useMasterData } from "../../../hooks/useMasterData";
import { checkedByOptions } from "../../../constants/checkedByOptions";
import { FormSelect } from "../../../../../shared/components/FormSelect";

// Master-data department options come as {value, label} where `value` is
// the department code — FormSelect shows `label` in the menu, so combine
// them into "CODE - Name" the same way the old <select> did.
const toDepartmentSelectOptions = (depts) =>
  depts.map((d) => ({ value: d.value, label: `${d.value} - ${d.label}` }));

const REQUEST_TYPE_OPTIONS = [
  { value: "General", label: "General" },
  { value: "Special", label: "Special" },
];

const REQUEST_CATEGORY_OPTIONS = [
  { value: "New", label: "New" },
  { value: "Revision", label: "Revision" },
  { value: "Modification", label: "Modification" },
  { value: "Replacement", label: "Replacement" },
];

// Project identity fields — Request Number, Receipt Number, Company Name,
// Responsible Department, Request Type, Request Category, Project Number,
// Requested Due Date, Checked By Name, Approved By Name, Project Name.
// Shown on the Project Setup page, independent of workflow mode and report
// cover data.
export function ProjectIdentityFields({ identityData, onUpdate, errors }) {
  // Department options come from the same master data source used by
  // CoverFormModal's "Department" field, so both forms always show the
  // same list instead of one of them drifting out of sync with a static copy.
  const {
    departmentOptions,
    loading: departmentLoading,
    error: departmentError,
    refetch: refetchDepartments,
  } = useMasterData();

  const departmentFailed =
    departmentError && !departmentLoading && departmentOptions.length === 0;

  return (
    <div>
      <SectionTitle>Project Information</SectionTitle>
      <SectionCard>
        <div className="space-y-4">
          {/* Request identifiers */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-6">
              {/* Request Number */}
              <div className="relative">
                <Label>Request Number</Label>
                <input
                  id="requestNo"
                  type="text"
                  value={identityData.requestNo || ""}
                  onChange={(e) => onUpdate({ requestNo: e.target.value })}
                  className={inputStyle(errors?.requestNo)}
                  placeholder="e.g. YSC-26-0107"
                />
                <ErrorStyle
                  show={!!errors?.requestNo}
                  text={errors?.requestNo}
                />
              </div>

              {/* Receipt Number */}
              <div className="relative">
                <Label>Receipt Number</Label>
                <input
                  id="receiptNo"
                  type="text"
                  value={identityData.receiptNo || ""}
                  onChange={(e) => onUpdate({ receiptNo: e.target.value })}
                  className={inputStyle(errors?.receiptNo)}
                  placeholder="e.g. RCP-26-0042"
                />
                <ErrorStyle
                  show={!!errors?.receiptNo}
                  text={errors?.receiptNo}
                />
              </div>

              {/* Project Number */}
              <div className="relative">
                <Label>Project Number</Label>
                <input
                  id="projectNo"
                  type="text"
                  value={identityData.projectNo || ""}
                  onChange={(e) => onUpdate({ projectNo: e.target.value })}
                  className={inputStyle(errors?.projectNo)}
                  placeholder="e.g. 77732"
                />
                <ErrorStyle
                  show={!!errors?.projectNo}
                  text={errors?.projectNo}
                />
              </div>

              {/* Requested Due Date */}
              <div className="relative">
                <Label>Requested Due Date</Label>
                <input
                  id="requestedDueDate"
                  type="date"
                  value={identityData.requestedDueDate || ""}
                  onChange={(e) =>
                    onUpdate({ requestedDueDate: e.target.value })
                  }
                  className={inputStyle(errors?.requestedDueDate)}
                />
                <ErrorStyle
                  show={!!errors?.requestedDueDate}
                  text={errors?.requestedDueDate}
                />
              </div>
            </div>
          </div>

          {/* Requester & classification */}
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-6">
              {/* Company Name */}
              <div className="relative">
                <Label>Company Name</Label>
                <input
                  id="companyName"
                  type="text"
                  value={identityData.companyName || ""}
                  onChange={(e) => onUpdate({ companyName: e.target.value })}
                  className={inputStyle(errors?.companyName)}
                  placeholder="e.g. YS Pole"
                />
                <ErrorStyle
                  show={!!errors?.companyName}
                  text={errors?.companyName}
                />
              </div>

              {/* Responsible Department */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  <Label>Responsible Department</Label>
                  {departmentFailed && (
                    <button
                      type="button"
                      onClick={refetchDepartments}
                      className="text-[11px] font-medium text-red-600 underline hover:text-red-700"
                    >
                      Retry
                    </button>
                  )}
                </div>
                <FormSelect
                  id="responsibleDepartment"
                  value={identityData.responsibleDepartment || ""}
                  onChange={(val) =>
                    onUpdate({ responsibleDepartment: val })
                  }
                  options={toDepartmentSelectOptions(departmentOptions)}
                  disabled={departmentLoading || departmentFailed}
                  hasError={!!errors?.responsibleDepartment}
                  placeholder={
                    departmentLoading
                      ? "Loading..."
                      : departmentFailed
                        ? "Failed to load"
                        : "Select Department"
                  }
                />
                <ErrorStyle
                  show={!!errors?.responsibleDepartment}
                  text={errors?.responsibleDepartment}
                />
              </div>

              {/* Request Type */}
              <div className="relative">
                <Label>Request Type</Label>
                <FormSelect
                  id="requestType"
                  value={identityData.requestType || ""}
                  onChange={(val) => onUpdate({ requestType: val })}
                  options={REQUEST_TYPE_OPTIONS}
                  hasError={!!errors?.requestType}
                  placeholder="Select Type"
                />
                <ErrorStyle
                  show={!!errors?.requestType}
                  text={errors?.requestType}
                />
              </div>

              {/* Request Category */}
              <div className="relative">
                <Label>Request Category</Label>
                <FormSelect
                  id="requestCategory"
                  value={identityData.requestCategory || ""}
                  onChange={(val) => onUpdate({ requestCategory: val })}
                  options={REQUEST_CATEGORY_OPTIONS}
                  hasError={!!errors?.requestCategory}
                  placeholder="Select Category"
                />
                <ErrorStyle
                  show={!!errors?.requestCategory}
                  text={errors?.requestCategory}
                />
              </div>
            </div>
          </div>

          {/* Approval information */}
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              {/* Checked By Name — dummy option list until the backend
                  exposes real personnel master data (see checkedByOptions). */}
              <div className="relative">
                <Label>Checked By Name</Label>
                <FormSelect
                  id="checkedByName"
                  value={identityData.checkedByName || ""}
                  onChange={(val) => onUpdate({ checkedByName: val })}
                  options={checkedByOptions}
                  hasError={!!errors?.checkedByName}
                  placeholder="Select Name"
                  allowCustom
                  customPlaceholder="Enter a name"
                />
                <ErrorStyle
                  show={!!errors?.checkedByName}
                  text={errors?.checkedByName}
                />
              </div>

              {/* Approved By Name */}
              <div className="relative">
                <Label>Approved By Name</Label>
                <input
                  id="approvedByName"
                  type="text"
                  value={identityData.approvedByName || ""}
                  onChange={(e) =>
                    onUpdate({ approvedByName: e.target.value })
                  }
                  className={inputStyle(errors?.approvedByName)}
                />
                <ErrorStyle
                  show={!!errors?.approvedByName}
                  text={errors?.approvedByName}
                />
              </div>
            </div>
          </div>

          {/* Project Name — own full-width row, not part of the grid above */}
          <div className="pt-4 border-t border-gray-100">
            <div className="relative">
              <Label>Project Name</Label>
              <input
                id="projectName"
                type="text"
                value={identityData.projectName || ""}
                onChange={(e) => onUpdate({ projectName: e.target.value })}
                className={inputStyle(errors?.projectName)}
                placeholder="e.g. Miyashita Children's Playground"
              />
              <ErrorStyle
                show={!!errors?.projectName}
                text={errors?.projectName}
              />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
