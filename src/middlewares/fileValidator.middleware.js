function requireFile(fieldName) {
  return (req, res, next) => {
    if (!req.file && !(req.files && req.files.length)) {
      return res
        .status(400)
        .json({ message: `Se requiere un archivo en '${fieldName}'` });
    }
    next();
  };
}

module.exports = requireFile;