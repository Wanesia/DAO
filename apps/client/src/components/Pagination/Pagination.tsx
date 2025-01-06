import { useMemo } from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  total: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  total,
  limit,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  // calculate the total number of pages based on the total number of items and the limit
  const totalPages = Math.ceil(total / limit);

  // Memoize the pagination buttons to avoid recalculating them on every render
  const paginationButtons = useMemo(() => {
    // If there are less than 5 pages, display all pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const buttons = [];

    if (currentPage > 2) {
      buttons.push(1); // Always show the first page
      if (currentPage > 3) {
        buttons.push("..."); // add an ellipsis if the current page is more than 3 pages away from the first page
      }
    }

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages);
      i++
    ) {
      buttons.push(i);
    }

    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        buttons.push("..."); // add an ellipsis if the current page is more than 2 pages away from the last page
      }
      buttons.push(totalPages); // Always show the last page
    }

    return buttons;
  }, [currentPage, totalPages]); // Recalculate only when the current page or total pages change

  return (
    <div className={styles.pagination}>
      {/* Previous button: Disabled if on the first page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className={styles.pageButton}
        disabled={currentPage === 1}
      >
        Forrige
      </button>

      {paginationButtons.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`${styles.pageButton} ${
              currentPage === page ? styles.active : ""
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className={styles.ellipsis}>
            {page}
          </span>
        )
      )}
      {/* Next button: Disabled if on the last page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className={styles.pageButton}
        disabled={currentPage === totalPages}
      >
        Næste
      </button>
    </div>
  );
};

export default Pagination;
