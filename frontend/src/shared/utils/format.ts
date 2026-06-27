export function formatDateVi(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTimeVi(iso: string): string {
  const d = new Date(iso)
  return `${d.toLocaleDateString('vi-VN')} · ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
}

export function appointmentStatusVi(
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED',
): string {
  const map = {
    SCHEDULED: 'Sắp tới',
    COMPLETED: 'Đã khám',
    CANCELLED: 'Đã hủy',
  }
  return map[status]
}
