const { fetchTopics, fetchArticleById } = require("../model/model")
const fs = require("fs/promises")


function getTopics(req, res, next){
    fetchTopics().then((allTopics) => {
        res.status(200).send({topics : allTopics})
    })
}


function getApi(req, res, next){
    return fs.readFile("./endpoints.json", "utf-8").then((fileContents) => {
        //console.log(fileContents)
        const parsedContents = JSON.parse(fileContents);
        res.status(200).send({endpoints : parsedContents})
    }).catch(next)
}


function getArticleById(req, res, next){
    const {article_id} = req.params;
    fetchArticleById(article_id).then((requestedArticle) => {
        res.status(200).send({article: requestedArticle })
    })
    .catch(next)
}



module.exports = { getTopics, getApi, getArticleById }