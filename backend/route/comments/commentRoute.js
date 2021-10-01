import express from 'express';
import {authMiddleware} from "../../middlewares/auth/authMiddleware.js";
import expressAsyncHandler from "express-async-handler";
import Comment from "../../model/comment/Comment.js";
import {blockUser} from "../../utils/blockUser.js";
import {validateMongodbId} from "../../utils/validateMongodbID.js";
const commentRoutes = express.Router();

export default commentRoutes;
