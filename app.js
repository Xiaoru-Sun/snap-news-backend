const express = require('express');
const app = express();
const { getTopics } = require("./controll/controller")


app.use(express.json());

app.get('/api/topics', getTopics)

module.exports = app;