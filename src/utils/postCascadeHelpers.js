const { PostImage, Comment } = require('../mongoSchemas');
const mongoose = require("mongoose");

const deleteAssociatedPostData = async (post) => {
  try {
    const validImageIds = post.imagenes.filter(id => mongoose.Types.ObjectId.isValid(id));
    console.log("Imágenes a eliminar:", validImageIds);
    await PostImage.deleteMany({ _id: { $in: validImageIds } });

    console.log("Comentarios a eliminar para el post:", post._id);
    await Comment.deleteMany({ post: post._id });

  } catch (error) {
    console.error("Error en deleteAssociatedPostData:", error);
    throw error;
  }
};

module.exports = { deleteAssociatedPostData };