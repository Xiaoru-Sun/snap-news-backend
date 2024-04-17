const { fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId, doesArticleExist, insertCommentsByArticleId, updateArticleById } = require("../model/model")
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
    fetchArticles().then((arrayOfArticles) => {
        res.status(200).send({articles : arrayOfArticles})
    })
    .catch(next)
}

function getCommentsByArticleId(req, res, next){
    const {article_id} = req.params;
    Promise.all([doesArticleExist(article_id), fetchCommentsByArticleId(article_id)])
    .then(([_, comments]) => { 
        res.status(200).send({comments : comments})
    })
    .catch(next)
}


function postCommentsByArticleId(req, res, next){
    const {article_id} = req.params;
    const {username} = req.body;
    const {body} = req.body
    insertCommentsByArticleId(article_id, username, body).then((newComment) => {
        res.status(200).send({postedComment: newComment})
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

module.exports = { getTopics, getApi, getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId, patchArticleById}