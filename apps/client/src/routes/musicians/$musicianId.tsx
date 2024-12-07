import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/musicians/$musicianId')({
  component: MusicianInfo,
})

function MusicianInfo() {
  return 'Hello /musicians/$musicianId!'
}
