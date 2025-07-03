const Joi = require("joi");

const tagAssignmentSchema = Joi.object({
  tagId: Joi.string().length(24).hex().required().messages({
    "any.required": "El ID de la etiqueta es obligatorio",
    "string.length": "El ID de la etiqueta debe tener 24 caracteres",
    "string.hex": "El ID debe estar en formato hexadecimal"
  })
});

module.exports = tagAssignmentSchema;
