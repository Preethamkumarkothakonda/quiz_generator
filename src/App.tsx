import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import TopicSelection from './pages/TopicSelection';
import QuizLoader from './pages/QuizLoader';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import './App.css';

function App() {
  return (
    <QuizProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<TopicSelection />} />
            <Route path="/loader" element={<QuizLoader />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </QuizProvider>
  );
}

export default App;
