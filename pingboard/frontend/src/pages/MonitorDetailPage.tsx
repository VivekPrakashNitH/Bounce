import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, MonitorResponse, HealthCheckResponse } from '../api/client';
import { ArrowLeft, Activity, Clock, Zap, TrendingUp } from 'lucide-react';

export default function MonitorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [monitor, setMonitor] = useState<MonitorResponse | null>(null);
    const [checks, setChecks] = useState<HealthCheckResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const loadData = async () => {
            try {
                const [monData, checkData] = await Promise.all([
                    api.getMonitor(Number(id)),
                    api.getChecks(Number(id), 24),
                ]);
                setMonitor(monData);
                setChecks(checkData);
            } catch {
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        loadData();
        // Refresh every 30 seconds
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, [id, navigate]);

    if (loading || !monitor) {
        return <div className="page-center"><div className="spinner" /></div>;
    }

    const upChecks = checks.filter(c => c.isUp);

    return (
        <div className="detail-page">
            <header className="detail-header">
                <button className="btn-ghost" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={18} /> Back
                </button>
            </header>

            <div className="detail-hero">
                <div className="detail-status">
                    <div
                        className="status-dot status-dot-lg"
                        style={{
                            background: monitor.currentlyUp === null
                                ? 'var(--color-warning)'
                                : monitor.currentlyUp
                                    ? 'var(--color-success)'
                                    : 'var(--color-danger)',
                        }}
                    />
                    <div>
                        <h1>{monitor.name}</h1>
                        <p className="monitor-url">{monitor.url}</p>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card card">
                    <TrendingUp size={20} />
                    <div className="stat-value">{monitor.uptimePercent}%</div>
                    <div className="stat-label">Uptime (30 days)</div>
                </div>
                <div className="stat-card card">
                    <Zap size={20} />
                    <div className="stat-value">{Math.round(monitor.avgResponseMs)}ms</div>
                    <div className="stat-label">Avg Response</div>
                </div>
                <div className="stat-card card">
                    <Activity size={20} />
                    <div className="stat-value">{upChecks.length}/{checks.length}</div>
                    <div className="stat-label">Checks Up (24h)</div>
                </div>
                <div className="stat-card card">
                    <Clock size={20} />
                    <div className="stat-value">{monitor.intervalSeconds}s</div>
                    <div className="stat-label">Check Interval</div>
                </div>
            </div>

            <div className="card">
                <h2>Response Time (Last 24h)</h2>
                <div className="response-chart">
                    {checks.slice(0, 100).reverse().map((check) => (
                        <div
                            key={check.id}
                            className="chart-bar"
                            style={{
                                height: `${Math.min(100, (check.responseTimeMs / 2000) * 100)}%`,
                                background: check.isUp ? 'var(--color-success)' : 'var(--color-danger)',
                            }}
                            title={`${check.responseTimeMs}ms — ${new Date(check.checkedAt).toLocaleTimeString()}`}
                        />
                    ))}
                </div>
            </div>

            <div className="card">
                <h2>Recent Checks</h2>
                <div className="checks-table">
                    <div className="table-header">
                        <span>Status</span>
                        <span>Response Time</span>
                        <span>Status Code</span>
                        <span>Time</span>
                    </div>
                    {checks.slice(0, 50).map(check => (
                        <div key={check.id} className="table-row">
                            <span>
                                <span className="status-dot" style={{
                                    background: check.isUp ? 'var(--color-success)' : 'var(--color-danger)',
                                }} />
                                {check.isUp ? 'Up' : 'Down'}
                            </span>
                            <span>{check.responseTimeMs}ms</span>
                            <span>{check.statusCode ?? '—'}</span>
                            <span>{new Date(check.checkedAt).toLocaleString()}</span>
                        </div>
                    ))}
                    {checks.length === 0 && (
                        <div className="table-row">
                            <span style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-muted)' }}>
                                No checks yet. First check will run within {monitor.intervalSeconds} seconds.
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
