import { createFileRoute, redirect } from "@tanstack/react-router";
import EnsembleForm from "../../components/EnsembleForm/EnsembleForm";

export const Route = createFileRoute("/ensembles/create-ensemble")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isTokenValid()) {
      throw redirect({
        to: "/login",
        search: { redirect: window.location.href },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="main-form">
      <section>
        <h2>Opret ensemble</h2>
        <EnsembleForm />
      </section>
    </main>
  );
}
