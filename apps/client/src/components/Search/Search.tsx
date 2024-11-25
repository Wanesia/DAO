import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import styles from "./Search.module.css";
import { FaSearch } from "react-icons/fa";
import Pagination from "../Pagination/Pagination";
import LoadingRing from "../LoadingRing/LoadingRing";
import Filter from "../Filter/Filter";

interface SearchProps<T, F> {
  fetchData: (
    searchTerm: string,
    page: number,
    limit: number,
    filter?: F | null
  ) => Promise<{ data: T[]; total: number }>;
  renderItem: (item: T) => JSX.Element;
  limit?: number;
  filterOptions?: F[];
  filterLabel: string | "";
  getFilterLabel: (filter: F) => string;
}

const Search = <T, F>({
  fetchData,
  renderItem,
  limit = 6,
  filterOptions = [],
  filterLabel,
  getFilterLabel,
}: SearchProps<T, F>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<F | null>(null);
  const [results, setResults] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced API call - set to 500ms - to reduce the number of API calls
  const fetchResults = useCallback(
    debounce(async (term: string, currentPage: number, currentFilter: F | null) => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, total } = await fetchData(
          term,
          currentPage,
          limit,
          currentFilter
        );
        setResults(data);
        setTotal(total);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [fetchData, limit]
  );

  // Resetting page number back to 1 when searchTerm or filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filter]);

  useEffect(() => {
    fetchResults(searchTerm, page, filter);
    return () => fetchResults.cancel();
  }, [searchTerm, page, filter, fetchResults]);

  const renderedResults = useMemo(
    () => results.map((item) => renderItem(item)),
    [results, renderItem]
  );

  return (
    <div>
      <div className="content">
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>

        {filterOptions.length > 0 && (
          <Filter
            label={filterLabel}
            options={filterOptions}
            onFilterChange={(value) => {
              setFilter(value);
              setPage(1);
            }}
            getOptionLabel={getFilterLabel}
          />
        )}
      </div>

      <section className="grey-wrapper">
        {isLoading && (
          <div className={styles.loadingWrapper}>
            <LoadingRing size="large" />
          </div>
        )}

        {!isLoading && error && (
          <div className={styles.errorWrapper}>
            <p className={styles.error}>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && results.length === 0 && (
          <div className="content">
            <p className={styles.empty}>No results found.</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && results.length > 0 && (
          <>
            <div className="content">
              <ul className="grid">{renderedResults}</ul>
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
