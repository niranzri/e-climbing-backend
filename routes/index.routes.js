const router = require('express').Router() // creates a new object from the Router class 

router.get('/', (req, res) => {
  res.json('All good in here')
})

module.exports = router