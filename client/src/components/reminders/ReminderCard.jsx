import React from 'react';
import { Calendar, Clock, Mail, Bell, Check, Edit2, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDateTime, getRelativeTime, isOverdue, getNotifyBeforeLabel, getUserTimezone } from '../../utils/date';

export const ReminderCard = ({
  reminder,
  onComplete,
  onToggle,
  onEdit,
  onDelete,
  timezone = getUserTimezone(),
}) => {
  const { _id, title, description, dueAt, notifyBefore, status, emailSent } = reminder;
  const overdue = isOverdue(dueAt, status);
  const completed = status === 'completed';
  const relTime = getRelativeTime(dueAt);

  const borderColor = overdue
    ? 'rgba(245, 158, 11, 0.4)'
    : completed
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(139, 92, 246, 0.15)';

  const bgColor = overdue
    ? 'rgba(245, 158, 11, 0.04)'
    : completed
    ? 'rgba(255,255,255,0.02)'
    : 'rgba(139, 92, 246, 0.06)';

  const handleStatusClick = () => {
    if (onToggle) {
      onToggle(_id);
    } else if (!completed && onComplete) {
      onComplete(_id);
    }
  };

  return (
    <div
      className="relative rounded-2xl p-5 sm:p-6 transition-all duration-300 group overflow-hidden"
      style={{
        background: bgColor,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${borderColor}`,
        borderLeft: overdue ? '3px solid rgba(245, 158, 11, 0.7)' : undefined,
        boxShadow: overdue ? '0 0 30px rgba(245,158,11,0.06)' : '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {completed ? (
              <Badge variant="completed" size="xs">
                <Check className="w-3 h-3" /> Done
              </Badge>
            ) : overdue ? (
              <Badge variant="amber" size="xs">
                <Clock className="w-3 h-3" /> Overdue · {relTime}
              </Badge>
            ) : (
              <Badge variant="purple" size="xs">
                <Clock className="w-3 h-3" /> {relTime}
              </Badge>
            )}

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/35 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.07]">
              <Bell className="w-3 h-3 text-purple-400" />
              {getNotifyBeforeLabel(notifyBefore)}
            </span>

            {emailSent && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                <Mail className="w-3 h-3" /> Email sent
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-base sm:text-lg font-display font-bold mb-1.5 transition-all ${
              completed ? 'line-through text-white/30' : 'text-white'
            }`}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p
              className={`text-sm leading-relaxed mb-3 line-clamp-2 ${
                completed ? 'line-through text-white/20' : 'text-white/45'
              }`}
            >
              {description}
            </p>
          )}

          {/* Date line */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-white/30">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Due {formatDateTime(dueAt, timezone)}</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 self-end sm:self-start shrink-0 pt-1 sm:pt-0">
          {!completed ? (
            <button
              type="button"
              onClick={handleStatusClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer active:scale-95"
              style={{
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#A78BFA',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.15)';
              }}
              title="Mark as completed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStatusClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer active:scale-95 text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10"
              title="Reopen reminder"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reopen</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(reminder)}
            className="p-2 text-white/25 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all cursor-pointer"
            aria-label="Edit"
            title="Edit reminder"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(reminder)}
            className="p-2 text-white/25 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
            aria-label="Delete"
            title="Delete reminder"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
