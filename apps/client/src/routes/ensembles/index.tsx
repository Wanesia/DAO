import { createFileRoute, redirect } from "@tanstack/react-router";
import Search from "../../components/Search/Search";
import { getEnsembles } from "../../api/ensembleApi";
import EnsembleCard from "../../components/EnsembleCard/EnsembleCard";
import JoinButton from "../../components/Button/JoinButton";
import { Genre } from "../../constants/enums";

export const Route = createFileRoute("/ensembles/")({
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
  const genreOptions = Object.values(Genre);

  return (
    <main>
      <div className="content">
        <h2>Ensembler</h2>
      </div>
      <section>
        <Search
          // Function that fetches data from the backend API
          // Passes search term, page number, limit, and filters as arguments
          // any API call used for search needs to have these arguments
          fetchData={(searchTerm, page, limit, filters) =>
            getEnsembles(searchTerm, page, limit, filters || {})
          }
          // This function renders individual items in the search results.
          // For each ensemble, it renders an `EnsembleCard` wrapped in a grid item
          // gridItem class is defined in global css so it can be used in any grid layout
          renderItem={(ensemble) => (
            <div className="gridItem">
              <EnsembleCard key={ensemble.id} ensemble={ensemble} />
              <JoinButton ensembleId={ensemble._id} />
            </div>
          )}
          // Filter options define what filters will be available in the search component
          // Here we are adding a filter for Genre using the `genreOptions` array
          // The key genre is used for the query in the backend
          // You can define more filters by adding more objects to the filterOptions array
          filterOptions={[
            { label: "Genre", options: genreOptions, key: "genre" },
            { label: "Location", key: "location" },
          ]}
          getFilterLabel={(filter) => {
            if (typeof filter === "string") {
              return filter;
            }
            return filter.toString();
          }}
        />
      </section>
    </main>
  );
}
