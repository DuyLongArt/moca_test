export type SessionStatus = 'IN_PROGRESS' | 'PENDING_REVIEW' | 'FINALIZED'

export type TestSessionSummary = {
  id: string
  setId: string
  submittedAt: string
  status: SessionStatus
  provisionalScore: number | null
  finalScore: number | null
  classification: string | null
}

export type Appointment = {
  id: string
  doctorName: string
  scheduledAt: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}

export type DoctorOption = {
  id: string
  name: string
  specialty: string
  phone?: string
  email?: string
  workplace?: string
  experience?: string
  isCurrent: boolean
}
