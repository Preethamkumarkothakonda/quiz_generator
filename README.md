
# 🧠 Quiz Master - AI-Powered Quiz Application

A **modern, responsive web application** that generates **dynamic quiz questions** using **Google’s Gemini AI**.
Built with **React, TypeScript, and Tailwind CSS** for a smooth, scalable, and engaging user experience.

🌐 **Live Demo** → [Quiz Master on Vercel](https://quiz-generator-six-delta.vercel.app/) 

---

## 📑 Table of Contents

1. [Project Setup & Demo](#-project-setup--demo)
2. [Problem Understanding](#-problem-understanding)
3. [AI Prompts & Iterations](#-ai-prompts--iterations)
4. [Architecture & Code Structure](#-architecture--code-structure)
5. [Screenshots](#-screenshots)
6. [Known Issues / Improvements](#-known-issues--improvements)
7. [Bonus Work](#-bonus-work)
8. [Technologies Used](#-technologies-used)

---

## 1. 🚀 Project Setup & Demo

### Prerequisites

* npm or yarn
* Google Gemini API key

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Preethamkumarkothakonda/quiz_generator.git
cd quiz-master-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here

# Start development server
npm start
```

### Building for Production

```bash
# Create production build
npm run build

### Access

* **Local Development:** [http://localhost:3000](http://localhost:3000)
* **Production:** Deployed on **Vercel** with CI/CD from GitHub

---

## 2. 📋 Problem Understanding

**Core Challenge:**
Create an **AI-powered quiz app** that generates **educational, multiple-choice questions** dynamically across different topics.

**Key Requirements:**

* ✅ AI-generated quiz questions (not static)
* ✅ Support for multiple + custom topics
* ✅ Interactive UI with progress tracking
* ✅ Responsive design for all devices
* ✅ Complex quiz state management
* ✅ Option to skip & revisit questions

**Assumptions Made:**

* Users want **flexible topic selection**
* **MCQs** are the simplest & most engaging format
* Real-time tracking improves UX
* Mobile-first is essential

---

## 3. 🔮 AI Prompts & Iterations

### Initial Challenges

**Problem 1:** API endpoint mismatch

```js
// Wrong
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

// Fixed
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
```

**Problem 2:** Fragile response parsing

````js
// Before
const parsedResponse = JSON.parse(responseText);

// After (cleaned response)
responseText = responseText
  .replace(/```/g, '')
  .replace(/```\n?/g, '')
  .replace(/`/g, '')
  .trim();
````

### Final Optimized Prompt

```js
const prompt = `
You are an expert quiz generator. Create exactly 5 multiple-choice questions about "${topic}".

STRICT REQUIREMENTS:
- 4 unique options per question
- Only one correct answer
- Challenging but fair
- Vary correct answer positions
- Return ONLY valid JSON (no markdown, no text)

FORMAT:
{
  "questions": [
    {
      "question": "Your question?",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0
    }
  ]
}`;
```

### Improvements Made

* Added **explicit JSON formatting** rules
* Implemented **fallback handling** for API errors
* Strict **response validation**
* Introduced **caching** to reduce API calls

---

## 4. 🏗 Architecture & Code Structure

### Project Structure

```
src/
├── components/        # Reusable UI
│   ├── QuestionCard.tsx
│   ├── ProgressBar.tsx
│   └── LoaderSpinner.tsx
├── context/           # State management
│   └── QuizContext.tsx
├── pages/             # App screens
│   ├── TopicSelection.tsx
│   ├── QuizLoader.tsx
│   ├── Quiz.tsx
│   └── Results.tsx
├── services/          # External integrations
│   └── aiService.ts
├── types/             # Shared TypeScript types
│   └── index.ts
├── App.tsx            # Main app + routing
└── index.tsx          # Entry point
```

### Key Decisions

* **State Management:** React Context + `useReducer`
* **AI Service:** Class-based caching + error handling
* **Component Patterns:** Compound Components, Render Props, Provider Pattern

### Navigation Flow

```
TopicSelection → QuizLoader → Quiz → Results
       ↓               ↓         ↓
   Custom Topic   AI Generation  Review/Retake
```

---

## 5. 🖼 Screenshots

### Desktop

* **Topic Selection:** Grid layout with predefined + custom topics
* **Quiz Interface:** Clean design with progress tracking
* **Results Page:** Score analysis + review options

### Mobile

* **Responsive UI:** Touch-friendly with large tap targets
* **Bottom Navigation:** Fixed progress bar
* **Smooth Animations:** Framer Motion integration

---

## 6. 🛠 Known Issues / Improvements

### Current Limitations

1. **API Key Security** – Exposed on client-side → needs backend proxy
2. **Offline Mode** – Currently requires internet → cache for offline quizzes
3. **Question Variety** – Limited to MCQs → add true/false, fill-in-the-blank

### Planned Improvements

**Short-term (1–2 weeks):**

* Backend API proxy
* Authentication + progress tracking
* Dark mode
* Improved retry/error handling

**Long-term (1–2 months):**

* More question types
* Difficulty levels
* Analytics dashboard
* Social features (share scores, challenges)
* PWA offline support

**Performance Optimizations:**

* Virtual scrolling for large lists
* Service worker caching
* Code splitting
* Skeleton loaders

---

## 7. 🎁 Bonus Work

* **✨ Animations & UX**

  * Framer Motion page transitions
  * Hover/tap micro-interactions
  * Smooth progress bar updates

* **📱 Mobile Experience**

  * Gesture support & swipe navigation
  * Responsive typography scaling
  * Fixed mobile navigation bar

* **🧠 Smart AI Integration**

  * Intelligent caching to reduce API calls
  * Endpoint fallbacks for reliability
  * Response validation for quality assurance

* **🎯 Advanced Quiz Features**

  * Free navigation + skip
  * Answer tracking indicators
  * Retake mode with shuffled options

* **💻 Developer Experience**

  * TypeScript full type safety
  * ESLint + Prettier setup
  * Error Boundaries for robustness
  * Hot reload during development

---

## 8. 🛠 Technologies Used

* **Frontend:** React 18, TypeScript, Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **AI:** Google Gemini API
* **State Management:** React Context + useReducer
* **Routing:** React Router v6
* **Build Tool:** Create React App
* **Deployment:** Vercel

---
