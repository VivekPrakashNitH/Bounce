import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 404 Not Found page — shown for unmatched routes.
 */
export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: '#0a0a1a', padding: '24px',
        }}>
            <div style={{
                maxWidth: '520px', textAlign: 'center',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '20px', padding: '48px 40px',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
                <div style={{
                    fontSize: '80px', lineHeight: 1, marginBottom: '16px',
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    fontWeight: 900,
                }}>
                    404
                </div>
                <h2 style={{ color: '#e2e8f0', margin: '0 0 12px', fontSize: '24px', fontWeight: 700 }}>
                    Page not found
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', margin: '0 0 32px' }}>
                    The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/home')} style={{
                        padding: '12px 28px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: 600,
                        transition: 'transform 0.2s',
                    }}>
                        🏠 Go Home
                    </button>
                    <button onClick={() => navigate(-1)} style={{
                        padding: '12px 28px', borderRadius: '10px',
                        border: '1px solid #475569', background: 'transparent',
                        color: '#94a3b8', cursor: 'pointer', fontSize: '15px',
                        transition: 'all 0.2s',
                    }}>
                        ← Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};
