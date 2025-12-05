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
} from "../handlers/handlerGetCharacters.js";
import { handlerDeleteCharacter } from "../handlers/handlerDeleteCharacter.js";
import { handlerCreateVectorDataStore } from "../handlers/handlerCreateVectorDataStore.js";
import { handlerUpdateVectorDataStore } from "../handlers/handlerUpdateVectoreDataStore.js";
import { handlerDeleteVectorDataStore } from "../handlers/handlerDeleteVectorDataStore.js";

const router = express.Router();

// General access to character info
router.get("/", handlerGetCharacters);

// Authenticated and Admin routes below
router.get("/all", authRoute, adminRoute, handlerGetAllCharacters);

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
  upload.single("avatar"),
  handlerUpdateCharacter
);

router.delete("/:id", authRoute, adminRoute, handlerDeleteCharacter);

// Hnadles the vector data stores for a character
router.post("/:id/data", authRoute, adminRoute, handlerCreateVectorDataStore);

router.put(
  "/:id/data/:dataVectorStoreId",
  authRoute,
  adminRoute,
  handlerUpdateVectorDataStore
);

router.delete(
  "/:id/data/:dataVectorStoreId",
  authRoute,
  adminRoute,
  handlerDeleteVectorDataStore
);

export default router;
