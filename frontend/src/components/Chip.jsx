export default function Chip({ label, icon: Icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip ${selected ? 'chip-selected' : ''}`}
      aria-pressed={selected}
    >
      {Icon && <Icon size={15} strokeWidth={2.25} aria-hidden="true" />}
      {label}
    </button>
  )
}
