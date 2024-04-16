const db = require("../db/connection")

function fetchTopics(){
    return db.query(`SELECT * FROM topics;`).then(({rows}) => {
        return rows;
    })
}

function fetchArticleById(article_id){
    const sqlStr = `SELECT * FROM articles WHERE article_id=$1;`
    return db.query(sqlStr, [article_id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({
                status : 404,
                msg: "Not found, article_id does not exist"
            })
        }
        return rows[0];
    })
}


function fetchArticles(){
    const sqlStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST (COUNT(comments.body) AS INT) as comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP by articles.article_id
    ORDER BY created_at DESC;`

    return db.query(sqlStr).then(({rows}) => {
        return rows;
    })
}

function fetchCommentsByArticleId(article_id){
    const sqlStr = `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`
    return db.query(sqlStr, [article_id]).then(({rows}) => {
        return rows;
    })
}

function doesArticleExist(article_id){
    const sqlStr = `SELECT * FROM articles WHERE article_id = $1;`
    return db.query(sqlStr, [article_id]).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                "status": 404,
                "msg": "Article_id not found!"
            })
        }
    })
}

module.exports = { fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId, doesArticleExist }