import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '../components/Login/LoginForm'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <LoginForm></LoginForm>
  )
}
