const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['income', 'expense'], required: true },
  title: String,
  amount: Number,
  category: String,
  date: Date
});

module.exports = mongoose.model('Expense', ExpenseSchema);