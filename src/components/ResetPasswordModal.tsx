import { useState } from 'react';
import { resetPassword } from '../services/authService';

interface ResetPasswordModalProps {
    token: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ResetPasswordModal({
    token,
    onClose,
    onSuccess
}: ResetPasswordModalProps) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await resetPassword(token, newPassword);
            setSuccess(res.message || "Password updated successfully!");
            setTimeout(() => {
                onSuccess();
            }, 1800);
        } catch (err: any) {
            setError(err.message || "Failed to reset password. Link may have expired.");
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
                >
                    ✕
                </button>

                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center mb-3 text-brand-blue">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Reset Your Password
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Enter a secure new password for your account.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3 bg-brand-blue hover:opacity-90 text-white font-bold rounded-lg shadow-md transition disabled:opacity-60"
                    >
                        {isLoading ? "Updating Password..." : "Set New Password"}
                    </button>
                </form>

            </div>
        </div>
    );
}
