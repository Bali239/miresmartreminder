import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { toDatetimeLocal, getNotificationPreview, getUserTimezone } from '../../utils/date';
import { Bell, Calendar, Sparkles } from 'lucide-react';

const NOTIFY_OPTIONS = [
  { value: 0, label: 'At due time' },
  { value: 10, label: '10 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 1440, label: '1 day before' },
];

export const ReminderModal = ({ isOpen, onClose, onSubmit, reminderToEdit = null, timezone = getUserTimezone() }) => {
  const isEditing = !!reminderToEdit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueAtLocal, setDueAtLocal] = useState('');
  const [notifyBefore, setNotifyBefore] = useState(10);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minDateTime = toDatetimeLocal(new Date());

  useEffect(() => {
    if (isOpen) {
      if (reminderToEdit) {
        setTitle(reminderToEdit.title || '');
        setDescription(reminderToEdit.description || '');
        setDueAtLocal(toDatetimeLocal(reminderToEdit.dueAt) || '');
        setNotifyBefore(reminderToEdit.notifyBefore !== undefined ? reminderToEdit.notifyBefore : 10);
      } else {
        const d = new Date(Date.now() + 60 * 60 * 1000);
        setTitle('');
        setDescription('');
        setDueAtLocal(toDatetimeLocal(d));
        setNotifyBefore(10);
      }
      setErrors({});
    }
  }, [isOpen, reminderToEdit]);

  const notificationPreview = getNotificationPreview(dueAtLocal, notifyBefore, timezone);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!dueAtLocal) {
      errs.dueAt = 'Due date is required';
    } else if (!isEditing && new Date(dueAtLocal).getTime() < Date.now()) {
      errs.dueAt = 'Due date cannot be in the past';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        dueAt: new Date(dueAtLocal).toISOString(),
        notifyBefore: Number(notifyBefore),
      });
      onClose();
    } catch (err) {
      setErrors((p) => ({ ...p, form: err.response?.data?.message || err.message || 'Failed to save' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Reminder' : 'New Reminder'}
      subtitle={isEditing ? 'Update the details below.' : 'Set it and forget it — Mira handles the rest.'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.form && (
          <div className="p-3.5 rounded-xl text-sm text-red-400 font-medium" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            {errors.form}
          </div>
        )}

        <Input
          label="Title *"
          placeholder="e.g., Doctor appointment, Pay rent, Submit report"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(p => ({ ...p, title: null })); }}
          error={errors.title}
          autoFocus
        />

        <div className="space-y-2 text-left">
          <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">Description (Optional)</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any notes, links, or extra context..."
            className="w-full glass text-[#F1F0FA] placeholder:text-white/25 text-sm rounded-2xl px-4 py-3 outline-none transition-all duration-200 resize-none focus:border-purple-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] hover:border-white/[0.14]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="datetime-local"
            label="Due Date & Time *"
            value={dueAtLocal}
            min={!isEditing ? minDateTime : undefined}
            onChange={(e) => { setDueAtLocal(e.target.value); if (errors.dueAt) setErrors(p => ({ ...p, dueAt: null })); }}
            error={errors.dueAt}
            leftElement={<Calendar className="w-4 h-4" />}
          />
          <Select
            label="Notify Me"
            value={notifyBefore}
            onChange={(e) => setNotifyBefore(Number(e.target.value))}
            options={NOTIFY_OPTIONS}
          />
        </div>

        {/* Live helper */}
        {notificationPreview && (
          <div
            className="p-3.5 rounded-xl flex items-center gap-3 text-xs font-semibold text-purple-300 animate-fade-up"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <Bell className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              You'll get an email on <strong className="text-purple-200">{notificationPreview}</strong>
            </span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.06]">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            icon={isEditing ? undefined : <Sparkles className="w-4 h-4" />}
          >
            {isEditing ? 'Save Changes' : 'Create Reminder'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReminderModal;
