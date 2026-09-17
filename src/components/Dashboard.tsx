import { useState } from 'react';

interface MetricsData {
    totalRequest: number;
    activeUsers: number;
    CacheHits: number;
}

interface DashboardProps {
    onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [logs, setLogs] = useState<string[]>(['[SYSTEM] Gateway dashboard initialized. Awaiting trigger.']);
    const [isFetching, setIsFetching] = useState(false);
    
    
    const [dbLatency, setDbLatency] = useState<number | null>(null);
    const [cacheLatency, setCacheLatency] = useState<number | null>(null);

    const addLog = (message: string) => {
        const time = new Date().toISOString().split('T')[1].slice(0, -1);
        setLogs(prevLogs => [...prevLogs, `[${time}] ${message}`]);
    };

    const handleFetchData = async () => {
        const token = localStorage.getItem('jwt');

        if (!token) {
            onLogout();
            return;
        }

        setIsFetching(true);
        addLog('Incoming GET request to /api/metrics...');
        
        const startTime = performance.now();

        try {
            const options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/metrics`, options);

            if (!response.ok) {
                throw new Error("Failed to fetch metrics");
            }

            const data = await response.json();
            
            const endTime = performance.now();
            const fetchTime = Math.round(endTime - startTime);
            
            
            const isCacheHit = response.headers.get('X-Cache') === 'HIT';

            setMetrics(data);
            

            if (isCacheHit) {
                setCacheLatency(fetchTime);
                addLog(`200 OK: Cache HIT! Data retrieved from Redis in ${fetchTime}ms.`);
            } else {
                setDbLatency(fetchTime);
                setCacheLatency(null);
                addLog(`200 OK: Cache MISS. PostgreSQL queried in ${fetchTime}ms.`);
            }

        } catch (err) {
            addLog('ERROR: Connection failed or token rejected.');
            setTimeout(() => onLogout(), 1500);
        } finally {
            setIsFetching(false);
        }
    };

    const handleClearCache = async () => {
        const token = localStorage.getItem('jwt');
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cache`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setMetrics(null);
                setDbLatency(null);
                setCacheLatency(null);
                addLog('200 OK: FLUSHALL command executed on Gateway Redis.');
            } else {
                addLog('ERROR: Gateway refused to flush cache.');
            }
        } catch (err) {
            addLog('ERROR: Network failure while flushing cache.');
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream text-brand-charcoal flex flex-col">
            <nav className="bg-brand-white shadow-md py-4 px-8 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-brand-blue">Latency Optimized API Proxy </h2>
                <button 
                    onClick={onLogout}
                    className="text-brand-red font-semibold px-4 py-2 hover:bg-gray-100 rounded transition"
                >
                    Logout
                </button>
            </nav>

            <main className="p-8 flex-1 max-w-6xl w-full mx-auto flex flex-col gap-8">
                
                <div className="space-y-8">
                    
                    <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-bold mb-4 text-brand-charcoal">Gateway Controls</h3>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={handleFetchData}
                                disabled={isFetching}
                                className="px-6 py-2 bg-brand-blue hover:opacity-90 text-brand-white rounded font-medium transition shadow-md disabled:opacity-50"
                            >
                                {isFetching ? 'Fetching...' : 'Check Latency'}
                            </button>
                            <button 
                                onClick={handleClearCache}
                                className="px-6 py-2 bg-brand-red hover:opacity-90 text-brand-white rounded font-medium transition shadow-md"
                            >
                                Flush Cache
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-brand-charcoal">System Overview</h3>
                        {!metrics ? (
                            <div className="bg-brand-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
                                No data loaded. Trigger a manual fetch to view metrics.
                            </div>
                        ) : (
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                <div className="bg-brand-white p-6 rounded-lg shadow-sm flex flex-col gap-2 border-t-4 border-brand-blue">
                                    <h4 className="text-sm font-bold text-gray-500">Current Requests</h4>
                                    <p className="text-3xl font-bold text-brand-blue">{metrics.totalRequest}</p>
                                </div>
                                <div className="bg-brand-white p-6 rounded-lg shadow-sm flex flex-col gap-2 border-t-4 border-brand-blue">
                                    <h4 className="text-sm font-bold text-gray-500">Total Registered Users</h4>
                                    <p className="text-3xl font-bold text-brand-blue">{metrics.activeUsers}</p>
                                </div>
                                <div className="bg-brand-white p-6 rounded-lg shadow-sm flex flex-col gap-2 border-t-4 border-brand-blue">
                                    <h4 className="text-sm font-bold text-gray-500">Cache Hits</h4>
                                    <p className="text-3xl font-bold text-brand-blue">{metrics.CacheHits}</p>
                                </div>
                                <div className="bg-brand-white p-6 rounded-lg shadow-sm flex flex-col gap-2 border-t-4 border-gray-400">
                                    <h4 className="text-sm font-bold text-gray-500">Initial Latency (ms)</h4>
                                    <p className="text-3xl font-bold text-gray-700">{dbLatency !== null ? `${dbLatency} ms` : '--'}</p>
                                </div>
                                <div className="bg-brand-white p-6 rounded-lg shadow-sm flex flex-col gap-2 border-t-4 border-emerald-500">
                                    <h4 className="text-sm font-bold text-emerald-600">Redis Cached Latency (ms)</h4>
                                    <p className="text-3xl font-bold text-emerald-500">{cacheLatency !== null ? `${cacheLatency} ms` : '--'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-lg shadow-lg flex flex-col overflow-hidden h-72 border border-slate-700">
                    <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center">
                        <span className="font-mono text-sm font-bold text-slate-300">Gateway Logs (Live)</span>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-2">
                        {logs.map((log, index) => (
                            <div key={index} className={log.includes('ERROR') ? 'text-red-400' : log.includes('200 OK') ? 'text-emerald-400' : 'text-slate-400'}>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}