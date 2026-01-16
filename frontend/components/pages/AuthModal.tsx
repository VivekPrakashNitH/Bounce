import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authApi, AuthResponse } from '../../services/apiService';

type AuthStep = 
  | 'initial'           // Choose login or register
  | 'login'             // Email + password login
  | 'register-email'    // Enter email for registration
  | 'register-otp'      // Enter OTP received via email
  | 'register-details'  // Enter name + password after OTP verification
  | 'forgot-email'      // Enter email for password reset
  | 'forgot-otp'        // Enter OTP for password reset
  | 'forgot-newpass'    // Enter new password
  | 'success';          // Success message

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { id: number; name: string; email: string; avatar?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<AuthStep>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setStep('initial');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setOtp('');
    setError('');
    setSuccessMessage('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Login with email and password
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await authApi.login(email, password);
      onSuccess(user);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for registration
  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.sendOtp(email);
      setStep('register-otp');
      setSuccessMessage(`OTP sent to ${email}. Check your inbox!`);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP for registration
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    // Move to details step after OTP entry
    setStep('register-details');
    setError('');
  };

  // Complete registration with name and password
  const handleCompleteRegistration = async () => {
    if (!name || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await authApi.verifyOtpAndRegister({
        email,
        otp,
        name,
        password,
      });
      onSuccess(user);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      // Go back to OTP step if OTP was invalid
      if (err.message?.toLowerCase().includes('otp')) {
        setStep('register-otp');
        setOtp('');
      }
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.forgotPassword(email);
      setStep('forgot-otp');
      setSuccessMessage(`Password reset OTP sent to ${email}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and go to new password step
  const handleVerifyForgotOtp = () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setStep('forgot-newpass');
    setError('');
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.resetPassword(email, otp, password);
      setStep('success');
      setSuccessMessage('Password reset successful! You can now login.');
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
      if (err.message?.toLowerCase().includes('otp')) {
        setStep('forgot-otp');
        setOtp('');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            {step !== 'initial' && step !== 'success' && (
              <button
                onClick={() => {
                  if (step === 'login' || step === 'register-email' || step === 'forgot-email') {
                    setStep('initial');
                  } else if (step === 'register-otp') {
                    setStep('register-email');
                  } else if (step === 'register-details') {
                    setStep('register-otp');
                  } else if (step === 'forgot-otp') {
                    setStep('forgot-email');
                  } else if (step === 'forgot-newpass') {
                    setStep('forgot-otp');
                  }
                  setError('');
                }}
                className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-white">
              {step === 'initial' && 'Welcome to Bounce'}
              {step === 'login' && 'Login'}
              {step === 'register-email' && 'Create Account'}
              {step === 'register-otp' && 'Verify Email'}
              {step === 'register-details' && 'Complete Registration'}
              {step === 'forgot-email' && 'Reset Password'}
              {step === 'forgot-otp' && 'Verify OTP'}
              {step === 'forgot-newpass' && 'New Password'}
              {step === 'success' && 'Success!'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message - Hide on register-details step */}
          {successMessage && !error && step !== 'register-details' && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          {/* Initial - Choose Login or Register */}
          {step === 'initial' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-center mb-6">
                Join the conversation and share your thoughts!
              </p>
              <button
                onClick={() => { setStep('login'); setError(''); setSuccessMessage(''); }}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Login with Password
              </button>
              <button
                onClick={() => { setStep('register-email'); setError(''); setSuccessMessage(''); }}
                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl border border-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Create New Account
              </button>
            </div>
          )}

          {/* Login Form */}
          {step === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢"
                    className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
              </button>
              <button
                onClick={() => { setStep('forgot-email'); setError(''); }}
                className="w-full text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Register - Email Step */}
          {step === 'register-email' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm mb-2">
                We'll send a 6-digit OTP to verify your email.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                  />
                </div>
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
              </button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button
                  onClick={() => { setStep('login'); setError(''); }}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  Login
                </button>
              </p>
            </div>
          )}

          {/* Register - OTP Step */}
          {step === 'register-otp' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm mb-2">
                Enter the 6-digit code sent to <span className="text-white">{email}</span>
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-center text-2xl tracking-[0.5em] placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
              </button>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full text-sm text-gray-400 hover:text-white transition-colors"
              >
                Didn't receive code? Resend OTP
              </button>
            </div>
          )}

          {/* Register - Details Step */}
          {step === 'register-details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleCompleteRegistration()}
                  />
                </div>
              </div>
              <button
                onClick={handleCompleteRegistration}
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </button>
            </div>
          )}

          {/* Forgot Password - Email Step */}
          {step === 'forgot-email' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm mb-2">
                Enter your email and we'll send you a code to reset your password.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
                  />
                </div>
              </div>
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
              </button>
            </div>
          )}

          {/* Forgot Password - OTP Step */}
          {step === 'forgot-otp' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm mb-2">
                Enter the 6-digit code sent to <span className="text-white">{email}</span>
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-center text-2xl tracking-[0.5em] placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyForgotOtp()}
                />
              </div>
              <button
                onClick={handleVerifyForgotOtp}
                disabled={loading || otp.length !== 6}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
              </button>
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full text-sm text-gray-400 hover:text-white transition-colors"
              >
                Didn't receive code? Resend
              </button>
            </div>
          )}

          {/* Forgot Password - New Password Step */}
          {step === 'forgot-newpass' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                  />
                </div>
              </div>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              <p className="text-gray-300">{successMessage}</p>
              <button
                onClick={() => { setStep('login'); setPassword(''); setSuccessMessage(''); }}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
