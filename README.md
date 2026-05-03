<div align="center">

# Japanese Learning Zone

### 日本語を学ぼう

Master Hiragana, Katakana, and Kanji with beautiful interactive flashcards.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## Features

**Interactive Flashcards** — Fluid card-flip animations powered by Framer Motion with two study modes: Character &rarr; Sound and Sound &rarr; Character.

**Full Character Coverage** — 46 Hiragana, 46 Katakana, and 20 essential Kanji with romaji and Thai meanings. JLPT-level filtering for Kanji.

**Smart Progress Tracking** — Per-character mastery system (3+ correct answers with positive ratio). Visual heatmap shows mastered, in-progress, and unstarted characters at a glance.

**Adaptive Study Sessions** — Shuffle decks, navigate freely, and get instant correct/incorrect feedback. Sessions auto-advance and show a completion modal when finished.

**Dark & Light Themes** — Carefully crafted warm stone palette with torii-red accents. Smooth transitions between themes.

**Persistent State** — All progress, session selections, study mode, and theme preference saved to localStorage. Pick up exactly where you left off.

**PWA-Ready** — Web app manifest with custom SVG logo. Installable on mobile home screens.

---

## Quick Start

```bash
# Clone
git clone https://github.com/Nonbangkok/JP-FlashCards.git
cd JP-Learning-Zone/japanese-flashcards

# Install
npm install

# Run
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `japanese-flashcards/build/`.

### Run Tests

```bash
npm test
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 with hooks |
| Language | TypeScript 4.9 (strict mode) |
| Styling | Tailwind CSS 4 + custom design tokens |
| Animations | Framer Motion |
| Build | Create React App (react-scripts 5) |
| Persistence | Browser localStorage |

### Design Philosophy

The UI follows a Japanese-minimalist aesthetic: warm stone neutrals (`stone-50` through `stone-900`) paired with torii-gate red (`#dc2626`) as the primary accent and temple gold (`#f59e0b`) for highlights. Typography uses Inter for Latin text and Noto Sans JP for Japanese characters. Every interactive element has spring-physics micro-animations.

---

## How to Use

1. **Choose a study mode** — "Character &rarr; Sound" to practice reading, or "Sound &rarr; Character" to practice recognition.
2. **Select characters** — Filter by type (Hiragana/Katakana/Kanji) or JLPT level. Select individual characters or use "Select All".
3. **Study** — Click cards to reveal answers. Mark yourself correct or wrong. Cards auto-advance.
4. **Track progress** — Visit the Progress tab to see mastery stats, accuracy, weak characters, and a full character heatmap.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, architecture overview, and guidelines.

---

## License

MIT -- see [LICENSE](./LICENSE).

---

<div align="center">

**Happy Learning! &nbsp; がんばってください！**

</div>
