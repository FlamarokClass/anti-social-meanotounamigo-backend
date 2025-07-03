const { Post, Comment } = require('../mongoSchemas');
const { seisMesesAtras, deleteAssociatedPostData } = require("../utils");
const redisClient = require("../redis/redis");
const ttl = parseInt(process.env.REDIS_TTL) || 60;

const getPosts = async (_, res) => {
  const posts = await Post.find({});
  await redisClient.set("posts:all", JSON.stringify(posts), { EX: ttl });
  res.status(200).json(posts);
};

// Devuelve toda la info completa del post con comentarios recientes (6 meses)
const getPostWithAllInfo = async (req, res) => {
  const comentarios = await Comment.find({
    post: req.post._id,
    fecha: { $gte: seisMesesAtras() }
  }).populate("user", "nombre");

  await req.post.populate("user", "nombre email");
  await req.post.populate("etiquetas", "nombre");
  await req.post.populate("imagenes");

  const postConComentarios = req.post.toObject();
  postConComentarios.comentarios = comentarios;

  await redisClient.set(`post:full:${req.post._id}`, JSON.stringify(postConComentarios), { EX: ttl });
  res.status(200).json(postConComentarios);
};

const getPostById = async (req, res) => {
  const post = req.post;
  await redisClient.set(`post:${post._id}`, JSON.stringify(post), { EX: ttl });
  res.status(200).json(post);
};

const createPost = async (req, res) => {
  const postData = {
    ...req.body,
    fecha: req.body.fecha || new Date().toISOString().slice(0, 10)
  };
  const newPost = await Post.create(postData);
  await redisClient.del("posts:all");
  res.status(201).json(newPost);
};

const updatePostById = async (req, res) => {
  const { descripcion, imagenes, etiquetas, fecha } = req.body;
  const post = req.post;

  if (descripcion !== undefined) post.descripcion = descripcion;
  if (etiquetas !== undefined) post.etiquetas = etiquetas;
  if (fecha !== undefined) post.fecha = fecha;

  await post.save();
  await redisClient.del("posts:all");
  await redisClient.set(`post:${post._id}`, JSON.stringify(post), { EX: ttl });
  res.status(200).json({ message: "El post fue actualizado correctamente", post });
};

const deletePostById = async (req, res) => {
  const post = req.post;
  await deleteAssociatedPostData(post);
  await post.deleteOne();
  await redisClient.del("posts:all");
  await redisClient.del(`post:${post._id}`);
  await redisClient.del(`post:full:${post._id}`);
  res.status(200).json({ message: "Post y datos asociados eliminados correctamente" });
};

const assignTagToPost = async (req, res) => {
  req.post.etiquetas.push(req.body.tagId);
  await req.post.save();
  await redisClient.del("posts:all");
  await redisClient.set(`post:${req.post._id}`, JSON.stringify(req.post), { EX: ttl });
  res.status(200).json({ message: "Etiqueta agregada al post", post: req.post });
};

const deleteTagFromPost = async (req, res) => {
  req.post.etiquetas = req.post.etiquetas.filter(
    id => id.toString() !== req.body.tagId
  );
  await req.post.save();
  await redisClient.del("posts:all");
  await redisClient.set(`post:${req.post._id}`, JSON.stringify(req.post), { EX: ttl });
  res.status(200).json({ message: "Etiqueta eliminada del post", post: req.post });
};

const assignImagesToPost = async (req, res) => {
  const { imageIds } = req.body;
  req.post.imagenes.push(...imageIds);
  await req.post.save();
  await redisClient.del("posts:all");
  await redisClient.set(`post:${req.post._id}`, JSON.stringify(req.post), { EX: ttl });
  res.status(200).json({
    message: "Imágenes asociadas correctamente al post",
    post: req.post,
  });
};

const deleteImagesFromPost = async (req, res) => {
  const { imageIds } = req.body;
  req.post.imagenes = req.post.imagenes.filter(
    id => !imageIds.includes(id.toString())
  );
  await req.post.save();
  await redisClient.del("posts:all");
  await redisClient.set(`post:${req.post._id}`, JSON.stringify(req.post), { EX: ttl });
  res.status(200).json({
    message: "Imágenes eliminadas del post correctamente",
    post: req.post,
  });
};


module.exports = {
  getPosts,
  getPostWithAllInfo,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  assignTagToPost,
  deleteTagFromPost,
  assignImagesToPost,
  deleteImagesFromPost,
};
