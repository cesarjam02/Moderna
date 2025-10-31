import { FunctionalComponent } from 'preact';
import { useAuth } from '@/contexts/AuthContext';

export const Layout: FunctionalComponent<{ children: preact.ComponentChildren }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isAuthenticated ? '#000000' : '#ffffff',
      }}
    >
      {children}
    </div>
  );
};