import { useState } from "react";
import { Select } from "@mantine/core";
import styles from "./Filter.module.css";

interface FilterProps<F> {
  label: string;
  options?: F[];
  onFilterChange: (value: F | string | null) => void;
  getOptionLabel?: (option: F) => string;
  filterType: "dropdown" | "text";
}

const Filter = <F,>({
  label,
  options = [],
  onFilterChange,
  getOptionLabel,
  filterType,
}: FilterProps<F>) => {
  const [selectedOption, setSelectedOption] = useState<F | string | null>(null);

  const handleDropdownChange = (value: string | null) => {
    const selected = value
      ? options.find((option) => getOptionLabel?.(option) === value) || null
      : null;
    setSelectedOption(selected);
    onFilterChange(selected);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || null;
    setSelectedOption(value);
    onFilterChange(value);
  };

  const handleClear = () => {
    setSelectedOption(null);
    onFilterChange(null);
  };

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.heading}>
        <label className={styles.label}>{label}</label>
        <button onClick={handleClear} className={styles.clearButton}>
          Ryd
        </button>
      </div>

      {filterType === "dropdown" && (
        <Select
          placeholder="Vælg"
          value={
            selectedOption && typeof selectedOption !== "string"
              ? getOptionLabel!(selectedOption as F)
              : (selectedOption as string | null)
          }
          data={options.map((option) => ({
            value: getOptionLabel!(option), 
            label: getOptionLabel!(option),
          }))}
          onChange={(value) => handleDropdownChange(value)} 
          clearable
          classNames={{
            input: styles.input,
            dropdown: styles.dropdown,
          }}
        />
      )}

      {filterType === "text" && (
        <input
          type="text"
          placeholder="Indtast by eller postnummer"
          value={(selectedOption as string) || ""}
          onChange={handleTextChange}
          className={styles.location}
        />
      )}
    </div>
  );
};

export default Filter;
