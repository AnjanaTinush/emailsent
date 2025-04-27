import express from "express";
import { createCheckout, getCheckoutsByUser, getAllCheckouts, getCheckoutDetails, updateCheckoutStatus, deleteCheckout } from "../controllers/checkout.controller.js";
import upload from "../middleware/multer.config.js"; // Middleware for file upload

const router = express.Router();

router.post("/checkout", upload.single("receipt"), createCheckout);

// Fetch checkouts by user ID
router.get("/checkouts/:userId", getCheckoutsByUser);

// GET /api/checkouts - Get all checkouts
router.get("/", getAllCheckouts);

router.get("/:checkoutId", getCheckoutDetails);

// PATCH /api/checkout/:checkoutId/status - Update checkout status
router.patch("/:checkoutId/status", updateCheckoutStatus);

// DELETE /api/checkout/:checkoutId - Delete checkout
router.delete("/:checkoutId", deleteCheckout);

export default router;