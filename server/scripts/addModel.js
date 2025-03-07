const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

async function addModel() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    const modelCollection = db.collection('aimodels');
    
    // Deactivate any currently active models
    await modelCollection.updateMany(
      { isActive: true },
      { $set: { isActive: false } }
    );
    
    // Add the new model
    await modelCollection.insertOne({
      name: "BiRefNet Background Removal Model",
      path: "/home/vikramaditya/Desktop/ti-model/server/models/birefnet",
      version: "1.0.0",
      description: "High-resolution image segmentation model for background removal",
      isActive: true,
      createdAt: new Date()
    });
    
    console.log('Model added successfully!');
  } finally {
    await client.close();
  }
}

addModel().catch(console.error);