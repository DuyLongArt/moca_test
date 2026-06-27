import { ArrowRight, Stethoscope, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import '../../styles/stitch-elderly.css'

const inputClass =
  'stitch-input w-full h-12 px-5 bg-surface-container-lowest border-2 border-outline rounded-xl text-lg text-on-surface placeholder:text-on-surface-variant'

export function LandingPage() {
  const navigate = useNavigate()
  const patientLogin = useAuthStore((s) => s.patientLogin)
  const [role, setRole] = useState<'PATIENT' | null>(null)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleContinue = () => {
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại.')
      return
    }
    setError(null)
    patientLogin(phone.trim())
    navigate('/patient')
  }

  return (
    <div className="app-shell elderly-layout bg-background text-on-background">
      <header className="flex h-14 shrink-0 items-center justify-center border-b-2 border-outline-variant bg-surface px-[var(--stitch-margin-mobile)]">
        <h1 className="text-xl font-bold text-primary">Assessment Pro</h1>
      </header>

      <main className="app-shell__main app-shell__main--center px-[var(--stitch-margin-mobile)]">
        {!role ? (
          <div className="mx-auto w-full max-w-sm">
            <section className="mb-6 text-center">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary">
                Kiểm tra nhận thức
              </p>
              <h2 className="text-3xl font-bold text-on-surface">
                Bạn là ai?
              </h2>
            </section>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setRole('PATIENT')}
                className="flex w-full items-center gap-5 rounded-2xl border-2 border-outline-variant bg-surface-container-lowest p-5 text-left transition hover:border-primary hover:ring-2 hover:ring-primary/20 active:scale-[0.98]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <UserRound size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-on-surface">Bệnh nhân</p>
                  <p className="text-base text-on-surface-variant">
                    Làm bài kiểm tra MoCA
                  </p>
                </div>
                <ArrowRight size={24} className="text-outline" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex w-full items-center gap-5 rounded-2xl border-2 border-outline-variant bg-surface-container-lowest p-5 text-left transition hover:border-primary hover:ring-2 hover:ring-primary/20 active:scale-[0.98]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-on-primary">
                  <Stethoscope size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-on-surface">Bác sĩ / Quản trị</p>
                  <p className="text-base text-on-surface-variant">
                    Đăng nhập để chấm điểm và quản lý
                  </p>
                </div>
                <ArrowRight size={24} className="text-outline" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-md">
            <button
              type="button"
              onClick={() => { setRole(null); setPhone(''); setError(null) }}
              className="mb-5 text-base font-medium text-primary hover:underline"
            >
              ← Quay lại
            </button>

            <form
              onSubmit={(e) => { e.preventDefault(); handleContinue() }}
              className="rounded-2xl border-2 border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
            >
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary">
                Kiểm tra nhận thức
              </p>
              <h2 className="text-2xl font-bold text-on-surface">Định danh</h2>
              <p className="mt-2 text-base text-on-surface-variant">
                Nhập số điện thoại để bắt đầu.
              </p>

              <div className="mt-5">
                <label htmlFor="entry-phone" className="mb-2 block px-1 text-base font-semibold text-on-surface">
                  Số điện thoại
                </label>
                <input
                  id="entry-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputClass}
                  placeholder="0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <p className="mt-4 text-base text-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-lg font-bold text-on-primary shadow-sm transition active:scale-[0.98]"
              >
                Bắt đầu bài kiểm tra
                <ArrowRight size={22} />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
