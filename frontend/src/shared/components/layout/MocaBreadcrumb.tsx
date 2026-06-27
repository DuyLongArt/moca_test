import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { resolveBreadcrumbs, type BreadcrumbCrumb } from '../../lib/breadcrumbs'

type Props = {
  items?: BreadcrumbCrumb[]
  variant?: 'stitch' | 'glass'
  className?: string
}

export function MocaBreadcrumb({ items, variant = 'stitch', className = '' }: Props) {
  const { pathname } = useLocation()
  const crumbs = items ?? resolveBreadcrumbs(pathname)

  if (crumbs.length <= 1) return null

  const linkClass =
    variant === 'stitch'
      ? 'text-on-surface-variant transition-colors hover:text-primary'
      : 'text-slate-500 transition-colors hover:text-blue-600'

  const currentClass =
    variant === 'stitch' ? 'font-medium text-on-surface' : 'font-medium text-slate-900'

  const sepClass = variant === 'stitch' ? 'text-outline' : 'text-slate-300'

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight size={14} className={sepClass} aria-hidden />
              )}
              {isLast || !crumb.to ? (
                <span className={currentClass} aria-current={isLast ? 'page' : undefined}>
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className={linkClass}>
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
