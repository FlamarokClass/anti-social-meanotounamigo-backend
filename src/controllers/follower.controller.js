const { User } = require('../mongoSchemas');

const followUser = async (req, res) => {
  try {
    const currentUserId = req.params.id;
    const userToFollowId = req.params.userToFollowId;

    await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: userToFollowId } }, //  evita duplicados
      { new: true }
    );

    await User.findByIdAndUpdate(
      userToFollowId,
      { $addToSet: { followers: currentUserId } },
      { new: true }
    );

    const userToFollow = await User.findById(userToFollowId);
    
    res.status(200).json({ 
      message: `Ahora sigues a ${userToFollow.nickname}` 
    });

  } catch (error) {
    console.error('Error en followUser:', error);
    res.status(500).json({ 
      message: 'Error al seguir el usuario'
    });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.params.id;
    const userToUnfollowId = req.params.userToFollowId;

    await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: userToUnfollowId } }
    );

    await User.findByIdAndUpdate(
      userToUnfollowId,
      { $pull: { followers: currentUserId } }
    );

    const userToUnfollow = await User.findById(userToUnfollowId);
    
    res.status(200).json({
      message: `Has dejado de seguir a ${userToUnfollow.nickname}`,
    });

  } catch (error) {
    console.error('Error en unfollowUser:', error);
    res.status(500).json({
      message: 'Error al dejar de seguir al usuario',
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select('followers')
      .populate('followers', 'nickname ');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      followers: user.followers
    });

  } catch (error) {
    console.error('Error en getFollowers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener seguidores',
    });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select('following')
      .populate('following', 'nickname')

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      following: user.following
    });

  } catch (error) {
    console.error('Error en getFollowing:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener seguidos',
    });
  }
};


module.exports = { 
    followUser, 
    unfollowUser, 
    getFollowers, 
    getFollowing 
};
