# Memforge - AI Flashcard Generator

Transform your study notes into interactive flashcards instantly using AI. Memforge helps students learn more efficiently by automatically generating question-answer pairs from any text.

![Memforge Banner](https://img.shields.io/badge/AI-Powered-blue) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green) ![React](https://img.shields.io/badge/Frontend-React-cyan) ![Express](https://img.shields.io/badge/Backend-Express-lightgrey)

## Features

- **AI-Powered Generation**: Uses Google Gemini 1.5 Flash to create flashcards from your notes
- **Save & Organize**: Store your flashcard decks for future study sessions
- **Interactive Study Mode**: Flip cards with smooth 3D animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful, intuitive interface built with Tailwind CSS
- **Fast & Efficient**: Quick flashcard generation with MongoDB storage

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AzhaanGlitch/Memforge
cd memforge
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env` and add your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/memforge
GEMINI_API_KEY=your_actual_api_key_here
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install

# Create .env file (optional, uses localhost:5000 by default)
cp .env.example .env
```

4. **Start MongoDB**

Make sure MongoDB is running on your system:
```bash
# Windows
mongod

5. **Run the Application**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

6. **Access the App**

Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Creating Flashcards

1. Paste your study notes in the text area on the home page
2. Click "Generate Flashcards"
3. Wait for AI to process your notes (usually 5-10 seconds)
4. Review your generated flashcards

### Studying Flashcards

1. Click on a flashcard to flip it and see the answer
2. Use arrow buttons to navigate between cards
3. Click the rotate button to manually flip cards

### Saving Decks

1. After generating flashcards, enter a name for your deck
2. Click "Save" to store it in the database
3. Access saved decks anytime from the home page

## Project Structure

```
memforge/
├── backend/
│   ├── models/
│   │   └── Deck.js         
│   ├── .env.example        
│   ├── .gitignore
│   ├── package.json
│   └── server.js           
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js       
│   │   ├── App.jsx          
│   │   ├── index.css       
│   │   └── main.jsx        
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## API Endpoints

### Flashcards

- `POST /api/generate-flashcards` - Generate flashcards from text
  ```json
  {
    "text": "Your study notes here..."
  }
  ```

### Decks

- `GET /api/decks` - Get all saved decks
- `GET /api/decks/:id` - Get a specific deck
- `POST /api/decks` - Create a new deck
  ```json
  {
    "name": "Biology Chapter 1",
    "cards": [
      {
        "front": "What is photosynthesis?",
        "back": "The process by which plants convert light energy into chemical energy"
      }
    ]
  }
  ```
- `PUT /api/decks/:id` - Update a deck
- `DELETE /api/decks/:id` - Delete a deck

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Google Gemini API** - AI text generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for AI-powered flashcard generation
- The open-source community for amazing tools and libraries
- All contributors who help improve Memforge

## Contact

For questions or support, please open an issue on GitHub or contact:
- Email: azhaanalisiddiqui15@gmail.com
- GitHub: [@AzhaanGlitch](https://github.com/AzhaanGlitch)

---

**Made by students, for students**

⭐ Star this repo if you find it helpful!