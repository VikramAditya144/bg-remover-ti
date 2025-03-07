const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/upload');
const imageService = require('../services/imageService');

// Get all processed images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process and upload an image
router.post('/process', upload.single('image'), async (req, res) => {
  try {
    // Check if file is uploaded or URL is provided
    let imageBuffer;
    if (req.file) {
      imageBuffer = req.file.buffer;
    } else if (req.body.imageUrl) {
      // Download image from URL
      imageBuffer = await imageService.downloadImage(req.body.imageUrl);
    } else {
      return res.status(400).json({ message: 'No image uploaded or URL provided' });
    }

    // Process the image
    const { originalImageUrl, processedImageUrl, imageId } = await imageService.processAndStoreImage(imageBuffer);

    // Save to database
    const newImage = new Image({
      imageId,
      originalUrl: originalImageUrl,
      processedUrl: processedImageUrl,
      createdAt: new Date()
    });
    
    await newImage.save();
    
    res.status(201).json({
      message: 'Image processed successfully',
      image: newImage
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ message: 'Error processing image' });
  }
});

// Delete an image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from Cloudinary
    const originalPublicId = `background_removal/original/${image.imageId}`;
    const processedPublicId = `background_removal/processed/${image.imageId}`;
    
    await cloudinary.uploader.destroy(originalPublicId);
    await cloudinary.uploader.destroy(processedPublicId);
    
    // Delete from database
    await Image.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
