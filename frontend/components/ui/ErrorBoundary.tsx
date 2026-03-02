import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * React Error Boundary — catches render errors and shows recovery UI.
 * Prevents the entire app from crashing on component errors.
 */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary] Caught:', error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: '100vh', background: '#0a0a1a', padding: '24px',
                }}>
                    <div style={{
                        maxWidth: '480px', textAlign: 'center',
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                        borderRadius: '16px', padding: '40px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💥</div>
                        <h2 style={{ color: '#e2e8f0', margin: '0 0 12px', fontSize: '22px' }}>
                            Something went wrong
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 8px' }}>
                            An unexpected error occurred. Your progress has been saved.
                        </p>
                        <p style={{
                            color: '#64748b', fontSize: '12px',
                            fontFamily: 'monospace', margin: '0 0 24px',
                            background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {this.state.error?.message || 'Unknown error'}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={this.handleReset} style={{
                                padding: '10px 24px', borderRadius: '8px', border: 'none',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                            }}>
                                Try Again
                            </button>
                            <button onClick={() => window.location.href = '/home'} style={{
                                padding: '10px 24px', borderRadius: '8px',
                                border: '1px solid #475569', background: 'transparent',
                                color: '#94a3b8', cursor: 'pointer', fontSize: '14px',
                            }}>
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
