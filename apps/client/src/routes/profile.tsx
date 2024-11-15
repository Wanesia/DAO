import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useEffect } from "react";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

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

        console.log(response.data);
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
      <h1>Profile Page</h1>
    </div>
  );
}
