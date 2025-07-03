const { User } = require('../mongoSchemas')
const { deleteUserRelatedData } = require('../utils');
const redisClient = require("../redis/redis");
const ttl = parseInt(process.env.REDIS_TTL) || 60;

//CRUD
const getUsers = async (_, res) => {
  const users = await User.find({});
  await redisClient.set("users:all", JSON.stringify(users), { EX: ttl });
  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const user = req.user;
  await redisClient.set(`user:${user._id}`, JSON.stringify(user), { EX: ttl });
  res.status(200).json(user);
};

const createUser = async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
};

const updateUserById = async (req, res) => {
  const { nickname, email } = req.body;
  const user = req.user;

  if (nickname !== undefined) user.nickname = nickname;
  if (email !== undefined) user.email = email;

  await user.save();
  await redisClient.del("users:all");
  await redisClient.set(`user:${user._id}`, JSON.stringify(user), { EX: ttl });

  res.status(200).json({ message: "Usuario actualizado correctamente", user });
};

const deleteUserById = async (req, res) => {
  try {
    await deleteUserRelatedData(req.user._id);
    await req.user.deleteOne();

    await redisClient.del(`user:${req.user._id}`);
    await redisClient.del("users:all");

    res.status(200).json({ message: "Usuario y sus datos asociados eliminados correctamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "No se pudo eliminar el usuario y sus datos relacionados" });
  }
};


module.exports = {
    getUsers, 
    getUserById, 
    createUser, 
    updateUserById, 
    deleteUserById,
}