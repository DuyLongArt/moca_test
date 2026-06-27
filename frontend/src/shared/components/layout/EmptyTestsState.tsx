import { RefreshCw } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../lib/queryKeys'
import { useAuthStore } from '../../../stores/authStore'

export function EmptyTestsState() {
  const queryClient = useQueryClient()
  const patientId = useAuthStore((s) => s.user?.id)

  const refresh = () => {
    if (patientId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.patient.sessions(patientId),
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest">
        <span className="text-4xl">🧪</span>
      </div>
      <h2 className="text-lg font-semibold text-on-surface">Chưa có bài test</h2>
      <p className="mt-1 max-w-xs text-sm text-on-surface-variant">
        Làm bài MoCA để xem kết quả tại đây.
      </p>
      <button
        type="button"
        onClick={refresh}
        className="mt-4 flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-on-primary active:scale-95"
      >
        <RefreshCw size={16} />
        Tải lại
      </button>
    </div>
  )
}
