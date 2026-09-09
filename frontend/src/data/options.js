export const ACADEMIC_LEVELS = [
  { value: 'school', label: 'School', icon: '🎒' },
  { value: 'undergraduate', label: 'Undergraduate', icon: '🎓' },
  { value: 'postgraduate', label: 'Postgraduate', icon: '📘' },
  { value: 'self-learning', label: 'Self-learning', icon: '🌱' },
]

export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Computer Science',
  'Programming',
  'Data Structures & Algorithms',
  'AI & Machine Learning',
  'Chemistry',
  'Other',
]

export const KNOWLEDGE_LEVELS = [
  { value: 'beginner', label: 'Complete beginner' },
  { value: 'basics', label: 'I know the basics' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export const GOALS = [
  { value: 'exam', label: 'Prepare for an exam', icon: '📝' },
  { value: 'concept', label: 'Understand a concept', icon: '💡' },
  { value: 'practice', label: 'Practice problems', icon: '✏️' },
  { value: 'project', label: 'Build a project', icon: '🛠️' },
  { value: 'interview', label: 'Interview preparation', icon: '💼' },
  { value: 'explore', label: 'Explore the topic', icon: '🧭' },
]

export const FORMATS = [
  { value: 'video', label: 'Video', icon: '🎥' },
  { value: 'article', label: 'Articles', icon: '📰' },
  { value: 'interactive', label: 'Interactive', icon: '🕹️' },
  { value: 'practice', label: 'Practice questions', icon: '✅' },
  { value: 'notes', label: 'Notes / PDFs', icon: '📄' },
]

export const STUDY_TIMES = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2+ hours' },
]

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'challenging', label: 'Challenging' },
]

export const FORMAT_META = Object.fromEntries(FORMATS.map((f) => [f.value, f]))
export const GOAL_META = Object.fromEntries(GOALS.map((g) => [g.value, g]))
export const KNOWLEDGE_META = Object.fromEntries(KNOWLEDGE_LEVELS.map((k) => [k.value, k]))
export const ACADEMIC_META = Object.fromEntries(ACADEMIC_LEVELS.map((a) => [a.value, a]))
