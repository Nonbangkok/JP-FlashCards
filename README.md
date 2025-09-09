# JP-Learning-Zone

A comprehensive Japanese character learning application built with React and TypeScript. This interactive flashcard system helps users master Hiragana, Katakana, and Kanji characters through spaced repetition and progress tracking.

## 🎌 Features

### Character Learning
- **Hiragana Characters**: Complete set of 46 basic Hiragana characters
- **Katakana Characters**: Complete set of 46 basic Katakana characters  
- **Kanji Characters**: Essential Kanji characters with meanings and difficulty levels
- **Character Types**: Support for all three Japanese writing systems

### Study Modes
- **Character → Pronunciation**: Learn to read characters and their sounds
- **Pronunciation → Character**: Practice writing characters from their sounds
- **Flexible Selection**: Choose specific character sets or individual characters

### Progress Tracking
- **Performance Analytics**: Track correct/incorrect answers for each character
- **Mastery System**: Identify mastered and weak characters
- **Session Persistence**: Save study sessions and resume where you left off
- **Progress Statistics**: Visual progress tracking with detailed statistics

### User Experience
- **Dark/Light Mode**: Toggle between themes for comfortable studying
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Flashcards**: Smooth animations and intuitive controls
- **Session Management**: Shuffle, navigate, and manage study sessions
- **Data Persistence**: All progress saved locally in browser

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JP-Learning-Zone
   ```

2. **Navigate to the project directory**
   ```bash
   cd japanese-flashcards
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build` folder.

## 📚 How to Use

### Starting a Study Session

1. **Select Study Mode**: Choose between "Character → Pronunciation" or "Pronunciation → Character"
2. **Choose Characters**: Select which characters you want to study (Hiragana, Katakana, or Kanji)
3. **Start Studying**: Click "Start Studying" to begin your flashcard session

### During Study

- **Flip Cards**: Click the card to reveal the answer
- **Answer Correctly/Incorrectly**: Use the ✓ or ✗ buttons to mark your answer
- **Navigate**: Use Previous/Next buttons or let the app auto-advance
- **Shuffle**: Randomize the order of cards in your session

### Tracking Progress

- **View Statistics**: Check the Progress tab to see your learning analytics
- **Identify Weak Areas**: Focus on characters you struggle with
- **Reset Progress**: Clear all data if you want to start fresh

## 🛠️ Technical Details

### Built With
- **React 19.1.1**: Modern React with hooks and functional components
- **TypeScript 4.9.5**: Type-safe JavaScript development
- **Tailwind CSS 4.1.13**: Utility-first CSS framework
- **React Scripts 5.0.1**: Create React App build tools

### Project Structure
```
src/
├── components/          # React components
│   ├── CharacterSelector.tsx
│   ├── FlashCard.tsx
│   └── ProgressStats.tsx
├── data/               # Character data
│   └── characters.ts
├── hooks/              # Custom React hooks
│   ├── useProgress.ts
│   └── useStudySession.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── localStorage.ts
└── App.tsx             # Main application component
```

### Key Features Implementation
- **Local Storage**: Persistent data storage using browser localStorage
- **Custom Hooks**: Reusable logic for progress tracking and study sessions
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: React hooks for component state management

## 🎯 Learning Methodology

This application implements effective language learning principles:

- **Spaced Repetition**: Characters you struggle with appear more frequently
- **Active Recall**: Testing yourself improves retention
- **Immediate Feedback**: Instant correction helps learning
- **Progress Tracking**: Visual progress motivates continued learning
- **Flexible Study**: Study at your own pace with customizable sessions

## 🔧 Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (one-way operation)

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Japanese character data sourced from standard Hiragana, Katakana, and Kanji references
- Built with modern web technologies for optimal learning experience
- Inspired by effective language learning methodologies

## 📞 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Happy Learning! がんばってください！** 🎌
