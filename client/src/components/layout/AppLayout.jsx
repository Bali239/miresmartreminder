import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ReminderModal from '../reminders/ReminderModal';
import { remindersApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth();

  const handleCreateReminder = async (data) => {
    try {
      await remindersApi.createReminder(data);
      addToast('Reminder created — email notification queued!');
      window.dispatchEvent(new CustomEvent('remindly:refetch'));
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create reminder', 'error');
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: '#08061A' }}>
      {/* Ambient background orbs */}
      <div className="orb orb-purple" style={{ top: '5%', left: '15%', opacity: 0.18 }} />
      <div className="orb orb-indigo" style={{ bottom: '10%', right: '10%', opacity: 0.14 }} />

      <Sidebar
        onOpenNewModal={() => setIsNewModalOpen(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen relative z-10">
        <Topbar
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenNewModal={() => setIsNewModalOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-fade-up">
          <Outlet context={{ onOpenNewModal: () => setIsNewModalOpen(true) }} />
        </main>
      </div>

      <ReminderModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateReminder}
        timezone={user?.timezone}
      />
    </div>
  );
};

export default AppLayout;
