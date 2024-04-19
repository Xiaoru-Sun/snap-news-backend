const { getUsers } = require("../controll/controller");

const usersRouter = require("express").Router();

usersRouter.get('/', getUsers);

module.exports = usersRouter;