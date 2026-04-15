const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Asset = require('../models/Asset');

// @route   GET api/assets
// @desc    Get all assets
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const assets = await Asset.find().populate('assignedTo', ['name', 'email']);
    res.json(assets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/assets
// @desc    Add new asset
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, category, serialNumber, purchaseDate, status } = req.body;

  try {
    const newAsset = new Asset({
      name,
      category,
      serialNumber,
      purchaseDate,
      status: status || 'Available'
    });

    const asset = await newAsset.save();
    res.json(asset);
  } catch (err) {
    console.error(err.message);
    if(err.code === 11000) {
      return res.status(400).json({ message: 'Serial Number already exists' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/assets/:id
// @desc    Update asset
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, category, serialNumber, purchaseDate, status, assignedTo } = req.body;

  const assetFields = {};
  if (name) assetFields.name = name;
  if (category) assetFields.category = category;
  if (serialNumber) assetFields.serialNumber = serialNumber;
  if (purchaseDate) assetFields.purchaseDate = purchaseDate;
  if (status) assetFields.status = status;
  if (assignedTo !== undefined) assetFields.assignedTo = assignedTo;

  try {
    let asset = await Asset.findById(req.params.id);

    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    asset = await Asset.findByIdAndUpdate(
      req.params.id,
      { $set: assetFields },
      { new: true }
    ).populate('assignedTo', ['name', 'email']);

    res.json(asset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/assets/:id
// @desc    Delete asset
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    await Asset.findByIdAndDelete(req.params.id);

    res.json({ message: 'Asset removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
