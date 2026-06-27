import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as loginApi } from '../features/auth/auth.api'

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN'

export type AuthUser = {
  id: string
  fullName: string
  email: string
  role: UserRole
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  /** Lightweight patient login — phone only, no JWT. Enables PrivateRoute access. */
  patientLogin: (phone: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const { user, accessToken } = await loginApi(email, password)
        set({ user, token: accessToken })
      },
      patientLogin: (phone) =>
        set({
          user: { id: phone, fullName: phone, email: `${phone}@patient.local`, role: 'PATIENT' },
          token: null,
        }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'moca-auth' },
  ),
)
