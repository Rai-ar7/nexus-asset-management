const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');

// @route   GET api/assignments
// @desc    Get all assignments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('asset', ['name', 'serialNumber', 'category'])
      .populate('employee', ['name', 'email', 'department']);
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/assignments
// @desc    Create new assignment
// @access  Private
router.post('/', auth, async (req, res) => {
  const { asset: assetId, employee: employeeId, assignedDate, returnDate } = req.body;

  try {
    // Check if asset is available
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    if (asset.status !== 'Available') {
      return res.status(400).json({ message: 'Asset is not available for assignment' });
    }

    const newAssignment = new Assignment({
      asset: assetId,
      employee: employeeId,
      assignedDate,
      returnDate: returnDate || null,
      status: 'Active'
    });

    const assignment = await newAssignment.save();

    // Update asset status
    asset.status = 'Assigned';
    asset.assignedTo = employeeId;
    await asset.save();

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('asset', ['name', 'serialNumber', 'category'])
      .populate('employee', ['name', 'email', 'department']);

    res.json(populatedAssignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/assignments/:id/return
// @desc    Mark assignment as returned
// @access  Private
router.put('/:id/return', auth, async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    if (assignment.status === 'Returned') {
      return res.status(400).json({ message: 'Asset already returned' });
    }

    assignment.status = 'Returned';
    assignment.returnDate = new Date();
    await assignment.save();

    // Update asset back to available
    const asset = await Asset.findById(assignment.asset);
    if (asset) {
      asset.status = 'Available';
      asset.assignedTo = null;
      await asset.save();
    }

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('asset', ['name', 'serialNumber', 'category'])
      .populate('employee', ['name', 'email', 'department']);

    res.json(populatedAssignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
