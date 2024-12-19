import { useController, Control } from "react-hook-form";
import styles from "./LevelSelector.module.css";

interface LevelSelectorProps {
  name: string;
  control: Control<any>;
}
const levelText: Record<number, string> = {
  1: "Passer til en musiker der har spillet under 1 år og kan spille efter simple/forsimplede noder.",
  2: "Passer til en musiker der har spillet 1-2 år og kan spille efter simple/forsimplede noder.",
  3: "Passer til en musiker der har spillet 2-4 år og kan spille efter lettere komplekse noder.",
  4: "Passer til en musiker der har spillet 4-6 år og kan spille efter lettere komplekse noder.",
  5: "Passer til en musiker der har spillet 6-10 år og kan spille efter komplekse noder.",
  6: "Passer til en musiker der har spillet over 10 år og kan spille efter meget komplekse noder.",
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ name, control }) => {
  const { field } = useController({
    name,
    control,
    defaultValue: 1, // Default level
  });

  const changeLevel = (change: number) => {
    const newLevel = field.value + change;
    field.onChange(Math.min(Math.max(newLevel, 1), 6)); // Ensure level stays within 1-6
  };

  return (
    <div>
      <label className={styles.label}>Hvor øvet er du?<span className="m_78a94662"> *</span></label>
      <div className={styles.container}>
        <div className={styles.level}>
          <h2 className={styles.niveau}>Niveau {field.value}</h2>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => changeLevel(-1)}
              disabled={field.value === 1}
            >
              -
            </button>
            <button
              type="button"
              onClick={() => changeLevel(1)}
              disabled={field.value === 6}
            >
              +
            </button>
          </div>
        </div>
        <p>{levelText[field.value]}</p>
      </div>
    </div>
  );
};

export default LevelSelector;
