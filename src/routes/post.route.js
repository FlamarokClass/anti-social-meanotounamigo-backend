const { Router } = require ('express');
const router = Router();
const { postController } = require('../controllers');
const { genericMiddleware, postTagMiddleware, postImageMiddleware } = require('../middlewares');
const { postSchema, postUpdateSchema, tagAssignmentSchema, imageAssigmentSchema } = require('../schemas');
const { Post } = require('../mongoSchemas');
const { checkCache, deleteCache } = require("../middlewares/redis.middleware")

// CRUD
router.get('/', checkCache, postController.getPosts);
router.get('/:id', checkCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Post, "post"), postController.getPostById);
router.get('/:id/full', checkCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Post, "post"), postController.getPostWithAllInfo); 
router.post("/", genericMiddleware.schemaValidator(postSchema), postController.createPost);
router.put('/:id', deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Post, "post"), genericMiddleware.schemaValidator(postUpdateSchema), postController.updatePostById);
router.delete('/:id', deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Post, "post"), postController.deletePostById);

// Para asignar y eliminar etiquetas de posts
router.post("/:id/tag", genericMiddleware.validId(), genericMiddleware.existsModelById(Post, "post"), genericMiddleware.schemaValidator(tagAssignmentSchema), postTagMiddleware.preventDuplicateTag, postController.assignTagToPost);
router.delete("/:id/tag", deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Post, "post"), genericMiddleware.schemaValidator(tagAssignmentSchema), postTagMiddleware.requireExistingTag, postController.deleteTagFromPost);

// Para subir o eliminar imagenes
router.post("/:id/images", genericMiddleware.validId(), genericMiddleware.existsModelById(Post, "post"), genericMiddleware.schemaValidator(imageAssigmentSchema), postImageMiddleware.preventDuplicateImages, postImageMiddleware.preventImageReuseAcrossPosts, postController.assignImagesToPost);
router.delete("/:id/images", deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Post, "post"), genericMiddleware.schemaValidator(imageAssigmentSchema), postImageMiddleware.requireExistingImage, postController.deleteImagesFromPost);

module.exports = router;