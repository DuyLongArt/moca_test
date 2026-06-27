import { MocaPatientLayout } from '../../shared/components/layout/MocaPatientLayout'
import { QueryState } from '../../shared/components/QueryState'
import { appointmentStatusVi, formatDateTimeVi } from '../../shared/utils/format'
import { usePatientAppointments } from './usePatientQueries'

export function PatientAppointmentsPage() {
  const { data = [], isLoading, error } = usePatientAppointments()

  return (
    <MocaPatientLayout title="Lịch khám">
      <QueryState
        isLoading={isLoading}
        error={error}
        isEmpty={data.length === 0}
        empty={
          <p className="py-8 text-center text-sm text-on-surface-variant">
            Chưa có lịch hẹn.
          </p>
        }
      >
        <div className="space-y-2">
          {data.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-3"
            >
              <div>
                <p className="font-semibold text-on-surface">{a.doctorName}</p>
                <p className="text-xs text-on-surface-variant">
                  {formatDateTimeVi(a.scheduledAt)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-primary-fixed px-2 py-0.5 text-[10px] font-semibold text-on-primary-fixed-variant">
                {appointmentStatusVi(a.status)}
              </span>
            </div>
          ))}
        </div>
      </QueryState>
    </MocaPatientLayout>
  )
}
