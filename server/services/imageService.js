// server/services/imageService.js
const cloudinary = require('../config/cloudinary');
const uuid = require('uuid');
const axios = require('axios');
const sharp = require('sharp');
const AIModelService = require('./aiModelService');
const { Readable } = require('stream');

// Convert buffer to stream for Cloudinary upload
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    }
  });
  return readable;
};

// Download image from URL
const downloadImage = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error('Failed to download image from URL');
  }
};

// Process image and upload to Cloudinary
const processAndStoreImage = async (imageBuffer) => {
  try {
    // Generate unique ID for this image pair
    const imageId = uuid.v4();
    
    // Convert buffer to sharp object for processing
    const sharpImage = sharp(imageBuffer);
    
    // Get image metadata
    const metadata = await sharpImage.metadata();
    
    // Resize large images for better performance (if needed)
    let processedBuffer = imageBuffer;
    if (metadata.width > 1200 || metadata.height > 1200) {
      processedBuffer = await sharpImage
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();
    }
    
    // Upload original image to Cloudinary
    const originalUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'background_removal/original',
          public_id: imageId,
          tags: ['background_removal', 'original']
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      bufferToStream(processedBuffer).pipe(uploadStream);
    });
    
    // Process the image with AI model
    const aiModelService = new AIModelService();
    const processedImageBuffer = await aiModelService.removeBackground(processedBuffer);
    
    // Upload processed image to Cloudinary
    const processedUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'background_removal/processed',
          public_id: imageId,
          tags: ['background_removal', 'processed']
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      bufferToStream(processedImageBuffer).pipe(uploadStream);
    });
    
    return {
      originalImageUrl: originalUploadResult.secure_url,
      processedImageUrl: processedUploadResult.secure_url,
      imageId
    };
  } catch (error) {
    console.error('Error in processing and storing image:', error);
    throw new Error('Failed to process and store image');
  }
};

module.exports = {
  downloadImage,
  processAndStoreImage
};