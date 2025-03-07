
// server/routes/modelRoutes.js
const express = require('express');
const router = express.Router();
const AIModel = require('../models/AIModel');

// Get all AI models
router.get('/', async (req, res) => {
  try {
    const models = await AIModel.find();
    res.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new AI model
router.post('/', async (req, res) => {
  try {
    const { name, description, modelPath } = req.body;
    
    // Create new model
    const newModel = new AIModel({
      name,
      description,
      modelPath
    });
    
    await newModel.save();
    
    res.status(201).json({
      message: 'AI model added successfully',
      model: newModel
    });
  } catch (error) {
    console.error('Error adding model:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Set active AI model
router.put('/setActive/:id', async (req, res) => {
  try {
    // First, set all models to inactive
    await AIModel.updateMany({}, { isActive: false });
    
    // Then set the selected model to active
    const model = await AIModel.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.json({
      message: 'Active model updated successfully',
      model
    });
  } catch (error) {
    console.error('Error updating active model:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;