// server/services/aiModelService.js
const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const AIModel = require('../models/AIModel');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const os = require('os');

class AIModelService {
  constructor() {
    this.model = null;
    this.modelPath = null;
    this.isLoading = false;
    this.modelType = null; // 'tensorflow' or 'python'
  }
  
  async getActiveModelPath() {
    try {
      const activeModel = await AIModel.findOne({ isActive: true });
      if (!activeModel) {
        throw new Error('No active AI model found');
      }
      
      // Debug the model document
      console.log('Active model document:', JSON.stringify(activeModel, null, 2));
      
      // Check all possible field names
      const path = activeModel.path || activeModel.modelPath || activeModel.model_path;
      
      if (!path) {
        throw new Error('Model path not found in model document');
      }
      
      // Determine model type based on path or model name
      if (activeModel.name && activeModel.name.includes('BiRefNet')) {
        this.modelType = 'python';
      } else {
        this.modelType = 'tensorflow';
      }
      
      console.log(`Using model type: ${this.modelType}, path: ${path}`);
      return path;
    } catch (error) {
      console.error('Error getting active model:', error);
      throw error;
    }
  }
  
  async loadModel() {
    try {
      if (this.isLoading) {
        // Wait until model is loaded if another request is loading it
        while (this.isLoading) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.model;
      }
      
      this.isLoading = true;
      
      // Get current active model path
      const modelPath = await this.getActiveModelPath();
      
      // If model is already loaded and path hasn't changed, return it
      if (this.model && this.modelPath === modelPath) {
        this.isLoading = false;
        return this.model;
      }
      
      // If using Python model, we don't actually load the model in Node.js
      if (this.modelType === 'python') {
        this.model = { path: modelPath, type: 'python' };
        this.modelPath = modelPath;
        this.isLoading = false;
        console.log('Python model path stored (will be loaded during inference)');
        return this.model;
      }
      
      // Load TensorFlow model
      console.log(`Loading TensorFlow model from: ${modelPath}`);
      this.model = await tf.node.loadSavedModel(modelPath);
      this.modelPath = modelPath;
      this.isLoading = false;
      
      return this.model;
    } catch (error) {
      this.isLoading = false;
      console.error('Error loading model:', error);
      throw new Error('Failed to load the AI model');
    }
  }
  
  async removeBackground(imageBuffer) {
    try {
      // Get the model path directly
      const modelPath = await this.getActiveModelPath();
      console.log(`Model path for background removal: ${modelPath}`);
      
      // Load model info
      await this.loadModel();
      
      // Use different processing based on model type
      if (this.modelType === 'python') {
        return await this.removeBackgroundWithPython(imageBuffer, modelPath);
      } else {
        return await this.removeBackgroundWithTensorflow(imageBuffer);
      }
    } catch (error) {
      console.error('Error removing background:', error);
      throw new Error('Failed to remove background from image');
    }
  }
  
