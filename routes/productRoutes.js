const router = require("express").Router();
const productControllers = require("../controllers/productControllers");
const { authGuard, adminGuard } = require("../middleware/authGuard");

// Make a create user API
router.post("/create", productControllers.createProduct);

// controllers -routes- (Index.js)

//fetch all
//http://localhost:8000/api/product/get_all_products
router.get("/get_all_products", authGuard, productControllers.getAllProducts);

//fetch single product
// if POST, body(data)
router.get("/get_single_product/:id", authGuard, productControllers.getProduct);

//delte Product
router.delete(
  "/delete_product/:id",
  adminGuard,
  productControllers.deleteProduct
);

//update Product
router.put("/update_product/:id", adminGuard, productControllers.updateProduct);

//exporting
module.exports = router;
