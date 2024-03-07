const { Schema, Types, model } = require("mongoose");

const reviewSchema = new Schema({
    title: { 
        type: String, 
        required: true},
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number, 
        enum: [1, 2, 3, 4, 5], 
        required: true
    },
    product: { 
        type: Types.ObjectId, 
        ref: "Product", 
        required: true
    },
    author: { 
        type: Types.ObjectId, 
        ref: "User", 
        default: null 
    },
}, { timestamps: true }) //adds timestamps for createdAt and updatedAt

const Review = model("Review", reviewSchema);
module.exports = Review;