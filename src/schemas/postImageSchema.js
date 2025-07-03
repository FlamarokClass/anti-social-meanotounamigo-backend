const Joi = require('joi');

const postImageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    "any.required": "La URL de la imagen es obligatoria.",
    "string.uri": "La URL de la imagen debe ser válida."
  }),
});

module.exports = postImageSchema;
