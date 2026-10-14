import { useState } from 'react';
import { loginUser, registerUser, forgotPassword } from '../services/authService';

interface LoginFormProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
    initialMode?: FormMode;
}

export type FormMode = 'login' | 'register' | 'forgot';

export default function LoginForm({
    isOpen,
    onClose,
    onLogin,
    initialMode = 'login'
}: LoginFormProps) {
    if (!isOpen) return null;

    const [mode, setMode] = useState<FormMode>(initialMode);
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetFormState = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
        setSuccess('');
    };

    const handleModeSwitch = (newMode: FormMode) => {
        setMode(newMode);
        resetFormState();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            if (mode === 'forgot') {
                if (!email) throw new Error("Please enter your registered email address.");
                const res = await forgotPassword(email);
                setSuccess(res.message || "Password reset link sent to your email! Please check your inbox.");
            } else if (mode === 'register') {
                if (!username || !email || !password) {
                    throw new Error("Username, email, and password are required.");
                }
                const data = await registerUser(username, email, password);
                localStorage.setItem('jwt', data.token);
                onLogin();
                onClose();
            } else {
                const data = await loginUser(username, password);
                localStorage.setItem('jwt', data.token);
                onLogin();
                onClose();
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                    title="Close"
                >
                    ✕
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mode === 'register' && 'Create Account'}
                        {mode === 'login' && 'Welcome Back'}
                        {mode === 'forgot' && 'Reset Password'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {mode === 'register' && 'Register to access gateway metrics & proxy testing'}
                        {mode === 'login' && 'Authenticate to run edge queries and flush cache'}
                        {mode === 'forgot' && 'Enter your email to receive a password reset link'}
                    </p>
                </div>

                {success && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg text-center">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {mode !== 'forgot' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {mode === 'login' ? 'Username or Email' : 'Username'}
                            </label>
                            <input 
                                type="text" 
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition"
                                placeholder={mode === 'login' ? "username or user@domain.com" : "Choose a username"}
                            />
                        </div>
                    )}

                    {(mode === 'register' || mode === 'forgot') && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition"
                                placeholder="name@example.com"
                            />
                        </div>
                    )}

                    {mode !== 'forgot' && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                {mode === 'login' && (
                                    <button 
                                        type="button" 
                                        onClick={() => handleModeSwitch('forgot')}
                                        className="text-xs font-semibold text-brand-blue dark:text-blue-400 hover:underline transition"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-2 bg-brand-blue hover:opacity-90 text-white font-bold py-2.5 px-4 rounded-lg transition shadow-md disabled:opacity-70"
                    >
                        {isLoading ? 'Processing...' : (
                            mode === 'register' ? 'Create Account' :
                            mode === 'login' ? 'Sign In' :
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {mode === 'register' && "Already have an account? "}
                    {mode === 'login' && "Don't have an account? "}
                    {mode === 'forgot' && "Remember your password? "}
                    
                    <button 
                        type="button"
                        onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
                        className="text-brand-blue dark:text-blue-400 hover:underline transition font-bold"
                    >
                        {mode === 'login' ? 'Register' : 'Sign In'}
                    </button>
                </div>

            </div>
        </div>
    );
}