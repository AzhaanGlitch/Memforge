import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Deck from './models/Deck.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/memforge')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Generate flashcards from text using Google Gemini API
app.post('/api/generate-flashcards', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('Generating flashcards for text:', text.substring(0, 100) + '...');

    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured. Please add GEMINI_API_KEY to your .env file' 
      });
    }

    const prompt = `Generate flashcards from the following text. Create clear, concise question-answer pairs that will help someone study and remember the key concepts. Return the response as a JSON array with objects containing "front" (the question) and "back" (the answer) properties.

Text: ${text}

Return ONLY a valid JSON array in this exact format, with no additional text or explanation:
[
  {"front": "Question 1", "back": "Answer 1"},
  {"front": "Question 2", "back": "Answer 2"}
]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let flashcardsText = data.candidates[0].content.parts[0].text.trim();
    
    // Remove markdown code blocks if present
    flashcardsText = flashcardsText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    console.log('Gemini response:', flashcardsText);

    // Parse the JSON response
    const flashcards = JSON.parse(flashcardsText);

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error('Invalid flashcards format received from AI');
    }

    // Validate flashcard structure
    const validFlashcards = flashcards.filter(
      (card) => card.front && card.back && typeof card.front === 'string' && typeof card.back === 'string'
    );

    if (validFlashcards.length === 0) {
      throw new Error('No valid flashcards could be generated');
    }

    console.log(`Generated ${validFlashcards.length} flashcards`);

    res.json({
      flashcards: validFlashcards,
      count: validFlashcards.length,
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    
    if (error.message.includes('JSON')) {
      return res.status(500).json({ 
        error: 'Failed to parse AI response. Please try again.',
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate flashcards',
      details: error.message 
    });
  }
});

// Get all decks
app.get('/api/decks', async (req, res) => {
  try {
    const decks = await Deck.find().sort({ createdAt: -1 });
    res.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

// Get a specific deck
app.get('/api/decks/:id', async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.json(deck);
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ error: 'Failed to fetch deck' });
  }
});

// Create a new deck
app.post('/api/decks', async (req, res) => {
  try {
    const { name, cards } = req.body;

    if (!name || !cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Name and cards array are required' });
    }

    if (cards.length === 0) {
      return res.status(400).json({ error: 'Deck must contain at least one card' });
    }

    const deck = new Deck({
      name,
      cards,
    });

    await deck.save();
    console.log('Deck saved:', deck.name);
    res.status(201).json(deck);
  } catch (error) {
    console.error('Error creating deck:', error);
    res.status(500).json({ error: 'Failed to create deck' });
  }
});

// Update a deck
app.put('/api/decks/:id', async (req, res) => {
  try {
    const { name, cards } = req.body;

    const deck = await Deck.findByIdAndUpdate(
      req.params.id,
      { name, cards, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    console.log('Deck updated:', deck.name);
    res.json(deck);
  } catch (error) {
    console.error('Error updating deck:', error);
    res.status(500).json({ error: 'Failed to update deck' });
  }
});

// Delete a deck
app.delete('/api/decks/:id', async (req, res) => {
  try {
    const deck = await Deck.findByIdAndDelete(req.params.id);
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    console.log('Deck deleted:', deck.name);
    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ error: 'Failed to delete deck' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});