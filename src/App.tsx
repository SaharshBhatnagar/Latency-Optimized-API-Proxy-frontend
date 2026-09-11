import LoginForm from './components/loginForm';
import Dashboard from './components/Dashboard';
import { useState } from 'react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('jwt'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  }

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
  }

  return (
    <div className="min-h-screen bg-brand-cream">

      {true ? (
        <Dashboard onLogout={handleLogout}/>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
          <h1 className="text-4xl font-bold text-brand-gold text-center">
            Cloud Native Frontend
          </h1>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
    </div>
  );
}