import { useState } from "react";
import styles from "./Filter.module.css";

interface FilterProps<F> {
  label: string;
  options: F[]; 
  onFilterChange: (value: F | null) => void; 
  getOptionLabel: (option: F) => string; 
}

const Filter = <F,>({
  label,
  options,
  onFilterChange,
  getOptionLabel,
}: FilterProps<F>) => {
  const [selectedOption, setSelectedOption] = useState<F | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const selected = options.find((option) => getOptionLabel(option) === value) || null;
    setSelectedOption(selected);
    onFilterChange(selected);
  };

  const handleClear = () => {
    setSelectedOption(null);
    onFilterChange(null);
  };

  return (
    <div className={styles.filterWrapper}>
      <label>{label}</label>
      <button onClick={handleClear} className={styles.clearButton}>
        Clear
      </button>
      <select value={selectedOption ? getOptionLabel(selectedOption) : ""} onChange={handleChange}>
        <option value="">All</option>
        {options.map((option, index) => (
          <option key={index} value={getOptionLabel(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
