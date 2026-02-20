import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, StatusPageResponse } from '../api/client';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

export default function StatusPage() {
    const { userId } = useParams<{ userId: string }>();
    const [status, setStatus] = useState<StatusPageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userId) return;
        const load = async () => {
            try {
                const data = await api.getStatusPage(Number(userId));
                setStatus(data);
            } catch {
                setError('Status page not found');
            } finally {
                setLoading(false);
            }
        };
        load();
        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, [userId]);

    if (loading) return <div className="page-center"><div className="spinner" /></div>;
    if (error || !status) return <div className="page-center"><p>{error}</p></div>;

    const allUp = status.monitors.every(m => m.isUp);

    return (
        <div className="status-page">
            <header className="status-header">
                <Activity size={28} />
                <h1>{status.owner}'s Services</h1>
            </header>

            <div className={`status-banner ${allUp ? 'status-ok' : 'status-incident'}`}>
                {allUp ? (
                    <>
                        <CheckCircle size={24} />
                        <span>All Systems Operational</span>
                    </>
                ) : (
                    <>
                        <XCircle size={24} />
                        <span>Some Systems Are Experiencing Issues</span>
                    </>
                )}
            </div>

            <div className="status-list">
                {status.monitors.map((monitor, i) => (
                    <div key={i} className="status-item card">
                        <div className="status-item-left">
                            <div
                                className="status-dot"
                                style={{ background: monitor.isUp ? 'var(--color-success)' : 'var(--color-danger)' }}
                            />
                            <span className="status-item-name">{monitor.name}</span>
                        </div>
                        <div className="status-item-right">
                            <span className="uptime-badge">{monitor.uptimePercent}% uptime</span>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="status-footer">
                Powered by <strong>PingBoard</strong>
            </footer>
        </div>
    );
}
