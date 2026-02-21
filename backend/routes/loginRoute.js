import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
const router = express.Router();
dotenv.config();


router.post('/register', async (req, res) => {
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


router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        
    if(!user) return res.status(500).json({message: 'User not found'});

    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if(!isMatch) return res.status(500).json({message: 'Invalid credentials'});
    const token = jwt.sign(
        {userId: user._id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: '120s'}
    )
    res.json({token});

    }catch(error){
        res.status(500).json({error: error.message});

    }
})

export default router;