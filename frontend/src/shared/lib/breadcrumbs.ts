import { matchPath } from 'react-router-dom'

export type BreadcrumbCrumb = {
  label: string
  to?: string
}

type RouteDef = {
  path: string
  crumbs: BreadcrumbCrumb[] | ((params: Record<string, string | undefined>) => BreadcrumbCrumb[])
}

const ROUTES: RouteDef[] = [
  { path: '/patient', crumbs: [{ label: 'Trang chủ' }] },
  {
    path: '/patient/test',
    crumbs: [
      { label: 'Trang chủ', to: '/patient' },
      { label: 'Làm test MoCA' },
    ],
  },
  {
    path: '/patient/results',
    crumbs: [
      { label: 'Trang chủ', to: '/patient' },
      { label: 'Kết quả' },
    ],
  },
  {
    path: '/patient/appointments',
    crumbs: [
      { label: 'Trang chủ', to: '/patient' },
      { label: 'Lịch khám' },
    ],
  },
  {
    path: '/patient/doctors',
    crumbs: [
      { label: 'Trang chủ', to: '/patient' },
      { label: 'Đổi bác sĩ' },
    ],
  },
  { path: '/doctor', crumbs: [{ label: 'Dashboard' }] },
  {
    path: '/doctor/patients',
    crumbs: [
      { label: 'Dashboard', to: '/doctor' },
      { label: 'Bệnh nhân' },
    ],
  },
  {
    path: '/doctor/reviews/:id',
    crumbs: [
      { label: 'Dashboard', to: '/doctor' },
      { label: 'Chấm điểm' },
    ],
  },
  { path: '/admin', crumbs: [{ label: 'Dashboard' }] },
  {
    path: '/admin/doctors',
    crumbs: [
      { label: 'Dashboard', to: '/admin' },
      { label: 'Quản lý bác sĩ' },
    ],
  },
]

export function resolveBreadcrumbs(pathname: string): BreadcrumbCrumb[] {
  for (const route of ROUTES) {
    const match = matchPath({ path: route.path, end: true }, pathname)
    if (!match) continue
    return typeof route.crumbs === 'function' ? route.crumbs(match.params) : route.crumbs
  }
  return []
}
