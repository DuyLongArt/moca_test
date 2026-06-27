import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function GlassCard({ children, className = '', onClick }: Props) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick()
            }
          : undefined
      }
      className={[
        'rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md',
        'transition hover:shadow-md',
        onClick ? 'cursor-pointer hover:bg-white/85' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
