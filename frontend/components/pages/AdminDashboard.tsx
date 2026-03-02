import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OverviewData {
    totalUsers: number;
    totalPageViews: number;
    totalActiveTimeHours: number;
    totalDropoffs: number;
    avgPagesPerUser: number;
}

interface ContentHealth {
    page_id: string;
    total_visitors: number;
    avg_active_ms: number;
    total_dropoffs: number;
    dropoff_rate_pct: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function adminFetch<T>(path: string): Promise<T> {
    const token = localStorage.getItem('bounce_token');
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    return res.json();
}

/**
 * Admin Analytics Dashboard — reads from materialized views.
 * Shows platform overview, content health, and drop-off funnel.
 */
export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [health, setHealth] = useState<ContentHealth[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            adminFetch<OverviewData>('/v1/admin/analytics/overview'),
            adminFetch<ContentHealth[]>('/v1/admin/analytics/content-health'),
        ]).then(([o, h]) => {
            setOverview(o);
            setHealth(h);
        }).catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a1a' }}>
                <p style={{ color: '#94a3b8' }}>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#0a0a1a', padding: '32px',
            fontFamily: '"Inter", -apple-system, sans-serif',
        }}>
            {/* Header */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ color: '#e2e8f0', margin: 0, fontSize: '28px', fontWeight: 700 }}>
                            📊 Admin Dashboard
                        </h1>
                        <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
                            Platform engagement analytics
                        </p>
                    </div>
                    <button onClick={() => navigate('/home')} style={{
                        padding: '8px 20px', borderRadius: '8px', border: '1px solid #334155',
                        background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px',
                    }}>
                        ← Back to Home
                    </button>
                </div>

                {/* Overview Cards */}
                {overview && (
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px', marginBottom: '32px',
                    }}>
                        {[
                            { label: 'Total Users', value: overview.totalUsers, icon: '👥', color: '#6366f1' },
                            { label: 'Page Views', value: overview.totalPageViews.toLocaleString(), icon: '👁', color: '#22c55e' },
                            { label: 'Active Hours', value: overview.totalActiveTimeHours.toLocaleString(), icon: '⏱', color: '#f59e0b' },
                            { label: 'Drop-offs', value: overview.totalDropoffs, icon: '🚪', color: '#ef4444' },
                            { label: 'Avg Pages/User', value: Math.round(overview.avgPagesPerUser), icon: '📄', color: '#8b5cf6' },
                        ].map(card => (
                            <div key={card.label} style={{
                                background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                                borderRadius: '12px', padding: '20px',
                                border: '1px solid rgba(51, 65, 85, 0.5)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '24px' }}>{card.icon}</span>
                                    <span style={{ color: card.color, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const }}>
                                        {card.label}
                                    </span>
                                </div>
                                <div style={{ color: '#e2e8f0', fontSize: '28px', fontWeight: 700 }}>
                                    {card.value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Content Health Table */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                    borderRadius: '16px', padding: '24px',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                }}>
                    <h2 style={{ color: '#e2e8f0', margin: '0 0 16px', fontSize: '18px' }}>
                        📋 Content Health
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Page', 'Visitors', 'Avg Active Time', 'Drop-offs', 'Drop-off Rate'].map(h => (
                                        <th key={h} style={{
                                            textAlign: 'left', padding: '10px 12px', color: '#64748b',
                                            fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const,
                                            borderBottom: '1px solid #1e293b',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {health.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '24px', color: '#64748b', textAlign: 'center' }}>
                                            No data yet — analytics populate after user activity
                                        </td>
                                    </tr>
                                ) : health.map(row => (
                                    <tr key={row.page_id} style={{ borderBottom: '1px solid rgba(30, 41, 59, 0.5)' }}>
                                        <td style={{ padding: '10px 12px', color: '#c4b5fd', fontSize: '14px', fontWeight: 500 }}>
                                            {row.page_id}
                                        </td>
                                        <td style={{ padding: '10px 12px', color: '#e2e8f0', fontSize: '14px' }}>
                                            {row.total_visitors}
                                        </td>
                                        <td style={{ padding: '10px 12px', color: '#e2e8f0', fontSize: '14px' }}>
                                            {(row.avg_active_ms / 1000).toFixed(1)}s
                                        </td>
                                        <td style={{ padding: '10px 12px', color: '#e2e8f0', fontSize: '14px' }}>
                                            {row.total_dropoffs}
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    width: '60px', height: '6px', borderRadius: '3px',
                                                    background: '#1e293b', overflow: 'hidden',
                                                }}>
                                                    <div style={{
                                                        height: '100%', borderRadius: '3px',
                                                        width: `${Math.min(row.dropoff_rate_pct, 100)}%`,
                                                        background: row.dropoff_rate_pct > 50 ? '#ef4444'
                                                            : row.dropoff_rate_pct > 25 ? '#f59e0b' : '#22c55e',
                                                    }} />
                                                </div>
                                                <span style={{
                                                    color: row.dropoff_rate_pct > 50 ? '#fca5a5'
                                                        : row.dropoff_rate_pct > 25 ? '#fde68a' : '#86efac',
                                                    fontSize: '13px',
                                                }}>
                                                    {row.dropoff_rate_pct.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
