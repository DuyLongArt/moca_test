import { useQuery } from '@tanstack/react-query'
import { fetchHealth } from '../api/health.api'
import { queryKeys } from '../lib/queryKeys'

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: fetchHealth,
    staleTime: 60_000,
    retry: 1,
  })
}
