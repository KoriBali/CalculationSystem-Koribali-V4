import * as yup from "yup";
import { ArmObjectSchema } from "./ArmObjectSchema";

const toNumber = (_, val) =>
  val === "" || val === null ? undefined : Number(val);

export const ArmSchema = yup.object({
  name: yup.string().required("Required field"),

  material: yup.string().required("Required field"),

  diameter: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  thickness: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  length: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  expLength: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  zHeight: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  hDistance: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  fixAngle: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field"),

  nnC: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .min(0, "Must be positive"),

  quantity: yup
    .number()
    .transform(toNumber)
    .typeError("Must be a number")
    .required("Required field")
    .integer("Must be a whole number")
    .min(1, "Value must be greater than 0"),

  armObjects: yup.array().of(ArmObjectSchema).default([]),
});
