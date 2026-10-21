import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Lock, Mail, User, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserTimezone } from '../utils/date';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timezone] = useState(() => getUserTimezone());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, timezone });
      addToast('Account created! Welcome to Mira.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setErrors({ form: msg });
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#08061A' }}>
      <div className="orb orb-purple" style={{ top: '-100px', right: '-100px', opacity: 0.25 }} />
      <div className="orb orb-indigo" style={{ bottom: '-100px', left: '-50px', opacity: 0.2 }} />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden"
        style={{ border: '1px solid rgba(139,92,246,0.2)', boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(139,92,246,0.1)' }}>
        {/* Quote panel (left on register) */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden order-2 lg:order-1"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)', borderRight: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full"
            style={{ background: 'rgba(99,102,241,0.12)', filter: 'blur(40px)' }} />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full"
            style={{ background: 'rgba(139,92,246,0.1)', filter: 'blur(30px)' }} />

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="relative z-10 my-auto">
            <blockquote className="text-2xl font-display font-semibold text-white/80 leading-relaxed italic mb-6">
              "Simplicity is about subtracting the obvious and adding the meaningful."
            </blockquote>
            <cite className="text-xs uppercase tracking-widest text-white/30 font-bold not-italic">
              — John Maeda · The Laws of Simplicity
            </cite>
          </div>

          {/* Features preview */}
          <div className="relative z-10 space-y-2">
            {['Automated email alerts', 'Custom advance notice', 'Timezone-aware delivery'].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-white/30 font-medium">
                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
                  <svg className="w-2.5 h-2.5 text-purple-400" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Form Column */}
        <div className="p-8 sm:p-12 order-1 lg:order-2" style={{ background: 'rgba(17,14,46,0.92)', backdropFilter: 'blur(40px)' }}>
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group w-fit">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">Mira</span>
          </Link>

          <div className="mb-7">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">Create your account</h1>
            <p className="text-sm text-white/35">Start forgetting deadlines — in the best way.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="p-3.5 rounded-xl text-sm text-red-400 font-medium" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                {errors.form}
              </div>
            )}

            <Input label="Full Name" type="text" placeholder="Alex Morgan" value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: null })); }}
              error={errors.name} leftElement={<User className="w-4 h-4" />} autoFocus />

            <Input label="Email" type="email" placeholder="you@example.com" value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: null })); }}
              error={errors.email} leftElement={<Mail className="w-4 h-4" />} autoComplete="email" />

            <Input label="Password (min 6 chars)" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: null })); }}
              error={errors.password} leftElement={<Lock className="w-4 h-4" />}
              rightElement={
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="text-white/30 hover:text-white/70 p-1 rounded transition-colors" aria-label="Toggle">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              } autoComplete="new-password" />

            {/* Auto-detected timezone */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <span className="flex items-center gap-2 text-xs font-medium text-white/35">
                <Globe className="w-3.5 h-3.5 text-purple-400" /> Auto-detected timezone
              </span>
              <span className="text-xs font-bold text-purple-400">{timezone}</span>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading}
              className="w-full mt-2" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
              Get started free
            </Button>
          </form>

          <p className="mt-8 pt-6 border-t border-white/[0.06] text-sm text-white/30 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
