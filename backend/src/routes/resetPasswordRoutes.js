import express from "express";
import {
  handlerResetPassword,
  handlerSendResetPasswordEmail,
} from "../handlers/handlerResetPassword.js";

const router = express.Router();

router.post("/", handlerSendResetPasswordEmail);

router.post("/:token", handlerResetPassword);

export default router;
