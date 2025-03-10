// client/src/pages/HomePage.js
import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ProcessedImage from '../components/ProcessedImage';

const HomePage = () => {
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageProcessed = (image) => {
    setProcessedImage(image);
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-lg text-gray-700 mb-8">
          Upload an image and our AI will automatically remove the background, giving you a clean, transparent image.
        </p>
      </section>

      <ImageUploader onImageProcessed={handleImageProcessed} />

      {processedImage && (
        <ProcessedImage
          original={processedImage.originalUrl}
          processed={processedImage.processedUrl}
        />
      )}
    </div>
  );
};

export default HomePage;
