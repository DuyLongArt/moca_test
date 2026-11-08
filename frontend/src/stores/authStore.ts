import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  doctorLogin as doctorLoginApi,
  doctorSignup as doctorSignupApi,
  logoutApi,
  patientLogin as patientLoginApi,
  patientSignup as patientSignupApi,
  refreshTokens,
  type AuthSession,
} from '../features/auth/auth.api'

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN'

export type AuthUser = {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  role: UserRole
  gender?: string
  dateOfBirth?: string | null
  educationYears?: number | null
}

type AuthState = {
  user: AuthUser | null
  /** Short-lived (15 min) access JWT. */
  token: string | null
  /** Rotating 30-day refresh token. */
  refreshToken: string | null
  patientLogin: (phone: string, password: string) => Promise<void>
  patientSignup: (payload: { phone: string; password: string; fullName: string }) => Promise<void>
  doctorLogin: (email: string, password: string) => Promise<void>
  doctorSignup: (payload: {
    email: string
    password: string
    fullName: string
    inviteCode: string
    specialty?: string
    licenseNumber?: string
  }) => Promise<void>
  /** Returns the new access token, or null (and clears the session) on failure. */
  refresh: () => Promise<string | null>
  updateUser: (user: AuthUser) => void
  /** Drops local state without calling the API. */
  clearSession: () => void
  /** Revokes the refresh token server-side, then clears local state. */
  logout: () => void
}

const setSession = (s: AuthSession) => ({
  user: s.user,
  token: s.accessToken,
  refreshToken: s.refreshToken,
})

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      patientLogin: async (phone, password) => {
        set(setSession(await patientLoginApi(phone, password)))
      },
      patientSignup: async (payload) => {
        set(setSession(await patientSignupApi(payload)))
      },
      doctorLogin: async (email, password) => {
        set(setSession(await doctorLoginApi(email, password)))
      },
      doctorSignup: async (payload) => {
        set(setSession(await doctorSignupApi(payload)))
      },
      refresh: async () => {
        const current = get().refreshToken
        if (!current) return null
        try {
          const t = await refreshTokens(current)
          set({ token: t.accessToken, refreshToken: t.refreshToken })
          return t.accessToken
        } catch {
          get().clearSession()
          return null
        }
      },
      updateUser: (user) => set({ user }),
      clearSession: () => set({ user: null, token: null, refreshToken: null }),
      logout: () => {
        const rt = get().refreshToken
        get().clearSession()
        if (rt) void logoutApi(rt).catch(() => {})
      },
    }),
    { name: 'moca-auth' },
  ),
)
