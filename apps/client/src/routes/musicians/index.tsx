import { createFileRoute } from '@tanstack/react-router'
import Search from '../../components/Search/Search';
import { getUsers } from '../../api/userApi';
import { InstrumentName } from '@shared/enums';

export const Route = createFileRoute('/musicians/')({
  component: RouteComponent,
})

function RouteComponent() {
    const instrumentOptions = Object.values(InstrumentName);
  return ( <main>
    <div className="content">
      <h2>Musiker</h2>
    </div>
    <section>
      <Search
        // Function that fetches data from the backend API
        // Passes search term, page number, limit, and filters as arguments
        // any API call used for search needs to have these arguments
        fetchData={(searchTerm, page, limit, filters) =>
          getUsers(searchTerm, page, limit, filters || {})
        }
        // This function renders individual items in the search results.
        // For each ensemble, it renders an `EnsembleCard` wrapped in a grid item
        // gridItem class is defined in global css so it can be used in any grid layout
        renderItem={(user) => (
          <div className="gridItem">
            {/* change to use card */}
          <p>{user.name}</p>
          </div>
        )}
        // Filter options define what filters will be available in the search component
        // Here we are adding a filter for Genre using the `genreOptions` array
        // The key genre is used for the query in the backend
        // You can define more filters by adding more objects to the filterOptions array
        filterOptions={[
          { label: "Instrument", options: instrumentOptions, key: "instrument" },
        ]}
        getFilterLabel={(filter) => {
          if (typeof filter === "string") {
            return filter;
          }
          return filter.toString();
        }}
      />
    </section>
  </main>)
}
