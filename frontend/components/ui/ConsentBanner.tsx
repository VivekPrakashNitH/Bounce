import React from 'react';

interface ConsentBannerProps {
    onAccept: () => void;
    onDecline: () => void;
}

/**
 * GDPR-compliant cookie/tracking consent banner.
 * Shown on first visit, saved to localStorage.
 */
export const ConsentBanner: React.FC<ConsentBannerProps> = ({ onAccept, onDecline }) => {
    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10000,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderTop: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '16px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '12px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
        }}>
            <div style={{ flex: '1 1 400px' }}>
                <p style={{ color: '#e2e8f0', margin: '0 0 4px', fontSize: '14px', fontWeight: 600 }}>
                    🍪 We use cookies to improve your learning experience
                </p>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '12px', lineHeight: '1.5' }}>
                    We track page time, scroll depth, and quiz attempts to personalize your learning path
                    and improve content quality. No data is shared with third parties.
                </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={onDecline} style={{
                    padding: '8px 20px', borderRadius: '8px',
                    border: '1px solid #475569', background: 'transparent',
                    color: '#94a3b8', cursor: 'pointer', fontSize: '13px',
                    transition: 'all 0.2s',
                }}>
                    Decline
                </button>
                <button onClick={onAccept} style={{
                    padding: '8px 20px', borderRadius: '8px', border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    transition: 'all 0.2s',
                }}>
                    Accept & Continue
                </button>
            </div>
        </div>
    );
};
