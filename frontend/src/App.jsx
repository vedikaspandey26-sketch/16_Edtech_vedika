import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import LandingPage from './pages/LandingPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultsPage from './pages/ResultsPage'
import SavedPage from './pages/SavedPage'
import ExplorePage from './pages/ExplorePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import QuizPage from './pages/QuizPage'
import RoadmapPage from './pages/RoadmapPage'
import ProfilePage from './pages/ProfilePage'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { isAuthenticated } = useAuth()
  return (
    <div className="min-h-screen bg-abyss text-text-primary">
      {isAuthenticated && <NavBar />}
      <main>
        <Routes>
          <Route path="/" element={isAuthenticated ? <LandingPage /> : <Navigate to="/login" replace />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/mindmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        </Routes>
      </main>
    </div>
  )
}
