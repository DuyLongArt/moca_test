import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  isLoading: boolean
  error: Error | null
  children: ReactNode
  empty?: ReactNode
  isEmpty?: boolean
}

export function QueryState({ isLoading, error, children, empty, isEmpty }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
        <Loader2 size={20} className="animate-spin" />
        Đang tải…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Không tải được dữ liệu: {error.message}
      </div>
    )
  }

  if (isEmpty && empty) return <>{empty}</>

  return <>{children}</>
}
