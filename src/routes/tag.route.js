const { Router }= require('express')
const router = Router()
const { tagController} = require('../controllers');
const { genericMiddleware } = require("../middlewares");
const { tagSchema }  = require('../schemas');
const { Tag } = require("../mongoSchemas");
const { checkCache, deleteCache } = require("../middlewares/redis.middleware")

router.get("/", checkCache, tagController.getTags);
router.get("/:id/post", checkCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Tag, "tag"), tagController.getPostsByTagId);
router.get("/:id", checkCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Tag, "tag"), tagController.getTagById);
router.post("/", genericMiddleware.schemaValidator(tagSchema), tagController.createTag);
router.put("/:id", deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Tag, "tag"), genericMiddleware.schemaValidator(tagSchema), tagController.updateTagById);
router.delete("/:id", deleteCache, genericMiddleware.validId(), genericMiddleware.existsModelById(Tag, "tag"), tagController.deleteTagById);

module.exports = router;