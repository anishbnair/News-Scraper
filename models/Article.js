// Require mongoose
var mongoose = require("mongoose");
// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
    // title is a required string
    title: {
        type: String,
        required: true
    },
    // link is a required string
    // todo save summary paragraph instead of link
    link: {
        type: String,
        required: true
    },
    // Saves array of notes
    // `notes` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Note
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
