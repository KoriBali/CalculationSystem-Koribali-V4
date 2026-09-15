import * as Yup from "yup";

export const ProjectSetupSchema = Yup.object().shape({
  requestNo: Yup.string().required("Request Number is required"),
  receiptNo: Yup.string().required("Receipt Number is required"),
  companyName: Yup.string().required("Company Name is required"),
  responsibleDepartment: Yup.string().required(
    "Responsible Department is required",
  ),
  requestType: Yup.string().required("Request Type is required"),
  requestCategory: Yup.string().required("Request Category is required"),
  projectNo: Yup.string().required("Project Number is required"),
  requestedDueDate: Yup.string().required("Requested Due Date is required"),
  projectName: Yup.string().required("Project Name is required"),
  checkedByName: Yup.string().required("Checked By Name is required"),
  approvedByName: Yup.string().required("Approved By Name is required"),
});
