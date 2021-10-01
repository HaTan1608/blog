import express from "express";
import Category from '../../model/category/Category.js';

import expressAsyncHandler from "express-async-handler";
import {authMiddleware} from "../../middlewares/auth/authMiddleware.js";


const categoryRoute = express.Router();

export default categoryRoute;
