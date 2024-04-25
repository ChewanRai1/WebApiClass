const router = require('express').Router()
const productControllers = require('../controllers/productControllers')

// Make a create user API
router.post('/create',productControllers.createProduct)

// controllers -routes- (Index.js)

//exporting
module.exports = router;