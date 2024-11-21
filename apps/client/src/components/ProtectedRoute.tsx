import { ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '@tanstack/react-router';

interface ProtectedRouteProps {
    children: ReactNode;
  }

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.navigate({ to: '/login' });
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;
