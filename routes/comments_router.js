const commentsRouter = require("express").Router();
const { removeCommentById, patchCommentById } = require("../controll/controller")

commentsRouter.delete("/:comment_id", removeCommentById)

commentsRouter.patch("/:comment_id", patchCommentById)

module.exports = commentsRouter;