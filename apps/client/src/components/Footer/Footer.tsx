import React from "react";
import styles from "./Footer.module.css";
import { Link } from "@tanstack/react-router";
import { RiInstagramFill, RiFacebookBoxFill, RiLinkedinBoxFill } from "react-icons/ri";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div>
          <p className={styles.heading}>Musik Samspil</p>
          <div className={styles.links}>
            <Link to="/">Hjem</Link>
            <Link to="/">Find musiker</Link>
            <Link to="/">Find ensemble</Link>
            <Link to="/">Profil</Link>
          </div>
          <div className={styles.social}>
            <RiInstagramFill size={36}/>
            <RiFacebookBoxFill size={36}/>
            <RiLinkedinBoxFill size={36}/>
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
        <div className={styles.logo}>
          <img src="/logo.png" alt="dao-logo" width={250} height={80} />
        </div>
      </div>
      <p className={styles.privacy}>Privatlivspolitik</p>
    </footer>
  );
};

export default Footer;
