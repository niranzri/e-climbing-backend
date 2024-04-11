const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({ 
    username: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    hashedPassword: { 
        type: String, 
        required: true 
    },
    favourites: { 
        type: [Types.ObjectId], 
        ref: "Product" 
    },
    addedToCart: { 
        type: [Types.ObjectId], 
        ref: "Product" 
    },
});

const User = model("User", userSchema);
module.exports = User;