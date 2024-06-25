const path = require("path");
const productModel = require("../models/productModel");
const fs = require("fs");

const createProduct = async (req, res) => {
  //check incoming data
  console.log(req.body);
  console.log(req.files);

  //Task: destructuring, validation
  const { productName, productPrice, productCategory, productDescription } =
    req.body;

  if (
    !productName ||
    !productPrice ||
    !productCategory ||
    !productDescription
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  //check product image
  if (!req.files || !req.files.productImage) {
    return res.status(400);
  }

  const { productImage } = req.files;

  //uploading
  //1. Genarate unique name for each file
  const imageName = `${Date.now()}-${productImage.name}`;
  //2. define sspecific path
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );
  //3. Upload to that path
  try {
    await productImage.mv(imageUploadPath);

    //save to data database
    const newProduct = new productModel({
      productName: productName,
      productPrice: productPrice,
      productCategory: productCategory,
      productDescription: productDescription,
      productImage: imageName,
    });
    const product = await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product Created",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

//fetch all products
const getAllProducts = async (req, res) => {
  try {
    //logic
    //Find all the products
    const products = await productModel.find({});
    // send response
    res.status(201).json({
      success: true,
      message: "Product fetched successfully!",
      products: products,
    });
  } catch (error) {
    console.log(error);
  }
};
// fetch single product
const getProduct = async (req, res) => {
  // receive id from URL
  const productId = req.params.id;

  try {
    const product = await productModel.findById(productId);
    console.log(product);
    res.status(201).json({
      success: true,
      message: "Product Fetched!",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Server Error!",
    });
  }
};

//delete product
const deleteProduct = async (req, res) => {
  //get product id
  const productId = req.params.id;

  try {
    await productModel.findByIdAndDelete(productId);

    res.status(201).json({
      success: true,
      message: "Product Deleted!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//update product
//1.Get a update id
//2. If new image is provided
//3. Upload (public)
//4. Delete old Image
//5.Update Products

const updateProduct = async (req, res) => {
  try {
    //if there is files, upload new and delete the old one
    if (req.files && req.files.productImage) {
      //upload new to /public/products
      //1.Destrusture files
      const { productImage } = req.files;

      //make a new image name
      //1. Genarate unique name for each file
      const imageName = `${Date.now()}-${productImage.name}`;
      //2. define sspecific path
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );

      //move to folder
      await productImage.mv(imageUploadPath);

      //replace productImage name to new name
      req.body.productImage = imageName;

      //# Delete the old image
      // Find  produc tInfo (e have onlby ID)
      const existingProduct = await productModel.findById(req.params.id);

      //Search that iomage in directory
      if (req.body.productImage) {
        //if new image is uploaaded, then only remove old image
        const oldImagePath = path.join(
          __dirname,
          `../public/products/${existingProduct.productImage}`
        );
        //delete from file system
        fs.unlinkSync(oldImagePath);
      }
    }
    //update in database
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    //send a response
    res.status(201).json({
      success: true,
      message: "Product Updated!",
      updatedProduct: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error,
    });
  }
};

//Pagination
const productPagination = async (req, res) => {
  // Result per page
  const resultPerPage = 2;

  //page no (received form user)
  const pageNo = req.query.page;
  try {
    const products = await productModel
      .find({})
      .skip((pageNo - 1) * resultPerPage)
      .limit(resultPerPage);

    //if there is no product
    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No product found",
      });
    }
    res.status(400).json({
      success: true,
      message: "Product fetched",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  productPagination,
};
