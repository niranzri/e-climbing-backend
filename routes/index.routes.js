const router = require('express').Router() // creates a new object from the Router class 

router.get('/', (req, res) => {
  res.json('All good in here')
})

const productsRouter = require("./product.routes");
router.use("/products", productsRouter);

module.exports = router