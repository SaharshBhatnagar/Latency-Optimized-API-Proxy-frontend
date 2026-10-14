interface AccessDeniedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenAuth: () => void;
    actionAttempted?: string;
}

export default function AccessDeniedModal({
    isOpen,
    onClose,
    onOpenAuth,
    actionAttempted = "execute gateway actions"
}: AccessDeniedModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center transform transition-all">
                
                <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Authentication Required
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                    You cannot <span className="font-semibold text-gray-800 dark:text-gray-200">{actionAttempted}</span> without being logged in. Please sign in or create an account to run edge queries and telemetry tests.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onOpenAuth();
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 bg-brand-blue hover:opacity-90 text-white font-semibold rounded-lg shadow-md transition"
                    >
                        Sign In / Register
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition"
                    >
                        Dismiss
                    </button>
                </div>

            </div>
        </div>
    );
}
