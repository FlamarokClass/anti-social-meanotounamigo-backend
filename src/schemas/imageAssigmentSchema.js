const Joi = require("joi");

const imageAssignmentSchema = Joi.object({
  imageIds: Joi.array()
    .items(
      Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .message("Cada imagen debe ser un ID hexadecimal válido de 24 caracteres.")
    )
    .min(1)
    .required()
    .messages({
      "any.required": "El campo imageIds es obligatorio.",
      "array.base": "Debés enviar un array de IDs de imágenes.",
      "array.min": "Al menos una imagen debe ser asignada."
    })
});

module.exports = imageAssignmentSchema;