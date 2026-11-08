import axios from 'axios'
import { api } from '../../shared/lib/axios'
import { getDevUser } from '../../shared/lib/devFixtures'
import { useMockApi } from '../../shared/lib/useMockApi'
import type { AuthUser, UserRole } from '../../stores/authStore'

type Envelope<T> = { status: string; code: number; message: string; data?: T }

type TokenData = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  role: string
}

export type AuthUserDto = {
  id: string
  email: string
  phoneNumber: string
  fullName: string
  role: UserRole
  gender?: string
  dateOfBirth?: string | null
  educationYears?: number | null
}

export function mapAuthUserDto(data: AuthUserDto): AuthUser {
  return {
    id: data.id,
    email: data.email,
    phoneNumber: data.phoneNumber,
    fullName: data.fullName,
    role: data.role,
    gender: data.gender || undefined,
    dateOfBirth: data.dateOfBirth ?? null,
    educationYears: data.educationYears ?? null,
  }
}

type LoginData = TokenData & {
  user: {
    id: string
    role: string
    full_name: string
    email: string
    phone: string
  }
}

export type AuthSession = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export type TokenPair = { accessToken: string; refreshToken: string }

const MOCK_TOKENS = { accessToken: 'dev-bypass', refreshToken: 'dev-bypass' }

function toRole(role: string): UserRole {
  return role.toUpperCase() as UserRole
}

function mapTokens(data: TokenData): TokenPair {
  return { accessToken: data.access_token, refreshToken: data.refresh_token }
}

function mapLogin(data: LoginData): AuthSession {
  return {
    ...mapTokens(data),
    user: {
      id: data.user.id,
      role: toRole(data.user.role),
      fullName: data.user.full_name,
      email: data.user.email,
      phoneNumber: data.user.phone,
    },
  }
}

export function apiErrorStatus(err: unknown): number | undefined {
  return axios.isAxiosError(err) ? err.response?.status : undefined
}

async function login(
  role: 'patient' | 'doctor',
  identifier: string,
  password: string,
): Promise<AuthSession> {
  const { data } = await api.post<Envelope<LoginData>>('/api/v1/auth/login', {
    role,
    identifier,
    password,
  })
  return mapLogin(data.data as LoginData)
}

/** Patient — phone number + password. */
export async function patientLogin(phone: string, password: string): Promise<AuthSession> {
  if (useMockApi()) {
    return { ...MOCK_TOKENS, user: { ...getDevUser('PATIENT'), phoneNumber: phone } }
  }
  return login('patient', phone, password)
}

/** Doctor — email + password. */
export async function doctorLogin(email: string, password: string): Promise<AuthSession> {
  if (useMockApi()) {
    const role: UserRole = email.includes('admin') ? 'ADMIN' : 'DOCTOR'
    return { ...MOCK_TOKENS, user: { ...getDevUser(role), email } }
  }
  return login('doctor', email, password)
}

/** Patient signup — the API returns no tokens, so sign in right after. */
export async function patientSignup(payload: {
  phone: string
  password: string
  fullName: string
}): Promise<AuthSession> {
  if (useMockApi()) {
    return {
      ...MOCK_TOKENS,
      user: { ...getDevUser('PATIENT'), phoneNumber: payload.phone, fullName: payload.fullName },
    }
  }
  await api.post('/api/v1/auth/register', {
    role: 'patient',
    identifier: payload.phone,
    password: payload.password,
    full_name: payload.fullName,
  })
  return login('patient', payload.phone, payload.password)
}

/** Doctor signup — requires the hospital invite code. */
export async function doctorSignup(payload: {
  email: string
  password: string
  fullName: string
  inviteCode: string
  specialty?: string
  licenseNumber?: string
}): Promise<AuthSession> {
  if (useMockApi()) {
    return {
      ...MOCK_TOKENS,
      user: { ...getDevUser('DOCTOR'), email: payload.email, fullName: payload.fullName },
    }
  }
  await api.post('/api/v1/auth/register', {
    role: 'doctor',
    identifier: payload.email,
    password: payload.password,
    full_name: payload.fullName,
    invite_code: payload.inviteCode,
    specialty: payload.specialty,
    license_number: payload.licenseNumber,
  })
  return login('doctor', payload.email, payload.password)
}

/** Rotates the refresh token; the old one is single-use. */
export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  const { data } = await api.post<Envelope<TokenData>>('/api/v1/auth/refresh', {
    refresh_token: refreshToken,
  })
  return mapTokens(data.data as TokenData)
}

export async function logoutApi(refreshToken: string): Promise<void> {
  if (useMockApi()) return
  await api.post('/api/v1/auth/logout', { refresh_token: refreshToken })
}
