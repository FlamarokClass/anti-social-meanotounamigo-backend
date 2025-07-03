const Joi = require("joi");

const commentCreateSchema = Joi.object({
  contenido: Joi.string().min(1).max(2000).required().messages({
    "any.required": "El contenido es obligatorio.",
    "string.empty": "El contenido no puede estar vacío.",
    "string.min": "El contenido debe tener como mínimo {#limit} caracteres.",
    "string.max": "El contenido debe tener como máximo {#limit} caracteres."
  }),
  fecha: Joi.date().optional(),
  user: Joi.string().hex().length(24).required(),
  post: Joi.string().hex().length(24).required()
});

module.exports = commentCreateSchema;