const { getUsers } = require("../controll/controller");
const users = require("../db/data/test-data/users");

const usersRouter = require("express").Router();

usersRouter.get('/:username?', getUsers);


module.exports = usersRouter;