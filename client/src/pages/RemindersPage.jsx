import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Search,
  ArrowUpDown,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { remindersApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isOverdue } from '../utils/date';
import ReminderCard from '../components/reminders/ReminderCard';
import ReminderModal from '../components/reminders/ReminderModal';
import DeleteConfirmModal from '../components/reminders/DeleteConfirmModal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/Skeleton';

export const RemindersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'all';

  const { onOpenNewModal } = useOutletContext();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Modal states for edit and delete
  const [editingReminder, setEditingReminder] = useState(null);
  const [deletingReminder, setDeletingReminder] = useState(null);

  const fetchReminders = useCallback(async () => {
    try {
      const data = await remindersApi.getReminders();
      setReminders(data);
    } catch (err) {
      console.error('Failed to load reminders:', err);
      addToast('Failed to load reminders', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchReminders();

    const handleRefetch = () => {
      fetchReminders();
    };
    window.addEventListener('remindly:refetch', handleRefetch);
    return () => window.removeEventListener('remindly:refetch', handleRefetch);
  }, [fetchReminders]);

  // Tab counts calculation
  const counts = useMemo(() => {
    let upcomingCount = 0;
    let overdueCount = 0;
    let completedCount = 0;

    reminders.forEach((r) => {
      if (r.status === 'completed') {
        completedCount++;
      } else if (isOverdue(r.dueAt, r.status)) {
        overdueCount++;
      } else {
        upcomingCount++;
      }
    });

    return {
      all: reminders.length,
      upcoming: upcomingCount,
      overdue: overdueCount,
      completed: completedCount,
    };
  }, [reminders]);

  // Filtered and sorted list
  const displayedReminders = useMemo(() => {
    let list = reminders;

    // Filter by tab
    if (currentFilter === 'upcoming') {
      list = list.filter((r) => r.status === 'pending' && !isOverdue(r.dueAt, r.status));
    } else if (currentFilter === 'overdue') {
      list = list.filter((r) => r.status === 'pending' && isOverdue(r.dueAt, r.status));
    } else if (currentFilter === 'completed') {
      list = list.filter((r) => r.status === 'completed');
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    // Sort by dueAt
    return [...list].sort((a, b) => {
      const dateA = new Date(a.dueAt).getTime();
      const dateB = new Date(b.dueAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [reminders, currentFilter, searchQuery, sortOrder]);

  const handleTabChange = (filterKey) => {
    setSearchParams(filterKey === 'all' ? {} : { filter: filterKey });
  };

  // Status toggle with optimistic updates
  const handleToggle = async (id) => {
    const original = [...reminders];
    const target = reminders.find((r) => r._id === id);
    if (!target) return;

    const nextStatus = target.status === 'completed' ? 'pending' : 'completed';

    setReminders((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: nextStatus } : r))
    );

    try {
      await remindersApi.toggleReminder(id);
      addToast(nextStatus === 'completed' ? 'Reminder completed!' : 'Reminder reopened!');
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setReminders(original);
      addToast('Failed to update status', 'error');
    }
  };

  const handleComplete = async (id) => {
    const original = [...reminders];
    setReminders((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: 'completed' } : r))
    );

    try {
      await remindersApi.completeReminder(id);
      addToast('Reminder marked as completed');
    } catch (err) {
      console.error('Failed to complete reminder:', err);
      setReminders(original);
      addToast('Failed to complete reminder', 'error');
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingReminder) return;
    const id = editingReminder._id;
    const original = [...reminders];

    setReminders((prev) =>
      prev.map((r) => (r._id === id ? { ...r, ...formData } : r))
    );

    try {
      const updated = await remindersApi.updateReminder(id, formData);
      setReminders((prev) => prev.map((r) => (r._id === id ? updated : r)));
      addToast('Reminder updated successfully');
    } catch (err) {
      setReminders(original);
      addToast('Failed to update reminder', 'error');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    const original = [...reminders];
    setReminders((prev) => prev.filter((r) => r._id !== id));

    try {
      await remindersApi.deleteReminder(id);
      addToast('Reminder deleted successfully');
    } catch (err) {
      setReminders(original);
      addToast('Failed to delete reminder', 'error');
      throw err;
    }
  };

  const tabs = [
    { key: 'all', label: 'All', count: counts.all, icon: Layers },
    { key: 'upcoming', label: 'Upcoming', count: counts.upcoming, icon: Clock },
    { key: 'overdue', label: 'Overdue', count: counts.overdue, icon: AlertTriangle },
    { key: 'completed', label: 'Completed', count: counts.completed, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Reminders
          </h2>
          <p className="text-sm text-white/40 mt-0.5">
            Manage your schedule, track upcoming alerts, and mark tasks done.
          </p>
        </div>

        <Button
          onClick={onOpenNewModal}
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          className="shadow-sm self-start sm:self-auto"
        >
          New reminder
        </Button>
      </div>

      {/* Tabs and Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Navigation Tabs */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-2xl overflow-x-auto max-w-full"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'gradient-btn text-white shadow-xs'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : tab.key === 'overdue' && tab.count > 0
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/[0.08] text-white/50'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reminders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass text-[#F1F0FA] placeholder:text-white/25 text-xs sm:text-sm rounded-xl pl-9 pr-3.5 py-2 transition-all outline-none focus-ring focus:border-purple-500/50"
            />
          </div>

          {/* Sort Button */}
          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="flex items-center gap-1.5 px-3 py-2 glass hover:border-purple-400/40 text-xs font-semibold text-white rounded-xl transition-all shadow-xs cursor-pointer"
            title={`Sort by due date (${sortOrder === 'asc' ? 'Earliest first' : 'Latest first'})`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">
              {sortOrder === 'asc' ? 'Earliest' : 'Latest'}
            </span>
          </button>
        </div>
      </div>

      {/* Reminder Cards List */}
      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : displayedReminders.length === 0 ? (
        <EmptyState
          title={
            searchQuery
              ? 'No matching reminders'
              : currentFilter === 'overdue'
              ? 'No overdue reminders!'
              : currentFilter === 'completed'
              ? 'No completed reminders yet'
              : 'No reminders in this view'
          }
          description={
            searchQuery
              ? `We couldn't find anything matching "${searchQuery}". Try a different keyword.`
              : currentFilter === 'overdue'
              ? 'You are completely on schedule. No missed deadlines here.'
              : 'Add your tasks and Mira will notify you before they are due.'
          }
          actionLabel={searchQuery ? 'Clear Search' : 'Create a reminder'}
          onAction={searchQuery ? () => setSearchQuery('') : onOpenNewModal}
        />
      ) : (
        <div className="space-y-3.5">
          {displayedReminders.map((reminder) => (
            <ReminderCard
              key={reminder._id}
              reminder={reminder}
              onComplete={handleComplete}
              onToggle={handleToggle}
              onEdit={(r) => setEditingReminder(r)}
              onDelete={(r) => setDeletingReminder(r)}
              timezone={user?.timezone}
            />
          ))}
        </div>
      )}

      {/* Edit Reminder Modal */}
      <ReminderModal
        isOpen={!!editingReminder}
        onClose={() => setEditingReminder(null)}
        onSubmit={handleUpdate}
        reminderToEdit={editingReminder}
        timezone={user?.timezone}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingReminder}
        onClose={() => setDeletingReminder(null)}
        onConfirm={handleDelete}
        reminder={deletingReminder}
      />
    </div>
  );
};

export default RemindersPage;
