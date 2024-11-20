
import { createFileRoute } from '@tanstack/react-router'
import EnsembleForm from '../components/EnsembleForm/EnsembleForm'

export const Route = createFileRoute('/create-ensemble')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='main-form'>
        <h2>Opret ensemble</h2>
        <EnsembleForm />
    </main>
  )
}
