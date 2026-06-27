import { Navigate, Outlet } from 'react-router-dom'
import type { UserRole } from '../../stores/authStore'
import { useAuthStore } from '../../stores/authStore'

type Props = {
  roles?: UserRole[]
}

export function PrivateRoute({ roles }: Props) {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    const home =
      user.role === 'PATIENT'
        ? '/patient'
        : user.role === 'DOCTOR'
          ? '/doctor'
          : '/admin'
    return <Navigate to={home} replace />
  }

  return <Outlet />
}
