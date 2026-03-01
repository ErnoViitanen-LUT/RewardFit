import type { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  style?: CSSProperties
}

export function Card({ children, style }: Props) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 12,
      padding: 16,
      border: '1px solid var(--color-border)',
      ...style,
    }}>
      {children}
    </div>
  )
}
