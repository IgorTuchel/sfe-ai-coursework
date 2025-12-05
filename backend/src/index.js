import express from "express";
import cors from "cors";
import serviceStartup from "./config/startup.js";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import { uploadObjectToS3 } from "./services/putObjectS3.js";
import usersRouter from "./routes/userRoutes.js";
import resetPasswordRouter from "./routes/resetPasswordRoutes.js";
import characterRouter from "./routes/characterRoutes.js";
import cookieParser from "cookie-parser";
import {
  BadRequestError,
  errorHandlingMiddleware,
} from "./middleware/errorMiddleware.js";
import geminiClient from "./config/gemini.js";
import { respondWithJson } from "./utils/json.js";
import { getEmbeddingFromGemini } from "./services/callEmbedingGemini.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/users", usersRouter);
app.use("/reset-password", resetPasswordRouter);
app.use("/characters", characterRouter);

app.listen(3000, async () => {
  await serviceStartup();

  console.log("Server is running on http://localhost:3000");
});

app.use(errorHandlingMiddleware);
