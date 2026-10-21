import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get('expired')) {
      addToast('Your session expired. Please sign in again.', 'info');
    }
  }, [location, addToast]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      addToast('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setErrors({ form: msg });
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#08061A' }}>
      {/* Ambient orbs */}
      <div className="orb orb-purple" style={{ top: '-150px', left: '-100px', opacity: 0.3 }} />
      <div className="orb orb-indigo" style={{ bottom: '-100px', right: '-50px', opacity: 0.2 }} />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden"
        style={{ border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(139,92,246,0.1)' }}
      >
        {/* Form Column */}
        <div className="p-8 sm:p-12" style={{ background: 'rgba(17,14,46,0.92)', backdropFilter: 'blur(40px)' }}>
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group w-fit">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">Mira</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">Welcome back</h1>
            <p className="text-sm text-white/35">Sign in to manage your reminders and email alerts.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="p-3.5 rounded-xl text-sm text-red-400 font-medium" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                {errors.form}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: null })); }}
              error={errors.email}
              leftElement={<Mail className="w-4 h-4" />}
              autoComplete="email"
              autoFocus
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: null })); }}
              error={errors.password}
              leftElement={<Lock className="w-4 h-4" />}
              rightElement={
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="text-white/30 hover:text-white/70 p-1 rounded transition-colors"
                  aria-label={showPassword ? 'Hide' : 'Show'}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password"
            />

            <Button type="submit" variant="primary" size="lg" loading={loading}
              className="w-full mt-2" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              Sign in
            </Button>
          </form>

          <p className="mt-8 pt-6 border-t border-white/[0.06] text-sm text-white/30 text-center">
            No account yet?{' '}
            <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Create one free →
            </Link>
          </p>
        </div>

        {/* Quote Panel */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 100%)',
            borderLeft: '1px solid rgba(139,92,246,0.15)',
          }}
        >
          {/* Decorative circle */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full"
            style={{ background: 'rgba(139,92,246,0.12)', filter: 'blur(40px)' }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
            style={{ background: 'rgba(99,102,241,0.1)', filter: 'blur(30px)' }} />

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="relative z-10 my-auto">
            <blockquote className="text-2xl font-display font-semibold text-white/80 leading-relaxed italic mb-6">
              "Your mind is for having ideas, not holding them."
            </blockquote>
            <cite className="text-xs uppercase tracking-widest text-white/30 font-bold not-italic">
              — David Allen · Getting Things Done
            </cite>
          </div>

          <div className="relative z-10 text-xs text-white/20 leading-relaxed">
            Mira sends reminders only when it's time to act. Until then, your mind stays free.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
