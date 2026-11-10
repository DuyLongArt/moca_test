import axios, { type InternalAxiosRequestConfig } from 'axios'
import { isDevAuthBypass } from './devAuth'
import { useAuthStore } from '../../stores/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mocatestdeploy.duylongart.workers.dev',
  headers: { 'Content-Type': 'application/json' },
})

const isAuthEndpoint = (url?: string) => url?.startsWith('/api/v1/auth/') ?? false

api.interceptors.request.use((config) => {
  // /auth/me is the only authenticated auth endpoint.
  if (!isAuthEndpoint(config.url) || config.url === '/api/v1/auth/me') {
    const token = useAuthStore.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh tokens rotate and are single-use, so concurrent 401s must share one refresh.
let refreshing: Promise<string | null> | null = null

function refreshOnce(): Promise<string | null> {
  refreshing ??= useAuthStore
    .getState()
    .refresh()
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

type RetryConfig = InternalAxiosRequestConfig & { _retried?: boolean }

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config as RetryConfig | undefined
    if (error.response?.status !== 401 || isDevAuthBypass() || !config) {
      return Promise.reject(error)
    }
    const canRefresh =
      !config._retried &&
      !isAuthEndpoint(config.url) &&
      useAuthStore.getState().refreshToken
    if (canRefresh) {
      config._retried = true
      const token = await refreshOnce()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        return api(config)
      }
    } else if (!isAuthEndpoint(config.url)) {
      useAuthStore.getState().clearSession()
    }
    return Promise.reject(error)
  },
)
