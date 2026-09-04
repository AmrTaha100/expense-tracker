const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// @route GET /api/expenses
// Supports optional query params: category, month (1-12), year
exports.getExpenses = async (req, res) => {
  try {
    const filter = { user: req.user.id };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.month && req.query.year) {
      const month = parseInt(req.query.month) - 1;
      const year = parseInt(req.query.year);
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ message: 'Amount and category are required' });
    }

    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      note,
      date: date || Date.now(),
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const { amount, category, note, date } = req.body;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (note !== undefined) expense.note = note;
    if (date !== undefined) expense.date = date;

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route GET /api/expenses/stats
// Returns total spending grouped by category (for charts)
exports.getStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
