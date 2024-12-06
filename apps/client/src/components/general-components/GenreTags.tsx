import { Genre } from "@shared/enums";
import { useEffect, useRef, useState } from "react";
import styles from "./GenreTags.module.css";

interface GenreTagsProps {
  genres: Genre[];
}

const GenreTags: React.FC<GenreTagsProps> = ({ genres }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(2); // Default to show 2 genres

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      adjustVisibleGenres();
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [genres]);

  const adjustVisibleGenres = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    let totalWidth = 0;
    let count = 0;

    // Add a temporary "+count" span for calculation
    const placeholderWidth = 40; // Approx width of "+1"/"+2"
    const genreElements = Array.from(container.children) as HTMLElement[];

    for (let i = 0; i < genreElements.length; i++) {
      const genre = genreElements[i];
      totalWidth += genre.offsetWidth + 8; // Add genre width and gap
      if (totalWidth + placeholderWidth > containerWidth) break; // Account for "+count"
      count++;
    }

    // Ensure at least 2 genres are always visible
    setVisibleCount(Math.max(2, count));
  };

  const extraCount = genres.length - visibleCount;

  return (
    <div ref={containerRef} className={styles.container}>
      {genres.slice(0, visibleCount).map((genre, index) => (
        <span key={index} className={styles.genreTag}>
          {genre}
        </span>
      ))}
      {extraCount > 0 && (
        <span className={styles.genreTag}>+{extraCount}</span>
      )}
    </div>
  );
};

export default GenreTags;
