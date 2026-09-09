import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import LandingPage from './pages/LandingPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultsPage from './pages/ResultsPage'
import SavedPage from './pages/SavedPage'

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/saved" element={<SavedPage />} />
        </Routes>
      </main>
    </div>
  )
}
