const { Post, PostImage } = require('../mongoSchemas');
const mongoose = require('mongoose');

const preventDuplicateImages = async (req, res, next) => {
  const newIds = req.body.imageIds.map(id => id.toString());
  const existing = req.post.imagenes.map(id => id.toString());

  const duplicates = newIds.filter(id => existing.includes(id));
  if (duplicates.length > 0) {
    return res.status(400).json({ message: "Algunas imágenes ya están asociadas al post", duplicates });
  }
  next();
};

const requireExistingImage = async (req, res, next) => {
  const imageIds = req.body.imageIds.map(id => id.toString());
  const current = req.post.imagenes.map(id => id.toString());

  const nonexistent = imageIds.filter(id => !current.includes(id));
  if (nonexistent.length > 0) {
    return res.status(400).json({
      message: "Algunas imágenes no están asociadas al post y no pueden eliminarse",
      invalidIds: nonexistent
    });
  }
  next();
};

const preventImageReuseAcrossPosts = async (req, res, next) => {
  const { imageIds } = req.body;
  const otherPostsUsing = await Post.find({
    _id: { $ne: req.post._id },
    imagenes: { $in: imageIds }
  });

  if (otherPostsUsing.length > 0) {
    return res.status(400).json({
      message: "Una o más imágenes ya están usadas en otro post",
      conflictingPostIds: otherPostsUsing.map(p => p._id)
    });
  }

  next();
};

const loadPostImage = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const img = await PostImage.findById(id);
    if (!img) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }
    req.postImage = img;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {preventDuplicateImages, requireExistingImage, preventImageReuseAcrossPosts, loadPostImage };