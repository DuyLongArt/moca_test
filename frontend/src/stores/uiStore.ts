import { create } from 'zustand'

export type ResultsFilter = 'all' | 'pending' | 'final'

type UiState = {
  patientResultsFilter: ResultsFilter
  setPatientResultsFilter: (filter: ResultsFilter) => void
  doctorAiAssist: boolean
  setDoctorAiAssist: (on: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  patientResultsFilter: 'all',
  setPatientResultsFilter: (patientResultsFilter) => set({ patientResultsFilter }),
  doctorAiAssist: true,
  setDoctorAiAssist: (doctorAiAssist) => set({ doctorAiAssist }),
}))
