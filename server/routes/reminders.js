const router = require('express').Router();
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const { sendTestEmail } = require('../services/mailer');

router.use(auth);

const calcRemindAt = (dueAt, mins) => new Date(new Date(dueAt).getTime() - mins * 60000);

// Create a reminder
router.post('/', async (req, res) => {
  try {
    const { title, description, dueAt, notifyBefore = 10 } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!dueAt || isNaN(new Date(dueAt).getTime())) {
      return res.status(400).json({ message: 'Valid due date is required' });
    }

    const numericNotifyBefore = Number(notifyBefore) || 0;
    const r = await Reminder.create({
      user: req.userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      dueAt: new Date(dueAt),
      notifyBefore: numericNotifyBefore,
      remindAt: calcRemindAt(dueAt, numericNotifyBefore),
    });

    res.status(201).json(r);
  } catch (err) {
    console.error('[Reminders] Create error:', err.message);
    res.status(500).json({ message: 'Failed to create reminder' });
  }
});

// List reminders with optional status filter
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const q = { user: req.userId };

    if (req.query.filter === 'upcoming') {
      Object.assign(q, { status: 'pending', dueAt: { $gte: now } });
    } else if (req.query.filter === 'overdue') {
      Object.assign(q, { status: 'pending', dueAt: { $lt: now } });
    } else if (req.query.filter === 'completed') {
      q.status = 'completed';
    }

    const reminders = await Reminder.find(q).sort({ dueAt: 1 });
    res.json(reminders);
  } catch (err) {
    console.error('[Reminders] List error:', err.message);
    res.status(500).json({ message: 'Failed to retrieve reminders' });
  }
});

// Protected route to test email setup (registered BEFORE /:id to prevent shadowing)
router.post('/test-email', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await sendTestEmail(user);
    res.json({ message: `Test email sent successfully to ${user.email}` });
  } catch (err) {
    console.error('[Reminders] Test email error:', err.message);
    res.status(500).json({ message: `Failed to send test email: ${err.message}` });
  }
});

// Get single reminder
router.get('/:id', async (req, res) => {
  try {
    const r = await Reminder.findOne({ _id: req.params.id, user: req.userId });
    if (!r) return res.status(404).json({ message: 'Reminder not found' });
    res.json(r);
  } catch (err) {
    console.error('[Reminders] Get single error:', err.message);
    res.status(500).json({ message: 'Failed to get reminder' });
  }
});

// Update a reminder
router.put('/:id', async (req, res) => {
  try {
    const r = await Reminder.findOne({ _id: req.params.id, user: req.userId });
    if (!r) return res.status(404).json({ message: 'Reminder not found' });

    const { title, description, dueAt, notifyBefore, status } = req.body;
    if (title !== undefined) r.title = title.trim();
    if (description !== undefined) r.description = description.trim();
    if (dueAt) r.dueAt = new Date(dueAt);
    if (notifyBefore !== undefined) r.notifyBefore = Number(notifyBefore);

    if (status && ['pending', 'completed'].includes(status)) {
      r.status = status;
      if (status === 'pending' && r.dueAt > new Date()) {
        r.emailSent = false;
      }
    }

    if (r.isModified('dueAt') || r.isModified('notifyBefore')) {
      r.remindAt = calcRemindAt(r.dueAt, r.notifyBefore);
      r.emailSent = false;
    }

    await r.save();
    res.json(r);
  } catch (err) {
    console.error('[Reminders] Update error:', err.message);
    res.status(500).json({ message: 'Failed to update reminder' });
  }
});

// Mark as completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const r = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status: 'completed' },
      { new: true }
    );
    if (!r) return res.status(404).json({ message: 'Reminder not found' });
    res.json(r);
  } catch (err) {
    console.error('[Reminders] Complete error:', err.message);
    res.status(500).json({ message: 'Failed to mark reminder completed' });
  }
});

// Toggle status between completed and pending
router.patch('/:id/toggle', async (req, res) => {
  try {
    const existing = await Reminder.findOne({ _id: req.params.id, user: req.userId });
    if (!existing) return res.status(404).json({ message: 'Reminder not found' });

    const newStatus = existing.status === 'completed' ? 'pending' : 'completed';
    existing.status = newStatus;
    if (newStatus === 'pending' && existing.dueAt > new Date()) {
      existing.emailSent = false;
    }
    await existing.save();
    res.json(existing);
  } catch (err) {
    console.error('[Reminders] Toggle error:', err.message);
    res.status(500).json({ message: 'Failed to toggle reminder status' });
  }
});

// Delete reminder
router.delete('/:id', async (req, res) => {
  try {
    const r = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!r) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted successfully' });
  } catch (err) {
    console.error('[Reminders] Delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete reminder' });
  }
});

module.exports = router;
