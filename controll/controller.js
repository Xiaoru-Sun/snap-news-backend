const { fetchTopics, fetchArticleById, fetchArticles } = require("../model/model")
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



module.exports = { getTopics, getApi, getArticleById, getArticles }