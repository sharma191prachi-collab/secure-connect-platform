const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const { verifyToken } = require('../middleware/auth');
const appEvents = require('../events/appEvents');

const router = express.Router();
router.use(verifyToken); // saare notes routes protected hain

const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid note id' });
  }
  next();
};

// CREATE
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body || {};
    if (!title || !content) return res.status(400).json({ message: 'title and content are required' });

    const note = await Note.create({ title, content, owner: req.user.id });
    appEvents.emit('note:created', note);
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// READ ALL (sirf apne notes)
router.get('/', async (req, res) => {
  const notes = await Note.find({ owner: req.user.id }).sort({ createdAt: 1 });
  res.json(notes);
});

// READ ONE
router.get('/:id', validId, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user.id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// UPDATE
router.put('/:id', validId, async (req, res) => {
  const { title, content } = req.body || {};
  const update = {};
  if (title) update.title = title;
  if (content) update.content = content;

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    update,
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  appEvents.emit('note:updated', note);
  res.json(note);
});

// DELETE
router.delete('/:id', validId, async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  appEvents.emit('note:deleted', note);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
