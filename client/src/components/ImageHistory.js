// client/src/components/ImageHistory.js
import React from 'react';

const ImageHistory = ({ images, onDelete }) => {
  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No processed images found in your history.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Image History</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image._id} className="border rounded-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={image.processedUrl}
                alt="Processed"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-2">
                Processed on {formatDate(image.createdAt)}
              </p>
              <div className="flex space-x-2">
                <a
                  href={image.processedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-1 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 text-sm"
                >
                  View
                </a>
                <a
                  href={image.processedUrl}
                  download="processed-image.png"
                  className="flex-1 px-3 py-1 bg-green-600 text-white text-center rounded-md hover:bg-green-700 text-sm"
                >
                  Download
                </a>
                <button
                  onClick={() => onDelete(image._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageHistory;