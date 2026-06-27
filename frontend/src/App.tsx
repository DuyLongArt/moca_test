import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './router'
import { queryClient } from './shared/lib/queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  )
}
