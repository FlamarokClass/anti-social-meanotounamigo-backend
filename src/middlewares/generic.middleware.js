const mongoose = require("mongoose");

const existsModelById = (modelo, nombreEnReq = "model") => {
  return async (req, res, next) => {
    const id = req.params.id;
    const data = await modelo.findById(id);
    if (!data) {
      return res.status(404).json({ message: `El ID ${id} no se encuentra registrado` });
    }
    req[nombreEnReq] = data;
    next();
  };
};
  
const validId = (paramName = "id") => (req, res, next) => {
  const id = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: `El ID '${paramName}' no es válido` });
  }
  next();
};
  
const schemaValidator = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errores = error.details.map((e) => ({
          atributo: e.path[0],
          mensaje: e.message,
          tipoError: e.type,
        }));
        return res.status(400).json({ errores });
      }
      next();
    };
  };
  
  module.exports = { 
    existsModelById, 
    validId, 
    schemaValidator 
};