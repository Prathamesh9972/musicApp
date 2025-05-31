// src/services/studentAPI.js
import axios from 'axios';


// Base API configuration
const API_BASE_URL = 'http://localhost:4200/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Student API functions
export const studentAPI = {
  // Get all published courses for browsing
  getPublishedCourses: async () => {
    const response = await api.get('/courses/published');
    return response.data;
  },

  // Get student's enrolled/purchased courses
  getEnrolledCourses: async () => {
    const response = await api.get('/purchases');
    return response.data;
  },

  // Purchase/Enroll in a course
  enrollInCourse: async (courseId) => {
    const response = await api.post('/purchases', { courseId });
    return response.data;
  },

  // Get specific course details with access check
  getCourseDetails: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  // Mark module as complete
  markModuleComplete: async (purchaseId, moduleId) => {
    const response = await api.post(`/purchases/${purchaseId}/modules/${moduleId}/complete`);
    return response.data;
  },

  // Get student's purchase history
  getPurchaseHistory: async () => {
    const response = await api.get('/purchases');
    return response.data;
  },

  // Update purchase (if needed)
  updatePurchase: async (purchaseId, data) => {
    const response = await api.put(`/purchases/${purchaseId}`, data);
    return response.data;
  }
};

export default studentAPI;