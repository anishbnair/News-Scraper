// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Requiring our Note and Article models
// var Note = require("./models/Note.js");
// var Article = require("./models/Article.js");

// Our scraping tools
// var request = require("request");
// var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises
// mongoose.Promise = Promise;


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var db = mongoose.connection;

// Port
var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Serve static content
app.use(express.static("public"));

// Set Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./routes/scraper.js");

app.use("/", routes);

// // Requiring our routes
// require("./routes/scraper.js")(app);


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/testNewsScraper1");

// Show any mongoose errors
db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
    console.log("Mongoose connection successful.");
});

// Listen on port
app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
});
