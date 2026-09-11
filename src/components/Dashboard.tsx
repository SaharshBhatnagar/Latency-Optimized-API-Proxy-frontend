interface DashboardProps { onLogout: () => void; }

export default function Dashboard({ onLogout }: DashboardProps) {
    return (
        <div className="min-h-screen bg-brand-cream text-brand-charcoal flex flex-col">
            <nav className="bg-brand-white shadow-md py-4 px-8 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-brand-gold">Cloud Native Gateway</h2>
                <button onClick={onLogout}
                className="bg-brand-charcoal text-brand-white px-4 py-2 rounded font-semibold hover:bg-opacity-80 transition">
                    Cache Data
                </button>
            </nav>

            <main className="p-8 flex-1">
                <h3 className="text-xl font-bold mb-6">System Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-brand-white p-6 rounded-lg shadow-sm fles fles-col gap-2 border-t-4 border-brand-gold">
                        <h4 className="text-3xl font-bold text-brand-gold">Total Requests</h4>
                    </div>
                    <div className="bg-brand-white p-6 rounded-lg shadow-sm fles fles-col gap-2 border-t-4 border-brand-gold">
                        <h4 className="text-3xl font-bold text-brand-gold">Active Users</h4>
                    </div>
                    <div className="bg-brand-white p-6 rounded-lg shadow-sm fles fles-col gap-2 border-t-4 border-brand-gold">
                        <h4 className="text-3xl font-bold text-brand-gold">Cache Hits</h4>
                    </div>
                </div>
            </main>
        </div>
    );
}