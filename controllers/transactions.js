const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
// POST route creates a new budget item
router.post('/budget', async (req, res) => {
  const { description, amount, category } = req.body;
  let budget = new Budget({ description, amount, category });
  budget = await budget.save();
  res.send(budget);
});

// module.exports = router;
module.exports = mongoose.model('Transaction', transactionSchema);