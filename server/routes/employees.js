const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   GET api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const employees = await User.find({ role: 'Employee' }).select('-password');
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/employees
// @desc    Add new employee (admin creates employee)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, email, password, department, role } = req.body;
  const bcrypt = require('bcryptjs'); // inline since only used here for creation by admin

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Employee with email already exists' });
    }

    user = new User({
      name,
      email,
      password,
      department,
      role: role || 'Employee'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/employees/:id
// @desc    Update employee
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, department, role } = req.body;

  const empFields = {};
  if (name) empFields.name = name;
  if (email) empFields.email = email;
  if (department) empFields.department = department;
  if (role) empFields.role = role;

  try {
    let emp = await User.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    emp = await User.findByIdAndUpdate(
      req.params.id,
      { $set: empFields },
      { new: true }
    ).select('-password');

    res.json(emp);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/employees/:id
// @desc    Delete employee
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const emp = await User.findById(req.params.id);

    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
