const client = require("../redis/redis");

const checkCache = async (req, res, next) => {
  let prefijo;

  // Determinamos el tipo de recurso según la ruta base
  if (req.baseUrl.includes('/user')) prefijo = 'user';
  else if (req.baseUrl.includes('/post-image')) prefijo = 'postImage';
  else if (req.baseUrl.includes('/post')) prefijo = 'post';
  else if (req.baseUrl.includes('/comment')) prefijo = 'comment';
  else if (req.baseUrl.includes('/tag')) prefijo = 'tag';
  else return res.status(400).json({ error: `Ruta no reconocida para invalidación de cache: ${req.baseUrl}` });

  const key = req.params.id ? `${prefijo}:${req.params.id}` : `${prefijo}s:all`;

  const data = await client.get(key);

  if (data) {
    console.log(`✅ CACHE HIT para la clave ${key}`);
    return res.status(200).json(JSON.parse(data));
  }

  console.log(`❌ CACHE MISS para la clave ${key}`);
  next();
};

const deleteCache = async (req, res, next) => {
  let prefijo;

  // Determinamos el tipo de recurso según la ruta base
  if (req.baseUrl.includes('/user')) prefijo = 'user';
  else if (req.baseUrl.includes('/post-image')) prefijo = 'postImage';
  else if (req.baseUrl.includes('/post')) prefijo = 'post';
  else if (req.baseUrl.includes('/comment')) prefijo = 'comment';
  else if (req.baseUrl.includes('/tag')) prefijo = 'tag';
  else return res.status(400).json({ error: `Ruta no reconocida para invalidación de cache: ${req.baseUrl}` });

  const key = req.params.id ? `${prefijo}:${req.params.id}` : `${prefijo}s:all`;

  const exists = await client.exists(key);
  if (exists) {
    await client.del(key);
    console.log(`🗑️  CACHE DELETE para la clave ${key}`);
  }
  next();
};

module.exports = { checkCache, deleteCache };
