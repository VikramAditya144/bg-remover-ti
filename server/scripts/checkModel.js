const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const AIModel = require('../models/AIModel');

async function checkModels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find all models
    const models = await AIModel.find({});
    console.log('All models:', JSON.stringify(models, null, 2));
    
    // Find active model
    const activeModel = await AIModel.findOne({ isActive: true });
    console.log('Active model:', JSON.stringify(activeModel, null, 2));
    
    // Update active model if needed
    if (activeModel) {
      const updated = await AIModel.findByIdAndUpdate(
        activeModel._id,
        { 
          path: '/home/vikramaditya/Desktop/ti-model/server/models/birefnet',
          modelPath: '/home/vikramaditya/Desktop/ti-model/server/models/birefnet'
        },
        { new: true }
      );
      console.log('Updated model:', JSON.stringify(updated, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkModels();