const express = require('express');
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');
const router = express.Router();

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json('No token provided');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json('Failed to authenticate');
    req.userId = decoded.id;
    next();
  });
}

// Create a new expense
router.post('/', verifyToken, async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, userId: req.userId });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all expenses for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    res.json(expenses);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update an expense
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json('Expense not found');
    res.json(expense);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete an expense
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json('Expense not found');
    res.json('Expense deleted successfully');
  } catch (err) {
    console.error("Expense POST error:", err);
    res.status(500).json(err);
  }
});

module.exports = router;