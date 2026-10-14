import { useState } from 'react';

interface MetricsData {
    totalRequest: number;
    activeUsers: number;
    CacheHits: number;
}

interface DashboardProps {
    isAuthenticated: boolean;
    onRequestAuth: (action: string) => void;
    onLogout: () => void;
}

export default function Dashboard({
    isAuthenticated,
    onRequestAuth,
    onLogout
}: DashboardProps) {
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [logs, setLogs] = useState<string[]>([
        '[SYSTEM] Latency-Optimized API Proxy initialized.',
        '[GATEWAY] Reverse proxy listening for telemetry queries.'
    ]);
    const [isFetching, setIsFetching] = useState(false);
    
    const [dbLatency, setDbLatency] = useState<number | null>(null);
    const [cacheLatency, setCacheLatency] = useState<number | null>(null);

    const addLog = (message: string) => {
        const time = new Date().toISOString().split('T')[1].slice(0, 8);
        setLogs(prevLogs => [...prevLogs, `[${time}] ${message}`]);
    };

    const handleFetchData = async () => {
        if (!isAuthenticated) {
            onRequestAuth("run latency check");
            return;
        }

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

        } catch {
            addLog('ERROR: Connection failed or token rejected.');
            setTimeout(() => onLogout(), 1500);
        } finally {
            setIsFetching(false);
        }
    };

    const handleClearCache = async () => {
        if (!isAuthenticated) {
            onRequestAuth("flush gateway cache");
            return;
        }

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
        } catch {
            addLog('ERROR: Network failure while flushing cache.');
        }
    };

    return (
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col gap-8 transition-colors">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-slate-800">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Telemetry & Cache Performance
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Live monitoring of cache hit ratios, PostgreSQL origin latency, and Redis speedup.
                    </p>
                </div>
                
                <div>
                    {isAuthenticated ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
                            Live Session Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            Landing Preview Mode
                        </span>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Gateway Telemetry Controls
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Trigger proxy queries to measure origin round-trip vs. in-memory edge cache.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button 
                            type="button"
                            onClick={handleFetchData}
                            disabled={isFetching}
                            className="px-5 py-2.5 bg-brand-blue hover:opacity-90 text-white rounded-lg font-semibold transition shadow-sm disabled:opacity-50 flex items-center space-x-2"
                        >
                            <svg className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>{isFetching ? 'Querying...' : 'Check Latency'}</span>
                        </button>
                        
                        <button 
                            type="button"
                            onClick={handleClearCache}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-sm flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Flush Cache</span>
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                    Live System Overview
                </h3>

                {!metrics ? (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-base font-medium">No telemetry query executed yet.</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Click <b>Check Latency</b> above to run an API request through the proxy gateway.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                        
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 border-t-4 border-t-brand-blue">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Total Requests
                            </h4>
                            <p className="text-3xl font-extrabold text-brand-blue mt-2">
                                {metrics.totalRequest}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 border-t-4 border-t-brand-blue">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Active Users
                            </h4>
                            <p className="text-3xl font-extrabold text-brand-blue mt-2">
                                {metrics.activeUsers}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 border-t-4 border-t-brand-blue">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Cache Hits
                            </h4>
                            <p className="text-3xl font-extrabold text-brand-blue mt-2">
                                {metrics.CacheHits}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 border-t-4 border-t-gray-400 dark:border-t-gray-500">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                DB Latency
                            </h4>
                            <p className="text-3xl font-extrabold text-gray-700 dark:text-gray-300 mt-2">
                                {dbLatency !== null ? `${dbLatency} ms` : '--'}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 border-t-4 border-t-emerald-500">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                Redis Cached (Hit)
                            </h4>
                            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                                {cacheLatency !== null ? `${cacheLatency} ms` : '--'}
                            </p>
                        </div>

                    </div>
                )}
            </div>

            <div className="bg-slate-950 rounded-2xl shadow-xl flex flex-col overflow-hidden h-80 border border-slate-800">
                <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                        <span className="font-mono text-xs font-bold text-slate-300 ml-2">
                            Gateway Proxy Telemetry Terminal
                        </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                        {logs.length} entries
                    </span>
                </div>
                
                <div className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto space-y-2 bg-slate-950 text-slate-300">
                    {logs.map((log, index) => {
                        let colorClass = "text-slate-400";
                        if (log.includes('ERROR')) colorClass = "text-red-400";
                        else if (log.includes('HIT')) colorClass = "text-emerald-400 font-bold";
                        else if (log.includes('MISS')) colorClass = "text-amber-400 font-semibold";
                        else if (log.includes('FLUSHALL')) colorClass = "text-cyan-400 font-semibold";

                        return (
                            <div key={index} className={`flex items-start space-x-2 ${colorClass}`}>
                                <span className="opacity-60 select-none">&gt;</span>
                                <span>{log}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

        </main>
    );
}