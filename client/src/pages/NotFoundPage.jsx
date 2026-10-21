import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-center relative overflow-hidden"
      style={{ background: '#08061A' }}
    >
      {/* Ambient background orbs */}
      <div className="orb orb-purple" style={{ top: '10%', left: '20%', opacity: 0.25 }} />
      <div className="orb orb-indigo" style={{ bottom: '15%', right: '15%', opacity: 0.2 }} />

      <div
        className="max-w-md w-full relative z-10 rounded-3xl p-8 sm:p-10"
        style={{
          background: 'rgba(17, 14, 46, 0.85)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(139, 92, 246, 0.1)',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
          }}
        >
          <Compass className="w-8 h-8 text-white" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
          404 Error
        </span>

        <h1 className="text-3xl font-display font-bold text-white mt-2 mb-3">
          Page not found
        </h1>

        <p className="text-sm text-white/40 leading-relaxed mb-8">
          The page you are looking for doesn't exist or has quietly moved into another orbit.
        </p>

        <div className="flex justify-center">
          <Link to="/">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
