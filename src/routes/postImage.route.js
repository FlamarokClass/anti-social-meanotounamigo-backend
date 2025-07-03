const { Router } = require('express');
const router = Router();
const { postImageController } = require('../controllers');
const { genericMiddleware } = require('../middlewares');
const { postImageSchema } = require('../schemas');
const { PostImage } = require('../mongoSchemas');
const { checkCache, deleteCache } = require("../middlewares/redis.middleware")

// CRUD
router.get('/', checkCache, postImageController.getPostImages);
router.get('/:id', checkCache, genericMiddleware.validId(), genericMiddleware.existsModelById(PostImage, "postImage"), postImageController.getPostImageById);
router.post('/', genericMiddleware.schemaValidator(postImageSchema), postImageController.createPostImage);
router.put('/:id', deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(PostImage, "postImage"), genericMiddleware.schemaValidator(postImageSchema), postImageController.updatePostImageById);
router.delete('/:id', deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(PostImage, "postImage"), postImageController.deletePostImageById);

module.exports = router;