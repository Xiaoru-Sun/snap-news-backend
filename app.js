const express = require('express');
const app = express();
const { getTopics, getApi} = require("./controll/controller")


app.get('/api/topics', getTopics)

app.get('/api', getApi)

//route for handling all invalid route
app.get("*", (req, res, next) => {
    res.status(404).send({msg : "Not found"})
})


// app.use((err, req, res, next) => {
//     console.log(err)
//     if(err.statusCode && err.msg){
//         res.status(err.statusCode).send({msg: err.msg})
//     } else {
//         next(err);
//     }
// })

// app.use((err, req, res, next) => {
//     res.status(500).send()
// })



module.exports = app;