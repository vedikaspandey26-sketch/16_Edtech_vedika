export default function ProgressSteps({ step, total }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-ink/60">Step {step} of {total}</span>
        <span className="text-sm font-medium text-ink/60">{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-1.5 w-full bg-ink/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-highlightDeep rounded-full transition-all duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
