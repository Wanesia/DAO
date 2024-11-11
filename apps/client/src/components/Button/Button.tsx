import { Link } from '@tanstack/react-router';
import styles from './Button.module.css';

interface ButtonProps {
  text: string;
  color?: 'blue' | 'white' | 'transparent';
  link?: string; 
  onClick?: () => void;  
}

const Button: React.FC<ButtonProps> = ({ text, color = 'blue', link, onClick }) => {
  const className = `${styles.btn} ${styles[color]}`;

  if (link) {
    const isExternal = link.startsWith('http');
    
    if (isExternal) {
      return (
        <a href={link} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
          {text}
        </a>
      );
    } else {
      return (
        <span onClick={onClick}>
          <Link to={link} className={className}>
            {text}
          </Link>
        </span>
      );
    }
  }

  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;


  
