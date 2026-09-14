import { useState } from 'react';
import { loginUser } from '../services/authService';

interface LoginFormProps {
    onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isRegisterMode) {
                setError("Registration backend not yet linked. Please sign in.");
                setIsLoading(false);
                return;
            }

            const data = await loginUser(username, password);
            localStorage.setItem('jwt', data.token);
            onLogin();
        } catch (err: any) {
            setError(err.message || "Invalid Credentials");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setError('');
        setUsername('');
        setPassword('');
    };

    return (
        <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
            <div className="bg-brand-white p-10 rounded-xl shadow-lg max-w-lg w-full border border-gray-200">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-brand-charcoal mb-2">
                        {isRegisterMode ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {isRegisterMode 
                            ? 'Register to access the gateway metrics' 
                            : 'Authenticate to access the gateway'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-brand-charcoal mb-1">
                            Username
                        </label>
                        <input 
                            type="text" 
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                            placeholder="username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-brand-charcoal mb-1">
                            Password
                        </label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {!isRegisterMode && (
                        <div className="flex justify-end">
                            <button 
                                type="button" 
                                className="text-sm font-medium text-brand-blue hover:opacity-80 transition"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="text-brand-red text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-brand-blue hover:opacity-90 text-brand-white font-bold py-3 px-4 rounded-lg transition shadow-md disabled:opacity-70"
                    >
                        {isLoading 
                            ? 'Processing...' 
                            : (isRegisterMode ? 'Register' : 'Sign In')}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600 font-medium">
                    {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
                    <button 
                        onClick={toggleMode} 
                        className="text-brand-blue hover:underline transition font-bold"
                    >
                        {isRegisterMode ? "Sign In" : "Register"}
                    </button>
                </div>

            </div>
        </div>
    );
}