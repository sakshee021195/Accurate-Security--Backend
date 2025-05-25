const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const FormData = require('../models/FormData');

// Submit form data
router.post('/submit', async (req, res) => {
    try {
      const formData = new FormData({
        ...req.body,
        dob: req.body.dob ? new Date(req.body.dob) : null,
        spouseDob: req.body.spouseDob ? new Date(req.body.spouseDob) : null,
        fromDate: req.body.fromDate ? new Date(req.body.fromDate) : null,
        toDate: req.body.toDate ? new Date(req.body.toDate) : null
      });
  
      const savedData = await formData.save();
      res.status(201).json({ success: true, data: savedData });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// Get all form submissions
router.get('/all', async (req, res) => {
    try {
      const forms = await FormData.find().sort({ createdAt: -1 });
      res.json(forms);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/user', auth, async (req, res) => {
    try {
      const forms = await FormData.find({ userId: req.user.id });
      res.json(forms);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.patch('/update/:id', async (req, res) => {
    try {
      const updated = await FormData.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return updated doc
        runValidators: true,
      });
  
      if (!updated) {
        return res.status(404).json({ message: 'Form not found' });
      }
  
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
    
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await FormData.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json({ success: true, message: 'Form deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;