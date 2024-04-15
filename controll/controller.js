const { app } = require("../app")
const { fetchTopics } = require("../model/model")


function getTopics(req, res, next){
    fetchTopics().then((allTopics) => {
        res.status(200).send(allTopics)
    })
}




module.exports = { getTopics }