import express from "express";
import { addToCart, getCart, updateCartItemQuantity, deleteCartItem, deleteCart } from "../controllers/cart.controller.js";
import { verifyToken } from "../utils/verifyUser.js"; // Middleware to verify JWT token

const router = express.Router();

// Add product to cart
router.post("/add", verifyToken, addToCart);

// Get cart details
router.get("/getcart/:userId", getCart);

// Update product quantity in the cart
router.put("/:userId/:productId", updateCartItemQuantity);

// Delete a product from the cart
router.delete("/:userId/:productId", deleteCartItem);

// Delete the entire cart
router.delete("/:userId", deleteCart);

export default router;