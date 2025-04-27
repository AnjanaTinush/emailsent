import express from "express";
import { submitFeedback, getFeedbackByOrderId, updateFeedback, deleteFeedback, getAllFeedback, deleteAdminFeedback, getFeedbackByProductId } from "../controllers/feedback.controller.js";

const router = express.Router();

// Submit feedback for an order
router.post("/add/:orderId", submitFeedback);

router.get("/order/:orderId", getFeedbackByOrderId);

// PATCH /api/feedback/update/:orderId - Update feedback
router.patch("/update/:orderId", updateFeedback);

// DELETE /api/feedback/delete/:orderId - Delete feedback
router.delete("/delete/:orderId", deleteFeedback);

// GET /api/feedback - Get all feedback
router.get("/", getAllFeedback);

// DELETE /api/feedback/:feedbackId - Delete feedback
router.delete("/:feedbackId", deleteAdminFeedback);

router.get("/product/:productId", getFeedbackByProductId);

export default router;