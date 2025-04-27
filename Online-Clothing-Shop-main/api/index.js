import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import routes
import userRouter from './routes/user.routes.js';
import employeeRouter from './routes/employee.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import checkoutRouter from "./routes/checkout.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

// Initialize Express app
const app = express();

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Serve static files from the "uploads" directory
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); // Get the current directory path

// Create the "uploads" directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));
console.log("Serving static files from:", uploadsDir);

// Routes
app.use('/api/users', userRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/feedback", feedbackRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000!!!');
});