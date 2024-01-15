/**
 * author.js
 * Used for managing reader comments, likes, views, and all the reader pages
* 
 */

const express = require("express");
const router = express.Router();

/**
 * @desc The home page for the reader, it shows all the different blogs
    * from all the different authors of the website
*/
router.get("/", (req, res, next) => {
    const query = "SELECT * FROM blogs;"
    global.db.all(query, function(err, blogs) {
        if (err) {
            next(err);
        } else {
            res.render("reader-home", { blogs: blogs });
        }
    });
});

/**
    * @desc Shows all articles for the given blog owner. We use the blog
    * owners user id to keep track of the owners blog
*/
router.get("/blog/:blog_owner_user_id", (req, res, next) => {
    const blogOwnerUserId = req.params.blog_owner_user_id;
    // select all the articles that the blog owner has published and we sort
    // them so that the most recently published article is on the top
    let query = "SELECT * FROM blogs WHERE user_id = ?;";
    global.db.get(query, [blogOwnerUserId], function(err, blog) {
        if (err) {
            next(err);
        } 
        query = "SELECT * FROM articles WHERE user_id = ? AND published <> '' ORDER BY published DESC";
        // execute sql query
        global.db.all(query, [blogOwnerUserId], function(err, articles) {
            if (err) {
                // if we fail to load the articles we just keep the user on the 
                // home page
                res.redirect("/reader-home");
            } else {
                res.render("reader-blog.ejs", { 
                    articles: articles,
                    blog: blog
                });
            }
        })
    })
});

/**
    * @desc Shows the given article that has a matching ":articleId"
    * it allows commenting, liking, and viewing of the blog
*/
router.get("/article/:articleId", (req, res, next) => {
    const articleId = req.params.articleId;
    const users_IP = req.ip;
    let userLikedPost = false;
    // check whether or not this user has liked the post
    let query = "SELECT ip_address FROM article_likes WHERE article_id = ?";
    global.db.all(query, [articleId], function(err, article_likes) {
        if (err) {
            next(err);
        } else {
            for (const like of article_likes) {
                if (like.ip_address == users_IP) {
                    userLikedPost = true;
                    break;
                }
            }
            query = "SELECT * FROM articles WHERE article_id = ?";
            // send the user the article information for the given link
            global.db.get(query, [articleId], function(err, article) {
                if (err) {
                    next(err);
                }
                query = "SELECT * FROM article_comments WHERE article_id = ? ORDER BY created DESC;";
                global.db.all(query, [articleId], function (err, comments) {
                    if (err) {
                        next(err);
                    } else {
                        // add one to the number of views for this article if their ip has not
                        // visited this page before
                        query = "SELECT ip_address FROM article_views WHERE article_id = ?;";
                        global.db.all(query, [articleId], function (err, article_views) {
                            if (err) {
                                next(err); //send the error on to the error handler
                            }
                            res.render("reader-article", {
                                article: article,
                                userLikedPost: userLikedPost,
                                comments: comments,
                            });

                            // if their ip address is here then we return to not allow another
                            // view to be counted. One view per ip address
                            for (const view of article_views) {
                                if (view.ip_address == users_IP) {
                                    next();
                                    return;
                                }
                            }
                            // if we reach here hten their ip address has not viewed the post, so
                            // we increase the views by one
                            query = "UPDATE articles SET number_of_views = number_of_views + 1 WHERE article_id = ?;";
                            global.db.run(query, [articleId], function (err) {
                                if (err) {
                                    next(err); //send the error on to the error handler
                                }

                                // add their ip to the article views database
                                query = "INSERT INTO article_views (article_id, ip_address) VALUES (?, ?);";
                                global.db.run(query, [articleId, users_IP], function (err) {
                                    if (err) {
                                        next(err); //send the error on to the error handler
                                    }
                                });
                            });
                        });
                    }
                });
            });
        }
    });
});

/*
* @desc Allows the user to like the article specified
*/
router.post("/article/like-article/:articleId", (req, res, next) => {
    const articleId = req.params.articleId;
    const users_IP = req.ip;
    // add one to the number of views for this article
    let query = "SELECT ip_address FROM article_likes WHERE article_id = ?";
    global.db.all(query, [articleId], function (err, article_likes) {
        if (err) {
            next(err); //send the error on to the error handler
        } else {
            query = "UPDATE articles SET number_of_likes = number_of_likes + 1 WHERE article_id = ?;";
            global.db.run(query, [articleId], function (err) {
                if (err) {
                    next(err); /*send the error on to the error handler*/ 
                }
            });

            query = "INSERT INTO article_likes (article_id, ip_address) VALUES (?, ?);";
            global.db.run(query, [articleId, users_IP], function(err) {
                if (err) {
                    next(err); //send the error on to the error handler
                } else {
                    res.redirect("/reader/article/" + articleId);
                }
            });
        }
    });
});

/*
* @desc Allows the user to unlike the article specified
*/
router.post("/article/unlike-article/:articleId", (req, res, next) => {
    const articleId = req.params.articleId;
    const user_IP = req.ip;
    let query = "UPDATE articles SET number_of_likes = number_of_likes - 1 WHERE article_id = ?;";
    // first we remove one like from the page since the user unliked
    global.db.run(query, [articleId], function (err) {
        if (err) {
            next(err); //send the error on to the error handler
        } 
    });

    // then we remove the like from the article_likes table so that their ip
    // address isn't liking the post
    query = "DELETE FROM article_likes WHERE article_id = ? AND ip_address = ?";
    global.db.run(query, [articleId, user_IP], function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect("/reader/article/" + articleId);
        }
    });
});

/*
    * @desc likes the article for the given articleId
*/
router.post("/article/submit-comment/:articleId" , (req, res, next) => {
    const articleId = req.params.articleId
    const commenter_name = req.body.commenter_name;
    const comment = req.body.comment;
    global.db.get("SELECT datetime('now', 'localtime') AS currDateTime", function(err, time) {
        const created = time.currDateTime;
        const query = "INSERT INTO article_comments (created, commenter_name, comment, article_id) VALUES (?, ?, ?, ?);";
        const query_params = [created, commenter_name, comment, articleId];
        global.db.run(query, query_params, function(err) {
            if (err) {
                next(err);
            } else {
                res.redirect("/reader/article/" + articleId);
            }
        });
    });
});

// Export the router object so index.js can access it
module.exports = router;
