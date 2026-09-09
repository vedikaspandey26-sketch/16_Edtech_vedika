import { useNavigate } from 'react-router-dom'

const STEPS = [
  { title: 'Tell us what you\u2019re learning', desc: 'Subject, topic, and how much you already know.' },
  { title: 'Tell us how you learn best', desc: 'Your goal, preferred format, and how much time you have.' },
  { title: 'Get your personalized study path', desc: '3\u20135 resources, ranked and explained \u2014 not 100 tabs to sort through.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-ink/50 mb-4">For students, not search engines</p>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.08] tracking-tight">
            Stop searching.<br />
            <span className="highlight-swipe">Start learning.</span>
          </h1>
          <p className="text-lg text-ink/65 mt-6 max-w-xl leading-relaxed">
            StudyMate AI finds learning resources that match your level, goal, learning style,
            and available time \u2014 so you open the right thing the first time.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-9">
            <button onClick={() => navigate('/questionnaire')} className="btn-primary">
              Find my resources
            </button>
            <a href="#how-it-works" className="btn-secondary">
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16 border-t border-ink/10">
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title}>
              <div className="font-display text-3xl font-semibold text-ink/20 mb-3">0{i + 1}</div>
              <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for students */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink/10">
        <div className="grid sm:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-4">
              Built for students, not search engines.
            </h2>
            <p className="text-ink/65 leading-relaxed">
              The internet has plenty of content on every topic \u2014 that was never the problem.
              The problem is finding what actually fits <em>you</em>: your level, your goal, and
              how much time you actually have today. StudyMate AI reduces the noise to a small,
              reasoned set of picks instead of endless results to compare.
            </p>
          </div>
          <div className="card p-8">
            <p className="font-display font-semibold mb-6">From information overload \u2192 learning clarity</p>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold text-ink/50 mb-3">Generic search</p>
                <ul className="space-y-2 text-ink/60">
                  <li>100+ results</li>
                  <li>No context</li>
                  <li>No personalization</li>
                  <li>Decision fatigue</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-3">StudyMate AI</p>
                <ul className="space-y-2">
                  <li>3\u20135 resources</li>
                  <li>Personalized</li>
                  <li>Explainable</li>
                  <li>Time-aware</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-ink/10 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-6">
          We didn\u2019t search for a topic. We searched for a topic \u2014 for you.
        </h2>
        <button onClick={() => navigate('/questionnaire')} className="btn-primary">
          Find my resources
        </button>
      </section>
    </div>
  )
}
