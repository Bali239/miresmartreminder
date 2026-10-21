import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDateOnly, getUserTimezone } from '../../utils/date';

export const Topbar = ({ onOpenMobileMenu, onOpenNewModal }) => {
  const { user } = useAuth();
  const timezone = user?.timezone || getUserTimezone();

  const getGreeting = () => {
    try {
      const h = parseInt(
        new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }).format(new Date()),
        10
      );
      if (h < 12) return 'Good morning';
      if (h < 17) return 'Good afternoon';
      return 'Good evening';
    } catch { return 'Welcome'; }
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';
  const todayFormatted = formatDateOnly(new Date(), timezone);

  return (
    <header
      className="sticky top-0 z-20 px-5 sm:px-8 py-4 flex items-center justify-between transition-all"
      style={{
        background: 'rgba(8, 6, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-1 text-white/40 hover:text-white rounded-xl glass transition-all"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-display font-bold text-white leading-tight">
            {getGreeting()},{' '}
            <span className="gradient-text">{firstName}</span>
          </h1>
          <p className="text-[11px] text-white/30 font-medium hidden sm:block">{todayFormatted}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Pulse indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-[11px] font-semibold text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live</span>
        </div>

        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white gradient-btn"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
