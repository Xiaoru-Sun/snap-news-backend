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
    test("Respond with an object of the posted comment when the provided article_id is existent, username is existent and body key has value", () => {
        const commentToPost = {
            username: testData.userData[0].username,
            body: "Cinamon spieced tea is the best match for it!"
        }
        return request(app)
        .post("/api/articles/7/comments")
        .send(commentToPost)
        .expect(200)
        .then(({body}) => {
            const { postedComment } = body;
            expect(typeof postedComment.comment_id).toBe("number")
            expect(postedComment.author).toBe(commentToPost.username);
            expect(postedComment.body).toBe(commentToPost.body);
            expect(postedComment.votes).toBe(0);
            expect(postedComment.article_id).toBe(7);
            expect(typeof postedComment.created_at).toBe("string");
        })
     })

     test("Respond with 400 error when the provided article_id is not numeric", () => {
        const commentToPost = {
            username: testData.userData[1].username,
            body: "Cinamon spieced tea is the best match for it!"
        }
        return request(app)
        .post("/api/articles/notanid/comments")
        .send(commentToPost)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
        })
     })

/*article_id is an foreign key in comments table, when attempting to insert this non-exisitent article_id 
sql throws an error, the code of which is 23503
either use doesArticleExist to throw a error, or alternatively add an error handling function particularly for 23503
*/

     test("Respond with 404 error when article_id is numeric but non-existent", () => {
        const commentToPost = {
            username: testData.userData[1].username,
            body:"Cinamon spieced tea is the best match for it!"
        }
        return request(app)
        .post("/api/articles/9999/comments")
        .send(commentToPost)
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Article_id not found!")
        })
     })


     test("Respond with 404 error when request body sends an non-existent username", () => {
        const commentToPost = {
            username: "unknownusername1234",
            body:"Cinamon spieced tea is the best match for it!"
        }
        return request(app)
        .post("/api/articles/9/comments")
        .send(commentToPost)
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Username is not found")
        })
     })

     test("Respond with 400 error when request does not have body key", () => {
        const commentToPost = {
            username: testData.userData[2].username,
            nobody: "I do not have a key called body"
        }
        return request(app)
        .post("/api/articles/9/comments")
        .send(commentToPost)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Assignment of a Null value to a Not Null Column")
        })
     })

     test("Respond with 404 error when request does not username key", () => {
        const commentToPost = {
            myname: testData.userData[2].username,
            nobody: "I do not have a key called body"
        }
        return request(app)
        .post("/api/articles/9/comments")
        .send(commentToPost)
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Username is not found")
        })
     })

})


describe("PATCH/api/articles/:article_id", () => {
    test("Respond with an object of the updated article when article_id is existent and partchBody has a positive number on 'inc_votes' key", () => {
        const patchBody = { inc_votes : 1 }
        const { inc_votes } = patchBody;
        return request(app)
        .patch("/api/articles/1")
        .send(patchBody)
        .expect(200)
        .then(({body}) => {
            const { updatedArticle } = body;
            expect(updatedArticle.votes).toBe(testData.articleData[0].votes + inc_votes)
        })
    })


    test("Respond with 404 Error when article_id is numeric but non-existent", () => {
        const patchBody = { inc_votes : 2 }
        return request(app)
        .patch("/api/articles/9999")
        .send(patchBody)
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toEqual("Article_id not found!")
        })
    })

    test("Respond with 400 Error when article_id is not numeric", () => {
        const patchBody = { inc_votes : 2 }
        return request(app)
        .patch("/api/articles/idid")
        .send(patchBody)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toEqual("Bad request")
        })
    })

    test("Respond with 400 Error when article_id is existent but patchBody doesn't have 'inc_votes' key", () => {
        const patchBody = { votes : 2 }
        return request(app)
        .patch("/api/articles/1")
        .send(patchBody)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toEqual("Assignment of a Null value to a Not Null Column")
        })
    })


    test("Respond with 400 Error when article_id is existent but patchBody has a string on 'inv_votes' key", () => {
        const patchBody = { inc_votes : "value" }
        return request(app)
        .patch("/api/articles/1")
        .send(patchBody)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toEqual("Bad request")
        })
    })

})


describe("DELETE/api/comments/:comment_id", () => {
    test("Respond with 204", () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
    })
    test("Respond with 400 error when comment_id is not a number", () => {
        return request(app)
        .delete("/api/comments/notanumberhere")
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
        })
    })
    test("Respond with 404 error when comment_id is numeric but non-existent", () => {
        return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Comment_id not found")
        })
    })


})


