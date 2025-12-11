import express from "express";
import {
  adminRoute,
  authRoute,
} from "../middleware/authenticatedRouteMiddleware.js";
import { handlerCreateCharacter } from "../handlers/handlerCreateCharacter.js";
import upload from "../middleware/uploadMiddleware.js";
import { handlerUpdateCharacter } from "../handlers/handlerUpdateCharacter.js";
import {
  handlerGetAllCharacters,
  handlerGetCharacters,
  handlerGetCharacter,
  handlerGetAllCharacterByID,
} from "../handlers/handlerGetCharacters.js";
import { handlerDeleteCharacter } from "../handlers/handlerDeleteCharacter.js";
import { handlerCreateVectorDataStore } from "../handlers/handlerCreateVectorDataStore.js";
import { handlerUpdateVectorDataStore } from "../handlers/handlerUpdateVectoreDataStore.js";
import { handlerDeleteVectorDataStore } from "../handlers/handlerDeleteVectorDataStore.js";
import { handlerGetVectorDataStore } from "../handlers/handlerGetVectorDataStore.js";

const router = express.Router();

// General access to character info
router.get("/", handlerGetCharacters);

router.get("/all", authRoute, adminRoute, handlerGetAllCharacters);

router.get(
  "/all/:characterID",
  authRoute,
  adminRoute,
  handlerGetAllCharacterByID
);

router.get("/:characterID", handlerGetCharacter);

router.post(
  "/",
  authRoute,
  adminRoute,
  upload.single("avatar"),
  handlerCreateCharacter
);

router.put(
  "/:id",
  authRoute,
  adminRoute,
  upload.fields([
    { name: "avatar", maxCount: 1, optional: true },
    { name: "backgroundImage", maxCount: 1, optional: true },
  ]),
  handlerUpdateCharacter
);

router.delete("/:id", authRoute, adminRoute, handlerDeleteCharacter);

// Hnadles the vector data stores for a character

router.get(
  "/:characterID/data",
  authRoute,
  adminRoute,
  handlerGetVectorDataStore
);

router.post(
  "/:characterID/data",
  authRoute,
  adminRoute,
  handlerCreateVectorDataStore
);

router.put(
  "/:characterID/data/:dataVectorStoreId",
  authRoute,
  adminRoute,
  handlerUpdateVectorDataStore
);

router.delete(
  "/:characterID/data/:dataVectorStoreId",
  authRoute,
  adminRoute,
  handlerDeleteVectorDataStore
);

export default router;
