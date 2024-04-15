const router = require("express").Router();
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/auth.middleware")

// POST product to user's wishlist
router.post("/wishlist", isAuthenticated, async (req, res) => {
    const { userId } = req.tokenPayload;
    const { productId } = req.body; // product Id is sent in the request body

    try {
        // Checks that user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Checks that product exists in the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product is already in favorites
        if (user.favourites.includes(productId)) {
            return res.status(400).json({ message: "Product is already in favorites" });
        } else {
            user.favourites.push(productId);
             // Save user - modifications to docs are not automatically persisted to the database, so one need to explicitly call save() to persist the changes
            await user.save();
            return res.status(200).json({ message: "Product added to favorites successfully" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

})

// DELETE product from wishlist
router.delete("/wishlist/:productId", isAuthenticated, async (req, res) => {
    const { userId } = req.tokenPayload;
    const { productId } = req.params; // product Id is sent in the request body

    try {
        // Checks if user exists in DB
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Checks if favorites includes product
        if (!user.favourites.includes(productId)) {
            return res.status(400).json({ message: "Product is not in wishlist" });
        }

        // Removes product from favorites & save user changes
        user.favourites = user.favourites.filter(item => item._id !== productId);
        await user.save();
        return res.status(200).json({ message: "Product removed from favorites successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})


// Adds product to user's cart
router.post("/cart", isAuthenticated, async (req, res) => {
    const { userId } = req.tokenPayload;
    const { productId } = req.body; // product Id is sent in the request body

    try {
        // Checks that user exists in DB
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Checks that product exists in DB
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product is already in cart
        if (user.addedToCart.includes(productId)) {
            return res.status(400).json({ message: "Product is already in cart" });
        } else {
            user.addedToCart.push(productId);
             // Save user - modifications to docs are not automatically persisted to the database, so one need to explicitly call save() to persist the changes
            await user.save();
            return res.status(200).json({ message: "Product added to cart successfully" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

})


// DELETE product from cart
router.delete("/cart/:productId", isAuthenticated, async (req, res) => {
    const { userId } = req.tokenPayload;
    const { productId }= req.params;

    try {
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if product exists in cart
        if (!user.addedToCart.includes(productId)) {
            return res.status(400).json({ message: "Product is not in the cart" });
        }

        // Remove product from cart
        user.addedToCart = user.addedToCart.filter(cartItem => cartItem.toString() !== productId);

        // Save user
        await user.save();

        return res.status(200).json({ message: "Product removed from cart successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;