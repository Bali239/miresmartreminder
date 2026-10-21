import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Globe,
  Send,
  Shield,
  Clock,
  Info,
  Check,
  Save,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi, remindersApi } from '../api';
import { getUserTimezone } from '../utils/date';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Standard common timezones list
const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
];

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [selectedTimezone, setSelectedTimezone] = useState(
    user?.timezone || getUserTimezone()
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Sync state if user changes
  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.timezone) setSelectedTimezone(user.timezone);
  }, [user]);

  // Live time ticker in chosen timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        const str = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: selectedTimezone || 'UTC',
        }).format(new Date());
        setCurrentTimeStr(str);
      } catch {
        setCurrentTimeStr(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezone]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await authApi.updateProfile({
        name: name.trim(),
        timezone: selectedTimezone,
      });
      updateUser({ name: updated.name, timezone: updated.timezone });
      addToast('Profile & preferences updated successfully');
    } catch (err) {
      console.error('Update profile error:', err);
      const msg = err.response?.data?.message || 'Failed to update preferences';
      addToast(msg, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUseBrowserTimezone = () => {
    const tz = getUserTimezone();
    setSelectedTimezone(tz);
    addToast(`Set to browser timezone: ${tz}`);
  };

  const handleSendTestEmail = async () => {
    setSendingTest(true);
    try {
      const res = await remindersApi.sendTestEmail();
      addToast(res.message || `Test email dispatched successfully to ${user?.email}`);
    } catch (err) {
      console.error('Test email error:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to dispatch test email. Please check server SMTP configuration.';
      addToast(msg, 'error');
    } finally {
      setSendingTest(false);
    }
  };

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'ME';

  // Merge common timezones with user's active timezone if not already in list
  const timezoneOptions = Array.from(
    new Set([selectedTimezone, ...COMMON_TIMEZONES])
  ).filter(Boolean);

  return (
    <div className="space-y-8 max-w-4xl text-left">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
          Settings & Preferences
        </h2>
        <p className="text-sm text-white/40 mt-0.5">
          Manage your account profile, timezone details, and email delivery verification.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile & Timezone Form Card */}
        <form onSubmit={handleSaveProfile}>
          <Card padding="p-6 sm:p-8" className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/[0.06]">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                }}
              >
                {initials}
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white">
                  {user?.name || 'Account User'}
                </h3>
                <p className="text-xs text-white/40 flex items-center gap-1.5 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Verified Mira Account</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 flex items-center pointer-events-none text-white/30">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full glass text-[#F1F0FA] text-sm rounded-2xl pl-11 pr-4 py-3 outline-none focus-ring focus:border-purple-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Email field (read-only) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 flex items-center pointer-events-none text-white/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full glass opacity-60 cursor-not-allowed text-white/60 text-sm rounded-2xl pl-11 pr-4 py-3 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Timezone Configuration Sub-section */}
            <div className="pt-4 border-t border-white/[0.06] space-y-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                  }}
                >
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-base font-display font-bold text-white">
                    Time Zone Synchronization
                  </h4>
                  <p className="text-xs text-white/40 mt-0.5">
                    Reminders are stored in UTC and dispatched according to your configured timezone.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                    Preferred Timezone
                  </label>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    className="w-full glass text-[#F1F0FA] text-sm rounded-2xl px-4 py-3 outline-none focus-ring focus:border-purple-500/50 cursor-pointer"
                  >
                    {timezoneOptions.map((tz) => (
                      <option
                        key={tz}
                        value={tz}
                        style={{ background: '#110E2E', color: '#F1F0FA' }}
                      >
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:self-end">
                  <button
                    type="button"
                    onClick={handleUseBrowserTimezone}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-semibold text-purple-300 hover:text-white glass hover:border-purple-400/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Detect browser timezone ({getUserTimezone()})</span>
                  </button>
                </div>
              </div>

              {/* Timezone preview pill */}
              <div
                className="p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                style={{
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.18)',
                }}
              >
                <div className="flex items-center gap-2 text-white/60">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>
                    Current time in <strong className="text-white">{selectedTimezone}</strong>:
                  </span>
                </div>
                <span className="font-mono font-bold text-purple-300">
                  {currentTimeStr || 'Loading...'}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                loading={savingProfile}
                icon={<Save className="w-4 h-4" />}
              >
                Save Preferences
              </Button>
            </div>
          </Card>
        </form>

        {/* Email Verification & Test Card */}
        <Card padding="p-6 sm:p-8">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-start gap-3.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                }}
              >
                <Send className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white">
                  Email Notification System
                </h3>
                <p className="text-xs sm:text-sm text-white/40 mt-0.5">
                  Verify that your backend Nodemailer service is successfully dispatching emails to{' '}
                  <strong className="text-white">{user?.email}</strong>.
                </p>
              </div>
            </div>

            <Button
              onClick={handleSendTestEmail}
              loading={sendingTest}
              variant="primary"
              icon={<Send className="w-4 h-4" />}
              className="shrink-0 shadow-sm"
            >
              Send test email
            </Button>
          </div>

          <div
            className="p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed"
            style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.18)',
            }}
          >
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">How email delivery works:</span>
              <ul className="list-disc list-inside mt-1.5 space-y-1.5 text-white/50">
                <li>
                  Click the <strong>Send test email</strong> button above to verify your SMTP or HTTP API delivery right now.
                </li>
                <li>
                  In development with Mailtrap sandbox, visit your inbox at{' '}
                  <code className="text-purple-300">mailtrap.io</code> to inspect the email HTML preview.
                </li>
                <li>
                  To test automated reminders, create a reminder due in 2 minutes with "At due time". The server-side cron worker checks every 60 seconds and dispatches the alert automatically.
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
