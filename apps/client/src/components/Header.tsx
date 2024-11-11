import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles["header-left"]}>
        <h1 className={styles["header-title"]}>Musik Samspil</h1>
        <p className={styles["header-subtitle"]}>Skabt af DAOS - Dans Amatørorkester Samvirke</p>
      </div>
      <div className={styles["header-right"]}>
        <button className={`${styles.button} ${styles["button-basic"]}`}>Opslag</button>
        <button className={`${styles.button} ${styles["button-basic"]}`}>Profil</button>
        <button className={`${styles.button} ${styles["button-dark"]}`}>Opret bruger</button>
        <button className={`${styles.button} ${styles["button-light"]}`}>Log ind</button>
      </div>
    </header>
  );
}
