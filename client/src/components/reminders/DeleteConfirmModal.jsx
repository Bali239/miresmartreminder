import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Trash2, AlertTriangle } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, reminder }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!reminder) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try { await onConfirm(reminder._id); onClose(); }
    finally { setIsDeleting(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" title="Delete Reminder">
      <div className="space-y-5">
        <div
          className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-white mb-0.5">This action is permanent</p>
            <p className="text-white/40 text-xs leading-relaxed">
              "<span className="text-white/60">{reminder.title}</span>" will be permanently deleted and any pending email notifications will be cancelled.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isDeleting}>Cancel</Button>
          <Button type="button" variant="danger" onClick={handleDelete} loading={isDeleting} icon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
