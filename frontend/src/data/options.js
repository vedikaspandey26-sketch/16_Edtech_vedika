import {
  School, GraduationCap, BookMarked, Sprout,
  FileEdit, Lightbulb, PenTool, Wrench, Briefcase, Compass,
  Video, Newspaper, Gamepad2, ListChecks, StickyNote,
} from 'lucide-react'

export const ACADEMIC_LEVELS = [
  { value: 'school', label: 'School', icon: School },
  { value: 'undergraduate', label: 'Undergraduate', icon: GraduationCap },
  { value: 'postgraduate', label: 'Postgraduate', icon: BookMarked },
  { value: 'self-learning', label: 'Self-learning', icon: Sprout },
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
  { value: 'exam', label: 'Prepare for an exam', icon: FileEdit },
  { value: 'concept', label: 'Understand a concept', icon: Lightbulb },
  { value: 'practice', label: 'Practice problems', icon: PenTool },
  { value: 'project', label: 'Build a project', icon: Wrench },
  { value: 'interview', label: 'Interview preparation', icon: Briefcase },
  { value: 'explore', label: 'Explore the topic', icon: Compass },
]

export const FORMATS = [
  { value: 'video', label: 'Video', icon: Video },
  { value: 'article', label: 'Articles', icon: Newspaper },
  { value: 'interactive', label: 'Interactive', icon: Gamepad2 },
  { value: 'practice', label: 'Practice questions', icon: ListChecks },
  { value: 'notes', label: 'Notes / PDFs', icon: StickyNote },
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
