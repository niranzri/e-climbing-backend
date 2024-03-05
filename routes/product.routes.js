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
        res.status(5000).json({message: "Error getting all the products"})
    }
  });
  
  // GET - Reads one product & populate with reviews
  
  

module.exports = router;