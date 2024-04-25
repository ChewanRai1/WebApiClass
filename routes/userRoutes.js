const router = require('express').Router()
const userControllers = require('../controllers/userControllers')

// Make a create user API
router.post('/create',userControllers.createUser)

// controllers -routes- (Index.js)

//exporting
module.exports = router;