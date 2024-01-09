/**
 * author.js
* 
 */

const express = require("express");
const router = express.Router();

/**
 * @desc Displays a page with login
 */
router.get("/", (req, res) => {
    const query = "SELECT * FROM articles ORDER BY last_modified DESC";
    // execute sql query
    global.db.all(query, (error, result) => {
        if (error) {
            res.redirect("/author");
            // ERROR MESSAGE HERE
        } else {
            res.render("author-home", { articles: result });
        }
    })
});


/**
 * @The author settings page where the author can change the blog title and author
* name and other settings
* */
router.get("/settings", (req, res, next) => {
    res.render("author-settings.ejs");
});

/**
 * @The author edit page where the author can amend and publish individual
    * articles
* */
router.get("/edit/:articleId", (req, res, next) => {
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
            // REDIRECT TO SOME SORT OF ERROR PAGE HERE
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

router.post("/add-draft", (req, res, next) => {
    global.db.get("SELECT datetime('now', 'localtime') AS currDateTime", function(err, row) {
        if (err) {
            next(err); //send the error on to the error handler
        } else {
            const query = "INSERT INTO articles \
            (user_name, created, last_modified, title, body, published) \
            VALUES (?, ?, ?, ?, ?, ?)";

            const username = "TODO";
            const created = row.currDateTime;
            const lastModified = row.currDateTime;
            let articleTitle = "";
            let articleBody = "";
            const published = false;

            if (req) {
                articleTitle = req.body.article_title;
                articleBody = req.body.article_body;
            }

            const query_parameters = [
                username,
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
        }
    })
})

router.delete("/edit/:articleId", (req, res, next) => {
    const articleId = req.params.articleId;
    global.db.get(`DELETE FROM articles WHERE article_id = ${articleId}`, function(err) {
        if (err) {
            next(err); //send the error on to the error handler
        } else {
            res.redirect("/"); 
            next();
        }
    })
})

router.post("/edit/:articleId", (req, res, next) => {
    const articleId = req.params.articleId;
    //ensure the article id is a valid number
    if (isNaN(parseInt(articleId))) {
        res.redirect("/author");
    }
    global.db.get("SELECT datetime('now', 'localtime') AS currDateTime", function(err, time) {
        global.db.get(`SELECT * FROM articles WHERE article_id = ${articleId}`, function(err, row) {
            if (err) {
                next(err);
            } else if (row == undefined) {
                // REDIRECT TO SOME SORT OF ERROR PAGE HERE
                // REDIRECT TO SOME SORT OF ERROR PAGE HERE
                // REDIRECT TO SOME SORT OF ERROR PAGE HERE
                // REDIRECT TO SOME SORT OF ERROR PAGE HERE
                // REDIRECT TO SOME SORT OF ERROR PAGE HERE
                res.redirect("/author");
                next();

            } else {
                const query = "UPDATE articles \
                SET user_name = ?, last_modified = ?, title = ?, body = ?, published = ?\
                WHERE article_id = ?"

                const username = "TODO";
                const lastModified = time.currDateTime;
                let articleTitle = "";
                let articleBody = "";
                const published = false;
                if (req) {
                    articleTitle = req.body.article_title;
                    articleBody = req.body.article_body;
                }
                const query_parameters = [ 
                    username,
                    lastModified,
                    articleTitle,
                    articleBody,
                    published,
                    articleId ];

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

// Export the router object so index.js can access it
module.exports = router;
