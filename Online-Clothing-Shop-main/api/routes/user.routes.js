import express from "express";
import { registerUser, signin, getAllUsers, getUserById, updateUser, deleteUser, signOut } from "../controllers/user.controller.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Sign in a user
router.post("/signin", signin);

// Get all users
router.get("/users", getAllUsers);



// Get user by ID
router.get("/user/:id", getUserById);



// Update user details
router.put("/update/:id", updateUser);

// Delete a user
router.delete("/user/:id", deleteUser);

// Sign out user
router.get("/signout", signOut);

export default router;
