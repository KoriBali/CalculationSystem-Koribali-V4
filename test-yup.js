const yup = require('yup');

const schema = yup.object({
  drawingType: yup.string(),
  surfaceTreatmentType: yup.string().required("Required field"),
  platingType: yup.string().required("Required field"),
  paintingType: yup.string().when("surfaceTreatmentType", {
    is: "Plating + Painting",
    then: (schema) => schema.required("Required field"),
    otherwise: (schema) => schema.optional(),
  }),
  colorName: yup.string().when("paintingType", {
    is: "Specified Color Paint",
    then: (schema) => schema.required("Required field"),
    otherwise: (schema) => schema.optional(),
  })
});

schema.validate({
  surfaceTreatmentType: "Plating + Painting",
  platingType: "Standard Plating",
  paintingType: "Specified Color Paint"
}, { abortEarly: false })
.then(console.log)
.catch(err => console.error(err.inner.map(e => ({ path: e.path, message: e.message }))));
