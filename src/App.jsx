// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/quiz" />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;