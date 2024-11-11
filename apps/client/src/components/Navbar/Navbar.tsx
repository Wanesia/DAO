import { Link } from "@tanstack/react-router";
import Button from "../Button/Button";
import styles from "./Navbar.module.css";
import { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const handleCloseMenu = () => setIsOpen(false);

  // Close hamburger menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.link}>
        <p className={styles.logo}>Musik Samspil</p>{" "}
        <p className={styles.subheading}>
          Skabt af DAOS - Dansk Amatørorkester Samvirke
        </p>
      </Link>

      <button className={styles.hamburger} onClick={toggleMenu}>
        {isOpen ? "╳" : "☰"}
      </button>

      <div className={`${styles.buttons} ${isOpen ? styles.showMenu : ""}`}>
        {isOpen && (
          <Button
            text="Hjem"
            link="/"
            color="transparent"
            onClick={handleCloseMenu}
          />
        )}
        <Button
          text="Find musiker"
          link="/musiker"
          color="transparent"
          onClick={handleCloseMenu}
        />
        <Button
          text="Find ensemble"
          link="/ensemble"
          color="transparent"
          onClick={handleCloseMenu}
        />
        <Button
          text="Opret bruger"
          link="/register"
          onClick={handleCloseMenu}
        />
        <Button
          text="Log ind"
          link="/login"
          color="white"
          onClick={handleCloseMenu}
        />
      </div>
    </nav>
  );
};

export default Navbar;
