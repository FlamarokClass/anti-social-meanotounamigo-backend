const { Router } = require("express");
const router = Router();
const { userController, followerController} = require("../controllers");
const { genericMiddleware, followerMiddleware} = require("../middlewares");
const { userSchema} = require('../schemas');
const { User } = require("../mongoSchemas");
const { checkCache, deleteCache } = require("../middlewares/redis.middleware")

//CRUD
router.get("/", checkCache, userController.getUsers);
router.get("/:id", checkCache, genericMiddleware.validId(), genericMiddleware.existsModelById(User, "user"), userController.getUserById);
router.post("/", genericMiddleware.schemaValidator(userSchema), userController.createUser);
router.put("/:id", deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(User, "user"), genericMiddleware.schemaValidator(userSchema), userController.updateUserById);
router.delete("/:id", deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(User, "user"), userController.deleteUserById);


// Un usuario puede manejar seguidores y seguidos
router.post("/:id/follow/:userToFollowId",genericMiddleware.validId,followerMiddleware.existsUser , followerMiddleware.existsUserToFollow, followerMiddleware.avoidAutoFollow, followerMiddleware.existsFollow,followerController.followUser);
router.delete('/:id/unfollow/:userToFollowId', genericMiddleware.validId, followerMiddleware.existsUser ,  followerMiddleware.existsUserToFollow, followerMiddleware.existsFollow, followerController.unfollowUser);
router.get('/:id/followers', genericMiddleware.validId, followerMiddleware.existsUser, followerController.getFollowers); // seguidores
router.get('/:id/following', genericMiddleware.validId, followerMiddleware.existsUser , followerController.getFollowing);  // seguidos

module.exports = router;
