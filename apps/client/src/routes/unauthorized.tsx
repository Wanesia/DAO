import { createFileRoute } from '@tanstack/react-router'
import Unauthorized from '../components/Unauthorized/Unauthorized'

export const Route = createFileRoute('/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
    return <Unauthorized></Unauthorized>
}
