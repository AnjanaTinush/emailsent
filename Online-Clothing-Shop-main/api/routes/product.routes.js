import express from "express";
import {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProductStatus,
  getProductById, // Import the new controller
  updateProduct, // Import the new controller
  getProductdetailsById,
  getAllActiveProducts,
} from "../controllers/product.controller.js"; // Import product controllers

const router = express.Router();

// Add a new product (with image upload)
router.post("/add", addProduct);


// Get all products
router.get("/", getAllProducts);

router.get("/active", getAllActiveProducts);

// Get a product by ID
router.get("/:id", getProductById);

// Delete a product
router.delete("/delete/:id", deleteProduct);

// Update product status
router.patch("/status/:id", updateProductStatus);

// Update product details (including image upload)
router.put("/update/:id", updateProduct);

router.get("/details/:productId", getProductdetailsById);



export default router;