describe("GET/api/users", () => {
    test("Respond with an array of objects, and each object has all the necessary keys", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body})=> {
            const {users} = body;
            expect(users.length).toBe(testData.userData.length);
            users.forEach(user => {
                expect(typeof user.username).toBe("string");
                expect(typeof user.name).toBe("string");
                expect(typeof user.avatar_url).toBe("string");
            })
        })
    })

})


describe("GET/api/articles?topicquery", () => {
    test("Respond with an array of articles, each article is for the specified topic", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            const { articles} = body;
            expect(articles.length).toBe(testData.articleData.filter(item => item.topic === "mitch").length)
        })
    })

    test("Respond with an empty array when the given topic exists but there is no associated article", () => {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(0)
        })
    })

    test("Respond with 404 error when the given topic is non-existent ", () => {
        return request(app)
        .get("/api/articles?topic=tech")
        .expect(404)
        .then(({body}) => {
        const { msg } = body;
        expect(msg).toBe("Topic not found")            
        })
    })

})


describe("GET/api/articles/:article_id(comment_count)", () => {
    test("Repond with an object of an article with comment_count property when article_id exists", () =>{
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            const { article } = body;
            expect(article.article_id).toBe(1)
            expect(typeof article.comment_count).toBe("number");
            expect(article.comment_count).toBe(testData.commentData.filter(comment => comment.article_id === 1).length)
        })
    })
})


describe("GET/api/articles(sorting queries)", () => {
    test("Return an array of aritcles sorted by votes in asc order as specified", () => {
        return request(app)
        .get("/api/articles?sort_by=votes&&order=asc")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("votes", {descending : false})
        })
    })

    test("Return 400 error when passing in a sort_by that is non-existent", () => {
        return request(app)
        .get("/api/articles?sort_by=weather&&order=asc")
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe("Bad request")
        })
    })

    test("Return 400 error when passing in a valid sort_by but order is invalid", () => {
        return request(app)
        .get("/api/articles?sort_by=weather&&order=Default")
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe("Bad request")
        })
    })
})

describe("GET/api/users/:username", () => {
    test("Respond with an user object that has all the necessary keys", () => {
        return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({body}) => {
            const { users } = body;
            expect(users.username).toBe("icellusedkars");
            expect( users.name ).toBe("sam");
            expect(users.avatar_url).toBe("https://avatars2.githubusercontent.com/u/24604688?s=460&v=4")
        })
    })

    test("Respond with 400 error when the given username is non-existent", () => {
        return request(app)
        .get("/api/users/validname")
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Username not found!")
        })
    })
})

describe("PATCH/api/comments/:comment_id", () => {
    test("Respond with an object of the updated comment when comment_id exists", () => {
        const patchBody = {inc_votes : -1 }
        const { inc_votes } = patchBody
        return request(app)
        .patch("/api/comments/4")
        .send(patchBody)
        .expect(200)
        .then(({body}) => {
            const { updatedComment } = body;
            expect(updatedComment.votes).toBe(testData.commentData[3].votes + inc_votes)
        })
    })

    test("Respond with 404 error when comment_id is non-existent", () => {
        const patchBody = {inc_votes : -1 }
        return request(app)
        .patch("/api/comments/123456")
        .send(patchBody)
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Comment_id not found")
        })
    })

    test("Respond with 400 error when commend_id is not existent nor numeric", () => {
        const patchBody = {inc_votes : -1 }
        return request(app)
        .patch("/api/comments/numericcommentid")
        .send(patchBody)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
        })
    })
    test("Respond with 400 error when comment_id is existent but patchBody has no inc_votes key", () => {
        const patchBody = {increment_votes : -1 }
        return request(app)
        .patch("/api/comments/5")
        .send(patchBody)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Assignment of a Null value to a Not Null Column")
        })
    })

    test("Respond with 400 error when comment_id is existent but patchBody has no inc_votes key", () => {
        const patchBody = {inc_votes : "value is not a number here"}
        return request(app)
        .patch("/api/comments/5")
        .send(patchBody)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
        })
    })
})

