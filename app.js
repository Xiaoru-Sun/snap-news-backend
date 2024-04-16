const express = require('express');
const app = express();
const { getTopics, getApi, getArticleById, getArticles} = require("./controll/controller")

app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

//route for handling all invalid route
app.get("*", (req, res, next) => {
    res.status(404).send({msg : "Not found"})
})


app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    if (err.code = "22P02"){
        res.status(400).send({msg: "Bad request"})
    } else {
        next(err);
    }
})


app.use((err, req, res, next) => {
    res.status(500).send({msg : "Server error"})
})



module.exports = app;