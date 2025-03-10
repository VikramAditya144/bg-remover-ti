import React, { useState, useRef } from 'react';
import './ImageProcessor.css';

const ImageProcessor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      setSelectedFile(file);
      setOriginalImage(URL.createObjectURL(file));
      setProcessedImage(null);
      setError(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      setSelectedFile(file);
      setOriginalImage(URL.createObjectURL(file));
      setProcessedImage(null);
      setError(null);
      
      // Update the file input
      if (fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
      }
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setUploadProgress(0);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 300);
    
    try {
      const response = await fetch('/api/images/process', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      setProcessedImage(result.imageUrl);
      setUploadProgress(100);
    } catch (err) {
      console.error('Error processing image:', err);
      setError(`Failed to process image: ${err.message}`);
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImage) return;
    
    fetch(processedImage)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `processed-${selectedFile.name}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(err => {
        console.error('Error downloading image:', err);
        setError('Failed to download image');
      });
  };

  return (
    <div className="image-processor-container">
      <div className="section-header mb-8">
        <h1 className="section-title text-3xl font-bold mb-4">AI Background Remover</h1>
        <p className="section-subtitle text-lg text-gray-600">
          Professional background removal powered by state-of-the-art AI
        </p>
      </div>

      <div className="image-processor bg-white rounded-lg shadow-md p-6 mb-8">
        {!originalImage ? (
          <div 
            className="upload-area border-dashed border-2 border-gray-300 rounded-md p-6 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon mb-4">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 16L12 12M12 12L8 16M12 12V21M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.7607 3.05389 14.7595 4.69928 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="upload-text">
              <h3 className="text-xl font-semibold mb-2">Upload your image</h3>
              <p className="text-gray-600">Drag and drop your image here or click to browse</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              className="file-input" 
              accept="image/*" 
              onChange={handleFileSelect} 
            />
          </div>
        ) : (
          <div className="image-processing-area">
            <div className="image-preview-container mb-8">
              <div className="image-preview grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="image-card">
                  <div className="image-card-header mb-4">
                    <h3 className="text-lg font-semibold">Original Image</h3>
                  </div>
                  <div className="image-card-body border rounded-md p-4">
                    <img src={originalImage} alt="Original" className="max-w-full h-auto mx-auto" />
                  </div>
                </div>
                
                {processedImage && (
                  <div className="image-card">
                    <div className="image-card-header mb-4">
                      <h3 className="text-lg font-semibold">Processed Image</h3>
                    </div>
                    <div className="image-card-body border rounded-md p-4 bg-gray-100">
                      <img src={processedImage} alt="Processed" className="max-w-full h-auto mx-auto" />
                    </div>
                  </div>
                )}
              </div>
              
              {isProcessing && (
                <div className="progress-container mt-6">
                  <div className="progress-label flex justify-between mb-2">
                    <span>Processing your image...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar h-2 bg-gray-200 rounded-full">
                    <div 
                      className="progress-fill h-full bg-blue-600 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message mt-6 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </div>

            <div className="action-buttons flex flex-col md:flex-row gap-4 justify-center">
              {/* Always show the process button if there's an original image and no processed image yet */}
              {originalImage && !processedImage && !isProcessing && (
                <button 
                  className="btn btn-primary process-btn w-full md:w-auto" 
                  onClick={processImage}
                  style={{ display: 'block' }} /* Ensure visibility */
                >
                  Remove Background
                </button>
              )}

              {processedImage && (
                <>
                  <button 
                    className="btn btn-accent download-btn w-full md:w-auto" 
                    onClick={downloadProcessedImage}
                  >
                    Download Result
                  </button>
                  <button 
                    className="btn btn-secondary new-image-btn w-full md:w-auto"
                    onClick={resetSelection}
                  >
                    Process Another Image
                  </button>
                </>
              )}

              {/* Updated condition to always show Cancel button when there's an image */}
              {originalImage && !processedImage && !isProcessing && (
                <button 
                  className="btn btn-secondary cancel-btn w-full md:w-auto" 
                  onClick={resetSelection}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card bg-white rounded-lg shadow-md p-6 text-center">
            <div className="feature-icon mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3.75H6.2C4.96393 3.75 4.34589 3.75 3.86645 3.98226C3.44403 4.18748 3.09681 4.52307 2.88615 4.93402C2.64999 5.40077 2.64999 5.99591 2.64999 7.18619V17.8138C2.64999 19.0041 2.64999 19.5992 2.88615 20.066C3.09681 20.4769 3.44403 20.8125 3.86645 21.0177C4.34589 21.25 4.96393 21.25 6.2 21.25H17.8C19.036 21.25 19.6541 21.25 20.1335 21.0177C20.5559 20.8125 20.9032 20.4769 21.1138 20.066C21.35 19.5992 21.35 19.0041 21.35 17.8138V15.25M16.15 4.75H13.4M18.9 7.5H13.4M13.4 10.25H11.65M15.15 18.25L21.35 12.05M7.7 12.05C7.7 13.8789 9.17107 15.35 11 15.35C12.8289 15.35 14.3 13.8789 14.3 12.05C14.3 10.2211 12.8289 8.75 11 8.75C9.17107 8.75 7.7 10.2211 7.7 12.05Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">Advanced machine learning for precise background removal</p>
          </div>
          <div className="feature-card bg-white rounded-lg shadow-md p-6 text-center">
            <div className="feature-icon mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H18M12 22C6.47715 22 2 17.5228 2 12M12 22V18M2 12C2 6.47715 6.47715 2 12 2M2 12H6M12 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Processing</h3>
            <p className="text-gray-600">Get results in seconds, even for high-resolution images</p>
          </div>
          <div className="feature-card bg-white rounded-lg shadow-md p-6 text-center">
            <div className="feature-icon mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 10.5L11 12.5L15.5 8M7 18C4.79086 18 3 16.2091 3 14C3 12.0221 4.43551 10.4175 6.32482 10.0708C6.83361 7.25386 9.28852 5.15152 12.2148 5.15152C15.6716 5.15152 18.4748 7.95474 18.4748 11.4116C19.894 11.7806 21 13.0336 21 14.5C21 16.1569 19.6569 17.5 18 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Cloud Storage</h3>
            <p className="text-gray-600">Secure cloud storage for all your processed images</p>
          </div>
        </div>
};

export default ImageProcessor;