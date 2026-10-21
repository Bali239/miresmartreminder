import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Clock, ArrowRight, Plus, Check } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { remindersApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getRelativeTime, formatDateTime } from '../utils/date';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { StatSkeleton, CardSkeleton } from '../components/common/Skeleton';

const GlassCard = ({ children, className = '', style = {} }) => (
  <div
    className={`rounded-2xl ${className}`}
    style={{
      background: 'rgba(139, 92, 246, 0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.12)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const DashboardPage = () => {
  const { onOpenNewModal } = useOutletContext();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ total: 0, completed: 0, pending: 0, overdue: 0, completionRate: 0, upcoming: [] });

  const fetchDashboard = useCallback(async () => {
    try {
      setData(await remindersApi.getDashboard());
    } catch {
      addToast('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDashboard();
    const h = () => fetchDashboard();
    window.addEventListener('remindly:refetch', h);
    return () => window.removeEventListener('remindly:refetch', h);
  }, [fetchDashboard]);

  const handleQuickComplete = async (id) => {
    setData((prev) => {
      const upcoming = prev.upcoming.filter((r) => r._id !== id);
      const completed = prev.completed + 1;
      const pending = Math.max(0, prev.pending - 1);
      return { ...prev, completed, pending, completionRate: prev.total ? Math.round((completed / prev.total) * 100) : 0, upcoming };
    });
    try {
      await remindersApi.completeReminder(id);
      addToast('Marked as complete!');
    } catch {
      addToast('Failed to complete', 'error');
      fetchDashboard();
    }
  };

  const { total, completed, pending, overdue, completionRate, upcoming } = data;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-3">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
          <div className="lg:col-span-4"><CardSkeleton /></div>
        </div>
      </div>
    );
  }

  // SVG ring
  const r = 52, stroke = 10, circ = 2 * Math.PI * r;
  const offset = circ - (completionRate / 100) * circ;

  const chartData = [
    { name: 'Completed', value: completed, color: '#8B5CF6' },
    { name: 'Pending', value: pending, color: 'rgba(139,92,246,0.15)' },
  ];

  const stats = [
    { label: 'Total', value: total, icon: '📋', color: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.15)' },
    { label: 'Completed', value: completed, icon: '✅', color: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
    { label: 'Pending', value: pending, icon: '⏳', color: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.15)' },
    { label: 'Overdue', value: overdue, icon: '⚡', color: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', highlight: overdue > 0 },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Overview</h2>
          <p className="text-sm text-white/35 mt-0.5">Your reminders at a glance.</p>
        </div>
        <Button onClick={onOpenNewModal} variant="primary" icon={<Plus className="w-4 h-4" />} className="self-start sm:self-auto">
          Create reminder
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-5" style={{ background: s.color, border: `1px solid ${s.border}`, boxShadow: s.highlight ? '0 0 30px rgba(245,158,11,0.08)' : undefined }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40">{s.label}</span>
              <span className="text-xl">{s.icon}</span>
            </div>
            <div className={`text-3xl font-display font-extrabold ${s.highlight ? 'text-amber-400' : 'text-white'}`}>
              {s.value}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Upcoming list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-display font-bold text-white">Next up</h3>
              <Badge variant="purple" size="xs">{upcoming.length} tasks</Badge>
            </div>
            <Link to="/reminders?filter=upcoming" className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <EmptyState
              title="You're all caught up!"
              description="No upcoming tasks. Add a reminder to see it here."
              actionLabel="Create reminder"
              onAction={onOpenNewModal}
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((item) => (
                <GlassCard key={item._id} className="p-4 flex items-center gap-4"
                  style={{ transition: 'all 0.2s ease' }}>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-bold text-sm text-white truncate">{item.title}</span>
                      <Badge variant="indigo" size="xs">{getRelativeTime(item.dueAt)}</Badge>
                    </div>
                    {item.description && (
                      <p className="text-xs text-white/35 truncate mb-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                      <Clock className="w-3 h-3 text-purple-400" />
                      <span>Due {formatDateTime(item.dueAt, user?.timezone)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickComplete(item._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full shrink-0 cursor-pointer transition-all active:scale-95"
                    style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.15)'}
                  >
                    <Check className="w-3.5 h-3.5" /> Done
                  </button>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Right: Progress ring + chart */}
        <div className="lg:col-span-4 space-y-5">
          {/* Completion ring */}
          <GlassCard className="p-6 text-center">
            <h4 className="text-sm font-display font-bold text-white mb-5">Completion Rate</h4>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="transparent" />
                <circle cx="64" cy="64" r={r} stroke="url(#ringGrad)" strokeWidth={stroke}
                  strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" fill="transparent"
                  className="transition-all duration-1000 ease-out" />
                <defs>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-extrabold gradient-text">{completionRate}%</span>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">done</span>
              </div>
            </div>
            <p className="text-xs text-white/30 mt-4">{completed} of {total} reminders completed</p>
          </GlassCard>

          {/* Recharts donut */}
          {total > 0 && (
            <GlassCard className="p-5 text-center">
              <h4 className="text-sm font-display font-bold text-white mb-3">Status Split</h4>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={5}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(17,14,46,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', fontSize: '12px', color: '#F1F0FA' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-5 text-xs text-white/35 pt-2 border-t border-white/[0.05]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" />Done ({completed})</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full border border-purple-500/40" />Pending ({pending})</span>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
