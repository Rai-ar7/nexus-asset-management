const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ['Active', 'Returned'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
