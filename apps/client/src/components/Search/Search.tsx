import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import styles from "./Search.module.css";
import { FaSearch } from "react-icons/fa";
import Pagination from "../Pagination/Pagination";
import Filter from "../Filter/Filter";
import LoadingRing from "../LoadingRing/LoadingRing";

// Using generic types to make the component reusable for different entities and filters
interface SearchProps<T, F> {
  fetchData: (
    searchTerm: string,
    page: number,
    limit: number,
    filters: Partial<F> | null
  ) => Promise<{ data: T[]; total: number }>; // API function to fetch specific data
  renderItem: (item: T) => JSX.Element; // Function to render each item in the search results
  limit?: number; // Number of results per page
  filterOptions?: { label: string; options?: F[keyof F][]; key: keyof F }[]; 
  getFilterLabel: (filter: F[keyof F]) => string; // Function to get the label of a filter option
}

const Search = <T, F>({
  fetchData,
  renderItem,
  limit = 6,
  filterOptions = [],
  getFilterLabel,
}: SearchProps<T, F>) => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // User input for search
  const [filters, setFilters] = useState<Partial<F>>({});
  const [results, setResults] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0); // Total number of results
  const [page, setPage] = useState<number>(1); // Current page number
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // useCallback hook is used to ensure function reference does not change on re-renders
  // Debouncing the fetchResults function to avoid making too many requests
  const fetchResults = useCallback(
    debounce(
      async (term: string, currentPage: number, currentFilters: Partial<F>) => {
        setError(null);
        setIsLoading(true);
        try {
          const { data, total } = await fetchData(
            term,
            currentPage,
            limit,
            currentFilters
          );
          setResults(data);
          setTotal(total);
        } catch (err) {
          setError("Failed to fetch data.");
        } finally {
          setIsLoading(false);
        }
      },
      500 // Delay of 500ms
    ),
    [fetchData, limit]
  );

  // Reset page number to 1 when searchTerm or filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filters]);

  // Fetch data whenever searchTerm, page, or filters change
  useEffect(() => {
    setIsLoading(true);
    fetchResults(searchTerm, page, filters);
    return () => fetchResults.cancel();
  }, [searchTerm, page, filters, fetchResults]);

  const updateFilter = (key: keyof F, value: F[keyof F] | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // Memoizing rendered results for performance optimization
  // Only re-renders when results or renderItem function changes
  const renderedResults = useMemo(
    () => results.map((item) => renderItem(item)),
    [results, renderItem]
  );

  return (
    <div>
      <div className="content">
        {total > 0 && <p className={styles.total}>{total} resultater fundet</p>}

        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Søg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>

        <div className={styles.filters}>
          {filterOptions &&
            filterOptions.map(({ label, options, key }) => (
              <Filter
                key={key as string}
                label={label}
                options={options}
                onFilterChange={(value) =>
                  updateFilter(key, value as F[keyof F] | null)
                }
                getOptionLabel={getFilterLabel}
                filterType={key === "location" ? "text" : "dropdown"}
              />
            ))}
        </div>
      </div>

      <section className="grey-wrapper">
        {!isLoading && error && (
          <div className={styles.errorWrapper}>
            <p className={styles.error}>{error}</p>
          </div>
        )}

        {!isLoading && !error && results.length === 0 && (
          <div className="content">
            <p className={styles.empty}>Ingen resultater fundet.</p>
          </div>
        )}
        {isLoading && <div className="loading"><LoadingRing size="large" /></div>}

        {!isLoading && !error && results.length > 0 && (
          <>
            <div className="content">
              <ul className="gridLarge">{renderedResults}</ul>
            </div>
            <Pagination
              total={total}
              limit={limit}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default Search;
