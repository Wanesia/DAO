import { createFileRoute } from "@tanstack/react-router";
import Search from "../components/Search/Search";
import { getEnsembles } from "../api/ensembleApi";
import EnsembleCard from "../components/EnsembleCard/EnsembleCard";

export const Route = createFileRoute("/ensembler")({
  component: RouteComponent,
});

enum Genre {
    BAROK = "Barok",
    FOLKEMUSIK = "Folkemusik",
    KAMMERMUSIK = "Kammermusik",
    ROMANTISK = "Romantisk",
    SENMODERNE = "Senmoderne",
    SENROMANTISK = "Senromantisk",
    SYMFONISK = "Symfonisk",
  }

function RouteComponent() {
  const genreOptions = Object.values(Genre);

  return (
    <main>
      <div className="content">
        <h2>Ensembler</h2>
      </div>
      <section>
        <Search
          fetchData={getEnsembles}
          renderItem={(ensemble) => (
            <div className="gridItem">
              <EnsembleCard key={ensemble.id} ensemble={ensemble} />
            </div>
          )}
          filterLabel="Genre" 
          filterOptions={genreOptions} 
          getFilterLabel={(genre) => genre.toString()} 
        />
      </section>
    </main>
  );
}
