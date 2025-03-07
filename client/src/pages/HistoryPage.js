
// client/src/pages/HistoryPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageHistory from '../components/ImageHistory';

const HistoryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images when component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/images');
      setImages(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load your image history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/images/${id}`);
      // Update the state to remove the deleted image
      setImages(images.filter(image => image._id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete the image');
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-6">Your Image History</h1>
        <p className="text-lg text-gray-700 mb-8">
          View and manage your previously processed images.
        </p>
      </section>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading your images...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <ImageHistory images={images} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default HistoryPage;
