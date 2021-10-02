import express from "express";
import {authMiddleware,blockUser,validateMongodbId} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Comment from "../models/commentModel.js";

const commentRouter = express.Router();

commentRouter.post("/", authMiddleware,
expressAsyncHandler(async (req, res) => {
    //1.Get the user
    const user = req.user;
    //Check if user is blocked
    blockUser(user);
    //2.Get the post Id
    const { postId, description } = req.body;
  
    try {
      const comment = await Comment.create({
        post: postId,
        user,
        description,
      });
      res.json(comment);
    } catch (error) {
      res.json(error);
    }
  })
);


commentRouter.get("/", authMiddleware, 
expressAsyncHandler(async (req, res) => {
    try {
      const comments = await Comment.find({}).sort("-created");
      res.json(comments);
    } catch (error) {
      res.json(error);
    }
  }));


  commentRouter.get("/:id", authMiddleware,
expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
      const comment = await Comment.findById(id);
      res.json(comment);
    } catch (error) {
      res.json(error);
    }
  }));


  commentRouter.put("/:id", authMiddleware,
expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
      const update = await Comment.findByIdAndUpdate(
        id,
        {
          user: req.user,
          description: req.body.description,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.json(update);
    } catch (error) {
      res.json(error);
    }
  }));


  commentRouter.delete("/:id", authMiddleware,
expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
      const comment = await Comment.findByIdAndDelete(id);
      res.json(comment);
    } catch (error) {
      res.json(error);
    }
  }));

 
export default commentRouter;
