const { Comment } = require("../mongoSchemas");
const redisClient = require ("../redis/redis");
const ttl = parseInt(process.env.REDIS_TTL) || 60;

const getComments = async (_, res) => {
  const comments = await Comment.find({})
    .populate("user", "nickName")
    .populate("post", "descripcion");
  await redisClient.set("comments:all", JSON.stringify(comments), { EX: ttl });
  res.status(200).json(comments);
};

const getCommentById = async (req, res) => {
  const comment = req.comment;
  await comment.populate("user", "nickName");
  await comment.populate("post", "descripcion");
  await redisClient.set(`comment:${comment._id}`, JSON.stringify(comment), { EX: ttl });
  res.status(200).json(comment);
};

const createComment = async (req, res) => {
  const { contenido, fecha, user, post } = req.body;
  const fechaComentario = fecha ? new Date(fecha) : new Date();
  const nuevoComentario = await Comment.create({
    contenido,
    fecha: fechaComentario,
    user,
    post
  });
  await redisClient.del("comments:all");
  res.status(201).json(nuevoComentario);
};

const updateCommentById = async (req, res) => {
  const { contenido, fecha } = req.body;
  const comment = req.comment;
  comment.contenido = contenido;
  if (fecha) comment.fecha = new Date(fecha);
  await comment.save();
  await redisClient.del("comments:all");
  await redisClient.set(`comment:${comment._id}`, JSON.stringify(comment), { EX: ttl });
  res.status(200).json({ message: "Comentario actualizado" });
};

const deleteCommentById = async (req, res) => {
  await req.comment.deleteOne();
  await redisClient.del("comments:all");
  await redisClient.del(`comment:${req.comment._id}`);
  res.status(200).json({ message: "Comentario eliminado correctamente" });
};


module.exports = { 
    createComment,
    getComments,
    getCommentById,
    updateCommentById,
    deleteCommentById
 };