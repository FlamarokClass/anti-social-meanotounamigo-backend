const { User } = require('../mongoSchemas/userSchema');


const existsUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verifica que el usuario a seguir exista
const existsUserToFollow = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({ error: "Usuario a seguir no encontrado" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Evita seguirse a uno mismo
const avoidAutoFollow = (req, res, next) => {
  if (req.params.id === req.params.userToFollowId) {
    return res.status(400).json({ error: "No podes seguirte" });
  }
  next();
};


const existsFollow = async (req, res, next) => {
    try {
        // Verificar primero que ambos usuarios existen
        const currentUser = await User.findById(req.params.id);
        if (!currentUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const userToFollow = await User.findById(req.params.userToFollowId);
        if (!userToFollow) {
            return res.status(404).json({ error: "Usuario a seguir no encontrado" });
        }

        // Verificar relación de seguimiento
        const isFollowing = currentUser.following.includes(userToFollow._id);
        
        if (req.method === 'POST') {
            if (isFollowing) {
                return res.status(400).json({ error: "Ya sigues a este usuario" });
            }
            if (req.params.id === req.params.userToFollowId) {
                return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
            }
        }
        
        if (req.method === 'DELETE' && !isFollowing) {
            return res.status(400).json({ error: "No sigues a este usuario" });
        }
        next();
    } catch (error) {
        res.status(500).json({ 
            error: "Error al verificar relación",
            details: error.message 
        });
    }
};


module.exports = { 
    existsUserToFollow, 
    avoidAutoFollow, 
    existsFollow, 
    existsUser 
};
