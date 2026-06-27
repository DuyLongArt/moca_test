// @ts-expect-error — JSX exam container; will split into TS modules later
import MocaTestContainer from './MocaTestContainer.jsx'

/** Full-screen exam — no chrome; calm layout lives in MocaTestContainer + mocaExam.css */
export function PatientTestPage() {
  return <MocaTestContainer />
}
