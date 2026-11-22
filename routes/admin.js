const express = require('express');
const User = require('../models/User');
const Note = require('../models/Note');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, requireRole('admin')); // RBAC: sirf admin

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.get('/notes', async (req, res) => {
  const notes = await Note.find().populate('owner', 'username email');
  res.json(notes);
});

module.exports = router;
