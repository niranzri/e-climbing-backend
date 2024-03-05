const { Schema, Types, model } = require("mongoose");

const reviewSchema = new Schema({
    description: {type: String},
    numberStars: {
        type: Number, 
        enum: [1, 2, 3, 4, 5], 
        required: true
    },
    createdBy: { type: Types.ObjectId, ref: "User", default: null },
})

const Review = model("Review", reviewSchema);
module.exports = Review;