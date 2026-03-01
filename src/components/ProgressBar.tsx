interface Props {
  value: number
  max: number
  label?: string
}

export function ProgressBar({ value, max, label }: Props) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0

  return (
    <div style={{ marginBottom: 8 }}>
      {label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          marginBottom: 4,
        }}>
          <span>{label}</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>{value}/{max}</span>
        </div>
      )}
      <div style={{
        height: 8,
        borderRadius: 4,
        background: 'var(--color-border)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 4,
          background: pct >= 100 ? 'var(--color-success)' : 'var(--color-primary)',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  )
}
