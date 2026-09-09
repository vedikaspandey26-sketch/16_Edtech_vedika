export default function Chip({ label, icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip ${selected ? 'chip-selected' : 'bg-white hover:border-ink/40'}`}
      aria-pressed={selected}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
    </button>
  )
}
