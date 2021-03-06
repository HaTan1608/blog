import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';
import categoryRouter from './routers/categoryRouter.js';
import commentRouter from './routers/commentRouter.js';
import emailMsgRouter from './routers/emailMsgRouter.js';
import postRouter from './routers/postRouter.js';
import path from 'path';
import uploadRouter from './routers/uploadRouter.js';
import dotenv from 'dotenv';
import { errorHandler, notFound } from "./utils.js";
import cors from 'cors'
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
var url = "mongodb+srv://amazona:8365598a@cluster0.fdtaq.mongodb.net/blogapp?authSource=admin&replicaSet=atlas-55bbid-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
mongoose.connect(url, function (err) {
  if (err) throw err;
  console.log("Database created!");
});

app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/category', categoryRouter)
app.use('/api/comments', commentRouter);
app.use('/api/email', emailMsgRouter);
app.use('/api/posts', postRouter);
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/frontend/build/index.html')))
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});