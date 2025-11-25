import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Generate flashcards from text
export const generateFlashcards = async (text) => {
  try {
    const response = await api.post('/generate-flashcards', { text });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate flashcards');
  }
};

// Save a new deck
export const saveDeck = async (name, cards) => {
  try {
    const response = await api.post('/decks', { name, cards });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to save deck');
  }
};

// Get all decks
export const getDecks = async () => {
  try {
    const response = await api.get('/decks');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch decks');
  }
};

// Get a specific deck
export const getDeck = async (id) => {
  try {
    const response = await api.get(`/decks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch deck');
  }
};

// Update a deck
export const updateDeck = async (id, name, cards) => {
  try {
    const response = await api.put(`/decks/${id}`, { name, cards });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update deck');
  }
};

// Delete a deck
export const deleteDeck = async (id) => {
  try {
    const response = await api.delete(`/decks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete deck');
  }
};

export default api;