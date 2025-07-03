const Joi = require('joi');

const updatePostSchema = Joi.object({
  descripcion: Joi.string().min(1).max(2000).messages({
    "string.empty": "La descripción no puede estar vacía.",
    "string.min": "La descripción debe tener como mínimo {#limit} caracteres.",
    "string.max": "La descripción debe tener como máximo {#limit} caracteres.",
  }),

  fecha: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.pattern.base": "La fecha debe tener el formato YYYY-MM-DD."
    }),

  imagenes: Joi.array().items(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("ID de imagen inválido.")
  ).optional(),

  etiquetas: Joi.array().items(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("ID de etiqueta inválido.")
  ).optional()
});

module.exports = updatePostSchema;