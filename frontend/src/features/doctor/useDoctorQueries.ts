import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../stores/authStore'
import { queryKeys } from '../../shared/lib/queryKeys'
import {
  approveReview,
  getSessionDetail,
  listDoctorPatients,
  listDoctorReviews,
} from './doctor.api'

export function useDoctorReviews() {
  const doctorId = useAuthStore((s) => s.user?.id)

  return useQuery({
    queryKey: queryKeys.doctor.reviews(doctorId ?? ''),
    queryFn: () => listDoctorReviews(doctorId!),
    enabled: !!doctorId,
  })
}

export function useDoctorPatients() {
  const doctorId = useAuthStore((s) => s.user?.id)

  return useQuery({
    queryKey: queryKeys.doctor.patients(doctorId ?? ''),
    queryFn: () => listDoctorPatients(doctorId!),
    enabled: !!doctorId,
  })
}

export function useSessionDetail(sessionId: string) {
  const doctorId = useAuthStore((s) => s.user?.id)

  return useQuery({
    queryKey: queryKeys.doctor.review(doctorId ?? '', sessionId),
    queryFn: () => getSessionDetail(sessionId),
    enabled: !!doctorId && !!sessionId,
  })
}

export function useApproveReview(sessionId: string) {
  const queryClient = useQueryClient()
  const doctorId = useAuthStore((s) => s.user?.id)

  return useMutation({
    mutationFn: (payload: Parameters<typeof approveReview>[1]) =>
      approveReview(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.doctor.review(doctorId ?? '', sessionId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.doctor.reviews(doctorId ?? ''),
      })
    },
  })
}
