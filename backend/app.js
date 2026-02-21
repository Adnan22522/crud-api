import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRoute.js';
import loginRoute from './routes/loginRoute.js';
import Auth from './middlewares/authMiddleware.js';
import cors from 'cors';
const app = express();

app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/api-crud')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());

app.use('/api', loginRoute);

app.use(Auth);
app.use('/api', userRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});