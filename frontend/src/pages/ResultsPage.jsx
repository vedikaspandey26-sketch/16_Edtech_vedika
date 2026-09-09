import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Compass, Sprout, Clock, Settings2, SearchX } from 'lucide-react'
import ResourceCard from '../components/ResourceCard'
import StudyPath from '../components/StudyPath'
import Chip from '../components/Chip'
import EmptyState from '../components/EmptyState'
import { ACADEMIC_META, GOAL_META, KNOWLEDGE_META, FORMAT_META } from '../data/options'
import { getLastSession } from '../services/storage'

const FORMAT_FILTERS = [{ value: 'all', label: 'All' }, ...Object.values(FORMAT_META).map((f) => ({ value: f.value, label: f.label, icon: f.icon }))]
const DIFFICULTY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' },
]
const TIME_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'short', label: '< 20 min' },
  { value: 'medium', label: '20\u201340 min' },
  { value: 'long', label: '40+ min' },
]

function matchesTimeBucket(minutes, bucket) {
  if (bucket === 'all') return true
  if (bucket === 'short') return minutes < 20
  if (bucket === 'medium') return minutes >= 20 && minutes <= 40
  return minutes > 40
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [formatFilter, setFormatFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')

  useEffect(() => {
    const last = getLastSession()
    if (!last) {
      navigate('/questionnaire')
      return
    }
    setSession(last)
  }, [navigate])

  const filtered = useMemo(() => {
    if (!session) return []
    return session.results.recommendations.filter((r) => {
      if (formatFilter !== 'all' && r.format !== formatFilter) return false
      if (difficultyFilter !== 'all' && r.difficulty !== difficultyFilter) return false
      if (!matchesTimeBucket(r.estimated_time, timeFilter)) return false
      return true
    })
  }, [session, formatFilter, difficultyFilter, timeFilter])

  if (!session) return null

  const { profile, results } = session
  const usedFallback = results.recommendations.some((r) => r.reason.toLowerCase().startsWith("we couldn't find an exact topic match") || r.reason.startsWith('We couldn\u2019t find an exact topic match'))
  const [top, ...rest] = filtered

  const academicMeta = ACADEMIC_META[profile.academic_level]
  const goalMeta = GOAL_META[profile.goal]
  const knowledgeMeta = KNOWLEDGE_META[profile.level]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      {/* Greeting / hierarchy header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2 animate-fadeUp">
        <div>
          <p className="eyebrow mb-2">Personalized for you \u2014 you\u2019ve got this, one step at a time</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold">
            {profile.topic || profile.subject}
          </h1>
        </div>
        <button onClick={() => navigate('/questionnaire')} className="btn-secondary !py-2 !px-4 text-sm">
          <Settings2 size={15} strokeWidth={2.25} /> Change preferences
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-5 mb-4">
        {academicMeta && <Tag icon={academicMeta.icon} text={academicMeta.label} />}
        {goalMeta && <Tag icon={goalMeta.icon} text={goalMeta.label} />}
        {knowledgeMeta && <Tag icon={Sprout} text={knowledgeMeta.label} />}
        {profile.formats?.length > 0 && (
          <Tag icon={FORMAT_META[profile.formats[0]]?.icon || Compass} text={profile.formats.map((f) => FORMAT_META[f]?.label).join(' + ')} />
        )}
        <Tag icon={Clock} text={`${profile.time} minutes`} />
      </div>

      <p className="text-text-secondary text-sm mb-10 max-w-xl">
        We didn\u2019t just search for {profile.topic || profile.subject}. We searched for it \u2014 for you.
      </p>

      {usedFallback && (
        <div className="card p-5 mb-8 border-amber-soft/25 flex items-start gap-3">
          <SearchX size={18} className="text-amber-soft shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-text-secondary">
            We couldn\u2019t find an exact match, but here are the closest resources based on your learning profile.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-start gap-6 mb-10 border-y border-stroke py-6">
        <div className="flex items-center gap-2 text-text-tertiary pt-2">
          <SlidersHorizontal size={15} strokeWidth={2} />
          <span className="text-xs font-semibold uppercase tracking-wide">Refine</span>
        </div>
        <FilterGroup label="Format" options={FORMAT_FILTERS} value={formatFilter} onChange={setFormatFilter} />
        <FilterGroup label="Difficulty" options={DIFFICULTY_FILTERS} value={difficultyFilter} onChange={setDifficultyFilter} />
        <FilterGroup label="Time" options={TIME_FILTERS} value={timeFilter} onChange={setTimeFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No resources match these filters"
          description="Try widening a filter above \u2014 your recommendations are still there."
        />
      ) : (
        <div className="grid gap-6">
          {top && <ResourceCard resource={top} featured />}
          {rest.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <StudyPath steps={results.study_path} />
      </div>
    </div>
  )
}

function Tag({ icon: Icon, text }) {
  return (
    <span className="chip !py-1.5 !px-3.5 bg-white/[0.04] text-sm capitalize">
      {Icon && <Icon size={14} strokeWidth={2} />} {text}
    </span>
  )
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Chip key={o.value} label={o.label} icon={o.icon} selected={value === o.value} onClick={() => onChange(o.value)} />
        ))}
      </div>
    </div>
  )
}
