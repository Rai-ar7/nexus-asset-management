const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Laptop', 'Monitor', 'Printer', 'Server', 'Other'], required: true },
  serialNumber: { type: String, unique: true, required: true },
  purchaseDate: { type: Date },
  status: { type: String, enum: ['Available', 'Assigned', 'Repair'], default: 'Available' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Asset', assetSchema);
