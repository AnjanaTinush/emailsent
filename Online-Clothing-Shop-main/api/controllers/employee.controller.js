import express from "express";
import jwt from "jsonwebtoken";
import Employee from "../models/employee.model.js"; // Adjust the path as necessary

const router = express.Router();

// Login route
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the employee exists
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored password (plaintext comparison)
    if (password !== employee.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: employee._id, email: employee.email },
      process.env.JWT_SECRET, // Make sure to set this in your environment variables
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Respond with the token and employee details (excluding the password)
    res.status(200).json({
      message: "Login successful",
      token,
      employee: {
        id: employee._id,
        email: employee.email,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      },
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

// Add Employee route
export const addEmployee = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the employee already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this email already exists" });
    }

    // Create a new employee
    const newEmployee = new Employee({ email, password });

    // Save the employee to the database
    await newEmployee.save();

    // Respond with the created employee (excluding the password)
    res.status(201).json({
      message: "Employee added successfully",
      employee: {
        id: newEmployee._id,
        email: newEmployee.email,
        createdAt: newEmployee.createdAt,
        updatedAt: newEmployee.updatedAt,
      },
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

// Export the router and methods
export default router;