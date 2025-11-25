import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true,
    trim: true,
  },
  back: {
    type: String,
    required: true,
    trim: true,
  },
});

const deckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cards: {
    type: [cardSchema],
    required: true,
    validate: {
      validator: function(cards) {
        return cards.length > 0;
      },
      message: 'Deck must contain at least one card',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
deckSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Deck = mongoose.model('Deck', deckSchema);

export default Deck;