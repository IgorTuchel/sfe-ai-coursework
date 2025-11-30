import express from "express";
import { handlerGetUser } from "../handlers/handlerGetUser.js";
import { handlerMakeUser } from "../handlers/handlerCreateUser.js";
import { handlerDeleteUser } from "../handlers/handlerDeleteUser.js";
import { handlerUpdateUser } from "../handlers/handlerUpdateUser.js";

const router = express.Router();

router.post("/", handlerMakeUser);

// Authenticated Routes

router.get("/", handlerGetUser);

router.put("/", handlerUpdateUser);

router.delete("/", handlerDeleteUser);

export default router;
