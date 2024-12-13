import { createFileRoute } from "@tanstack/react-router";
import Settings from "../components/Profile/Settings";
import { UserProvider, useUser } from "../context/UserContext";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <UserProvider>
      <main className="main-form">
        <SettingsForm></SettingsForm>
      </main>
    </UserProvider>
  );
}
function SettingsForm() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return <Settings user={user} />;
}
