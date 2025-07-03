const { PostImage, Post } = require('../mongoSchemas');
const redisClient = require("../redis/redis");
const ttl = parseInt(process.env.REDIS_TTL) || 60;

const getPostImages = async (_, res) => {
  const postImages = await PostImage.find({});
  await redisClient.set("postImages:all", JSON.stringify(postImages), { EX: ttl });
  res.status(200).json(postImages);
};

const getPostImageById = async (req, res) => {
  const postImage = req.postImage;
  await redisClient.set(`postImage:${postImage._id}`, JSON.stringify(postImage), { EX: ttl });
  res.status(200).json(postImage);
};

const createPostImage = async (req, res) => {
  const newImage = await PostImage.create({ url: req.body.url });
  await redisClient.del("postImages:all");
  res.status(201).json({ message: "Imagen creada con éxito", image: newImage });
};

const updatePostImageById = async (req, res) => {
  const { url } = req.body;
  const postImage = req.postImage;
  postImage.url = url;
  await postImage.save();

  await redisClient.del("postImages:all");
  await redisClient.set(`postImage:${postImage._id}`, JSON.stringify(postImage), { EX: ttl });

  res.status(200).json({ message: 'La imagen fue actualizada' });
};

const deletePostImageById = async (req, res) => {
  const imageId = req.postImage._id;
  // Buscar post que tenga la imagen
  const post = await Post.findOne({ imagenes: imageId });
  if (post) {
    post.imagenes.pull(imageId); // elimina el ID del array
    await post.save();

    await redisClient.del(`post:${post._id}`);
    await redisClient.del(`post:full:${post._id}`);
  }
  // Eliminar la imagen
  await req.postImage.deleteOne();
  // Limpiar caché de imágenes
  await redisClient.del("postImages:all");
  await redisClient.del(`postImage:${imageId}`);
  res.status(200).json({ message: 'Imagen eliminada y desvinculada correctamente del post' });
};

module.exports = {
  getPostImages,
  getPostImageById,
  createPostImage,
  updatePostImageById,
  deletePostImageById,
};