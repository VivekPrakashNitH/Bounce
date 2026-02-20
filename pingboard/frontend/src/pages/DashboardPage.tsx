import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api, MonitorResponse, CreateMonitorRequest } from '../api/client';
import { Plus, Activity, LogOut, Pause, Play, Trash2 } from 'lucide-react';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [monitors, setMonitors] = useState<MonitorResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formName, setName] = useState('');
    const [formUrl, setUrl] = useState('');
    const [formMethod, setMethod] = useState('GET');
    const [formInterval, setInterval] = useState(60);

    useEffect(() => {
        loadMonitors();
    }, []);

    const loadMonitors = async () => {
        try {
            const data = await api.getMonitors();
            setMonitors(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load monitors');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const req: CreateMonitorRequest = {
                name: formName,
                url: formUrl,
                method: formMethod,
                intervalSeconds: formInterval,
            };
            await api.createMonitor(req);
            setShowForm(false);
            setName(''); setUrl(''); setMethod('GET'); setInterval(60);
            await loadMonitors();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create monitor');
        }
    };

    const handleToggle = async (id: number) => {
        try {
            await api.toggleMonitor(id);
            await loadMonitors();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle monitor');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this monitor and all its history?')) return;
        try {
            await api.deleteMonitor(id);
            await loadMonitors();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete monitor');
        }
    };

    const getStatusColor = (monitor: MonitorResponse): string => {
        if (!monitor.isActive) return 'var(--color-muted)';
        if (monitor.currentlyUp === null) return 'var(--color-warning)';
        return monitor.currentlyUp ? 'var(--color-success)' : 'var(--color-danger)';
    };

    const getStatusLabel = (monitor: MonitorResponse): string => {
        if (!monitor.isActive) return 'Paused';
        if (monitor.currentlyUp === null) return 'Pending';
        return monitor.currentlyUp ? 'Up' : 'Down';
    };

    if (loading) {
        return (
            <div className="page-center">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <Activity size={24} />
                    <h1>PingBoard</h1>
                </div>
                <div className="header-right">
                    <span className="user-name">{user?.name}</span>
                    <button className="btn-ghost" onClick={logout} title="Sign out">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="dashboard-toolbar">
                    <h2>Monitors ({monitors.length})</h2>
                    <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                        <Plus size={16} /> Add Monitor
                    </button>
                </div>

                {error && <div className="error-banner">{error} <button onClick={() => setError('')}>✕</button></div>}

                {showForm && (
                    <form onSubmit={handleCreate} className="monitor-form card">
                        <h3>New Monitor</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="monitor-name">Name</label>
                                <input id="monitor-name" value={formName} onChange={e => setName(e.target.value)}
                                    placeholder="My API" required />
                            </div>
                            <div className="form-group" style={{ flex: 2 }}>
                                <label htmlFor="monitor-url">URL</label>
                                <input id="monitor-url" value={formUrl} onChange={e => setUrl(e.target.value)}
                                    placeholder="https://api.example.com/health" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="monitor-method">Method</label>
                                <select id="monitor-method" value={formMethod} onChange={e => setMethod(e.target.value)}>
                                    <option>GET</option><option>HEAD</option><option>POST</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="monitor-interval">Interval (sec)</label>
                                <input id="monitor-interval" type="number" min={30} max={3600}
                                    value={formInterval} onChange={e => setInterval(Number(e.target.value))} />
                            </div>
                            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                                <button type="submit" className="btn-primary">Create</button>
                            </div>
                        </div>
                    </form>
                )}

                {monitors.length === 0 ? (
                    <div className="empty-state card">
                        <Activity size={48} />
                        <h3>No monitors yet</h3>
                        <p>Add your first monitor to start tracking uptime.</p>
                    </div>
                ) : (
                    <div className="monitor-grid">
                        {monitors.map(monitor => (
                            <div key={monitor.id} className="monitor-card card" onClick={() => navigate(`/monitor/${monitor.id}`)}>
                                <div className="monitor-card-header">
                                    <div className="status-dot" style={{ background: getStatusColor(monitor) }} />
                                    <span className="status-label" style={{ color: getStatusColor(monitor) }}>
                                        {getStatusLabel(monitor)}
                                    </span>
                                    <div className="monitor-actions" onClick={e => e.stopPropagation()}>
                                        <button className="btn-icon" onClick={() => handleToggle(monitor.id)}
                                            title={monitor.isActive ? 'Pause' : 'Resume'}>
                                            {monitor.isActive ? <Pause size={14} /> : <Play size={14} />}
                                        </button>
                                        <button className="btn-icon btn-danger" onClick={() => handleDelete(monitor.id)} title="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="monitor-name">{monitor.name}</h3>
                                <p className="monitor-url">{monitor.url}</p>

                                <div className="monitor-stats">
                                    <div className="stat">
                                        <span className="stat-value">{monitor.uptimePercent}%</span>
                                        <span className="stat-label">Uptime (30d)</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">{Math.round(monitor.avgResponseMs)}ms</span>
                                        <span className="stat-label">Avg Response</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">{monitor.intervalSeconds}s</span>
                                        <span className="stat-label">Interval</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
