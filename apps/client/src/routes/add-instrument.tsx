import { createFileRoute } from "@tanstack/react-router";
import InstrumentForm from "../components/Profile/InstrumentForm";
import { useUser } from "../context/UserContext";


export const Route = createFileRoute("/add-instrument")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
  
      <AddInstrument></AddInstrument>
  );
}
function AddInstrument() {
    const { user, loading } = useUser();
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!user) {
      return <div>No user data available.</div>;
    }
  
    return <InstrumentForm user={user} />;
  }