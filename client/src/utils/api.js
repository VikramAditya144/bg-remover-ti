import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: '/api'
});

// Image-related API calls
export const getImages = () => api.get('/images');
export const processImage = (formData) => api.post('/images/process', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const deleteImage = (id) => api.delete(`/images/${id}`);

// AI Model-related API calls
export const getModels = () => api.get('/models');
export const addModel = (modelData) => api.post('/models', modelData);
export const setActiveModel = (id) => api.put(`/models/setActive/${id}`);

export default api;
