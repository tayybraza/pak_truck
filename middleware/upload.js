const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to ensure the directory exists
const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });  // Create the directory if it doesn't exist
    }
};


// Set up storage engine for product images
const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/img/product'); // Set the upload folder path for product images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-product-${file.originalname}`); // Unique filename for product images
    }
});

// Set up storage engine for category images
const categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/img/category'); // Set the upload folder path for category images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-category-${file.originalname}`); // Unique filename for category images
    }
});

// Set up storage engine for user images
const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/img/user'; // Path for storing user images
        ensureDirectoryExistence(dir);  // Ensure the directory exists
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-user-${file.originalname}`); // Unique filename for user images
    }
});


// Create multer upload instances
const uploadProduct = multer({ storage: productStorage });
const uploadCategory = multer({ storage: categoryStorage });
const uploadUser = multer({ storage: userStorage }); // New instance for user images

// Export the upload instances for use in routes
module.exports = { uploadProduct, uploadCategory, uploadUser }; // Export user upload instance
