const topicsRouter = require("express").Router();
const { getTopics, postTopics } = require("../controll/controller")

topicsRouter.get("/", getTopics)

topicsRouter.post("/", postTopics)

module.exports = topicsRouter;