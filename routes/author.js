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
    const query = "SELECT * FROM articles ORDER BY CREATED";
    // execute sql query
    global.db.all(query, (error, result) => {
        if (error) {
            res.redirect("./author-home");
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
router.get("/edit/:", (req, res, next) => {
    res.render("author-edit.ejs");
});

router.post("/add-draft", (req, res, next) => {
    global.db.get("SELECT datetime('now', 'localtime') AS currDateTime", function(err, row) {
        if (err) {
            next(err); //send the error on to the error handler
        } else {
            const currDateTime = row.currDateTime;
            const query = "INSERT INTO articles \
            (user_name, created, last_modified, title, body, published) \
            VALUES (?, ?, ?, ?, ?, ?)";
            const published = false;
            let articleTitle = "";
            let articleBody = "";
            if (req) {
                articleTitle = req.body.article_title;
                articleBody = req.body.article_body;
            }
            const query_parameters = [
                "TODO",
                currDateTime,
                currDateTime,
                articleTitle,
                articleBody,
                published
            ];
            global.db.run(query, query_parameters,
                function (err) {
                    if (err) {
                        next(err); //send the error on to the error handler
                    } else {
                        res.redirect("/author");
                        next();
                    }
                });
        }
    })
})
router.post("/submitArticle", (req, res, next) => {
    global.db.get("SELECT datetime('now', 'localtime') AS currDateTime", function(err, row) {
        if (err) {
            next(err); //send the error on to the error handler
        } else {
            const currDateTime = row.currDateTime;
            const query = "INSERT INTO articles \
            (user_name, created, last_modified, title, body, published) \
            VALUES (?, ?, ?, ?, ?, ?)";
            const published = false;
            const articleTitle = req.body.article_title;
            const articleBody = req.body.article_body;
            const query_parameters = ["TODO", currDateTime, currDateTime, articleTitle, articleBody, published];
            global.db.run(query, query_parameters,
                function (err) {
                    if (err) {
                        next(err); //send the error on to the error handler
                    } else {
                        res.send(`New article has been added successfuly! at@ id ${this.lastID}!`);
                        next();
                    }
                });
        }
    })
});


// Export the router object so index.js can access it
module.exports = router;
