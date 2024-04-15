const express = require('express');
const app = express();
const { getTopics} = require("./controll/controller")


app.use(express.json());

app.get('/api/topics', getTopics)

//route for handling all invalid route
app.get("*", (req, res, next) => {
    res.status(404).send({msg : "Not found"})
})

app.use((err, req, res, next) => {
    if(err.statusCode && err.msg){
        res.status(err.statusCode).send({msg: err.msg})
    } else {
        next(err);
    }
})



module.exports = app;