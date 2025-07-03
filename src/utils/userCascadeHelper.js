const { Post, Comment, PostImage } = require('../mongoSchemas');

const deleteUserRelatedData = async (userId) => {
  try {
    // 1. Obtener todos los posts del usuario
    const posts = await Post.find({ user: userId });
    const postIds = posts.map(post => post._id);
    // 2. Juntar todos los IDs de imágenes referenciadas
    const imageIds = posts.flatMap(post => post.imagenes);
    // 3. Borrar imágenes, comentarios y posts
    await PostImage.deleteMany({ _id: { $in: imageIds } });
    await Comment.deleteMany({ user: userId });
    await Post.deleteMany({ _id: { $in: postIds } });
  } catch (err) {
    console.error("Error al eliminar datos relacionados al usuario:", err);
    throw err;
  }
};

module.exports = { deleteUserRelatedData };