import { useNavigate } from 'react-router-dom'
import { ArrowRight, ListFilter, Sparkles, Clock3, CheckCircle2, XCircle } from 'lucide-react'

const STEPS = [
  { title: 'Tell us what you\u2019re learning', desc: 'Subject, topic, and how much you already know.', icon: ListFilter },
  { title: 'Tell us how you learn best', desc: 'Your goal, preferred format, and how much time you have.', icon: Clock3 },
  { title: 'Get your personalized study path', desc: '3\u20135 resources, ranked and explained \u2014 not 100 tabs to sort through.', icon: Sparkles },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 sm:pt-28 pb-24">
        <div className="max-w-3xl animate-fadeUp">
          <div className="inline-flex items-center gap-2 eyebrow mb-6 px-3.5 py-1.5 rounded-pill border border-stroke bg-white/[0.03]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-soft" />
            For students, not search engines
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.08] tracking-tight">
            Stop searching.<br />
            <span className="highlight-swipe">Start learning.</span>
          </h1>
          <p className="text-lg text-text-secondary mt-6 max-w-xl leading-relaxed">
            StudyMate AI finds learning resources that match your level, goal, learning style,
            and available time \u2014 so exam season feels like something you can handle, one
            step at a time.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-9">
            <button onClick={() => navigate('/questionnaire')} className="btn-primary">
              Find my resources <ArrowRight size={16} strokeWidth={2.5} />
            </button>
            <a href="#how-it-works" className="btn-secondary">
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16 border-t border-stroke">
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="card card-hover p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-stroke flex items-center justify-center text-indigo-soft">
                    <Icon size={19} strokeWidth={2} />
                  </div>
                  <span className="font-display text-sm font-semibold text-text-tertiary">0{i + 1}</span>
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Built for students */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-stroke">
        <div className="grid sm:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-4">
              Built for students, not search engines.
            </h2>
            <p className="text-text-secondary leading-relaxed">
              The internet has plenty of content on every topic \u2014 that was never the problem.
              The problem is finding what actually fits <em className="text-text-primary not-italic font-medium">you</em>:
              your level, your goal, and how much time you actually have today. StudyMate AI
              reduces the noise to a small, reasoned set of picks instead of endless results to compare.
            </p>
          </div>
          <div className="card p-8">
            <p className="font-display font-semibold mb-6">From information overload \u2192 learning clarity</p>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold text-text-tertiary mb-3">Generic search</p>
                <ul className="space-y-2.5 text-text-secondary">
                  {['100+ results', 'No context', 'No personalization', 'Decision fatigue'].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <XCircle size={15} className="text-coral shrink-0" strokeWidth={2} /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-3">StudyMate AI</p>
                <ul className="space-y-2.5 text-text-primary">
                  {['3\u20135 resources', 'Personalized', 'Explainable', 'Time-aware'].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-teal-soft shrink-0" strokeWidth={2} /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-stroke text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-3 max-w-2xl mx-auto">
          We didn\u2019t search for a topic. We searched for a topic \u2014 for you.
        </h2>
        <p className="text-text-secondary mb-8">You\u2019ve got this. One step at a time.</p>
        <button onClick={() => navigate('/questionnaire')} className="btn-primary">
          Find my resources <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </section>
    </div>
  )
}
