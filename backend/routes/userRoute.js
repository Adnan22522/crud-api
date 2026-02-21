import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';


const router = express.Router();
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    if(users) return res.json(users);
  } catch (err) {    res.status(500).json({ message: err.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { password } = req.body;
    const hashPass = await bcrypt.hash(password, 10);
    req.body.password = hashPass;
    const users = await User.find({'email': req.body.email});
    if(users.length > 0) return res.status(400).json({ message: 'User already exists' });
    const newUser = await User.create(req.body);
    if(newUser) return res.json(newUser);
  } catch (err) {    res.status(500).json({ message: err.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(user) return res.json(user);
  } catch (err) {    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // This will now instantly return the freshly updated record!
    return res.json(user); 
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if(user) return res.json({ message: 'User deleted' });
  } catch (err) {    res.status(500).json({ message: err.message });
  }
});

export default router;