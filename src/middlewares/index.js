const genericMiddleware = require("./generic.middleware");
const followerMiddleware = require("./follower.middleware");
const postTagMiddleware = require("./postTag.middleware");
const postImageMiddleware = require("./postImageMiddleware");

module.exports = { 
    genericMiddleware, 
    followerMiddleware, 
    postTagMiddleware ,
    postImageMiddleware
};