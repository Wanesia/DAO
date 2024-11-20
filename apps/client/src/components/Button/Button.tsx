import React from 'react';
import { Link } from '@tanstack/react-router';
import styles from './Button.module.css';

interface ButtonProps {
  text: string;
  color?: 'blue' | 'white' | 'transparent';
  link?: string;
  onClick?: () => void;
  type?: 'button' | 'submit'
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color = 'blue',
  link,
  onClick,
  type = 'button', 
  children,
}) => {
  const className = `${styles.btn} ${styles[color]}`;

  if (link) {
    const isExternal = link.startsWith('http');

    if (isExternal) {
      return (
        <a
          href={link}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {children} {text}
        </a>
      );
    } else {
      return (
        <span onClick={onClick}>
          <Link to={link} className={className}>
            {children} {text}
          </Link>
        </span>
      );
    }
  }

  return (
    <button type={type} className={className} onClick={onClick}>
      {children} {text}
    </button>
  );
};

export default Button;
