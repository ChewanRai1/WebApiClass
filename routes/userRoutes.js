const router = require("express").Router();
const userControllers = require("../controllers/userControllers");

// Make a create user API
router.post("/create", userControllers.createUser);

// controllers -routes- (Index.js)

// login user api
router.post("/login", userControllers.loginUser);

// forgot password api
router.post("/forgot_password", userControllers.forgotPassword);

//exporting
module.exports = router;
