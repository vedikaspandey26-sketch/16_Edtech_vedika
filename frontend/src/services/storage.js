const SAVED_KEY = 'studymate_saved_resources'
const PROFILE_KEY = 'studymate_last_profile'
const RESULTS_KEY = 'studymate_last_results'

export function getSavedResources() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || []
  } catch {
    return []
  }
}

export function isResourceSaved(id) {
  return getSavedResources().some((r) => r.id === id)
}

export function saveResource(resource) {
  const current = getSavedResources()
  if (current.some((r) => r.id === resource.id)) return current
  const updated = [...current, resource]
  localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
  return updated
}

export function removeResource(id) {
  const updated = getSavedResources().filter((r) => r.id !== id)
  localStorage.setItem(SAVED_KEY, JSON.stringify(updated))
  return updated
}

export function storeLastSession(profile, results) {
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results))
}

export function getLastSession() {
  try {
    const profile = JSON.parse(sessionStorage.getItem(PROFILE_KEY))
    const results = JSON.parse(sessionStorage.getItem(RESULTS_KEY))
    if (!profile || !results) return null
    return { profile, results }
  } catch {
    return null
  }
}
