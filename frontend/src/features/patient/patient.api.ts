import { api } from '../../shared/lib/axios'
import { getDevUser } from '../../shared/lib/devFixtures'
import { useMockApi } from '../../shared/lib/useMockApi'
import { mapAuthUserDto } from '../auth/auth.api'
import type { AuthUser } from '../../stores/authStore'
import type {
  Appointment,
  DoctorOption,
  TestSessionSummary,
} from '../../shared/types/session'


const USE_MOCK = useMockApi()

const MOCK_SESSIONS: TestSessionSummary[] = [
  {
    id: '1',
    setId: 'MOCA_SET_1',
    submittedAt: '2026-06-24T09:30:00Z',
    status: 'PENDING_REVIEW',
    provisionalScore: 22,
    finalScore: null,
    classification: 'Chờ bác sĩ duyệt',
  },
  {
    id: '2',
    setId: 'MOCA_SET_1',
    submittedAt: '2026-05-10T14:00:00Z',
    status: 'FINALIZED',
    provisionalScore: 26,
    finalScore: 27,
    classification: 'Nhận thức bình thường',
  },
]

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    doctorName: 'BS. Trần Minh',
    scheduledAt: '2026-06-28T09:00:00Z',
    status: 'SCHEDULED',
  },
  {
    id: '2',
    doctorName: 'BS. Trần Minh',
    scheduledAt: '2026-05-15T14:30:00Z',
    status: 'COMPLETED',
  },
]

const MOCK_DOCTORS: DoctorOption[] = [
  { id: 'd1', name: 'BS. Trần Minh', specialty: 'Thần kinh', phone: '0911111111', email: 'doctor.tran@moca.local', workplace: 'Bệnh viện Trung ương', experience: '15 năm', isCurrent: true },
  { id: 'd2', name: 'BS. Lê Hương', specialty: 'Lão khoa', phone: '0922222222', email: 'doctor.le@moca.local', workplace: 'Bệnh viện Trung ương', experience: '10 năm', isCurrent: false },
  { id: 'd3', name: 'BS. Phạm Quân', specialty: 'Tâm thần', phone: '0933333333', email: 'doctor.quan@moca.local', workplace: 'Bệnh viện Tâm thần', experience: '8 năm', isCurrent: false },
]

export async function listPatientSessions(
  patientId: string,
): Promise<TestSessionSummary[]> {
  if (USE_MOCK) return MOCK_SESSIONS
  const { data } = await api.get<TestSessionSummary[]>(
    `/api/v1/patient/${patientId}/sessions`,
  )
  return data
}

export async function listPatientAppointments(
  patientId: string,
): Promise<Appointment[]> {
  if (USE_MOCK) return MOCK_APPOINTMENTS
  const { data } = await api.get<Appointment[]>(
    `/api/v1/patient/${patientId}/appointments`,
  )
  return data
}

export async function listDoctorOptions(
): Promise<DoctorOption[]> {
  if (USE_MOCK) return MOCK_DOCTORS

  const { data } = await api.get<
    | DoctorOption[]
    | { status?: string; code?: number; message?: string; data?: Array<Record<string, unknown>> }
  >('/api/v1/doctors/list', {
    // params: { patient_id: patientId },
  })

  const rows = Array.isArray(data) ? data : data?.data ?? []

  return rows.map((item: any, index: number) => ({
    id: String(item.id ?? item.doctor_id ?? item.full_name ?? `${item.specialty ?? 'doctor'}-${index}`),
    name: String(item.full_name ?? item.fullName ?? item.name ?? `Bác sĩ ${index + 1}`),
    specialty: String(item.specialty ?? item.specialty_name ?? 'Chuyên khoa'),
    phone: typeof item.phone_number === 'string' || typeof item.phoneNumber === 'string'
      ? String(item.phone_number ?? item.phoneNumber ?? '')
      : undefined,
    email: typeof item.email === 'string' ? item.email : undefined,
    workplace: typeof item.workplace === 'string' ? item.workplace : undefined,
    experience: typeof item.experience === 'string' ? item.experience : undefined,
    isCurrent: Boolean(item.is_current ?? item.isCurrent ?? false),
  }))
}

export async function pickClinician(
  patientId: string,
  clinicianId: string,
): Promise<void> {
  if (USE_MOCK) return

  const { data } = await api.post<
    | string
    | { status?: string; code?: number; message?: string; data?: Record<string, unknown> }
  >('/api/v1/doctor/list', null, {
    params: {
      patient_id: patientId,
      doctor_id: clinicianId,
    },
  })

  const ok =
    typeof data === 'string'
      ? data.toLowerCase().includes('success')
      : String(data?.status ?? '').toLowerCase() === 'ok' ||
        Number(data?.code ?? 0) === 200 ||
        String(data?.message ?? '').toLowerCase().includes('success')

  if (!ok) {
    throw new Error('Không thể gán bác sĩ cho bệnh nhân.')
  }
}

export type UpdatePatientProfilePayload = {
  fullName: string
  email?: string
  gender?: string
  dateOfBirth?: string | null
  educationYears?: number | null
}

export async function updatePatientProfile(
  patientId: string,
  payload: UpdatePatientProfilePayload,
): Promise<AuthUser> {
  if (USE_MOCK) {
    return { ...getDevUser('PATIENT'), id: patientId, ...payload }
  }
  const { data } = await api.patch(`/api/v1/patient/${patientId}/profile`, payload)
  return mapAuthUserDto(data)
}

export type SubmitSessionPayload = {
  patientId: string
  setId: string
  rawAnswers: Record<string, unknown>
  educationYears: number
}

export async function submitTestSession(
  payload: SubmitSessionPayload,
): Promise<TestSessionSummary> {
  if (USE_MOCK) {
    return {
      id: crypto.randomUUID(),
      setId: payload.setId,
      submittedAt: new Date().toISOString(),
      status: 'PENDING_REVIEW',
      provisionalScore: 0,
      finalScore: null,
      classification: 'Chờ bác sĩ duyệt',
    }
  }
  const { data } = await api.post<TestSessionSummary>(
    '/api/v1/test-sessions',
    payload,
  )
  return data
}
