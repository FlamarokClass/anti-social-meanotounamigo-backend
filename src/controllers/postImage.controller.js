const { PostImage, Post } = require('../mongoSchemas');
const redisClient = require("../redis/redis");
const { deleteFileByUrl } = require('../utils');
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
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  const newImage = await PostImage.create({ url });
  await redisClient.del('postImages:all');
  res.status(201).json({
    message: 'Imagen creada con éxito',
    image: newImage
  });
};

const updatePostImageById = async (req, res) => {
  const image = req.postImage;
    const oldUrl = image.url;
    const newUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    image.url = newUrl;
    await image.save();

    await deleteFileByUrl(oldUrl);
    await redisClient.del('postImages:all');
    await redisClient.del(`postImage:${image._id}`);

    return res.status(200).json({
      message: 'Imagen actualizada con éxito',
      image
    });
};


const deletePostImageById = async (req, res) => {
  const image   = req.postImage;
    const imageId = image._id;
    const oldUrl  = image.url;

    await Post.updateMany(
      { imagenes: imageId },
      { $pull: { imagenes: imageId } }
    );

    await image.deleteOne();
    await deleteFileByUrl(oldUrl);

    await redisClient.del('postImages:all');
    await redisClient.del(`postImage:${imageId}`);
    await redisClient.del('posts:all');

    return res.status(200).json({
      message: 'Imagen eliminada y desvinculada correctamente'
    });
};

module.exports = {
  getPostImages,
  getPostImageById,
  createPostImage,
  updatePostImageById,
  deletePostImageById
};
