import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity } from 'lucide-react';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                await register(email, password, name);
            } else {
                await login(email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Activity size={32} className="auth-icon" />
                    <h1>PingBoard</h1>
                    <p className="auth-subtitle">Uptime Monitoring & Status Pages</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>

                    {error && <div className="error-banner">{error}</div>}

                    {isRegister && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Your name"
                                required
                                minLength={2}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            required
                            minLength={8}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                    </button>

                    <p className="auth-toggle">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            className="link-button"
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                        >
                            {isRegister ? 'Sign In' : 'Create one'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
