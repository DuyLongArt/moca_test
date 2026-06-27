import { api } from '../../shared/lib/axios'
import type { AuthUser, UserRole } from '../../stores/authStore'

type LoginResponse = {
  accessToken: string
  user: {
    id: string
    email: string
    fullName: string
    role: UserRole
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; accessToken: string }> {
  const { data } = await api.post<LoginResponse>('/api/auth/login', {
    email,
    password,
  })
  return {
    accessToken: data.accessToken,
    user: {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.fullName,
      role: data.user.role,
    },
  }
}
