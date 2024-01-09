/**
 * reader.js
* 
 */

const express = require("express");
const router = express.Router();

/**
 * @desc TODO
 */
router.get("/", (req, res) => {
    const query = "SELECT * FROM articles ORDER BY CREATED";
    // execute sql query
    global.db.all(query, (error, result) => {
        if (err) {
            res.redirect("./reader-home");
            //req.query.keyword + "error: "+ err.message;
            //return console.error("No book found with the keyword you have entered" + 
            //this can also be used in case of an 
            //error instead of the above line
        } else {
            console.log(result);
            res.render("reader-home", { articles: result });
        }
    })
});


// Export the router object so index.js can access it
module.exports = router;
