import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSavedResources, removeResource } from '../services/storage'
import { FORMAT_META } from '../data/options'

export default function SavedPage() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState([])

  useEffect(() => {
    setSaved(getSavedResources())
  }, [])

  function handleRemove(id) {
    setSaved(removeResource(id))
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-semibold mb-1">Saved resources</h1>
      <p className="text-ink/60 text-sm mb-10">Everything you\u2019ve bookmarked, in one place.</p>

      {saved.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-medium mb-2">Nothing saved yet.</p>
          <p className="text-sm text-ink/60 mb-6">Resources you save from your study path will show up here.</p>
          <button onClick={() => navigate('/questionnaire')} className="btn-primary">Find resources</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {saved.map((r) => {
            const format = FORMAT_META[r.format] || { label: r.format, icon: '📎' }
            return (
              <div key={r.id} className="card p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-display font-semibold">{r.title}</p>
                  <p className="text-sm text-ink/60">{r.platform} · {format.icon} {format.label} · {r.estimated_time} min</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-4 text-sm">
                    Open
                  </a>
                  <button onClick={() => handleRemove(r.id)} className="text-sm text-ink/50 hover:text-flag transition-colors px-2">
                    Remove
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
