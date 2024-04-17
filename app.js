const express = require('express');
const app = express();
const { getTopics, getApi, getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchArticleById, removeCommentById, getUsers} = require("./controll/controller")

app.use(express.json())
app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentsByArticleId)

app.patch('/api/articles/:article_id', patchArticleById)

app.delete("/api/comments/:comment_id", removeCommentById)

app.get('/api/users', getUsers)

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
    if (err.code === "22P02"){
        res.status(400).send({msg: "Bad request"})
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    if (err.code === "23502"){
        res.status(400).send({msg: "Assignment of a Null value to a Not Null Column"})
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg : "Server error"})
})



module.exports = app;