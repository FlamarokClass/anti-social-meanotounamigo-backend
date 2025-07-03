const  { Tag, Post } = require('../mongoSchemas')
const redisClient = require("../redis/redis");
const ttl = parseInt(process.env.REDIS_TTL) || 60;

const getTags = async (_, res) => {
  const tags = await Tag.find({});
  await redisClient.set("tags:all", JSON.stringify(tags), { EX: ttl });
  res.status(200).json(tags);
};

const getTagById = async (req, res) => {
  const tag = req.tag;
  await redisClient.set(`tag:${tag._id}`, JSON.stringify(tag), { EX: ttl });
  res.status(200).json(tag);
};

const createTag = async (req, res) => {
  const newTag = new Tag(req.body);
  await newTag.save();
  res.status(201).json(newTag);
};

const updateTagById = async (req, res) => {
  const { nombre } = req.body;
  const tag = req.tag;
  tag.nombre = nombre;
  await tag.save();

  await redisClient.del("tags:all");
  await redisClient.set(`tag:${tag._id}`, JSON.stringify(tag), { EX: ttl });

  res.status(200).json({ message: 'Etiqueta actualizada correctamente', tag });
};

const deleteTagById = async (req, res) => {
  const tagId = req.tag._id;
  await req.tag.deleteOne();

  await redisClient.del("tags:all");
  await redisClient.del(`tag:${tagId}`);

  res.status(200).json({ message: "Etiqueta eliminada correctamente" });
};

const getPostsByTagId = async (req, res) => {
  const tag = req.tag;
  const posts = await Post.find({ etiquetas: tag._id });

  await redisClient.set(`posts:byTag:${tag._id}`, JSON.stringify(posts), { EX: ttl });
  res.status(200).json(posts);
};


module.exports = { 
    getTags, 
    getTagById, 
    createTag, 
    updateTagById, 
    deleteTagById,
    getPostsByTagId
}