import Cart from "../models/cart.model.js"; // Import the Cart model
import Product from "../models/product.model.js"; // Import the Product model

// Add a product to the cart
export const addToCart = async (req, res) => {
  const { productId, quantity, userId } = req.body;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user already has a cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the user doesn't have a cart, create a new one
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      // If the product is already in the cart, update the quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    // Calculate the total price of the cart
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save the cart to the database
    await cart.save();

    res.status(200).json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

// Get cart details for the current user
export const getCart = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  };

// Update product quantity in the cart
export const updateCartItemQuantity = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate the total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

// Delete a product from the cart
export const deleteCartItem = async (req, res) => {
    const { userId, productId } = req.params;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Remove the product from the cart
      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  
      // If the cart is empty, delete the cart document
      if (cart.items.length === 0) {
        await Cart.deleteOne({ userId });
        return res.status(200).json({ message: "Cart is empty and deleted", cart: null });
      }
  
      // Recalculate the total price
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
  
      await cart.save();
      res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      res.status(500).json({ message: "Failed to delete product from cart" });
    }
  };

// Delete the entire cart
export const deleteCart = async (req, res) => {
  const { userId } = req.params;

  try {
    await Cart.deleteOne({ userId });
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "Failed to delete cart" });
  }
};