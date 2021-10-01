import express from "express";
import {authMiddleware} from "../../middlewares/auth/authMiddleware.js";
import expressAsyncHandler from "express-async-handler";
import sgMail from "@sendgrid/mail";
import Filter from "bad-words";
import EmailMsg from "../../model/EmailMessaging/EmailMessaging.js";

const emailMsgRoute = express.Router();


export default emailMsgRoute;
