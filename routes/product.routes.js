const router = require("express").Router();
const Product = require("../models/Product.model");

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
        const oneProduct = await Product.findById(productId).populate("reviews")
        res.status(200).json(oneProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error getting the product requested"})
    }
  })

module.exports = router;