import { FileText, Video, Code2, Gamepad2 } from 'lucide-react'

const TYPES = [{ value: 'all', label: 'All' }, { value: 'text', label: 'Text', icon: FileText }, { value: 'video', label: 'Video', icon: Video }, { value: 'practice', label: 'Practice', icon: Code2 }, { value: 'interactive', label: 'Interactive', icon: Gamepad2 }]

export default function ResourceTypeFilterTabs({ value, onChange }) {
  return <div className="flex flex-wrap gap-2">{TYPES.map(({ value: itemValue, label, icon: Icon }) => <button key={itemValue} className={`chip ${value === itemValue ? 'chip-selected' : ''}`} onClick={() => onChange(itemValue)}>{Icon && <Icon size={15} />}{label}</button>)}</div>
}