  // Add modelPath as a parameter to ensure it's available
  async removeBackgroundWithPython(imageBuffer, modelPath) {
    try {
      console.log('Using Python (BiRefNet) for background removal');
      console.log(`Model path: ${modelPath}`);
      
      // Create temporary files for input and output
      const tempInputFile = path.join(os.tmpdir(), `input-${Date.now()}.png`);
      const tempOutputFile = path.join(os.tmpdir(), `output-${Date.now()}.png`);
      
      // Write the input buffer to a temp file
      await fs.writeFile(tempInputFile, imageBuffer);
      
      // Path to the Python script - use the passed modelPath parameter
      const scriptPath = path.join(modelPath, 'inference.py');
          
      // Check if script exists
      try {
        await fs.access(scriptPath);
        console.log(`Found inference script at ${scriptPath}`);
      } catch (error) {
        console.error(`Inference script not found at ${scriptPath}. Error: ${error.message}`);
        throw new Error('Inference script not found');
      }
      
      console.log(`Running inference with input: ${tempInputFile}, output: ${tempOutputFile}`);
      
      // Run the Python script
      return new Promise((resolve, reject) => {
        const process = spawn('python3', [
          scriptPath,
          '--input', tempInputFile,
          '--output', tempOutputFile
        ]);
        
        let stdoutData = '';
        let stderrData = '';
        
        process.stdout.on('data', data => {
          stdoutData += data.toString();
          console.log(`Python stdout: ${data.toString().trim()}`);
        });
        
        process.stderr.on('data', data => {
          stderrData += data.toString();
          console.error(`Python stderr: ${data.toString().trim()}`);
        });
        
        process.on('close', async code => {
          try {
            if (code === 0) {
              console.log('Background removal completed successfully');
              // Read the output file as a buffer
              const outputBuffer = await fs.readFile(tempOutputFile);
              
              // Clean up temp files
              fs.unlink(tempInputFile).catch(err => console.error('Error deleting temp input file:', err));
              fs.unlink(tempOutputFile).catch(err => console.error('Error deleting temp output file:', err));
              
              resolve(outputBuffer);
            } else {
              console.error(`Python process exited with code ${code}`);
              console.error(`STDERR: ${stderrData}`);
              reject(new Error('Failed to remove background from image'));
            }
          } catch (error) {
            console.error('Error processing output file:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error in Python background removal:', error);
      throw new Error(`Failed to remove background with Python: ${error.message}`);
    }
  }
  
  async removeBackgroundWithTensorflow(imageBuffer) {
    try {
      console.log('Using TensorFlow for background removal');
      
      // Process image with sharp
      const { data, info } = await sharp(imageBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      const { width, height, channels } = info;
      
      // Convert to tensor
      const imageTensor = tf.tensor3d(new Uint8Array(data), [height, width, channels])
        .div(255.0)
        .expandDims(0);
      
      // Normalize tensor
      const meanImageNet = tf.tensor([0.485, 0.456, 0.406]);
      const stdImageNet = tf.tensor([0.229, 0.224, 0.225]);
      const normalizedTensor = imageTensor.slice([0, 0, 0, 0], [1, height, width, 3])
        .sub(meanImageNet)
        .div(stdImageNet);
      
      // Make prediction
      const predictions = this.model.predict(normalizedTensor);
      
      // Process the mask
      const maskTensor = predictions.sigmoid().squeeze();
      const maskArray = await maskTensor.array();
      
      // Create alpha channel mask
      const maskBuffer = Buffer.alloc(width * height);
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          maskBuffer[i * width + j] = Math.round(maskArray[i][j] * 255);
        }
      }
      
      // Apply mask to original image
      const processedImageBuffer = await sharp(imageBuffer)
        .ensureAlpha()
        .joinChannel(maskBuffer, { raw: { width, height, channels: 1 } })
        .toFormat('png')
        .toBuffer();
      
      // Clean up tensors
      tf.dispose([imageTensor, normalizedTensor, meanImageNet, stdImageNet, predictions, maskTensor]);
      
      return processedImageBuffer;
    } catch (error) {
      console.error('Error in TensorFlow background removal:', error);
      throw new Error('Failed to remove background with TensorFlow');
    }
  }
  
  // Fallback method for simple background removal
  async removeBackgroundSimple(imageBuffer) {
    try {
      console.log('Using simple background removal fallback');
      
      // Use sharp to create a simple mask (this is just a placeholder)
      const mask = await sharp(imageBuffer)
        .greyscale()
        .normalize()
        .threshold(128)
        .toBuffer();
      
      // Apply the mask to create transparent background
      const processedImageBuffer = await sharp(imageBuffer)
        .ensureAlpha()
        .composite([{
          input: mask,
          blend: 'dest-in'
        }])
        .png()
        .toBuffer();
      
      return processedImageBuffer;
    } catch (error) {
      console.error('Error in simple background removal:', error);
      throw new Error('Failed to remove background from image');
    }
  }
}

module.exports = AIModelService;