import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import ProfileInfo from "../components/Profile/ProfileInfo";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(
          "http://localhost:3000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          // If unauthorized, redirect to the unauthorized page
          navigate({ to: "/unauthorized" });
        }
      }
    };

    checkAuthorization();
  }, [navigate]);

  return (
    <div>
      {user ? (
        <ProfileInfo user={user} />
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
