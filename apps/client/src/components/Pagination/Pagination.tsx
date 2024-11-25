import React, { useMemo } from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  total: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  limit,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / limit);

  const paginationButtons = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const buttons = [];

    if (currentPage > 2) {
      buttons.push(1);
      if (currentPage > 3) {
        buttons.push("...");
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
        buttons.push("...");
      }
      buttons.push(totalPages);
    }

    return buttons;
  }, [currentPage, totalPages]);

  return (
    <div className={styles.pagination}>
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
