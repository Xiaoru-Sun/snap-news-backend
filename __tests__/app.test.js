const app = require("../app")
const seed = require("../db/seeds/seed.js")
const testData = require("../db/data/test-data/index.js")
const db = require("../db/connection.js")
const request = require("supertest")
const requiredEndpoints = require("../endpoints.json")


afterAll(() => {
    return db.end()
})
beforeAll(() => {
    return seed(testData)
})

describe("/api/topics", () => {
//requesting all topics, happy path
    test("Respond with an array of topic objects, each of which should slug and description property", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body})=> {
            const allTopics = body.topics;
            expect(allTopics.length).toBe(3);
            allTopics.forEach(topic => {
                expect(typeof topic.slug).toBe("string");
                expect(typeof topic.description).toBe("string");
            })
        })
    })
//requesting all topics sending invalid route
    test("Respond with 404 error", () => {
        return request(app)
        .get("/api/cats")
        .expect(404)
        .then(({body})=> {
            const {msg} = body
            expect(msg).toBe("Not found")
        })
    })
})

describe("getApi", () => {
    test("Respond with an object describing all the available endpoints on your API, and each key has description, queries, exampleResponse keys", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            const {endpoints} = body;
            expect(endpoints).toEqual(requiredEndpoints)
            // Object.keys(endpoints).forEach( (key) => {
            //     expect(typeof endpoints[key]["description"]).toBe("string");
            //     expect(Array.isArray(endpoints[key]["queries"])).toBe(true);
            //     expect(endpoints[key]["exampleResponse"]).not.toBe("null");
            //     expect(endpoints[key]["exampleResponse"].constructor === Object).toBe(true)
            // })
        })
    })
})

describe("getArticleById", () => {
    test("Respond with an object of the specic article when sending a valid article_id", () => {
        return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then(({body}) => {
            const { article } = body;
            expect(article.article_id).toBe(4);
        })
    })

    test("Respond with 404 error when sending a valid but non-existent id ", () => {
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Not found, article_id does not exist");
        })
    })

    test("Respond with 400 error when sending an invalid id", () => {
        return request(app)
        .get("/api/articles/newarticle")
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
        })
    })
})

describe("GET/api/articles", () => {
    test("Respond with an array of articles, each of which contains all the keys", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(testData.articleData.length)
            articles.forEach((article) => {
                expect(typeof article.article_id).toBe("number");
                expect(typeof article.author).toBe("string");
                expect(typeof article.title).toBe("string");
                expect(typeof article.topic).toBe("string");
                expect(typeof article.created_at).toBe("string")
                expect(typeof article.votes).toBe("number");
                expect(typeof article.article_img_url).toBe("string");
                expect(typeof article.comment_count).toBe("number");
                expect(Object.keys(articles).includes("body")).toBe(false)

            })
        })
    })

    test("Respond with an array of articles that is sorted by date in descending order", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", { descending: true })
        })
    })
})


describe("GET/api/articles/:article_id/comments", () => {
//Both User-provided article_id and its comments are existent
    test("Respond with an array of comments sorted by created_at in DESC order, and each comment should have all the keys", () => {
        return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({body}) => {
            const { comments } = body;
            expect(comments.length).toBe(testData.commentData.filter(comment => comment.article_id === 9).length);
            expect(comments).toBeSortedBy("created_at", {descending: true})
            comments.forEach(comment => {
                expect(typeof comment.comment_id).toBe("number");
                expect(typeof comment.votes).toBe("number");
                expect(typeof comment.created_at).toBe("string");
                expect(typeof comment.author).toBe("string");
                expect(typeof comment.body).toBe("string");
                expect(typeof comment.article_id).toBe("number");
            })
        })
    })

//User-provided article_id exists but comments are non-existent
    test("Respond with an empty array when the given article has zero comments", () => {
        return request(app)
        .get("/api/articles/8/comments")
        .expect(200)
        .then(({body}) => {
            const { comments } = body;
            expect(comments.length).toBe(0);
        })

    })
//User-provided article_id is non-existent
    test("Respond with 404 Error when the given article_id is not-existent", () => {
        return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Article_id not found!");
        })
    })

//User-provided article_id is not valid
    test("Respond with 400 Error when the given article_id is not valid", () => {
        return request(app)
        .get("/api/articles/idnumber/comments")
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
        })
    })

})

describe("POST/api/articles/:article_id/comments", () => {
    test("Respond with an object of the posted comment when the provided article_id is existent and request body has values on username and body keys", () => {
        const commentToPost = {
            username: "rogersop",
            body: "Cinamon spieced tea is the best match for it!"
        }
        return request(app)
        .post("/api/articles/7/comments")
        .send(commentToPost)
        .expect(200)
        .then(({body}) => {
            const { postedComment } = body;
            expect(postedComment.author).toBe(commentToPost.username);
            expect(postedComment.body).toBe(commentToPost.body);
            expect(postedComment.votes).toBe(0);
            expect(postedComment.article_id).toBe(7);
            expect(typeof postedComment.created_at).toBe("string");
        })
     })


     test("Respond with 400 Error when the provided article_id is existent but one key is missing", () => {
        const commentToPost = {
            username: "rogersop",
        }
        return request(app)
        .post("/api/articles/7/comments")
        .send(commentToPost)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
        })
     })

     test("Respond with 400 Error when article_id is non existent", () => {
        const commentToPost = {
            username: "rogersop",
            body:"Cinamon spieced tea is the best match for it!"
        }
        return request(app)
        .post("/api/articles/9999/comments")
        .send(commentToPost)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
        })
     })



})

