import { createFileRoute, redirect } from "@tanstack/react-router";
import Search from "../../components/Search/Search";
import { getPosts } from "../../api/postApi";
import { InstrumentName } from "../../constants/enums";
import PostCard from "../../components/PostCard/PostCard";

export const Route = createFileRoute("/posts/")({
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
  const instrumentOptions = Object.values(InstrumentName);

  return (
    <main>
      <div className="content">
        <h2>Opslag</h2>
      </div>
      <section>
        <Search
          // Function that fetches data from the backend API
          // Passes search term, page number, limit, and filters as arguments
          // any API call used for search needs to have these arguments
          fetchData={(searchTerm, page, limit, filters) =>
            getPosts(searchTerm, page, limit, filters || {})
          }
          // This function renders individual items in the search results.
          // For each post, it renders an `EnsemblePost` wrapped in a grid item
          // gridItem class is defined in global css so it can be used in any grid layout
          renderItem={(post) => (
            <div className="gridItemLarge" key={post._id}>
              <PostCard post={post} />
            </div>
          )}
          // Filter options define what filters will be available in the search component
          // Here we are adding a filter for Genre using the `genreOptions` array
          // The key genre is used for the query in the backend
          // You can define more filters by adding more objects to the filterOptions array
          filterOptions={[
            {
              label: "Instrument",
              options: instrumentOptions,
              key: "instrumentName",
            },
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
