import Checkout from "../models/checkout.model.js";
import Cart from "../models/cart.model.js";
import path from "path";

export const createCheckout = async (req, res) => {
  try {
    const { userId, address, phoneNumber, email, items, totalPrice } = req.body;
    const receipt = req.file ? path.basename(req.file.path) : null;

    // Create a new checkout
    const checkout = new Checkout({
      userId,
      address,
      phoneNumber,
      email,
      receipt,
      items: JSON.parse(items), // Convert JSON string back to array
      totalPrice,
      status: "Pending", // Default status
    });

    // Save the checkout to the database
    await checkout.save();

    // Clear the user's cart after checkout
    await Cart.deleteOne({ userId });

    res.status(201).json({ message: "Checkout created successfully", checkout });
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ message: "Failed to create checkout" });
  }
};

export const getCheckoutsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch checkouts for the user
      const checkouts = await Checkout.find({ userId })
        .populate("userId") // Populate user details (optional)
        .populate("items.productId"); // Populate product details
  
      if (!checkouts || checkouts.length === 0) {
        return res.status(404).json({ message: "No checkouts found for this user" });
      }
  
      res.status(200).json(checkouts);
    } catch (error) {
      console.error("Error fetching checkouts:", error);
      res.status(500).json({ message: "Failed to fetch checkouts" });
    }
  };

  // Get all checkouts
export const getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.find()
      .populate("userId", "username email") // Populate user details
      .populate("items.productId", "productName price"); // Populate product details

    res.status(200).json(checkouts);
  } catch (error) {
    console.error("Error fetching checkouts:", error);
    res.status(500).json({ message: "Failed to fetch checkouts" });
  }
};

// Get checkout details by ID
export const getCheckoutDetails = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    // Find the checkout by ID and populate user and product details
    const checkout = await Checkout.findById(checkoutId)
      .populate("userId", "username email") // Populate user details
      .populate("items.productId", "productName price"); // Populate product details

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Send the checkout details
    res.status(200).json(checkout);
  } catch (error) {
    console.error("Error fetching checkout details:", error);
    res.status(500).json({ message: "Failed to fetch checkout details" });
  }
};

// Update checkout status
export const updateCheckoutStatus = async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled","Refund"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the checkout status
    const updatedCheckout = await Checkout.findByIdAndUpdate(
      checkoutId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedCheckout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    res.status(200).json({ message: "Checkout status updated successfully", checkout: updatedCheckout });
  } catch (error) {
    console.error("Error updating checkout status:", error);
    res.status(500).json({ message: "Failed to update checkout status" });
  }
};

// Delete checkout
export const deleteCheckout = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    // Find and delete the checkout
    const deletedCheckout = await Checkout.findByIdAndDelete(checkoutId);

    if (!deletedCheckout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    res.status(200).json({ message: "Checkout deleted successfully", checkout: deletedCheckout });
  } catch (error) {
    console.error("Error deleting checkout:", error);
    res.status(500).json({ message: "Failed to delete checkout" });
  }
};