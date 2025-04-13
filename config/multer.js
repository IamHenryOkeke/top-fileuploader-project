const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage (files will be saved in 'uploads' folder)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gdrive", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    transformation: [{ width: 800, height: 800, crop: "limit" }], // optional
  },
});

// File filter function (allows only specific file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, GIF, and PDF files are allowed"), false);
  }
  cb(null, true);
};

// Multer middleware configuration
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
  fileFilter,
});

module.exports = upload;