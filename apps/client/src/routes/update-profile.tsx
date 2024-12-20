import { createFileRoute } from "@tanstack/react-router";
import ProfileEdit from "../components/Profile/ProfileEdit";
import { useUser } from "../context/UserContext";

export const Route = createFileRoute("/update-profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
      <main className="main-form">
        <UpdateForm></UpdateForm>
      </main>

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

  return <ProfileEdit />;
}
