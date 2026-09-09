import { Link, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display font-semibold text-lg tracking-tight">
          StudyMate <span className="highlight-swipe">AI</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-ink/70">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <Link to="/questionnaire" className="hover:text-ink transition-colors">Discover</Link>
          <Link to="/saved" className="hover:text-ink transition-colors">Saved</Link>
        </nav>
        <button onClick={() => navigate('/questionnaire')} className="btn-primary !px-5 !py-2.5 text-sm">
          Find Resources
        </button>
      </div>
    </header>
  )
}
