const router = require("express").Router();
const Product = require("../models/Product.model");
const Review = require("../models/Review.model");
const { isAuthenticated } = require("../middlewares/auth.middleware")

// Endpoint / => /api/products

// GET all products
router.get("/", async (req, res) => {
    try {
      const allProducts = await Product.find();
      res.status(200).json(allProducts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error getting all the products"})
    }
  });
  
// GET product and populate with reviews
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

// POST review associated with one product
router.post("/:productId/reviews", isAuthenticated, async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.tokenPayload;
  const payload = req.body;
  payload.product = productId; // Associates the review with the product
  payload.author = userId; // Sets the author to the authenticated user's ID

  try {
    // Retrieves the book form the database using its ID (to ensure the book exists and can be updated)
    const product = await Product.findById(productId); 
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // creates a review
    const review = await Review.create(payload);
    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Push the review directly into the product's reviews array
    await Product.findByIdAndUpdate(productId, { $push: { reviews: review._id } }, { new: true});
    res.status(201).json({ message: "Review created successfully", review });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create the review" })
  }
});

// PUT (update) review 
router.put("/:productId/reviews/:reviewId", isAuthenticated, async (req, res) => {
  const { productId, reviewId } = req.params;
  const { userId } = req.tokenPayload; 
  const payload = req.body;

  try {
    // Checks if review exists in the database
    const review = await Review.findById(reviewId)
      if (!review) {
        return res.status(404).json({ message: "Review not found."})
      }

      // Checks if the review belongs to the specified product
      if (review.product !== productId) {
        return res.status(400).json({ message: "Review does not belong to the specified product." });
      }

      if (review.author == userId) {
      // Checks if the review exists in the database and updates it
      const updatedReview = await Review.findByIdAndUpdate(reviewId, payload, { new: true});
      res.status(200).json(updatedReview);
        if (!updatedReview) {
          return res.status(404).json({ message: "Updated review not found." })
        } else {
          res.status(403).json({message: "You are not the right user to update this review."});
        }
      }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update the review" })
  }
})

// DELETE review
router.delete("/:productId/reviews/:reviewId", isAuthenticated, async (req, res) => {
  const { productId, reviewId } = req.params
  const { userId } = req.tokenPayload; 

   try {
    // Checks if the review exists in the database 
    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: "Review not found."})
    }

    // Checks if the review belongs to the specified product
    if (review.product !== productId) { // review.product.toString() !== productId ?
      return res.status(400).json({ message: "Review does not belong to the specified product." });
    }

    // Checks if the user is allowed to delete the review
    if (review.author == userId) {
      // Checks if the review exists in the database and deletes it
      const deletedReview = await Review.findByIdAndDelete(reviewId);
      if (!deletedReview) {
        return res.status(404).json({ message: "Deleted review not found or already deleted." })
      }
      res.status(200).send(); // Sends a plain text response to the client
      //res.status(200).json({ message: "Review deleted successfully."}) // Sends a JSON response with structured data included. 
    } else {
      res.status(400).json({ message: "You are not allowed to delete the review." });
    }

  } catch (error) {
    res.status(500).json({ error, message: "Failed to delete review." });
  }
});
  

module.exports = router;