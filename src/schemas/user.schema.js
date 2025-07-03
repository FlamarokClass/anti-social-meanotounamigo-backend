const Joi = require('joi');

const userSchema = Joi.object({
  nickname: Joi.string()
  .required()
  .min(3).
  max(20).
  alphanum().
  pattern(/^[a-zA-Z0-9_-]+$/). // Expresión regular para que controle que permite solo letras, números o guiones.
  messages({
    "any.required" : "El nickname es obligatorio.",
    "string.empty": "El nickname no puede estar vacío.",
    "string.min": "El nickname debe tener como mínimo {#limit} caracteres.",
    "string.max": "El nickname debe tener como máximo {#limit} caracteres.",
    "string.pattern.base": "El nickname solo permite letras, números o guiones."
    }),

  email: Joi.string().
  required().
  email().
  trim(). // Evita espacios
  lowercase().
  messages({
    "any.required": "El email es obligatorio.",
    "string.empty": "El email no puede estar vacío.",
    "string.email": "El email debe ser válido."
  }),
  password: Joi.string().
  required().
  messages({
    "any.required": "El password es obligatorio.",
    "string.empty": "El password no puede estar vacío."
  })
});

module.exports = userSchema;