import express from "express";
import Category from '../../model/category/Category.js';

import expressAsyncHandler from "express-async-handler";
import {authMiddleware} from "../../middlewares/auth/authMiddleware.js";


const categoryRoute = express.Router();
categoryRoute.post(
  "/",
  authMiddleware, 
  expressAsyncHandler(async (req, res) => {
    try {
      const category = await Category.create({
        user: req.user._id,
        title: req.body.title,
      });
      res.json(category);
    } catch (error) {
      res.json(error);
    }
  }));
categoryRoute.get("/", authMiddleware,
expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("user")
      .sort("-createdAt");
    res.json(categories);
  } catch (error) {
    res.json(error);
  }
}));
categoryRoute.get("/:id", authMiddleware,
expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id)
      .populate("user")
      .sort("-createdAt");
    res.json(category);
  } catch (error) {
    res.json(error);
  }
}));
categoryRoute.put("/:id", authMiddleware, expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(category);
  } catch (error) {
    res.json(error);
  }
}));
categoryRoute.delete("/:id", authMiddleware, expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);

    res.json(category);
  } catch (error) {
    res.json(error);
  }
}));
export default categoryRoute;
