const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const { sendReminderEmail } = require('../services/mailer');

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    // Find candidate pending reminders ready for notification
    const due = await Reminder.find({
      status: 'pending',
      emailSent: false,
      remindAt: { $lte: now },
    }).select('_id');

    for (const { _id } of due) {
      // Atomic claim ensures only one process/worker sends the email and prevents duplicate sends
      const r = await Reminder.findOneAndUpdate(
        { _id, emailSent: false },
        { emailSent: true },
        { new: true }
      ).populate('user', 'email name timezone');

      if (!r) continue;

      try {
        await sendReminderEmail(r);
        console.log(`[ReminderJob] Successfully sent reminder email for reminder ID: ${_id}`);
      } catch (err) {
        // Reset emailSent back to false so it retries on next scheduled run
        await Reminder.updateOne({ _id }, { emailSent: false });
        console.error(`[ReminderJob] Failed to send email for reminder ID: ${_id}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[ReminderJob] Cron execution error:', err.message);
  }
});