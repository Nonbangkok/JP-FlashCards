# Contributing to Japanese Learning Zone

Welcome! We're glad you're interested in contributing. This guide will help you get set up and understand the project structure.

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/) — treat everyone with kindness, assume good intent, and focus on what's best for the project.

---

## Getting Started

### Prerequisites

- **Node.js** >= 16
- **npm** >= 8

### Setup

```bash
git clone https://github.com/Nonbangkok/JP-FlashCards.git
cd JP-Learning-Zone/japanese-flashcards
npm install
npm start
```

The dev server runs at [http://localhost:3000](http://localhost:3000) with hot reload.

### Useful Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start development server |
| `npm test` | Run test suite (Jest) |
| `npm run build` | Production build to `build/` |

---

## Architecture Overview

### Entry Point

`src/index.tsx` renders `<App />` inside `React.StrictMode`.

### App.tsx — The Orchestrator

`App.tsx` owns the top-level state and controls three views:

- **Home** — Study mode selection, character picker, start button.
- **Study** — Flashcard deck with navigation, shuffle, progress bar, and a session-complete overlay.
- **Progress** — Stats dashboard with mastery counts, accuracy, weak characters, and a character heatmap.

View transitions use Framer Motion's `AnimatePresence` with `mode="wait"`.

### Custom Hooks

| Hook | File | Responsibility |
|------|------|---------------|
| `useProgress` | `src/hooks/useProgress.ts` | Tracks per-character correct/incorrect counts. Determines mastery (>= 3 correct AND positive ratio). Syncs to `localStorage`. |
| `useStudySession` | `src/hooks/useStudySession.ts` | Manages the active deck: current index, flip state, answered tracking, shuffle. Handles card transitions with a configurable `TRANSITION_DURATION`. |

### Components

| Component | File | Purpose |
|-----------|------|---------|
| `FlashCard` | `src/components/FlashCard.tsx` | 3D card-flip with spring physics. Supports both study modes. Shows correct/incorrect visual feedback with colored borders. |
| `CharacterSelector` | `src/components/CharacterSelector.tsx` | Filterable, searchable character grid. Type/JLPT filters, bulk select/deselect, animated grid entries. |
| `ProgressStats` | `src/components/ProgressStats.tsx` | Stats cards, animated progress bars by type, weak-character badges, character heatmap grid. |

### Data & Types

- `src/data/characters.ts` — Static arrays of `hiraganaCharacters`, `katakanaCharacters`, `kanjiCharacters`, and the combined `allCharacters`.
- `src/types/index.ts` — Core interfaces: `Character`, `Progress`, `StudySession`, `StudyMode`, `CharacterType`, `DifficultyLevel`.

### Persistence

`src/utils/localStorage.ts` handles all browser storage with these keys:

- `japanese-flashcards-progress` — Per-character progress (no expiry)
- `japanese-flashcards-session` — Selected characters + study mode (7-day expiry)
- `japanese-flashcards-mode` — Last-used study mode
- `japanese-flashcards-theme` — Dark/light preference

---

## UI/UX Guidelines

### Design Tokens

All colors, spacing, radii, and shadows are defined as CSS custom properties in `App.css`. Use these variables instead of hardcoded values:

```css
/* Colors */
var(--primary)        /* Torii red */
var(--success)        /* Green for correct */
var(--error)          /* Red for incorrect */
var(--text-primary)   /* Main text */
var(--bg-card)        /* Card background */

/* Spacing */
var(--space-1) through var(--space-12)

/* Radii */
var(--radius-sm) through var(--radius-full)
```

### Styling Approach

This project uses a hybrid approach: Tailwind CSS for utility generation and custom CSS classes defined in `App.css` for component-specific styles. When adding new components:

1. Use existing CSS classes from `App.css` (`.card`, `.btn`, `.btn-primary`, `.filter-pill`, etc.)
2. Follow the naming convention: `component-element` (e.g., `flash-card-front`, `stat-value`)
3. Support dark mode via CSS custom properties — never hardcode light/dark colors

### Animations

All animations use Framer Motion. Follow these conventions:

- **Page transitions**: Use `pageVariants` from `App.tsx` with `AnimatePresence mode="wait"`
- **Interactive elements**: Use `whileHover` and `whileTap` for spring-based micro-interactions
- **Entry animations**: Use `initial` + `animate` with short delays
- **Spring physics**: Prefer `type: "spring"` with `damping: 25-30` and `stiffness: 300-500`

### Accessibility

- All interactive elements must have `aria-label` or visible text
- Buttons should include `type="button"` to prevent form submission
- Cards use `role="button"` and handle keyboard events (`Enter` / `Space`)
- Color is never the sole indicator — always pair with text or icons

---

## Making Changes

### Branch Naming

```
feature/description    # New features
fix/description        # Bug fixes
docs/description       # Documentation updates
refactor/description   # Code refactoring
```

### Commit Messages

Write clear, concise commit messages in imperative mood:

```
add JLPT N4 kanji characters
fix progress bar not updating on card answer
refactor FlashCard to use CSS custom properties
```

### Pull Request Process

1. **Fork** the repository and create a feature branch from `main`.
2. Make your changes. Ensure `npm run build` succeeds with no errors.
3. Run `npm test` and verify no tests break.
4. Test both light and dark modes in the browser.
5. Test on mobile viewport sizes (responsive design).
6. Open a PR with:
   - A clear title (under 70 characters)
   - Description of what changed and why
   - Screenshots for any visual changes
7. Address review feedback promptly.

---

## Adding New Characters

To add characters, edit `src/data/characters.ts`:

```typescript
{ id: 'h-47', character: 'が', romaji: 'ga', type: 'hiragana' },
```

For Kanji, include `meaning` and `level`:

```typescript
{ id: 'j-21', character: '年', romaji: 'nen/toshi', meaning: 'ปี', type: 'kanji', level: 1 },
```

IDs must be unique. Use `h-` prefix for Hiragana, `k-` for Katakana, `j-` for Kanji.

---

Thank you for contributing!
