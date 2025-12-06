import express from "express";
import { authRoute } from "../middleware/authenticatedRouteMiddleware.js";
import { handlerCreateChat } from "../handlers/handlerCreateChat.js";
import { handlerUpdateChat } from "../handlers/handlerUpdateChat.js";
import { handlerDeleteChat } from "../handlers/handlerDeleteChat.js";
import { handlerSendChatMessage } from "../handlers/handlerSendChatMessage.js";
import {
  handlerGetChat,
  handlerGetAllChats,
} from "../handlers/handlerGetChat.js";

const router = express.Router();

router.post("/", authRoute, handlerCreateChat);

router.put("/:chatID", authRoute, handlerUpdateChat);

router.delete("/:chatID", authRoute, handlerDeleteChat);

router.post("/:chatID", authRoute, handlerSendChatMessage);

router.get("/:chatID", authRoute, handlerGetChat);

router.get("/", authRoute, handlerGetAllChats);

export default router;
