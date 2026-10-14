import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import AccessDeniedModal from './components/AccessDeniedModal';
import ResetPasswordModal from './components/ResetPasswordModal';

export default function App() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return !!localStorage.getItem('jwt');
    });

    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
    const [showAccessDeniedModal, setShowAccessDeniedModal] = useState<boolean>(false);
    const [deniedAction, setDeniedAction] = useState<string>('execute actions');
    
    const [resetToken, setResetToken] = useState<string | null>(null);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            setResetToken(token);
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setShowAuthModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setIsAuthenticated(false);
    };

    const handleResetSuccess = () => {
        setResetToken(null);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        setShowAuthModal(true);
    };

    const handleCloseResetModal = () => {
        setResetToken(null);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    };

    const handleRequestAuth = (actionName: string) => {
        setDeniedAction(actionName);
        setShowAccessDeniedModal(true);
    };

    return (
        <div className="min-h-screen bg-brand-cream dark:bg-slate-950 text-brand-charcoal dark:text-slate-100 flex flex-col transition-colors duration-200">
            <Navbar 
                isDark={isDark}
                onToggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                onOpenAuth={() => setShowAuthModal(true)}
                onLogout={handleLogout}
            />

            <div className="flex-1 py-4">
                <Dashboard 
                    isAuthenticated={isAuthenticated}
                    onRequestAuth={handleRequestAuth}
                    onLogout={handleLogout}
                />
            </div>

            <AccessDeniedModal 
                isOpen={showAccessDeniedModal}
                onClose={() => setShowAccessDeniedModal(false)}
                onOpenAuth={() => setShowAuthModal(true)}
                actionAttempted={deniedAction}
            />

            <LoginForm 
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLogin={handleLoginSuccess}
            />

            {resetToken && (
                <ResetPasswordModal 
                    token={resetToken}
                    onClose={handleCloseResetModal}
                    onSuccess={handleResetSuccess}
                />
            )}

            <footer className="border-t border-gray-200 dark:border-slate-800 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p>Latency-Optimized API Proxy &copy; {new Date().getFullYear()} Saharsh Bhatnagar</p>
                    <p className="font-mono text-[11px]">proxy.saharshbhatnagar.app</p>
                </div>
            </footer>
        </div>
    );
}