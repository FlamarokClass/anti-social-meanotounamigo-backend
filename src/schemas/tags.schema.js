const Joi = require('joi');

const tagSchema = Joi.object({
  nombre: Joi.string()
    .pattern(/^#[a-zA-Z0-9ñ-]+$/)
    .min(2)
    .max(30)
    .required()
    .messages({
      'any.required': 'La etiqueta es obligatoria.',
      'string.empty': 'La etiqueta no puede estar vacía.',
      'string.min': 'La etiqueta debe tener al menos {#limit} caracteres.',
      'string.max': 'La etiqueta debe tener como máximo {#limit} caracteres.',
      'string.pattern.base': 'La etiqueta debe comenzar con "#" y solo contener letras y números sin espacios.'
    })
});

module.exports = tagSchema;