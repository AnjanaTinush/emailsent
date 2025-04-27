import mongoose from "mongoose";

// Define the Product Schema
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Store the image URL or file path
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensure price is non-negative
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, // Ensure quantity is non-negative
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"], // Only allow "active" or "inactive"
      default: "active", // Default status is "active"
    },
  },
  { timestamps: true } // Add createdAt and updatedAt fields
);

// Create the Product model
const Product = mongoose.model("Product", productSchema);

export default Product;