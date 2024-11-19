import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '../context/UserContext';
import ProfileInfo from '../components/Profile/ProfileInfo';

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})


function RouteComponent() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return <ProfileInfo user={user} />;
}