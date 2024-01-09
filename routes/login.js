
/**
 * login.js
* the author login to allow authors to post and edit their posts
*
* 
 */

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

/**
 * @desc Displays a page with login
 */
router.get("/", (req, res) => {
    res.render("login.ejs");
});


/**
 * @desc Add a new user to the database based on data from the submitted form
 */
router.post("/add-user", (req, res, next) => {
// first ensure that no user exists with the given username
const userName = req.body.user_name;
const password = req.body.password;
const saltRounds = 10;

bcrypt
    .hash(password, saltRounds)
    .then(hash => {
        let query = "SELECT * FROM USERS WHERE user_name = ?;"
        query_parameters = [userName];
        // check to ensure that the username isn't taken;
        global.db.all(query, query_parameters,
        function (err, rows) {
            if (err) {
                next(err); //send the error on to the error handler

            } else if(rows.length != 0){
                next(new Error("TODO, IMPLAMENT A NICE ERROR MESSAG HERE"));

            } else {
                bcrypt
                .compare(password, hash)
                .then(res => {
                    return true;
                })
                .catch(err => console.error(err.message));
            }
        });
    })
    .catch(err => console.error(err.message));
});

// Export the router object so index.js can access it
module.exports = router;
