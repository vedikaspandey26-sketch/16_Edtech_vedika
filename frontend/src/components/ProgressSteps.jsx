export default function ProgressSteps({ step, total }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow">Step {step} of {total}</span>
        <span className="eyebrow">{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/[0.06] rounded-pill overflow-hidden">
        <div
          className="h-full rounded-pill bg-gradient-to-r from-indigo-soft to-teal-soft transition-all duration-500 ease-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
