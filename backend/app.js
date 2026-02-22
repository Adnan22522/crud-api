import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRoute.js';
import loginRoute from './routes/loginRoute.js';
import Auth from './middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import cors from 'cors';
const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/api-crud')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const limiter = rateLimit({
  windowMs: 1000 * 20, // 20 seconds
  limit: 5, // 5 requests
  message: 'Too many requests, please try again later.'
});

const limiter2 = slowDown({
  windowMs: 1000 * 60,
  delayAfter: 5,
  delayMs: (hits) => hits * 1000, // hits is the number of requests made after the limit is reached.
});

// app.use(limiter);
app.use(limiter2);
app.use(cors());
app.use(express.json());
app.use('/api', loginRoute);
app.use(Auth);


app.use('/api', userRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});