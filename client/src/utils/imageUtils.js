
// client/src/utils/imageUtils.js
/**
 * Download an image from a URL
 * @param {string} url - The URL of the image to download
 * @param {string} [filename] - Optional filename for the downloaded image
 */
export const downloadImageFromUrl = (url, filename = 'image.png') => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to the document, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  /**
   * Check if a URL is a valid image URL
   * @param {string} url - The URL to validate
   * @returns {boolean} - True if the URL appears to be a valid image URL
   */
  export const isValidImageUrl = (url) => {
    if (!url) return false;
    
    // Check if the URL has a valid image extension
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = url.split('.').pop().toLowerCase();
    
    return imageExtensions.includes(extension);
  };
  
  /**
   * Format file size to human-readable format
   * @param {number} bytes - The file size in bytes
   * @returns {string} - Formatted file size
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  