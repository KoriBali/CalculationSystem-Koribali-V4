import { DrawingSchema } from './src/features/calculations/schemas/drawing/DrawingSchema.js';
import { validateWithYup } from './src/features/calculations/utils/validation.js';

const data = {
  surfaceTreatmentType: "Plating + Painting",
  platingType: "Standard Plating",
  specificPlatingTypeCode: "HZTD",
  paintingType: "Specified Color Paint",
  colorName: "",
  munsellValue: "",
  colorCode: ""
};

validateWithYup(DrawingSchema, data).then(res => console.log(res));
