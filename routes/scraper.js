// Dependencies
var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.get("/", function (req, res) {
    res.render("index");
});


// This will get the articles scraped and saved in db and show them in list
router.get("/savedarticles", function (req, res) {

    // Grab every doc in the Articles array
    Article.find({}, function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            var hbsArticleObject = {
                articles: doc
            };

            res.render("savedarticles", hbsArticleObject);
        }
    });
});


// A GET request to scrape the nytimes website
router.post("/scrape", function (req, res) {

    // First, we grab the body of the html with request
    request("http://www.nytimes.com/", function (error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);

        // Make emptry array for temporarily saving and showing scraped Articles
        var scrapedArticles = {};
        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {

            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("a").text();

            console.log("What's the result title? " + result.title);

            result.link = $(this).children("a").attr("href");

            scrapedArticles[i] = result;

        });

        console.log("Scraped Articles object built nicely: " + scrapedArticles);

        var hbsArticleObject = {
            articles: scrapedArticles
        };

        res.render("index", hbsArticleObject);

    });
});


// Save an article
router.post("/save", function (req, res) {

    console.log("This is the title: " + req.body.title);

    var newArticleObject = {};

    newArticleObject.title = req.body.title;

    newArticleObject.link = req.body.link;

    var entry = new Article(newArticleObject);

    console.log("We can save the article: " + entry);

    // Now, save that entry to the db
    entry.save(function (err, doc) {
        // Log any errors
        if (err) {
            console.log(err);
        }
        // Or log the doc
        else {
            console.log(doc);
        }
    });

    res.redirect("/savedarticles");

});


// Delete a saved article
router.get("/delete/:id", function (req, res) {

    console.log("ID is getting read for delete" + req.params.id);

    console.log("Able to activate delete function.");

    Article.findOneAndRemove({ "_id": req.params.id }, function (err, offer) {
        if (err) {
            console.log("Not able to delete:" + err);
        } else {
            console.log("Able to delete, Yay");
        }
        res.redirect("/savedarticles");
    });
});


// Delete a note
router.get("/notes/:id", function (req, res) {

    console.log("ID is getting read for delete" + req.params.id);

    console.log("Able to activate delete function.");

    Note.findOneAndRemove({ "_id": req.params.id }, function (err, doc) {
        if (err) {
            console.log("Not able to delete:" + err);
        } else {
            console.log("Able to delete, Yay");
        }
        res.send(doc);
    });
});