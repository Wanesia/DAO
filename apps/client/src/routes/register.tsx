import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '../components/Register/RegisterForm'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <RegisterForm></RegisterForm>
  )
}
