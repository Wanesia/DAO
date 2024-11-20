
import { createFileRoute } from '@tanstack/react-router'
import EnsembleForm from '../components/EnsembleForm/EnsembleForm'
import ProtectedRoute from '../components/ProtectedRoute';

export const Route = createFileRoute('/create-ensemble')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProtectedRoute>
      <main className='main-form'>
        <section>
          <h2>Opret ensemble</h2>
          <EnsembleForm />
        </section>
      </main>
    </ProtectedRoute>
  );
}