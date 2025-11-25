import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, ChevronLeft, ChevronRight, RotateCw, Loader2, Save, FolderOpen } from 'lucide-react';
import * as api from './services/api';

export default function App() {
  const [view, setView] = useState('home');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [savedDecks, setSavedDecks] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [error, setError] = useState(null);

  // Load saved decks on mount
  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const decks = await api.getDecks();
      setSavedDecks(decks);
    } catch (error) {
      console.error('Error loading decks:', error);
      setError('Failed to load saved decks');
    }
  };

  const generateFlashcards = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await api.generateFlashcards(inputText);
      
      if (data.flashcards && data.flashcards.length > 0) {
        setCurrentDeck({
          name: '',
          cards: data.flashcards,
          createdAt: new Date().toISOString()
        });
        setView('study');
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setInputText('');
      } else {
        setError('No flashcards generated. Try different text.');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setError(error.message || 'Failed to generate flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveDeckHandler = async () => {
    if (!currentDeck || !deckName.trim()) {
      setError('Please enter a deck name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedDeck = await api.saveDeck(deckName, currentDeck.cards);
      setCurrentDeck(savedDeck);
      setDeckName('');
      await loadDecks();
      alert('Deck saved successfully!');
    } catch (error) {
      console.error('Error saving deck:', error);
      setError(error.message || 'Failed to save deck');
    } finally {
      setLoading(false);
    }
  };

  const loadDeck = (deck) => {
    setCurrentDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setView('study');
  };

  const deleteDeckHandler = async (deckId) => {
    if (!confirm('Are you sure you want to delete this deck?')) return;
    
    try {
      await api.deleteDeck(deckId);
      await loadDecks();
      if (currentDeck && currentDeck._id === deckId) {
        setView('home');
        setCurrentDeck(null);
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
      setError(error.message || 'Failed to delete deck');
    }
  };

  const nextCard = () => {
    if (currentDeck && currentCardIndex < currentDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  // HOME VIEW
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Flashcard Generator</h1>
            <p className="text-gray-600">Transform your notes into study flashcards instantly</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Deck</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your notes here... (e.g., history notes, science concepts, vocabulary)"
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
            <button
              onClick={generateFlashcards}
              disabled={loading || !inputText.trim()}
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Generate Flashcards
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Saved Decks</h2>
              <FolderOpen className="w-6 h-6 text-indigo-600" />
            </div>
            
            {savedDecks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved decks yet. Create your first one!</p>
            ) : (
              <div className="space-y-3">
                {savedDecks.map((deck) => (
                  <div key={deck._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{deck.name}</h3>
                      <p className="text-sm text-gray-500">
                        {deck.cards.length} cards • {new Date(deck.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadDeck(deck)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Study
                      </button>
                      <button
                        onClick={() => deleteDeckHandler(deck._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // STUDY VIEW
  if (view === 'study' && currentDeck) {
    const currentCard = currentDeck.cards[currentCardIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => setView('home')}
            className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!currentDeck._id && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Save This Deck</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="Enter deck name..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && saveDeckHandler()}
                />
                <button
                  onClick={saveDeckHandler}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors disabled:bg-gray-400"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentDeck.name || 'New Deck'}
            </h2>
            <p className="text-gray-600">
              Card {currentCardIndex + 1} of {currentDeck.cards.length}
            </p>
          </div>

          <div className="perspective-1000 mb-8">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              <div className="absolute inset-0 bg-white rounded-xl shadow-2xl p-8 flex items-center justify-center backface-hidden">
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-4 uppercase tracking-wide">Front</p>
                  <p className="text-2xl font-semibold text-gray-800">{currentCard.front}</p>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-indigo-600 rounded-xl shadow-2xl p-8 flex items-center justify-center backface-hidden rotate-y-180">
                <div className="text-center">
                  <p className="text-indigo-200 text-sm mb-4 uppercase tracking-wide">Back</p>
                  <p className="text-2xl font-semibold text-white">{currentCard.back}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={prevCard}
              disabled={currentCardIndex === 0}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
            >
              <ChevronLeft className="w-6 h-6 text-indigo-600" />
            </button>
            
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-3 bg-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <RotateCw className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={nextCard}
              disabled={currentCardIndex === currentDeck.cards.length - 1}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
            >
              <ChevronRight className="w-6 h-6 text-indigo-600" />
            </button>
          </div>

          <p className="text-center text-gray-600 text-sm">Click card to flip</p>
        </div>
      </div>
    );
  }

  return null;
}