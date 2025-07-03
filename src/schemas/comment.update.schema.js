const Joi = require('joi');

const commentUpdateSchema = Joi.object({
  contenido: Joi.string().required().min(1).max(2000).messages({
    "any.required": "El contenido es obligatorio.",
    "string.empty": "El contenido no puede estar vacío.",
    "string.min": "El contenido debe tener como mínimo {#limit} caracteres.",
    "string.max": "El contenido debe tener como máximo {#limit} caracteres."
  }),
  fecha: Joi.date().iso().optional().messages({
    "date.base": "La fecha debe tener un formato válido."
  })
});

module.exports = commentUpdateSchema;