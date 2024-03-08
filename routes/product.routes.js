const router = require("express").Router();
const Product = require("../models/Product.model");
const Review = require("../models/Review.model");

// Endpoint / => /api/products

// GET - Reads all products
router.get("/", async (req, res) => {
    try {
      const allProducts = await Product.find();
      res.status(200).json(allProducts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error getting all the products"})
    }
  });
  
// GET - Reads one product & populates with reviews
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
      const product = await Product.findById(productId).populate("reviews")
      if (!product) {
        return res.status(404).json({ message: "Product not found"})
      }
      res.status(200).json(product);
      
  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Error getting the product requested"})
  }
})

// POST - Creates one review associated with one product
router.post("/:productId/reviews", isAuthenticated, async (req, res) => {
  const { productId } = req.params;
  const payload = req.body;
  const { userId } = req.tokenPayload;
  payload.author = userId; // sets the author to the authenticated user's ID

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    payload.product = productId; // Associate the review with the product

    const review = await Review.create(payload);
    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Push the review directly into the product's reviews array
    await Product.findByIdAndUpdate(productId, { $push: { reviews: review } }, { new: true});
    res.status(201).json({ message: "Review created successfully", review });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create the review" })
  }
});

// PUT - Updates one review
router.put("/:productId/reviews/:reviewId", isAuthenticated, async (req, res) => {
  const { reviewId } = req.params;
  const payload = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true});
    if (!updatedReview) {
      return res.status(404).json({ message: "Updated review not found" })
    }
    res.status(200).json(updatedReview);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update the review" })
  }
})

// DELETE -  Deletes one review
router.delete("/:productId/reviews/:reviewId", isAuthenticated, async (req, res) => {
  const { reviewId } = req.params
   try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Deleted review not found or already deleted." })
    }
    res.status(200).send();
    //res.status(200).json({ messafe: "Review deleted successfully."})
  } catch (error) {
    res.status(500).json({ error, message: "Failed to delete review." });
  }
});
  

module.exports = router;