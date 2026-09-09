import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Compass, Bookmark, Sparkles, LayoutDashboard, CircleUserRound, BrainCircuit, Map } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/questionnaire', label: 'Discover', icon: Compass },
  { to: '/explore', label: 'Smart search', icon: Sparkles },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/quiz', label: 'Quiz', icon: BrainCircuit },
  { to: '/mindmap', label: 'Roadmap', icon: Map },
  { to: '/profile', label: 'Profile', icon: CircleUserRound },
  { to: '/saved', label: 'Saved', icon: Bookmark },
]

export default function NavBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-30 glass">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-soft to-teal-soft flex items-center justify-center">
            <Sparkles size={16} className="text-abyss" strokeWidth={2.5} />
          </span>
          StudyMate <span className="highlight-swipe">AI</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.to
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium transition-colors duration-250
                  ${active ? 'text-text-primary bg-white/[0.06]' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'}`}
              >
                <Icon size={16} strokeWidth={2} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <button onClick={() => navigate('/questionnaire')} className="btn-primary !px-5 !py-2.5 text-sm">
          Find resources
        </button>
      </div>
    </header>
  )
}
