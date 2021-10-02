import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';

//import { isAdmin, isAuth } from '../utils.js';
import {authMiddleware} from "../utils.js";
const categoryRouter = express.Router();

categoryRouter.post("/", authMiddleware,
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


  categoryRouter.get("/", authMiddleware,
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


  categoryRouter.get("/:id", authMiddleware,
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


  categoryRouter.put("/:id", authMiddleware,
expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        {
          title: req.body.title,
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


categoryRouter.delete("/:id", authMiddleware,
expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
  
      res.json(category);
    } catch (error) {
      res.json(error);
    }
  }));

export default categoryRouter;