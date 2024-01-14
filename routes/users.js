/**
 * users.js
 * Used for managing user login, banning, deleting etc, anything to do with
    * users
 *
 * NB. it's better NOT to use arrow functions for callbacks with the SQLite library
* 
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");


/**
 * @desc Everything to do with adding, removing or editing users is here.
    * These are all post requests as we have no user page
 */
// 
router.get("/login", (req, res) => {
    res.render("login.ejs");
});

router.get("/register", (req, res) => {
    res.render("register.ejs");
});


/**
 * @desc clears the users session, logging them out
    *
 */
//
router.post("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);

        } else {
            res.redirect("/users/login");
        }
    });
});
/**
 * @desc Logs the user in if they provide the correct username and password
    * combination
 */
const genericLoginError = "Invalid username or password";
router.post("/login", (req, res, next) => {
    const username = req.body?.username;
    const password = req.body?.password;
    if (!username || !password) {
        return res.status(401).send(genericLoginError);
    }
    const query_parameters = [username];
    let query = "SELECT * FROM users WHERE username = ?;";
    global.db.get(query, query_parameters, function (err, user) {
        if (err) {
            next(err); //send the error on to the error handler

        } else {
            if (!user) {
                return res.status(401).send(genericLoginError)
            }
            const hash = user.password;
            bcrypt.compare(password, hash, function(err, result) {
                if (result) {
                    // give them a cookie to allow them to access each page
                    req.session.user = {
                        user_id: user.user_id,
                        username: user.username 
                    };
                    res.redirect("/author");
                } else {
                    return res.status(401).send(genericLoginError);
                }
            });
        }
    });
});

/**
 * @desc Add a new user to the database based on data from the submitted form
 */
router.post("/add-user", (req, res, next) => {
    const blogTitle = req.body?.blog_title;
    const authorName = req.body?.author_name;
    const username = req.body?.username;
    const password = req.body?.password;
    const confirmPassword = req.body?.confirm_password;

    // ensure all fields are filled in 
    if (!username || !password || !authorName || !blogTitle || !confirmPassword) {
        return res.status(401).send("Please fill out all fields");
    };

    if (password !== confirmPassword) {
        return res.status(401).send("Your passwords do not match, please try again.");
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        let query = "SELECT * FROM USERS WHERE username = ?;"
        query_parameters = [username];
        // check to ensure that the username isn't taken;
        global.db.all(query, query_parameters,
            function (err, rows) {
                if (err) next(err); //send the error on to the error handler
                else if(rows.length != 0) return res.status(401).send("Username has already been taken");
            });

        query = "INSERT INTO users (username, password, author_name) VALUES (?, ?, ?);";
        query_parameters = [username, hash, authorName];

        console.log(hash);
        // Execute the query and send a confirmation message
        global.db.run(query, query_parameters, function (err) {
            if (err) next(err); //send the error on to the error handler
            else {
                // add the users blog settings
                query = "INSERT INTO blogs (user_id, blog_title, author_name) VALUES (?, ?, ?);";
                query_parameters = [this.lastID, blogTitle, authorName];
                // Execute the query and send a confirmation message
                global.db.run(query, query_parameters,
                function (err) {
                    if (err) next(err); 
                });
                next();
                res.redirect("/users/login");
            }
        });
    })
});

// Export the router object so index.js can access it
module.exports = router;
