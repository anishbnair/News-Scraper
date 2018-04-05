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
