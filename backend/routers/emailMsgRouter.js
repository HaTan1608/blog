import express from "express";
import {authMiddleware} from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import sgMail from "@sendgrid/mail";
import Filter from "bad-words";
import EmailMsg from"../models/emailMsgModel.js";

const emailMsgRouter = express.Router();
emailMsgRouter.post("/", authMiddleware,
expressAsyncHandler(async (req, res) => {
    const { to, subject, message } = req.body;
    //get the message
    const emailMessage = subject + " " + message;
    //prevent profanity/bad words
    const filter = new Filter();
  
    const isProfane = filter.isProfane(emailMessage);
    if (isProfane)
      throw new Error("Email sent failed, because it contains profane words.");
    try {
      //buld up msg
      const msg = {
        to,
        subject,
        text: message,
        from: "twentekghana@gmail.com",
      };
      //send msg
      await sgMail.send(msg);
      //save to our db
      await EmailMsg.create({
        sentBy: req.user._id,
        from: req.user.email,
        to,
        message,
        subject,
      });
      res.json("Mail sent");
    } catch (error) {
      res.json(error);
    }
  }));

export default emailMsgRouter;
