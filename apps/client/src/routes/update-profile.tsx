import { createFileRoute } from "@tanstack/react-router";
import ProfileSettings from "../components/Profile/ProfileSettings";
import { UserProvider, useUser } from "../context/UserContext";

export const Route = createFileRoute("/update-profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <UserProvider>
      <main className="main-form">
        <UpdateForm></UpdateForm>
      </main>
    </UserProvider>
  );
}

function UpdateForm() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return <ProfileSettings user={user} />;
}
