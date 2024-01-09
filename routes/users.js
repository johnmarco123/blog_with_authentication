/**
 * users.js
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 * and the suggested pattern for retrieving data by executing queries
 *
 * NB. it's better NOT to use arrow functions for callbacks with the SQLite library
* 
 */

const express = require("express");
const router = express.Router();

/**
 * @desc Displays a page with login
 */
router.get("/", (req, res) => {
    res.render("users.ejs");
});

router.post("/ban-user", (req, res, next) => {
});

router.post("/delete-user", (req, res, next) => {
});

/**
    * @desc Add a new user to the database based on data from the submitted form
    */
router.post("/add-user", (req, res, next) => {
    // first ensure that no user exists with the given username
    const userName = req.body.user_name;
    const password = req.body.password;
    let query = "SELECT * FROM USERS WHERE user_name = ?;"
    query_parameters = [userName];
    // check to ensure that the username isn't taken;
    global.db.all(query, query_parameters,
        function (err, rows) {
            if (err) {
                next(err); //send the error on to the error handler
            } else if(rows.length != 0){
                next(new Error("TODO, IMPLAMENT A NICE ERROR MESSAG HERE"));
            }        
        });

    query = "INSERT INTO users (user_name, password) VALUES (?, ?);";
    query_parameters = [userName, password];

    // Execute the query and send a confirmation message
    global.db.run(query, query_parameters,
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.send(`New data inserted @ id ${this.lastID}!`);
                next();
            }
        }
    );
});

// Export the router object so index.js can access it
module.exports = router;
