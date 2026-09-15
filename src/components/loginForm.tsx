import { useState } from 'react';
import { loginUser, registerUser, resetPassword } from '../services/authService';

interface LoginFormProps {
    onLogin: () => void;
}

type FormMode = 'login' | 'register' | 'forgot';

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [mode, setMode] = useState<FormMode>('login');
    const [forgotStep, setForgotStep] = useState<1 | 2>(1);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetFormState = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        setForgotStep(1);
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
                if (forgotStep === 1) {
                    if (!username) throw new Error("Please enter your username");
                    setForgotStep(2);
                } else {
                    if (password !== confirmPassword) {
                        throw new Error("Passwords do not match");
                    }
                    await resetPassword(username, password);
                    setSuccess("Password reset successful! You can now log in.");
                    setMode('login');
                    setUsername('');
                    setPassword('');
                    setConfirmPassword('');
                    setForgotStep(1);
                }
            } else {
                let data;
                if (mode === 'register') {
                    data = await registerUser(username, password);
                } else {
                    data = await loginUser(username, password);
                }
                localStorage.setItem('jwt', data.token);
                onLogin();
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
            <div className="bg-brand-white p-10 rounded-xl shadow-lg max-w-lg w-full border border-gray-200">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-brand-charcoal mb-2">
                        {mode === 'register' && 'Create Account'}
                        {mode === 'login' && 'Welcome Back'}
                        {mode === 'forgot' && (forgotStep === 1 ? 'Reset Password' : 'New Password')}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {mode === 'register' && 'Register to access the gateway metrics'}
                        {mode === 'login' && 'Authenticate to access the gateway'}
                        {mode === 'forgot' && (forgotStep === 1 ? 'Enter your username to begin' : 'Secure your account')}
                    </p>
                </div>

                {success && (
                    <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {!(mode === 'forgot' && forgotStep === 2) && (
                        <div>
                            <label className="block text-sm font-semibold text-brand-charcoal mb-1">
                                Username
                            </label>
                            <input 
                                type="text" 
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue transition"
                                placeholder="username"
                            />
                        </div>
                    )}

                    {(mode !== 'forgot' || forgotStep === 2) && (
                        <div>
                            <label className="block text-sm font-semibold text-brand-charcoal mb-1">
                                {mode === 'forgot' ? 'New Password' : 'Password'}
                            </label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue transition"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    {mode === 'forgot' && forgotStep === 2 && (
                        <div>
                            <label className="block text-sm font-semibold text-brand-charcoal mb-1">
                                Confirm New Password
                            </label>
                            <input 
                                type="password" 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue transition"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    {mode === 'login' && (
                        <div className="flex justify-end">
                            <button 
                                type="button" 
                                onClick={() => handleModeSwitch('forgot')}
                                className="text-sm font-medium text-brand-blue hover:opacity-80 transition"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-brand-blue hover:opacity-90 text-brand-white font-bold py-3 px-4 rounded-lg transition shadow-md disabled:opacity-70"
                    >
                        {isLoading ? 'Processing...' : (
                            mode === 'register' ? 'Register' :
                            mode === 'login' ? 'Sign In' :
                            forgotStep === 1 ? 'Continue' : 'Reset Password'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600 font-medium">
                    {mode === 'register' && "Already have an account? "}
                    {mode === 'login' && "Don't have an account? "}
                    {mode === 'forgot' && "Remembered your password? "}
                    
                    <button 
                        onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
                        className="text-brand-blue hover:underline transition font-bold"
                    >
                        {mode === 'login' ? 'Register' : 'Sign In'}
                    </button>
                </div>

            </div>
        </div>
    );
}