const { Schema, model, Types } = require("mongoose"); // imports the Schema and model dependencies from the mongoose library

const productSchema = new Schema({  // creates the productSchema using the Schema constructor
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["shoes", "bag", "brush", "chalk", "harness", "belay device", "carabiner"],
        required: true,
    },
    colour: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female", "neutral"],
        required: true,
    },
    reviews: {
        type: [Types.ObjectId], 
        ref: "Review", 
    }
});


const Product = model("Product", productSchema); // creates the model
module.exports = Product;