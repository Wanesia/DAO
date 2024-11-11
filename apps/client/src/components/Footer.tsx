import styles from "../styles/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareInstagram,
  faSquareFacebook,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import nuteIcon from "../assets/icons/pale-30.svg";
import daosImage from "../assets/images/DAOS.png";

export default function Footer() {
  return (
    <footer>
      <div className={styles["footer-left"]}>
        <h1>MUSIK SAMSPIL</h1>
        <ul className={styles["footer-nav"]}>
          <li>Hjem</li>
          <li>Find Musiker</li>
          <li>Find Ensemble</li>
          <li>Profil</li>
        </ul>
        <div className={styles["footer-icons"]}>
          <FontAwesomeIcon icon={faSquareInstagram} />
          <FontAwesomeIcon icon={faSquareFacebook} />
          <FontAwesomeIcon icon={faLinkedin} />
        </div>
      </div>

      <div className={styles["footer-middle"]}>
        <img className={styles["nute-icon"]} src={nuteIcon} alt="nuteIcon" />
      </div>
      <div className="footer-right">
        <img className={styles["daos-image"]} src={daosImage} alt="nuteIcon" />
      </div>
      <p className={styles.privacy}>Privatlivspolitik</p>

    </footer>
  );
}
