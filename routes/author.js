/**
 * author.js
 * Used for managing authors adding, removing, publishing, editing, articles *
* 
 */

const express = require("express");
const router = express.Router();

// redirect the user to the login page if they aren't authorized
function unauthorized(req, res) {
    if (!req.session?.user) {
        // redirect them to the login page if they aren't authenticated
        res.redirect("/users/login"); 
        return true;  // and ensure that we return true, since this user
                      // is unauthorized
    }
    return false;
}

/**
    * @Display this authors home page with their articles
    */
router.get("/", (req, res, next) => {
    if (unauthorized(req, res)) return;
    let query = "SELECT * FROM articles WHERE user_id = ? ORDER BY last_modified DESC;";
    const userId = req.session.user.user_id;
    // ensure this user is authorized to come here
    // execute sql query
    global.db.all(query, [userId], function(err, articles) {
        if (err) {
            next(err);
        } else {
            query = "SELECT * FROM blogs WHERE user_id = ?;";
            global.db.get(query, [userId], function(err, blog) {
                if (err) {
                    next(err);
                }
                res.render("author-home", {
                    articles: articles,
                    blog: blog,
                    user: req.session.user,
                });
            });
        }
    })
});


/**
 * @The author settings page where the author can change the blogs title and author
* name and other settings
* */
router.get("/settings", (req, res, next) => {
    // ensure this user is authorized to come here
    if (unauthorized(req, res)) return;
    const userId = req.session.user.user_id;
    const query = "SELECT * FROM blogs WHERE user_id = ?;";
    global.db.get(query, [userId], function(err, blog) {
        if (err) {
            next(err);
        } else {
            res.render("author-settings.ejs", { blog: blog });
        }
    })
});

/**
 * @The author settings page where the author can change the blog title and author
* name and other settings. Posting to this actually changes the settings
* */
router.post("/settings", (req, res, next) => {
    // ensure this user is authorized to come here
    if (unauthorized(req, res)) return;

    const query = "UPDATE blogs SET blog_title = ?, author_name = ? WHERE user_id = ?"
    const blogTitle = req.body.blog_title;
    const authorName = req.body.author_name;
    const queryParams = [blogTitle, authorName, req.session.user.user_id];

    global.db.run(query, queryParams, function(err) {
        if (err) {
            next(err); 
        } else {
            // after we save the settings we redirect the user to the author
            // home
            res.redirect("/author");
        }
    });
});

/**
 * @The author edit page where the author can amend and publish individual
    * articles
* */
router.get("/edit/:articleId", (req, res, next) => {
    // ensure this user is authorized to come here
    if (unauthorized(req, res)) return;
    const articleId = req.params.articleId;
    if (isNaN(parseInt(articleId))) {
        res.redirect("/author");
    }
    global.db.get(`SELECT * FROM articles WHERE article_id = ${articleId}`, function(err, row) {
        if (err) {
            next(err);
        } else if (row == undefined) {
            // REDIRECT TO SOME SORT OF ERROR PAGE HERE
            // REDIRECT TO SOME SORT OF ERROR PAGE HERE
            res.redirect("/author");
            next();

        } else {
            res.render("author-edit.ejs", { article: row });
            next();
        }
    });
});

/**
 * @ When first creating a new draft, we create a empty article post
    * 
* */
router.post("/add-draft", (req, res, next) => {
    // ensure this user is authorized to come here
    if (unauthorized(req, res)) return;
    global.db.get("SELECT datetime('now', 'localtime') AS currDateTime", function(err, time) {
        if (err) {
            next(err); //send the error on to the error handler
        } else {
            global.db.get("SELECT author_name FROM users WHERE user_id = ?",
                [req.session.user.user_id],
                function(err, userData) {

                const query = "INSERT INTO articles \
                (user_id, author_name, created, last_modified, title, body, published) \
                VALUES (?, ?, ?, ?, ?, ?, ?)";

                const user_id = req.session.user.user_id
                const author_name = userData.author_name; 
                const created = time.currDateTime;
                const lastModified = time.currDateTime;
                const articleTitle = req.body.article_title;
                const articleBody = req.body.article_body;
                const published = "";

                const query_parameters = [
                    user_id,
                    author_name,
                    created,
                    lastModified,
                    articleTitle,
                    articleBody,
                    published
                ];
                global.db.run(query, query_parameters,
                function (err) {
                    if (err) {
                        next(err); //send the error on to the error handler
                    } else {
                        res.redirect(`/author/edit/${this.lastID}`);
                        next();
                    }
                });
            });
        }
    })
})

/**
 * @ Deletes a post at the given article id
    * 
* */

router.post("/delete/:articleId", (req, res, next) => {
    // ensure this user is authorized to come here
    if (unauthorized(req, res)) return;
    const articleId = req.params.articleId;
    if (isNaN(parseInt(articleId))) {
        res.redirect("/author");
    }
    global.db.run("DELETE FROM articles WHERE article_id = ?", [articleId], function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect("/author");
        }
    });
});

/**
 * @ Edits the contents of a given articleID
    * 
* */
router.post("/edit/:articleId", (req, res, next) => {
    // ensure this user is authorized to come here
    if (unauthorized(req, res)) return;
    const articleId = req.params.articleId;
    //ensure the article id is a valid number
    if (isNaN(parseInt(articleId))) {
        res.redirect("/author");
    }
    global.db.get("SELECT datetime('now', 'localtime') AS currDateTime", function(err, time) {
        global.db.get(`SELECT * FROM articles WHERE article_id = ?`,
            [articleId],
            function(err, row) {
            if (err) {
                next(err);
            } else if (row == undefined) {
                res.redirect("/author");
                next();

            } else {
                const query = "UPDATE articles SET \
                last_modified = ?,\
                title = ?,\
                body = ?,\
                published = ?\
                WHERE article_id = ?"

                const lastModified = time.currDateTime;
                const articleTitle = req.body.article_title;
                const articleBody = req.body.article_body;
                const published = "";

                const query_parameters = [ 
                    lastModified,
                    articleTitle,
                    articleBody,
                    published,
                    articleId];

                global.db.run(query, query_parameters, function (err) {
                    if (err) {
                        next(err); //send the error on to the error handler
                    } else {
                        res.redirect("/author"); next();
                    }
                });
            }
        });
    });
});

/**
 * @desc when the user publishes an article we call this function. It changes
    * the article from draft to published, giving it a publish date. Once
    * it is published it cannot be unpublished, or edited only deleted
    * 
 */
router.post("/publish/:articleId", (req, res, next) => {
    // ensure the user is authorized to come here
    if (unauthorized(req, res)) return;
    const articleId = req.params.articleId;
    //ensure the article id is a valid number
    if (isNaN(parseInt(articleId))) {
        res.redirect("/author");
    }
    global.db.get("SELECT datetime('now', 'localtime') AS currDateTime", function(err, time) {
        global.db.get(`SELECT * FROM articles WHERE article_id = ?`,
        [articleId],
        function(err, row) {
            if (err) {
                next(err);
            } else if (row == undefined) {
                res.redirect("/author");
                next();

            } else {
                const currTime = time.currDateTime;
                global.db.run( `UPDATE articles SET published = ? WHERE article_id = ?`,
                    [currTime, articleId],
                    function (err) {
                    if (err) {
                        next(err); //send the error on to the error handler
                    } else {
                        res.redirect("/author"); next();
                    }
                });
            }
        });
    });
});
// Export the router object so index.js can access it
module.exports = router;
