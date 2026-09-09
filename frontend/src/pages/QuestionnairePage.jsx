import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressSteps from '../components/ProgressSteps'
import Chip from '../components/Chip'
import {
  ACADEMIC_LEVELS,
  SUBJECTS,
  KNOWLEDGE_LEVELS,
  GOALS,
  FORMATS,
  STUDY_TIMES,
  DIFFICULTIES,
} from '../data/options'
import { fetchRecommendations } from '../services/api'
import { storeLastSession } from '../services/storage'

const TOTAL_STEPS = 3
const LOADING_MESSAGES = ['Building your study path...', 'Matching resources to your learning style...']

const initialForm = {
  academic_level: 'undergraduate',
  subject: '',
  customSubject: '',
  topic: '',
  level: 'beginner',
  goal: 'concept',
  formats: [],
  time: 30,
  difficulty: 'moderate',
}

export default function QuestionnairePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setError('')
  }

  function toggleFormat(value) {
    setForm((f) => ({
      ...f,
      formats: f.formats.includes(value) ? f.formats.filter((v) => v !== value) : [...f.formats, value],
    }))
  }

  function canProceedFromStep1() {
    const subject = form.subject === 'Other' ? form.customSubject : form.subject
    return subject.trim() || form.topic.trim()
  }

  function goNext() {
    if (step === 1 && !canProceedFromStep1()) {
      setError('Add at least a subject or a topic so we know what to look for.')
      return
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1))
  }

  async function handleSubmit() {
    setError('')
    setLoading(true)
    setLoadingMessage(LOADING_MESSAGES[0])

    const messageTimer = setTimeout(() => setLoadingMessage(LOADING_MESSAGES[1]), 700)

    const subject = form.subject === 'Other' ? form.customSubject : form.subject
    const profile = {
      academic_level: form.academic_level,
      subject,
      topic: form.topic,
      level: form.level,
      goal: form.goal,
      formats: form.formats,
      time: form.time,
      difficulty: form.difficulty,
    }

    try {
      const results = await fetchRecommendations(profile)
      storeLastSession(profile, results)
      navigate('/results')
    } catch (err) {
      if (err.message === 'BACKEND_UNAVAILABLE') {
        setError('We can\u2019t reach the recommendation service right now. Please make sure the backend is running and try again.')
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      clearTimeout(messageTimer)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 py-32 text-center">
        <div className="w-10 h-10 mx-auto mb-6 rounded-full border-2 border-ink/15 border-t-ink animate-spin" />
        <p className="font-display text-lg font-semibold">{loadingMessage}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
      <ProgressSteps step={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-1">What are you learning?</h2>
            <p className="text-ink/60 text-sm">This helps us find resources on the right topic, at the right depth.</p>
          </div>

          <Field label="Academic level">
            <div className="flex flex-wrap gap-2">
              {ACADEMIC_LEVELS.map((a) => (
                <Chip key={a.value} label={a.label} icon={a.icon} selected={form.academic_level === a.value} onClick={() => update('academic_level', a.value)} />
              ))}
            </div>
          </Field>

          <Field label="Subject">
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <Chip key={s} label={s} selected={form.subject === s} onClick={() => update('subject', s)} />
              ))}
            </div>
            {form.subject === 'Other' && (
              <input
                type="text"
                placeholder="Type your subject"
                value={form.customSubject}
                onChange={(e) => update('customSubject', e.target.value)}
                className="mt-3 w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus:border-ink/40 outline-none"
              />
            )}
          </Field>

          <Field label="Topic (optional but helps a lot)">
            <input
              type="text"
              placeholder="e.g. Binary Search"
              value={form.topic}
              onChange={(e) => update('topic', e.target.value)}
              className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus:border-ink/40 outline-none"
            />
          </Field>

          <Field label="Current knowledge">
            <div className="flex flex-wrap gap-2">
              {KNOWLEDGE_LEVELS.map((k) => (
                <Chip key={k.value} label={k.label} selected={form.level === k.value} onClick={() => update('level', k.value)} />
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-1">What\u2019s your goal?</h2>
            <p className="text-ink/60 text-sm">So we can prioritize the right kind of resource.</p>
          </div>

          <Field label="Learning goal">
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <Chip key={g.value} label={g.label} icon={g.icon} selected={form.goal === g.value} onClick={() => update('goal', g.value)} />
              ))}
            </div>
          </Field>

          <Field label="Difficulty preference">
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <Chip key={d.value} label={d.label} selected={form.difficulty === d.value} onClick={() => update('difficulty', d.value)} />
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-1">How do you like to learn?</h2>
            <p className="text-ink/60 text-sm">Pick as many formats as you like, and how much time you have today.</p>
          </div>

          <Field label="Preferred format (select any)">
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <Chip key={f.value} label={f.label} icon={f.icon} selected={form.formats.includes(f.value)} onClick={() => toggleFormat(f.value)} />
              ))}
            </div>
          </Field>

          <Field label="Available study time">
            <div className="flex flex-wrap gap-2">
              {STUDY_TIMES.map((t) => (
                <Chip key={t.value} label={t.label} selected={form.time === t.value} onClick={() => update('time', t.value)} />
              ))}
            </div>
          </Field>
        </div>
      )}

      {error && <p className="text-sm text-flag mt-6">{error}</p>}

      <div className="flex items-center justify-between mt-10">
        {step > 1 ? (
          <button onClick={goBack} className="btn-secondary">Back</button>
        ) : <span />}

        {step < TOTAL_STEPS ? (
          <button onClick={goNext} className="btn-primary">Continue</button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary">Get my study path →</button>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink/70 mb-3">{label}</p>
      {children}
    </div>
  )
}
