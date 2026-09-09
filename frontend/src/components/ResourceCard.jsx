import { useState, useEffect } from 'react'
import { Clock, BadgeCheck, Sparkles, Bookmark, BookmarkCheck, ArrowUpRight, Star } from 'lucide-react'
import { FORMAT_META } from '../data/options'
import { isResourceSaved, saveResource, removeResource } from '../services/storage'
import ProgressRing from './ProgressRing'

const DIFFICULTY_STYLES = {
  easy: 'text-teal-soft bg-teal-soft/10',
  moderate: 'text-amber-soft bg-amber-soft/10',
  challenging: 'text-coral bg-coral/10',
}

export default function ResourceCard({ resource, featured = false }) {
  const [saved, setSaved] = useState(false)
  const format = FORMAT_META[resource.format]
  const FormatIcon = format?.icon

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
    <div className={`card card-hover p-6 sm:p-7 ${featured ? 'border-indigo-soft/25 shadow-glow' : ''}`}>
      {featured && (
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-soft mb-4">
          <Star size={13} fill="currentColor" strokeWidth={0} />
          Best match
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold leading-snug">{resource.title}</h3>
          <p className="text-sm text-text-tertiary mt-1">{resource.platform}</p>
        </div>
        <ProgressRing value={resource.match_score} size={featured ? 64 : 52} />
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {FormatIcon && (
          <span className="chip !py-1.5 !px-3 bg-white/[0.04] text-xs">
            <FormatIcon size={13} strokeWidth={2} /> {format.label}
          </span>
        )}
        <span className={`chip !py-1.5 !px-3 border-transparent text-xs capitalize ${DIFFICULTY_STYLES[resource.difficulty] || ''}`}>
          {resource.difficulty}
        </span>
        <span className="chip !py-1.5 !px-3 bg-white/[0.04] text-xs">
          <Clock size={13} strokeWidth={2} /> {resource.estimated_time} min
        </span>
        <span className="chip !py-1.5 !px-3 bg-white/[0.04] text-xs">
          <BadgeCheck size={13} strokeWidth={2} /> {resource.credibility} credibility
        </span>
      </div>

      <p className="text-sm text-text-secondary mt-4 leading-relaxed">{resource.description}</p>

      <div className="mt-5 rounded-2xl bg-gradient-to-br from-indigo-soft/[0.08] to-teal-soft/[0.06] border border-indigo-soft/15 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-soft mb-1.5">
          <Sparkles size={13} strokeWidth={2.25} /> Why this resource?
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">{resource.reason}</p>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary !py-2.5 !px-5 text-sm flex-1 sm:flex-none"
        >
          Start learning <ArrowUpRight size={16} strokeWidth={2.25} />
        </a>
        <button onClick={toggleSave} className="btn-secondary !py-2.5 !px-5 text-sm">
          {saved ? <BookmarkCheck size={16} strokeWidth={2.25} /> : <Bookmark size={16} strokeWidth={2.25} />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}
