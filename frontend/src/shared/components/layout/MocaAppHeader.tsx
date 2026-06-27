import { Brain, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../stores/authStore'

type Props = {
  title?: string
}

export function MocaAppHeader({ title = 'MoCA Assessment' }: Props) {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/entry', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 w-full items-center justify-between border-b border-outline-variant bg-surface px-[var(--stitch-margin-mobile)]">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" aria-hidden />
        <h1 className="text-lg font-semibold text-primary md:text-xl">{title}</h1>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container"
        aria-label="Đăng xuất"
      >
        <LogOut className="h-5 w-5" />
        <span className="hidden sm:inline">Đăng xuất</span>
      </button>
    </header>
  )
}