describe("POST/api/articles", () => {
    test("Respond with an object of the newly added article when both author and topic are existent", () => {
        const articleToAdd = {
            author: "rogersop",
            title : "I am a good title",
            topic: "cats",
            body: "It is all about cats"
        }
        return request(app)
        .post("/api/articles")
        .send(articleToAdd)
        .expect(200)
        .then(({body}) => {
            const {addedArticle} = body;
            expect(addedArticle.article_id).toBe(testData.articleData.length + 1)
            expect(addedArticle.author).toBe("rogersop");
            expect(addedArticle.title).toBe("I am a good title");
            expect(addedArticle.body).toBe("It is all about cats");
            expect(addedArticle.article_img_url).toBe("https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700")
            expect(addedArticle.votes).toBe(0);
            expect(typeof addedArticle.created_at).toBe("string");
            expect(addedArticle.comment_count).toBe(0)
        })
    })

    test("Respond with 400 error when author is non-existent", () => {
        const articleToAdd = {
            author: "new author",
            title : "I am a good title",
            topic: "cats",
            body: "It is all about cats"
        }
        return request(app)
        .post("/api/articles")
        .send(articleToAdd)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
  
        })
    })

    test("Respond with 400 error when topic is non-existent", () => {
        const articleToAdd = {
            author: "rogersop",
            title : "I am a good title",
            topic: "crafts",
            body: "It is all about cats"
        }
        return request(app)
        .post("/api/articles")
        .send(articleToAdd)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
  
        })
    })
})

describe("GET/api/articles(pagination)", () => {
    test("Respond with 10 articles if limit is not specified and p equals 1", () => {
        return request(app)
        .get("/api/articles?p=1")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(10)
        })
    })

    test("Respond with 3 articles when limit is 5 and p is 3", () => {
        return request(app)
        .get("/api/articles?limit=5&&p=3")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(4)
        })
    })

    test("Respond with 14 articles when limit is bigger than 13", () => {
        return request(app)
        .get("/api/articles?limit=15")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(14)
        })
    })

    test("Respond with an empty array when limit is bigger than 13 and p is 2", () => {
        return request(app)
        .get("/api/articles?limit=15&&p=2")
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles.length).toBe(0)
        })
    })
    
})


describe("GET/api/articles/:article_id/comments(pagination)", () => {
    test("Respond with 5 articles if article_id is 1 and limit is not specified and p equals 1", () => {
        return request(app)
        .get("/api/articles/1/comments?limit=5&&p=1")
        .expect(200)
        .then(({body}) => {
            const { comments } = body;
            expect(comments.length).toBe(5)
        })
    })
    test("Respond with 1 article if article_id is 1 and limit is 5, p is 3", () => {
        return request(app)
        .get("/api/articles/1/comments?limit=5&&p=3")
        .expect(200)
        .then(({body}) => {
            const { comments } = body;
            expect(comments.length).toBe(1)
        })
    })
    test("Respond with 400 error when limit is not numeric", () => {
        return request(app)
        .get("/api/articles/1/comments?limit=limit5&&p=3")
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
        })
    })

    test("Respond with 400 error when p is not numeric", () => {
        return request(app)
        .get("/api/articles/1/comments?limit=5&&p=page")
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
        })
    })
})

describe("POST/api/topics", () => {
    test("Return an a topic object containing the newly added topic", () => {
        const topicToAdd = {
            slug :"sql",
            description: "Structured query language"
        }
        return request(app)
        .post("/api/topics")
        .send(topicToAdd)
        .expect(200)
        .then(({body}) => {
            const { addedTopic } = body;
            expect(addedTopic.slug).toBe("sql");
            expect(addedTopic.description).toBe("Structured query language")
        })
    })

    test("Return an 400 error when request body slug is an existent one", () => {
        const topicToAdd = {
            slug :"mitch",
            description: "Structured query language"
        }
        return request(app)
        .post("/api/topics")
        .send(topicToAdd)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Assignment of value to existing primary key");
    
        })
    })
    test("Return an 400 error when slug is null", () => {
        const topicToAdd = {
            slug : null,
            description: "Structured query language"
        }
        return request(app)
        .post("/api/topics")
        .send(topicToAdd)
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Assignment of a Null value to a Not Null Column");
    
        })
    })
})

describe("DELETE/api/articles/:article_id", () => {
    test("Return 404 error when artcile_id is non-existent", () => {
        return request(app)
        .delete("/api/articles/9999")
        .expect(404)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Article_id not found")
        })
    })

    test("Return 400 error when article_id is not numeric", () => {
        return request(app)
        .delete("/api/articles/deletearticle_5")
        .expect(400)
        .then(({body}) => {
            const { msg } = body;
            expect(msg).toBe("Bad request")
        })
    })
    test("Return 400 error when article_id is associated with comments", () => {
        return request(app)
        .delete("/api/articles/3")
        .expect(400)
        .then(({body}) => {
            const {msg} = body;
            expect(msg).toBe("Violates foreign key constraint")
        })
    })

    test("Return 204 and no content when article_id is not associated with comments", () => {
        return request(app)
        .delete("/api/articles/4")
        .expect(204)
    })

})
