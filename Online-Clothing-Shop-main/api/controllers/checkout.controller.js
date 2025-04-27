import Checkout from "../models/checkout.model.js";
import Cart from "../models/cart.model.js";
import path from "path";
import nodemailer from "nodemailer";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'oepmsystem@gmail.com',
    pass: 'uvym yofx swbz lbbg',
  },
});

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
      items: JSON.parse(items),
      totalPrice,
      status: "Pending",
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
        .populate("userId")
        .populate("items.productId");
  
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
      .populate("userId", "username email")
      .populate("items.productId", "productName price");

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

    const checkout = await Checkout.findById(checkoutId)
      .populate("userId", "username email")
      .populate("items.productId", "productName price");

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

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
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refund"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find and update the checkout status
    const updatedCheckout = await Checkout.findByIdAndUpdate(
      checkoutId,
      { status },
      { new: true }
    ).populate("userId", "username email")
     .populate("items.productId", "productName price"); // Also populate product details for the email

    if (!updatedCheckout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Send email notification if status is "Refund"
    if (status === "Refund") {
      // Use the email from the checkout record
      const userEmail = updatedCheckout.email;
      
      // Format the order date
      const orderDate = new Date(updatedCheckout.createdAt).toLocaleDateString();
      const refundDate = new Date().toLocaleDateString();
      
      // Get items information for the email
      const itemsList = updatedCheckout.items.map(item => {
        return `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${item.productId?.productName || 'Product'}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">$${(item.productId?.price * item.quantity).toFixed(2) || '0.00'}</td>
          </tr>
        `;
      }).join('');
      
      // Create email options with improved styling matching your theme
      const mailOptions = {
        from: 'oepmsystem@gmail.com',
        to: userEmail,
        subject: "Your Order Refund Confirmation",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F5F3F4; padding: 0;">
            <!-- Header -->
            <div style="background-color: #161A1D; padding: 20px; text-align: center;">
              <h1 style="color: #F5F3F4; margin: 0; font-size: 24px;">Refund Confirmation</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px; background-color: white; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
              <p style="margin-top: 0; color: #333;">Dear ${updatedCheckout.userId?.username || 'Customer'},</p>
              
              <p style="color: #333;">We're writing to confirm that your refund for order <strong>#${updatedCheckout._id.toString().slice(-8)}</strong> has been processed successfully.</p>
              
              <!-- Order Information Box -->
              <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #161A1D; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Refund Details</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Order ID:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">#${updatedCheckout._id.toString().slice(-8)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Order Date:</td>
                    <td style="padding: 8px 0; text-align: right;">${orderDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Refund Date:</td>
                    <td style="padding: 8px 0; text-align: right;">${refundDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #555;">Refund Amount:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #660708;">$${updatedCheckout.totalPrice.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Products Table -->
              <h3 style="color: #161A1D; margin-bottom: 15px;">Refunded Items</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <thead>
                  <tr style="background-color: #f5f3f4;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0;">Product</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e0e0e0;">Quantity</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e0e0e0;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                  <tr>
                    <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold;">$${updatedCheckout.totalPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              
              <p style="color: #333;">The refunded amount should appear in your account within 3-5 business days, depending on your payment provider.</p>
              
              <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin: 20px 0;">
                <p style="margin-top: 0; color: #333;"><strong>Need help?</strong> If you have any questions about your refund, please contact our customer support team at <a href="mailto:support@example.com" style="color: #660708; text-decoration: none;">support@example.com</a>.</p>
              </div>
              
              <p style="color: #333;">Thank you for your understanding.</p>
              
              <p style="color: #333; margin-bottom: 0;">Best regards,<br>The OEPM Team</p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #161A1D; color: #F5F3F4; padding: 20px; text-align: center; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">© 2025 OEPM System. All rights reserved.</p>
              <p style="margin: 0;">This is an automated email, please do not reply.</p>
            </div>
          </div>
        `
      };

      // Send the email
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Refund email sent to ${userEmail}`);
      } catch (emailError) {
        console.error("Error sending refund email:", emailError);
        // Note: We don't want to fail the status update if the email fails
      }
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