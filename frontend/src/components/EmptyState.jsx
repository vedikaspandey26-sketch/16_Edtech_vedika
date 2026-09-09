export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card px-8 py-14 text-center flex flex-col items-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-stroke flex items-center justify-center mb-5">
          <Icon size={24} strokeWidth={1.75} className="text-indigo-soft" />
        </div>
      )}
      <p className="font-display text-lg font-semibold mb-1.5">{title}</p>
      {description && <p className="text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">{description}</p>}
      {action}
    </div>
  )
}
