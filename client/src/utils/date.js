/**
 * Date and Time utilities for Remindly
 */

/**
 * Get current system timezone of user's browser
 */
export function getUserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Format a date string or timestamp in a readable format using specific timezone
 */
export function formatDateTime(date, timezone = getUserTimezone()) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

/**
 * Format date only (e.g., "Wednesday, Oct 21, 2026")
 */
export function formatDateOnly(date, timezone = getUserTimezone()) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: timezone,
    }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

/**
 * Format time only (e.g., "4:30 PM")
 */
export function formatTimeOnly(date, timezone = getUserTimezone()) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(d);
  } catch {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

/**
 * Calculate relative time from now (e.g., "in 3 hours", "in 10 minutes", "2 hours ago")
 */
export function getRelativeTime(targetDate) {
  if (!targetDate) return '';
  const target = new Date(targetDate).getTime();
  if (isNaN(target)) return '';

  const now = Date.now();
  const diffMs = target - now;
  const isPast = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const mins = Math.floor(absDiff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) {
    return isPast ? 'just now' : 'due in a moment';
  }

  if (mins < 60) {
    return isPast ? `${mins} min${mins === 1 ? '' : 's'} ago` : `in ${mins} min${mins === 1 ? '' : 's'}`;
  }

  if (hours < 24) {
    return isPast ? `${hours} hr${hours === 1 ? '' : 's'} ago` : `in ${hours} hr${hours === 1 ? '' : 's'}`;
  }

  if (days < 30) {
    return isPast ? `${days} day${days === 1 ? '' : 's'} ago` : `in ${days} day${days === 1 ? '' : 's'}`;
  }

  const months = Math.floor(days / 30);
  return isPast ? `${months} month${months === 1 ? '' : 's'} ago` : `in ${months} month${months === 1 ? '' : 's'}`;
}

/**
 * Check if a reminder is overdue
 */
export function isOverdue(dueAt, status) {
  if (status === 'completed') return false;
  return new Date(dueAt).getTime() < Date.now();
}

/**
 * Convert Date or ISO string to value suitable for <input type="datetime-local" />
 * Format: YYYY-MM-DDTHH:mm
 */
export function toDatetimeLocal(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Calculate expected notification time preview string
 */
export function getNotificationPreview(dueAtLocalValue, notifyBeforeMinutes, timezone = getUserTimezone()) {
  if (!dueAtLocalValue) return null;
  const dueDate = new Date(dueAtLocalValue);
  if (isNaN(dueDate.getTime())) return null;

  const notifyTimeMs = dueDate.getTime() - Number(notifyBeforeMinutes || 0) * 60000;
  const notifyDate = new Date(notifyTimeMs);

  return formatDateTime(notifyDate, timezone);
}

/**
 * Format notifyBefore minutes into friendly label
 */
export function getNotifyBeforeLabel(minutes) {
  const m = Number(minutes);
  if (m === 0) return 'At due time';
  if (m === 10) return '10 minutes before';
  if (m === 30) return '30 minutes before';
  if (m === 60) return '1 hour before';
  if (m === 1440) return '1 day before';
  if (m < 60) return `${m} mins before`;
  return `${Math.round(m / 60)} hrs before`;
}
