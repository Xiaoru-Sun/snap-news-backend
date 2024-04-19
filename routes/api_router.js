const apiRouter = require("express").Router();
const { getApi } = require("../controll/controller");
const usersRouter = require("./users_router");
const topicsRouter = require("./topics_router");
const commentsRouter = require("./comments_router");
const articlesRouter = require("./articles_router");

apiRouter.get("/", getApi)

apiRouter.use("/users", usersRouter)

apiRouter.use("/topics", topicsRouter)

apiRouter.use("/comments", commentsRouter)

apiRouter.use("/articles", articlesRouter)

module.exports = apiRouter;