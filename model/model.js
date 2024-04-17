const db = require("../db/connection")
const format = require("pg-format");
const topics = require("../db/data/test-data/topics");
const testData = require("../db/data/test-data/index.js");
const { query } = require("express");

function fetchTopics(){
    return db.query(`SELECT * FROM topics;`).then(({rows}) => {
        return rows;
    })
}

function fetchArticleById(article_id){
    const sqlStr = `SELECT filtered.*, CAST (COUNT(comments.body) AS INT) as comment_count
    FROM (
        SELECT * FROM articles 
        WHERE article_id = $1) AS filtered
    LEFT JOIN comments ON comments
    .article_id = filtered.article_id
    GROUP by filtered.article_id, filtered.title, filtered.topic, filtered.author, filtered.body, filtered.created_at, filtered.votes, filtered.article_img_url;`
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

function insertCommentsByArticleId(article_id, username, body){

    const queryVals = [body];
    const validUserNames = testData.userData.map(user => user.username);
    if(!validUserNames.includes(username)){
        return Promise.reject({
            status: 404,
            msg : "Username is not found"
        })
    } else {
        queryVals.push(username)
    }
    queryVals.push(article_id)

    const sqlStr = format(`INSERT INTO %I
    (body, author, article_id)
    VALUES %L RETURNING *;`, "comments", [queryVals])

    return db.query(sqlStr).then(({rows}) => {
        return rows[0];
    })
}

function updateArticleById(article_id, inc_votes){
    const sqlStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`
    return db.query(sqlStr, [inc_votes, article_id]).then(({rows}) => {
        return rows[0]
    })

}

function deleteCommentById(comment_id){
    const sqlStr = 'DELETE FROM comments WHERE comment_id = $1 RETURNING *;'
    return db.query(sqlStr, [comment_id]).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Comment_id not found"
            })
        }
    })
}

function fetchUsers(){
    const sqlStr = format('SELECT * FROM %I;', "users")
    return db.query(sqlStr).then(({rows}) => {
        return rows;
    })
}

function fetchArticleByTopic(topic){
    const sqlStr = format('SELECT * FROM %I WHERE topic = $1;', "articles");
    return db.query(sqlStr, [topic]).then(({rows}) => {
        return rows;
    })
}

function doesTopicExist(topic){
    const sqlStr = format('SELECT * FROM %I WHERE slug = $1;', 'topics')
    return db.query(sqlStr, [topic]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Topic not found"
            })
        }
    })
}



module.exports = { fetchTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId, doesArticleExist, insertCommentsByArticleId, updateArticleById, deleteCommentById, fetchUsers, fetchArticleByTopic, doesTopicExist}