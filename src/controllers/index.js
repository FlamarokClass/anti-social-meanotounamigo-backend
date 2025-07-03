const userController = require("./user.controller");
const postController = require("./post.controller");
const postImageController = require("./postImage.controller");
const commentController = require("./comment.controller")
const tagController = require("./tag.controller");
const followerController = require("./follower.controller")

module.exports = { 
    userController, 
    postController, 
    postImageController, 
    commentController, 
    tagController, 
    followerController
};