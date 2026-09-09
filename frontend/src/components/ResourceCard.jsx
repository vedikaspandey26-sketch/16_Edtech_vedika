import { useState, useEffect } from 'react'
import { FORMAT_META } from '../data/options'
import { isResourceSaved, saveResource, removeResource } from '../services/storage'

const DIFFICULTY_COLORS = {
  easy: 'text-emerald-700 bg-emerald-50',
  moderate: 'text-amber-700 bg-amber-50',
  challenging: 'text-rose-700 bg-rose-50',
}

export default function ResourceCard({ resource, featured = false }) {
  const [saved, setSaved] = useState(false)
  const format = FORMAT_META[resource.format] || { label: resource.format, icon: '📎' }

  useEffect(() => {
    setSaved(isResourceSaved(resource.id))
  }, [resource.id])

  function toggleSave() {
    if (saved) {
      removeResource(resource.id)
      setSaved(false)
    } else {
      saveResource(resource)
      setSaved(true)
    }
  }

  return (
    <div className={`card p-6 sm:p-7 ${featured ? 'border-ink/20 shadow-[0_4px_24px_rgba(20,33,61,0.10)]' : ''}`}>
      {featured && (
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/60 mb-3">
          <span>⭐ Best match</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold leading-snug">{resource.title}</h3>
          <p className="text-sm text-ink/60 mt-1">{resource.platform}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-2xl font-semibold text-ink">{resource.match_score}%</div>
          <div className="text-xs text-ink/50">match</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="chip !py-1 !px-3 bg-mist border-transparent text-xs">{format.icon} {format.label}</span>
        <span className={`chip !py-1 !px-3 border-transparent text-xs capitalize ${DIFFICULTY_COLORS[resource.difficulty] || ''}`}>
          {resource.difficulty}
        </span>
        <span className="chip !py-1 !px-3 bg-mist border-transparent text-xs">⏱ {resource.estimated_time} min</span>
        <span className="chip !py-1 !px-3 bg-mist border-transparent text-xs">✓ {resource.credibility} credibility</span>
      </div>

      <p className="text-sm text-ink/70 mt-4 leading-relaxed">{resource.description}</p>

      <div className="mt-4 rounded-2xl bg-highlight/25 border border-highlightDeep/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1">Why this resource?</p>
        <p className="text-sm text-ink/85 leading-relaxed">{resource.reason}</p>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary !py-2.5 !px-5 text-sm flex-1 sm:flex-none"
        >
          Start learning →
        </a>
        <button onClick={toggleSave} className="btn-secondary !py-2.5 !px-5 text-sm">
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
  )
}
