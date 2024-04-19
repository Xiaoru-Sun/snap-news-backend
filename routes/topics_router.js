const topicsRouter = require("express").Router();
const { getTopics } = require("../controll/controller")

topicsRouter.get("/", getTopics)

module.exports = topicsRouter;