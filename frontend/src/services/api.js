const API_BASE = '/api'

export async function fetchRecommendations(profile) {
  try {
    const response = await fetch(`${API_BASE}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(errorBody.error || 'Something went wrong while finding your resources.')
    }

    return await response.json()
  } catch (err) {
    if (err instanceof TypeError) {
      // Network-level failure - the backend is unreachable.
      throw new Error('BACKEND_UNAVAILABLE')
    }
    throw err
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options)
  if (!response.ok) throw new Error('Unable to load learning data. Please try again.')
  return response.json()
}

export function smartSearch(query, intent, filters) {
  return request('/search/smart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, intent, filters }) })
}

export function fetchDashboard() { return request('/dashboard/demo-user') }
export function fetchSyllabus(parentId) { return request(`/syllabus/tree${parentId ? `?parentId=${encodeURIComponent(parentId)}` : ''}`) }
export function createTimePlan(topic, minutesAvailable) { return request('/plan/time-based', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, minutesAvailable }) }) }
