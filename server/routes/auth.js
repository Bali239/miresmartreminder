const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, timezone = 'UTC' } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || '',
      email: email.toLowerCase(),
      timezone: timezone || 'UTC',
      password: hashedPassword,
    });

    res.status(201).json({
      token: sign(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
      },
    });
  } catch (err) {
    console.error('[Auth] Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: sign(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        timezone: user.timezone || 'UTC',
      },
    });
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      timezone: user.timezone || 'UTC',
    });
  } catch (err) {
    console.error('[Auth] Me error:', err.message);
    res.status(500).json({ message: 'Failed to retrieve profile' });
  }
});

// Update profile (name and/or timezone)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, timezone } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (timezone !== undefined) updateData.timezone = timezone.trim();

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      timezone: user.timezone || 'UTC',
    });
  } catch (err) {
    console.error('[Auth] Profile update error:', err.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
