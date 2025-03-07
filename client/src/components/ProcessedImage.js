
// client/src/components/ProcessedImage.js
import React from 'react';

const ProcessedImage = ({ original, processed }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Processed Result</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original image */}
        <div>
          <h3 className="font-medium mb-2">Original Image</h3>
          <div className="border rounded-md p-2">
            <img
              src={original}
              alt="Original"
              className="max-w-full h-auto mx-auto"
            />
          </div>
        </div>
        
        {/* Processed image */}
        <div>
          <h3 className="font-medium mb-2">Processed Image</h3>
          <div className="border rounded-md p-2 bg-gray-100">
            <img
              src={processed}
              alt="Processed"
              className="max-w-full h-auto mx-auto"
            />
          </div>
          
          {/* Download button */}
          <div className="mt-4">
            <a
              href={processed}
              download="processed-image.png"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Download Processed Image
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessedImage;
