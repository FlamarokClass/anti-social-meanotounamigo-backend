const genericMiddleware = require("./generic.middleware");
const followerMiddleware = require("./follower.middleware");
const postTagMiddleware = require("./postTag.middleware");
const postImageMiddleware = require("./postImageMiddleware");
const upload = require("./upload"); 
const requireFile = require("./fileValidator.middleware");

module.exports = { 
    genericMiddleware, 
    followerMiddleware, 
    postTagMiddleware ,
    postImageMiddleware,
    upload,
    requireFile
};