import multer from "multer";
import path from "path";
import fs from "fs";

// Create the "uploads" directory if it doesn't exist
const uploadsDir = "./api/uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp and a random string
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `image-${uniqueSuffix}${extension}`); // Save only the filename
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Only images (jpeg, jpg, png, gif) are allowed!"));
    }
  },
});

export default upload;