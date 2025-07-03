const preventDuplicateTag = (req, res, next) => {
  const { tagId } = req.body;
  const post = req.post;

  const exists = post.etiquetas.some(id => id.toString() === tagId);
  if (exists) {
    return res.status(400).json({ message: "El post ya contiene esa etiqueta" });
  }

  next();
};

const requireExistingTag = (req, res, next) => {
  const { tagId } = req.body;
  const post = req.post;

  const hasTag = post.etiquetas.some(id => id.toString() === tagId);
  if (!hasTag) {
    return res.status(404).json({ message: "El post no contiene esa etiqueta" });
  }

  next();
};

module.exports = {preventDuplicateTag, requireExistingTag };