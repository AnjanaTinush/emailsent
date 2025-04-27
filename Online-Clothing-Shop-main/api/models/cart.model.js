import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Store user ID as a string
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, // Reference to Product Model
          ref: "Product", // Name of the referenced model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensure quantity is at least 1
        },
        price: {
          type: Number,
          required: true,
          min: 0, // Ensure price is non-negative
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0, // Ensure total price is non-negative
    },
  },
  { timestamps: true } // Add createdAt and updatedAt fields
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;