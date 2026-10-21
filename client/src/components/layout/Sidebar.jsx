import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Settings, Plus, LogOut, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ onOpenNewModal, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Reminders', to: '/reminders', icon: CalendarCheck },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const content = (
    <div className="h-full flex flex-col" style={{ background: 'rgba(8, 6, 26, 0.95)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Top brand */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mira logo mark */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-xl tracking-tight block leading-none">
              Mira
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
              Smart Reminders
            </span>
          </div>
        </div>
        {setMobileOpen && (
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 text-white/30 hover:text-white rounded-lg" aria-label="Close nav">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* New Reminder CTA */}
      <div className="px-4 mb-6">
        <button
          onClick={() => { if (setMobileOpen) setMobileOpen(false); onOpenNewModal(); }}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-bold text-white gradient-btn"
        >
          <Plus className="w-4 h-4" />
          New Reminder
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.08)',
                  }
                : undefined
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* User menu */}
      <div className="p-4 mt-auto border-t border-white/[0.05]">
        <div className="flex items-center gap-3 px-3 py-3 mb-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
          >
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name || 'User'}</p>
            <p className="text-[11px] text-white/35 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/35 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-60 h-screen fixed left-0 top-0 z-30">{content}</aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-[85vw] h-full z-10 animate-fade-up">{content}</div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
