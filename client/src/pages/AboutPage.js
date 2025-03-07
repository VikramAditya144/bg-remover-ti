
// client/src/pages/AboutPage.js
import React from 'react';

const AboutPage = () => {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">About Our Background Removal Tool</h1>
        <p className="text-lg text-gray-700 mb-8">
          Learn about our AI-powered background removal technology and how it works.
        </p>
      </section>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <p className="mb-4">
          Our background removal tool uses advanced deep learning models to accurately identify and remove backgrounds from images. 
          The process is fully automated and works in seconds.
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Key Features</h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Automatic background detection and removal</li>
          <li>Support for various image formats</li>
          <li>High-quality output with transparent backgrounds</li>
          <li>Fast processing times</li>
          <li>Cloud storage for your processed images</li>
          <li>Completely free to use</li>
        </ul>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Technology Stack</h3>
        <p>
          Our application is built using the MERN stack (MongoDB, Express.js, React, and Node.js) with TensorFlow.js for the AI component.
          We use Cloudinary for image storage and processing.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions, feedback, or issues with our tool, please don't hesitate to reach out to us at:
        </p>
        <p className="text-blue-600 font-medium mt-2">
          support@backgroundremoval.example.com
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
