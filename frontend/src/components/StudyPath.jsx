import { Lightbulb, PlayCircle, StickyNote, ListChecks, Compass, Route } from 'lucide-react'

const STEP_ICONS = [Lightbulb, PlayCircle, StickyNote, ListChecks, Compass]

export default function StudyPath({ steps }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Route size={18} strokeWidth={2} className="text-indigo-soft" />
        <h3 className="font-display text-lg font-semibold">Your recommended path</h3>
      </div>
      <p className="text-sm text-text-tertiary mb-7">One step at a time \u2014 not a pile of links.</p>

      <ol className="space-y-0">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i] || Compass
          return (
            <li key={step.resource_id} className="relative pl-12 pb-7 last:pb-0">
              {i < steps.length - 1 && (
                <span className="absolute left-[19px] top-10 bottom-0 w-px bg-gradient-to-b from-stroke to-transparent" aria-hidden="true" />
              )}
              <span className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-2xl bg-white/[0.05] border border-stroke text-indigo-soft">
                <Icon size={17} strokeWidth={2} />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mt-1.5">{step.label}</p>
              <p className="font-medium mt-0.5">{step.title}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
