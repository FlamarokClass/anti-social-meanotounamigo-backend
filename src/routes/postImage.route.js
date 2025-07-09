const { Router } = require('express');
const router = Router();
const { postImageController } = require('../controllers');
const { genericMiddleware, upload, postImageMiddleware, requireFile } = require('../middlewares');
const { checkCache, deleteCache } = require('../middlewares/redis.middleware');

router.get('/', checkCache, postImageController.getPostImages);
router.get('/:id', genericMiddleware.validId(), postImageMiddleware.loadPostImage, checkCache, postImageController.getPostImageById);
router.post('/', upload.single('image'), requireFile('image'), deleteCache, postImageController.createPostImage);
router.put('/:id', genericMiddleware.validId(), postImageMiddleware.loadPostImage, upload.single('image'), requireFile('image'), deleteCache, postImageController.updatePostImageById);
router.delete('/:id', genericMiddleware.validId(), postImageMiddleware.loadPostImage, deleteCache, postImageController.deletePostImageById);

module.exports = router;