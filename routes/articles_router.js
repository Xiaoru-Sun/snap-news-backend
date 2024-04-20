const articlesRouter = require("express").Router();
const { getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchArticleById, postArticles} = require("../controll/controller");



articlesRouter.get("/", getArticles)

articlesRouter.get("/:article_id", getArticleById)

articlesRouter.get("/:article_id/comments", getCommentsByArticleId)

articlesRouter.post("/:article_id/comments", postCommentsByArticleId)

articlesRouter.patch("/:article_id", patchArticleById)

articlesRouter.post("/", postArticles)


module.exports = articlesRouter;