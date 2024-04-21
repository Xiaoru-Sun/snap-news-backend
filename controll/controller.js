const { totalCount } = require("../db/connection")
const users = require("../db/data/test-data/users")
const { fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId, doesArticleExist, insertCommentsByArticleId, updateArticleById, deleteCommentById, fetchUsers, updateCommentById, insertArticles, insertTopics, deleteArticleById} = require("../model/model")
const fs = require("fs/promises")


function getTopics(req, res, next){
    fetchTopics().then((allTopics) => {
        res.status(200).send({topics : allTopics})
    })
}


function getApi(req, res, next){
    // return fs.readFile("./endpoints.json", "utf-8").then((fileContents) => {
    //     //console.log(fileContents)
    //     const parsedContents = JSON.parse(fileContents);
    //     res.status(200).send({endpoints : parsedContents})
    // }).catch(next)

    const endpoints = require("../endpoints.json")
    res.status(200).send({endpoints: endpoints})
}


function getArticleById(req, res, next){
    const {article_id} = req.params;
    fetchArticleById(article_id).then((requestedArticle) => {
        res.status(200).send({article: requestedArticle })
    })
    .catch(next)
}


function getArticles(req, res, next){
    const { topic, sort_by, order, limit, p } = req.query;
        fetchArticles(topic, sort_by, order, limit, p).then((articles) => {
            res.status(200).send({articles: articles})
        }).catch(next)
}



function getCommentsByArticleId(req, res, next){
    const {article_id} = req.params;
    const {limit, p} = req.query;
    //console.log(req.query)
    Promise.all([doesArticleExist(article_id), fetchCommentsByArticleId(article_id, limit, p)])
    .then(([_, comments]) => { 
        res.status(200).send({comments : comments})
    })
    .catch(next)
}


function postCommentsByArticleId(req, res, next){
    const { article_id } = req.params;
    const { username } = req.body;
    const { body } = req.body
    Promise.all([doesArticleExist(article_id), insertCommentsByArticleId(article_id, username, body)])
    .then(([_, newComment]) => {
        res.status(200).send({ postedComment: newComment })
    }).catch(next)
}

function patchArticleById(req, res, next){
    const {inc_votes} = req.body;
    const {article_id} = req.params;
    Promise.all([doesArticleExist(article_id), updateArticleById(article_id, inc_votes)]) 
    .then(([_, updatedArticle]) => {
        res.status(200).send({updatedArticle: updatedArticle})
    }).catch(next)

}

function removeCommentById(req, res, next){
    const {comment_id} = req.params;
    deleteCommentById(comment_id).then(()=> {
        res.status(204).end();
    }).catch(next)

}


function getUsers(req, res, next){
    const { username } = req.params;
    fetchUsers(username).then((users) => {
        res.status(200).send({users : users})
    }).catch(next)

}


function patchCommentById(req, res, next){
    const { inc_votes } = req.body;
    const { comment_id } = req.params;
    updateCommentById(comment_id, inc_votes).then((updatedComment) => {
        res.status(200).send({updatedComment: updatedComment})
    }).catch(next)
}

function postArticles(req, res, next){
    const {author, topic, body, title} = req.body;
    insertArticles(author, topic, body, title).then((addedArticle) => {
        res.status(200).send({addedArticle : addedArticle})
    }).catch(next)
}

function postTopics(req, res, next){
    const { slug, description } = req.body;
    insertTopics(slug, description).then((addedTopic) => {
        res.status(200).send({addedTopic : addedTopic})
    }).catch(next)
}

function removeArticleById(req, res, next){
    const { article_id } = req.params;
    deleteArticleById(article_id).then(() => {
        res.status(204).end()
    }).catch(next)
}

module.exports = { getTopics, getApi, getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchArticleById, removeCommentById, getUsers, patchCommentById, postArticles, postTopics, removeArticleById}