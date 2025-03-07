import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = ({ onImageProcessed }) => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [inputMethod, setInputMethod] = useState('upload');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handle URL input
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  // Handle URL preview
  const handleUrlPreview = () => {
    if (imageUrl) {
      setPreview(imageUrl);
    }
  };

  // Process image
  const handleProcessImage = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let formData = new FormData();
      
      if (inputMethod === 'upload' && file) {
        formData.append('image', file);
      } else if (inputMethod === 'url' && imageUrl) {
        formData.append('imageUrl', imageUrl);
      } else {
        throw new Error('Please provide an image file or URL');
      }
      
      const response = await axios.post('/api/images/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.image) {
        onImageProcessed(response.data.image);
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while processing the image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Upload a new image</h2>
      
      {/* Input method selection */}
      <div className="mb-4">
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="inputMethod"
              value="upload"
              checked={inputMethod === 'upload'}
              onChange={() => setInputMethod('upload')}
            />
            <span className="ml-2">Upload Image</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="inputMethod"
              value="url"
              checked={inputMethod === 'url'}
              onChange={() => setInputMethod('url')}
            />
            <span className="ml-2">Image URL</span>
          </label>
        </div>
      </div>
      
      {/* File upload input */}
      {inputMethod === 'upload' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose an image file
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
        </div>
      )}
      
      {/* URL input */}
      {inputMethod === 'url' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter the URL of an image
          </label>
          <div className="flex">
            <input
              type="text"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleUrlPreview}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-200"
            >
              Preview
            </button>
          </div>
        </div>
      )}
      
      {/* Preview */}
      {preview && (
        <div className="mb-4">
          <p className="block text-sm font-medium text-gray-700 mb-2">Preview</p>
          <div className="border rounded-md p-2">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto max-h-64 mx-auto"
            />
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Process button */}
      <button
        onClick={handleProcessImage}
        disabled={loading || (!file && !imageUrl)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Process Image'}
      </button>
    </div>
  );
};

export default ImageUploader;
