import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var url = "mongodb+srv://amazona:8365598a@cluster0.fdtaq.mongodb.net/fshop?authSource=admin&replicaSet=atlas-55bbid-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
mongoose.connect(url, function (err) {
  if (err) throw err;
  console.log("Database created!");
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/frontend/build/index.html')))
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});