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
