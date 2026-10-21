const router = require('express').Router();
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');

router.get('/', auth, async (req, res) => {
  try {
    const now = new Date();
    const u = req.userId;
    const [total, completed, overdue, upcoming] = await Promise.all([
      Reminder.countDocuments({ user: u }),
      Reminder.countDocuments({ user: u, status: 'completed' }),
      Reminder.countDocuments({ user: u, status: 'pending', dueAt: { $lt: now } }),
      Reminder.find({ user: u, status: 'pending', dueAt: { $gte: now } }).sort({ dueAt: 1 }).limit(5),
    ]);

    const pending = Math.max(0, total - completed);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      total,
      completed,
      overdue,
      pending,
      completionRate,
      upcoming,
    });
  } catch (err) {
    console.error('[Dashboard] Error fetching metrics:', err.message);
    res.status(500).json({ message: 'Failed to retrieve dashboard metrics' });
  }
});

module.exports = router;
