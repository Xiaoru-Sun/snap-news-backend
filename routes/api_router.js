const apiRouter = require("express").Router();
const { getApi } = require("../controll/controller")

apiRouter.get('/', getApi)

module.exports = apiRouter;