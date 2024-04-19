const commentsRouter = require("express").Router();
const { removeCommentById } = require("../controll/controller")

commentsRouter.delete("/:comment_id", removeCommentById)

module.exports = commentsRouter;