const jwt = require('jsonwebtoken');
const { Member } = require('../models');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }
    const existing = await Member.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const member = await Member.create({ name, email, password });
    const token = signToken(member.id);
    res.status(201).json({ success: true, token, member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }
    const member = await Member.findOne({ where: { email } });
    if (!member) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const valid = await member.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    const token = signToken(member.id);
    res.json({ success: true, token, member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// GET /api/members/me
const getMe = async (req, res) => {
  try {
    const member = await Member.findByPk(req.memberId);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    res.json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { register, login, getMe };
