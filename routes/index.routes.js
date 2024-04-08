const router = require('express').Router() // creates a new object from the Router class 

router.get('/', (req, res) => {
  res.json('All good in here')
})

const productsRouter = require("./product.routes");
router.use("/products", productsRouter);

const usersRouter = require("./user.routes");
router.use("/users", usersRouter);

module.exports = router