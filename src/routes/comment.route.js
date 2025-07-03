const { Router } = require("express");
const router = Router();
const { Comment } = require('../mongoSchemas');
const { commentController } = require("../controllers");
const { commentCreateSchema, commentUpdateSchema } = require('../schemas');
const { genericMiddleware } = require("../middlewares");
const { checkCache, deleteCache } = require("../middlewares/redis.middleware")

// CRUD
router.post("/", genericMiddleware.schemaValidator(commentCreateSchema), commentController.createComment);
router.get("/", checkCache, commentController.getComments);
router.get("/:id", checkCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Comment, "comment"), commentController.getCommentById);
router.put("/:id", deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Comment, "comment"), genericMiddleware.schemaValidator(commentUpdateSchema), commentController.updateCommentById)
router.delete("/:id", deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Comment, "comment"), commentController.deleteCommentById);

module.exports = router;