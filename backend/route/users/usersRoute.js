   
import express from "express";
import expressAsyncHandler from "express-async-handler";
import sgMail from "@sendgrid/mail";
import fs from "fs";
import crypto from "crypto";
import {generateToken} from "../../config/token/generateToken.js";
import User from "../../model/user/User.js";
import {validateMongodbId} from "../../utils/validateMongodbID.js";
import {cloudinaryUploadImg} from "../../utils/cloudinary.js";
import {blockUser} from "../../utils/blockUser.js";
sgMail.setApiKey('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');
import {authMiddleware} from "../../middlewares/auth/authMiddleware.js";
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

const userRoutes = express.Router();
//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb) => {
  //check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    //rejected files
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

//Image Resizing
const profilePhotoResize = async (req, res, next) => {
  //check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};



export default userRoutes;