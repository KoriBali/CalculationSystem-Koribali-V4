import { ChevronRight } from "lucide-react";
import {
  inputStyle,
  ErrorStyle,
  Label,
  SectionTitle,
  SectionCard,
} from "./coverFieldPrimitives";

// Project identity fields — Request No., Company Name, Request Type,
// Project No., Requested Due Date, Project Name. Shown on the Project
// Setup page, independent of workflow mode and report cover data.
export function ProjectIdentityFields({ identityData, onUpdate, errors }) {
  return (
    <div>
      <SectionTitle>Project Information</SectionTitle>
      <SectionCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Request No. */}
          <div className="relative">
            <Label>Request No.</Label>
            <input
              type="text"
              value={identityData.requestNo || ""}
              onChange={(e) => onUpdate({ requestNo: e.target.value })}
              className={inputStyle(errors?.requestNo)}
              placeholder="e.g. YSC-26-0107"
            />
            <ErrorStyle show={!!errors?.requestNo} text={errors?.requestNo} />
          </div>

          {/* Company Name */}
          <div className="relative">
            <Label>Company Name</Label>
            <input
              type="text"
              value={identityData.companyName || ""}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
              className={inputStyle(errors?.companyName)}
              placeholder="e.g. YS Pole"
            />
            <ErrorStyle show={!!errors?.companyName} text={errors?.companyName} />
          </div>

          {/* Request Type */}
          <div className="relative">
            <Label>Request Type</Label>
            <div className="relative">
              <select
                value={identityData.requestType || ""}
                onChange={(e) => onUpdate({ requestType: e.target.value })}
                className={`${inputStyle(errors?.requestType)} appearance-none`}
              >
                <option value="" disabled>Select Type</option>
                <option value="New">New</option>
                <option value="Revision">Revision</option>
                <option value="Modification">Modification</option>
                <option value="Replacement">Replacement</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
            </div>
            <ErrorStyle show={!!errors?.requestType} text={errors?.requestType} />
          </div>

          {/* Project No. */}
          <div className="relative">
            <Label>Project No.</Label>
            <input
              type="text"
              value={identityData.projectNo || ""}
              onChange={(e) => onUpdate({ projectNo: e.target.value })}
              className={inputStyle(errors?.projectNo)}
              placeholder="e.g. 77732"
            />
            <ErrorStyle show={!!errors?.projectNo} text={errors?.projectNo} />
          </div>

          {/* Requested Due Date */}
          <div className="relative">
            <Label>Requested Due Date</Label>
            <input
              type="date"
              value={identityData.requestedDueDate || ""}
              onChange={(e) => onUpdate({ requestedDueDate: e.target.value })}
              className={inputStyle(errors?.requestedDueDate)}
            />
            <ErrorStyle
              show={!!errors?.requestedDueDate}
              text={errors?.requestedDueDate}
            />
          </div>

          {/* Project Name */}
          <div className="relative">
            <Label>Project Name</Label>
            <input
              type="text"
              value={identityData.projectName || ""}
              onChange={(e) => onUpdate({ projectName: e.target.value })}
              className={inputStyle(errors?.projectName)}
              placeholder="e.g. Miyashita Children's Playground"
            />
            <ErrorStyle show={!!errors?.projectName} text={errors?.projectName} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
