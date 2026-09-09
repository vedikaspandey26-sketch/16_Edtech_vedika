export default function StudyPath({ steps }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="card p-6 sm:p-8">
      <h3 className="font-display text-lg font-semibold mb-1">Your recommended path</h3>
      <p className="text-sm text-ink/60 mb-6">A short sequence, not just a pile of links.</p>

      <ol className="space-y-0">
        {steps.map((step, i) => (
          <li key={step.resource_id} className="relative pl-10 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span className="absolute left-[15px] top-8 bottom-0 w-px bg-ink/15" aria-hidden="true" />
            )}
            <span className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-ink text-paper font-display text-sm font-semibold">
              {step.step}
            </span>
            <p className="text-sm font-semibold text-ink/50 uppercase tracking-wide">{step.label}</p>
            <p className="font-medium">{step.title}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
