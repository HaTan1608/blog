import jwt from 'jsonwebtoken';
import expressAsyncHandler from "express-async-handler";
import User from "./models/userModel.js";
import cloudinary from "cloudinary";
import mongoose from 'mongoose';
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "20d" });
  };


export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
        jwt.verify(
            token,
            process.env.JWT_SECRET || 'somethingsecret',
            (err, decode) => {
                if (err) {
                    res.status(401).send({ message: 'Invalid Token' });
                } else {
                    req.user = decode;
                    next();
                }
            }
        );
    } else {
        res.status(401).send({ message: 'No Token' });
    }
};
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Admin Token' });
    }
};



export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
    let token;
  
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      try {
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_KEY);
          //find the user by id
          const user = await User.findById(decoded.id).select("-password");
          //attach the user to the request object
          req.user = user;
          next();
        }
      } catch (error) {
        throw new Error("Not authorized token expired, login again");
      }
    } else {
      throw new Error("There is no token attached to the header");
    }
  });
  

export  const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  //Err handler
 export  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  


     
export const blockUser = user => {
    if (user.isBlocked) {
      throw new Error(`Access Denied ${user.firstName} is blocked`);
    }
  };
  

 

cloudinary.config({
  cloud_name: 'tweneboah',
  api_key: '986451386744613',
  api_secret: 'GiusV0bSLrMqioANgP3H0j0dAL0',
});

export const cloudinaryUploadImg = async fileToUpload => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return {
      url: data.secure_url,
    };
  } catch (error) {
    return error;
  }
};

export const validateMongodbId = id => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("The id is not valid or found");
  };