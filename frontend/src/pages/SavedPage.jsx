import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, ExternalLink, X, Clock } from 'lucide-react'
import { getSavedResources, removeResource } from '../services/storage'
import { FORMAT_META } from '../data/options'
import EmptyState from '../components/EmptyState'

export default function SavedPage() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState([])

  useEffect(() => {
    setSaved(getSavedResources())
  }, [])

  function handleRemove(id) {
    setSaved(removeResource(id))
  }

  const totalMinutes = saved.reduce((sum, r) => sum + (r.estimated_time || 0), 0)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="eyebrow mb-2">Your library</p>
          <h1 className="font-display text-3xl font-semibold">Saved resources</h1>
        </div>
        {saved.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock size={15} strokeWidth={2} />
            {totalMinutes} min of learning saved
          </div>
        )}
      </div>

      {saved.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          description="Resources you save from your study path will show up here, ready whenever you are."
          action={
            <button onClick={() => navigate('/questionnaire')} className="btn-primary">
              Find resources
            </button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {saved.map((r) => {
            const format = FORMAT_META[r.format]
            const FormatIcon = format?.icon
            return (
              <div key={r.id} className="card card-hover p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display font-semibold truncate">{r.title}</p>
                  <p className="text-sm text-text-tertiary flex items-center gap-1.5 mt-1">
                    {r.platform}
                    <span className="w-1 h-1 rounded-full bg-text-tertiary/60" />
                    {FormatIcon && <FormatIcon size={13} strokeWidth={2} />} {format?.label}
                    <span className="w-1 h-1 rounded-full bg-text-tertiary/60" />
                    {r.estimated_time} min
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-4 text-sm">
                    Open <ExternalLink size={14} strokeWidth={2.25} />
                  </a>
                  <button
                    onClick={() => handleRemove(r.id)}
                    aria-label="Remove from saved"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-text-tertiary hover:text-coral hover:bg-coral/10 transition-colors duration-250"
                  >
                    <X size={16} strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
