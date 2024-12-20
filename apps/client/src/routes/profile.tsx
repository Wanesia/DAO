import { createFileRoute } from "@tanstack/react-router";
import {  useUser } from "../context/UserContext";
import ProfileInfo from "../components/Profile/ProfileInfo";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Profile />;
}

function Profile() {
  const { user, loading } = useUser();
  console.log("User in Profile:", user);
  console.log("Loading state:", loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return <ProfileInfo />;
}
