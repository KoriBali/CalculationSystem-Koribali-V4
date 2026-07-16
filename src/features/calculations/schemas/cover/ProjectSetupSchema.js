import * as Yup from "yup";

export const ProjectSetupSchema = Yup.object().shape({
  requestNo: Yup.string().required("Request No. is required"),
  companyName: Yup.string().required("Company Name is required"),
  requestType: Yup.string().required("Request Type is required"),
  projectNo: Yup.string().required("Project No. is required"),
  requestedDueDate: Yup.string().required("Requested Due Date is required"),
  projectName: Yup.string().required("Project Name is required"),
});
