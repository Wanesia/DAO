import { useState } from "react";
import { Select } from "@mantine/core";
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

  const handleChange = (value: string | null) => {
    const selected = value
      ? options.find((option) => getOptionLabel(option) === value) || null
      : null;
    setSelectedOption(selected);
    onFilterChange(selected);
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

      <Select
        placeholder="Vælg"
        value={selectedOption ? getOptionLabel(selectedOption) : null}
        data={options.map((option) => ({
          value: getOptionLabel(option),
          label: getOptionLabel(option),
        }))}
        onChange={handleChange}
        clearable
        classNames={{
          input: styles.input,
          dropdown: styles.dropdown,

        }}
      />
    </div>
  );
};

export default Filter;
