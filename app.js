const express = require('express');
const app = express();
const apiRouter = require('./routes/api_router.js');


app.use(express.json())

app.use('/api', apiRouter)

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
    console.log(err)
    res.status(500).send({msg : "Server error"})
})



module.exports = app;