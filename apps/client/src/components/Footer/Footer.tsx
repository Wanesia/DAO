import React from "react";
import styles from "./Footer.module.css";
import { Link } from "@tanstack/react-router";
import {
  RiInstagramFill,
  RiFacebookBoxFill,
  RiLinkedinBoxFill,
} from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import LoginPopup from "../LoginPopUp/LoginPopUp";

const Footer: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = (event: React.MouseEvent) => {
    if (!isLoggedIn) {
      event.preventDefault();
      setShowPopup(true);
    }
  };
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.content}>
          <div>
            <p className={styles.heading}>Musik Samspil</p>
            <div className={styles.links}>
              <Link to="/">Hjem</Link>
              <Link to="/musicians" onClick={handleClick}>
                Find musiker
              </Link>
              <Link to="/ensembles" onClick={handleClick}>
                Find ensemble
              </Link>
              <Link to="/profile" onClick={handleClick}>
                Profil
              </Link>
            </div>
            <div className={styles.social}>
              <RiInstagramFill size={36} />
              <RiFacebookBoxFill size={36} />
              <RiLinkedinBoxFill size={36} />
            </div>
          </div>
          <div className={styles.notes}>
            <img
              src="/pale-30.svg"
              alt="musical-notes"
              width={250}
              height={100}
            />
          </div>
          <div className="logo-container">
            <div className={styles.logo}>
              <img src="/logo.png" alt="dao-logo" width={250} height={80} />
            </div>
          </div>
        </div>
        <p className={styles.privacy}>Privatlivspolitik</p>
      </footer>
      {showPopup && <LoginPopup onClose={() => setShowPopup(false)} />}
    </>
  );
};

export default Footer;
