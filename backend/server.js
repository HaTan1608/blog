import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import userRoutes from "./route/users/usersRoute.js";
import {errorHandler, notFound } from "./middlewares/error/errorHandler.js";
import postRoute from "./route/posts/postRoute.js";
import commentRoutes from "./route/comments/commentRoute.js";
import emailMsgRoute from "./route/emailMsg/emailMsgRoute.js";
import categoryRoute from "./route/category/categoryRoute.js";

import mongoose from 'mongoose';
const app = express();

//Middleware
app.use(express.json());
//cors
app.use(cors());
app.use(express.urlencoded({ extended: true }));
var url = "mongodb+srv://amazona:8365598a@cluster0.fdtaq.mongodb.net/fshop?authSource=admin&replicaSet=atlas-55bbid-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

try{
    mongoose.connect(url,{
      
        useUnifiedTopology:true,
        useNewUrlParser:true,
    });
    console.log('Data connected')
}catch(error){
    console.log(error.message)
}
app.get("/", (req, res) => {
  res.json({ msg: "API for blog Application..." });
});
//Users route
app.use("/api/users", userRoutes);
//Post route
app.use("/api/posts", postRoute);
//comment routes
app.use("/api/comments", commentRoutes);
//email msg
app.use("/api/email", emailMsgRoute);
//category route
app.use("/api/category", categoryRoute);
//err handler
app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));