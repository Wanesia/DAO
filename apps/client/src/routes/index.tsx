import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>
        Stedet hvor amatørmusikere finder hinanden og spiller musik sammen
      </h1>
    </div>
  )
}
