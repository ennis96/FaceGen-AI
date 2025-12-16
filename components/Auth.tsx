import React, { useState } from 'react';
import { Mail, Lock, CheckCircle, AlertCircle, Loader2, ArrowRight, User as UserIcon, Shield } from './Icons';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [authStep, setAuthStep] = useState<'login' | 'signup' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authStep === 'login') {
       handleLogin();
    } else if (authStep === 'signup') {
       handleSignupRequest();
    } else if (authStep === 'verify') {
       handleVerify();
    }
  };

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Mock login validation
      if (email && password.length >= 6) {
         completeAuth();
      } else {
         setError("Invalid credentials.");
      }
    }, 1500);
  };

  const handleSignupRequest = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Move to verification step
      setAuthStep('verify');
    }, 1500);
  };

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (verificationCode === '123456') { // Mock OTP
        completeAuth();
      } else {
        setError("Invalid verification code. Try '123456'.");
      }
    }, 1500);
  };

  const completeAuth = () => {
      onLogin({
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: name || email.split('@')[0],
        email: email,
        credits: 3,
        isPro: false,
        library: []
      });
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google Login Delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        name: 'Google User',
        email: 'user@gmail.com',
        credits: 5, // Bonus credits for Google Sign In
        isPro: false,
        library: []
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {authStep === 'login' && 'Welcome Back'}
              {authStep === 'signup' && 'Create Account'}
              {authStep === 'verify' && 'Verify Email'}
            </h1>
            <p className="text-neutral-400">
              {authStep === 'login' && 'Sign in to access your designs'}
              {authStep === 'signup' && 'Join the elite watch face designers'}
              {authStep === 'verify' && `Enter code sent to ${email}`}
            </p>
          </div>

          {authStep !== 'verify' && (
            <button 
                onClick={handleGoogleLogin}
                className="w-full bg-white text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-colors mb-6"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign {authStep === 'login' ? 'in' : 'up'} with Google
            </button>
          )}

          {authStep !== 'verify' && (
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-neutral-500 text-xs uppercase">Or continue with email</span>
                <div className="h-px bg-white/10 flex-1"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authStep === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-400 ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 text-neutral-500" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {authStep !== 'verify' && (
                <>
                <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-400 ml-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-neutral-500" size={18} />
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="name@example.com"
                    />
                </div>
                </div>

                <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-400 ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-neutral-500" size={18} />
                    <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    />
                </div>
                </div>
                </>
            )}

            {authStep === 'verify' && (
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 ml-1">Verification Code</label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-3.5 text-neutral-500" size={18} />
                        <input
                        type="text"
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full bg-neutral-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors tracking-widest text-center text-xl font-mono"
                        placeholder="000000"
                        maxLength={6}
                        />
                    </div>
                    <p className="text-center text-xs text-neutral-500 mt-2">Use code <b>123456</b> for this demo</p>
                </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {authStep === 'login' ? 'Sign In' : authStep === 'signup' ? 'Get Verification Code' : 'Verify & Login'} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {authStep !== 'verify' && (
            <div className="mt-6 text-center">
                <p className="text-neutral-400 text-sm">
                {authStep === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                    onClick={() => setAuthStep(authStep === 'login' ? 'signup' : 'login')}
                    className="text-primary hover:text-emerald-300 font-semibold ml-1"
                >
                    {authStep === 'login' ? 'Sign Up' : 'Log In'}
                </button>
                </p>
            </div>
          )}
          
          {authStep === 'verify' && (
            <div className="mt-6 text-center">
                 <button 
                    onClick={() => setAuthStep('signup')}
                    className="text-neutral-400 hover:text-white text-sm"
                >
                    Back to Sign Up
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;