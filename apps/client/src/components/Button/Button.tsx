import React from 'react';
import { Link } from '@tanstack/react-router';
import styles from './Button.module.css';

interface ButtonProps {
  text: string;
  color?: 'blue' | 'white' | 'transparent' | 'white-slim' | 'extra-small';
  link?: string;
  onClick?: () => void;
  type?: 'button' | 'submit'
  children?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color = 'blue',
  link,
  onClick,
  type = 'button', 
  children,
  disabled,
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
          <Link to={link} className={className} disabled={disabled}>
            {children} {text}
          </Link>
        </span>
      );
    }
  }

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children} {text}
    </button>
  );
};

export default Button;
