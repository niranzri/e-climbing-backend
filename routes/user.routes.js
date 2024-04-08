const router = require("express").Router();
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/auth.middleware")

// Adds product to wishlist
router.post("/:userId/wishlist", isAuthenticated, async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.productId; // product Id is sent in the request body

    try {
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product is already in favorites
        if (user.favourites.includes(productId)) {
            return res.status(400).json({ message: "Product is already in favorites" });
        }

        // Add product to favorites
        user.favourites.push(productId);

        // Save user - modifications to docs are not automatically persisted to the database, so one need to explicitly call save() to persist the changes
        await user.save();

        return res.status(200).json({ message: "Product added to favorites successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

})

// Deletes product from wishlist
router.delete("/:userId/wishlist/:productId", isAuthenticated, async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId; // product Id is sent in the request body

    try {
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if product exists in favorites
        if (!user.favourites.includes(productId)) {
            return res.status(400).json({ message: "Product is not in favorites" });
        }

        // Remove product from favorites
        user.favourites = user.favourites.filter(fav => fav.toString() !== productId);

        // Save user
        await user.save();

        return res.status(200).json({ message: "Product removed from favorites successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})


// Adds product to cart
router.post("/:userId/cart", isAuthenticated, async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.productId; // product Id is sent in the request body

    try {
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product is already in favorites
        if (user.favourites.includes(productId)) {
            return res.status(400).json({ message: "Product is already in favorites" });
        }

        // Add product to favorites
        user.addedToCart.push(productId);

        // Save user
        await user.save();

        return res.status(200).json({ message: "Product added to favorites successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

})


// Deletes product from cart
router.delete("/:userId/cart/:productId", isAuthenticated, async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

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