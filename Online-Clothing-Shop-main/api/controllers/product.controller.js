import Product from "../models/product.model.js";
import upload from "../middleware/multer.config.js";
import path from "path";

export const addProduct = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { productName, description, price, quantity, category } = req.body;

      if (!productName || !description || !price || !quantity || !category) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Extract only the filename from the path
      const image = req.file ? path.basename(req.file.path) : null;

      const newProduct = new Product({
        productName,
        description,
        image,
        price,
        quantity,
        category,
      });

      await newProduct.save();

      res.status(201).json({
        message: "Product added successfully",
        product: newProduct,
      });
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllProducts = async (req, res) => {
    try {
      // Fetch all products from the database
      const products = await Product.find();
  
      // If no products are found, return a 404 response
      if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found" });
      }
  
      // Return the list of products
      res.status(200).json({
        message: "Products retrieved successfully",
        products: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  // Get all active products
export const getAllActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" }); // Filter by status: "Active"
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching active products:", error);
    res.status(500).json({ message: "Failed to fetch active products" });
  }
};

  // Controller to delete a product
export const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id; // Get product ID from request parameters
  
      // Find and delete the product
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      // If product not found, return 404
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Return success response
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const updateProductStatus = async (req, res) => {
    try {
      const productId = req.params.id; // Get product ID from request parameters
      const { status } = req.body; // Get new status from request body
  
      // Validate the status value
      if (status !== "active" && status !== "inactive") {
        return res.status(400).json({ message: "Status must be 'active' or 'inactive'" });
      }
  
      // Find and update the product status
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { status }, // Update the status field
        { new: true } // Return the updated product
      );
  
      // If product not found, return 404
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Return success response with updated product
      res.status(200).json({
        message: "Product status updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const updateProduct = async (req, res) => {
    try {
      // Use the same Multer middleware for image upload
      upload.single("image")(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
  
        const productId = req.params.id;
        const { productName, description, price, quantity, category, status } = req.body;
  
        // Find the product by ID
        let product = await Product.findById(productId);
  
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
  
        // Update product fields
        product.productName = productName;
        product.description = description;
        product.price = price;
        product.quantity = quantity;
        product.category = category;
        product.status = status;
  
        // Update image if a new file is uploaded
        if (req.file) {
          product.image = req.file ? path.basename(req.file.path) : null; // Save the new image path
        }
  
        // Save the updated product
        await product.save();
  
        res.status(200).json({
          message: "Product updated successfully",
          product,
        });
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
  // Controller to get a product by ID
export const getProductById = async (req, res) => {
    try {
      const productId = req.params.id; // Get product ID from request parameters
  
      // Find the product by ID
      const product = await Product.findById(productId);
  
      // If product not found, return 404
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Return the product details
      res.status(200).json({
        message: "Product retrieved successfully",
        product,
      });
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  // Get product details by ID
export const getProductdetailsById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

